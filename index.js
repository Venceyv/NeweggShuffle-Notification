const puppeteer = require("puppeteer")

const url = "https://www.newegg.com/product-shuffle"

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

// Configure
const browserConfig = async () => {
  const browser = await puppeteer.launch({ headless: false})
  const page = await browser.newPage()
  await page.goto(url)
  await page.goto(url)
  return page
}

// Authentification *Replace example@gmail.com*
const authentification = async (page) => {
  await page.type("input#labeled-input-signEmail", "example@gmail.com")
  await page.click("button.btn.login_to_3")

  // Wait for DOM update
  await page.waitForSelector(
    "div.signin-step-3 div.form-cells div.form-cell div.form-v-code [aria-label='verify code 5'"
  )

  // Wait for user input one-time code
  await page.waitForFunction(() => {
    const verifyCode = document.querySelector(
      "div.signin-step-3 div.form-cells div.form-cell div.form-v-code [aria-label='verify code 5'"
    ).value
    return verifyCode != ""
  },{timeout:60000})

  await delay(3000)
  await page.click(
    "div.signin-step-3 div.form-cells div.form-cell button#signInSubmit"
  )
}

// Login into Newegg account
const login = async (page) => {
  if (page.url() !== url) {
    await authentification(page)
    await page.waitForNavigation()
    return page
  }

  // const authError = document.querySelector("p.color-red.text-align-center")

  // Resent one-time code login until user input correct code
  // while (authError) {
  //   await page.reload()
  //   await login(page)
  // }
  // return page
}

const checkStatus = async () => {
  let page = await browserConfig()
  page = await login(page)
  await page.screenshot({path: "screenshot.png"})
  // const popUp = await page.waitForSelector("div.modal-dialog.modal-dialog-centered div.modal-content")
  
  // if(popUp){
  //   await page.click(
  //     "div#Popup_Later_Visit div.modal-dialog.modal-dialog-centered div.modal-content div.modal-header button.close"
  //   )
  // }

  // const status = await page.querySelector("div.page-section-info div.bg-wide-flag").innerText
  // console.log(status)
}

checkStatus()
