require('dotenv').config()
const puppeteer = require("puppeteer")
const CronJob = require("cron").CronJob
const sgMail = require("@sendgrid/mail")
const url = "https://www.newegg.com/product-shuffle"
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const apikey = `${process.env.SENDGRID_API_KEY}`

// delay function
const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

// Configure
const browserConfig = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(url)
  await page.goto(url)
  return page
}

// Authentification
const authentification = async (page) => {
  await page.type("input#labeled-input-signEmail", process.env.USER_EMAIL)
  await page.click("button.btn.login_to_3")

  // Wait for DOM update
  await page.waitForSelector("div.signin-step-3 div.form-cells div.form-cell div.form-v-code [aria-label='verify code 5'")

  // Wait for user input 5th # one-time code
  await page.waitForFunction(
    () => {const verifyCode = document.querySelector("div.signin-step-3 div.form-cells div.form-cell div.form-v-code [aria-label='verify code 5'").value
            return verifyCode != ""
    },{ timeout: 60000 })
  
  // Wait 3 second after 5th auth # input before confirm
  await delay(3000)
  await page.click("div.signin-step-3 div.form-cells div.form-cell button#signInSubmit")
}

// Login into Newegg account
const login = async (page) => {
  if (page.url() !== url) {
    await authentification(page)
    await page.waitForNavigation()
    return page
  }
}

// Close popups
const closePopUp = async(page) =>{
  const popUp = await page.waitForFunction(
    () => {
      const popUp = document.querySelector(
        "#Popup_Later_Visit div.modal-dialog.modal-dialog-centered div.modal-content"
      )
      return popUp
    },
    { timeout: 5000 }
  )

  // pop up window exist  =>  Shuffle Closed
  if (popUp) {
    try{
    await page.click(
      "#Popup_Later_Visit div.modal-dialog.modal-dialog-centered div.modal-content div.modal-header button.close"
    )
    }catch{
      console.log("");
    }
  }

  await delay(4000)
  // second pop up
  if (popUp) {
    try {
      await page.click(
        "#Popup_Later_Visit div.modal-dialog.modal-dialog-centered div.modal-content div.modal-header button.close"
      )
    }catch {
      console.log("")
    }
  }
  return page
}

// User login
const userLogin = async () => {
  let page = await browserConfig()
  page = await login(page)
  return page
}

// Check time
const checkStatus= async(page)=>{
  await page.reload()
  page = await closePopUp(page)

  await delay(2000)
  // obtain shuffle status
  const shuffleStatus = await page.evaluate(() => {
    const status = document.querySelector(
      "section.page-section.page-section-hero div.page-section-info div.bg-wide-flag"
    )
    return status.innerText
  })

  // obtain countdown time
  const timer = await page.evaluate(() => {
    const time = document.querySelectorAll("div#Countdown_1 span")
    let timerList = []
    time.forEach((timing) => {
      timerList.push(timing.innerText)
    })
    return timerList
  })

  console.log(shuffleStatus)

  // format countdown time with ":"
  let timeLeft = ""
  timer.forEach((time, i) => {
    timeLeft = timeLeft + time
    if (i % 2 != 0 && i < 5 ) {
      timeLeft = timeLeft + ":"
    }
  })

  console.log(timeLeft)
  sendEmail('Newegg Shuffle Status', 
  `${shuffleStatus}\Time Left: ${timeLeft}.
  \Newegg Shuffle Link: ${url}`)
  console.log('Notification Sent!!');
}

//@ send email notification
const sendEmail = (subject,body) =>{
  const email = {
    to: process.env.USER_EMAIL,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject: subject,
    text: body,
    html: body
  }
  return sgMail.send(email)
}

//@ Change desired minutes
const userNum = 20

// Runs on schedule of every userNum minutes
const trackStatus = async () => {
  let page = await userLogin()
  let newJob = new CronJob(`0 */${userNum} * * * *`, ()=>{
    checkStatus(page)
  })
  newJob.start()
}

trackStatus()

