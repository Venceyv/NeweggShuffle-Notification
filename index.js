const puppeteer = require("puppeteer")

const url = "https://www.newegg.com/product-shuffle"

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

// Authentification *Replace example@gmail.com*
const authentification = async (page) => {
  await page.type("input#labeled-input-signEmail", "steammingliu1@gmail.com")
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

const checkStatus = async () => {
  let page = await browserConfig()
  page = await login(page)
  await page.screenshot({ path: "screenshot1.png" })
  const popUp = await page.waitForFunction(
    ()=>{const popUp = document.querySelector(
    "#Popup_Later_Visit div.modal-dialog.modal-dialog-centered div.modal-content")
    return popUp
  }, {timeout:5000}
  )
  
  // pop up window exist  =>  Shuffle Closed
  if(popUp)
  {
    await page.click(
      "#Popup_Later_Visit div.modal-dialog.modal-dialog-centered div.modal-content div.modal-header button.close"
    )
  }

  await delay(4000)
  // second pop up
  if (popUp) {
    await page.click(
      "#Popup_Later_Visit div.modal-dialog.modal-dialog-centered div.modal-content div.modal-header button.close"
    )
  }

  const shuffleStatus = await page.evaluate(()=>{
    const status = document.querySelector("section.page-section.page-section-hero div.page-section-info div.bg-wide-flag")
    return status.innerText 
  })

  const timer = await page.evaluate(()=> {
    const time = document.querySelectorAll("div#Countdown_1 span")
    let timerList = []
    time.forEach((timing)=>{
      timerList.push(timing.innerText)
    })
    return timerList
  })

  console.log(shuffleStatus)

  timer.forEach((time, i)=> {
    console.log(time);
    if(i%2 != 0){console.log(":");}
  })
}

checkStatus()
