const puppeteer = require('puppeteer')

const url = `https://weibo.com/u/5347310757?refer_flag=1001030001_&nick=%E5%82%BB%E5%AD%A9%E5%AD%90%E6%88%91%E6%89%8D%E6%98%AF%E4%BD%A0%E5%A6%88%E5%A6%88%E5%95%8A&is_all=1`

function sleep (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

;(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  await sleep(3000)

  // await page.waitForSelector('.page.next')
  // //
  // for (let i = 0; i < 2; i++) {
  //   await sleep(3000)
  //   await page.click('.page.next')
  // }

  const result = await page.evaluate(() => {
    var $ = window.$
    var list = $('.WB_detail')
    var links = []

    if (list.length >= 1) {
      list.each((index, item) => {
        let it = $(item)
        let time = it.find('.S_txt2').text()
        let content = it.find('.WB_text').text()

        links.push({
          time,
          content
        })
      })
    }

    return links
  })

  await browser.close();
  
  console.log(result)

  // process.send({result})
  //
  // process.exit(0)

})()