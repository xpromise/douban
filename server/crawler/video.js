const puppeteer = require('puppeteer')

const base = `https://movie.douban.com/subject/`
const doubanId = `27160683`
const videoBase = `https://movie.douban.com/trailer/227554`

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

  await page.goto(base + doubanId, {
    waitUntil: 'networkidle2'
  })

  await sleep(2000)

  const result = await page.evaluate(() => {

    var $ = window.$
    var it = $('.related-pic-video')

    if (it && it.length > 0) {

      var link = it.attr('href')
      var cover = it.find('img').attr('src')

      return {
        link,
        cover
      }
    }

    return {}
  })

  let video = null

  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })

    await sleep(3000)

    video = await page.evaluate(() => {
      var $ = window.$
      var it = $('source')

      if (it && it.length > 0) {
        return it.attr('src')
      }

      return ''
    })

  }

  const data = {
    video,
    doubanId,
    cover: result.cover
  }

  await browser.close();

  process.send(data)

  process.exit(0)

})()