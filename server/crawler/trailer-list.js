const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=%E7%94%B5%E5%BD%B1`

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

  await page.waitForSelector('.more')

  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')
  }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp>a')
    var links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = +it.find('.rate').text()
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  await browser.close();
  console.log(result)
  process.send({result})

  process.exit(0)

})()