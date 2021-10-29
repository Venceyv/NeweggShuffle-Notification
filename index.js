const puppeteer = require('puppeteer')

const url = "https://www.newegg.com/product-shuffle"

// const configBrowser = async () => {
//     const browser = await puppeteer.launch({headless: false})
//     const page = await browser.newPage()
//     await page.goto(url)
//     return page
// }

// const statusCheck = async (page) => {
//     // await page.reload()
//     let html = await page.evaluate(()=>{
//         const stat = document.querySelector(".col-lg-6.intro-content p")
//         return stat.innerText
//     })
// }

// const monitor = async () => {
//     let page = await configBrowser()
//     let content = await statusCheck(page)
//     console.log(content)
// }

// monitor()
const delay = time => {
  return new Promise(function (resolve,reject) {
    setTimeout(resolve, time)
  })
}

const monitor = async () => {
const browser = await puppeteer.launch({
  headless: false,
  slowMo: 30,
  args: ["--window-size=1920,1080"],
})
const page = await browser.newPage()
await delay(2000)
await page.goto(url)
await delay(2000)

// auth needed ...

// page.click("button.close")

// const stat = await page.evaluate(() => {
//     const statCheck = document.querySelector("h5.modal-title")
//     return statCheck.innerText
// })

// console.log(stat)
// await page.waitForTimeout(4000)

// await delay(2000)
await page.goto(url)
await browser.close()

}

monitor()