const puppeteer = require("puppeteer")

const url = "https://www.newegg.com/product-shuffle"

const delay = (time) => {
  return new Promise(function (resolve, reject) {
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
// Replace example@gmail.com
const Authentification = async (page) => {
  await page.type("input#labeled-input-signEmail", "steammingliu1@gmail.com")
  await page.click("button.btn.login_to_3")

  await page.waitForSelector(
    "div.signin-step-3 div.form-cells div.form-cell div.form-v-code [aria-label='verify code 5'"
  )

  // Wait for user input one-time code
  await page.waitForFunction(() => {
    const verifyCode = document.querySelector(
      "div.signin-step-3 div.form-cells div.form-cell div.form-v-code [aria-label='verify code 6'"
    ).value
    return verifyCode != ""
  })

  await delay(3000)
  await page.click("div.signin-step-3 div.form-cells div.form-cell button#signInSubmit")
}

  
const CheckStatus = async ()=>{
  let page = await browserConfig()

  if(page.url() !== url){await Authentification(page)}

  const authError = page.waitForSelector("p.color-red.text-align-center")

  // Resent one-time code login until user input correct code
  while (authError) {
    await page.reload()
    await Authentification(page)
  }
}

CheckStatus()