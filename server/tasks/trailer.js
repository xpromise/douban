const cp = require('child_process')
const path = require('path')
const Movies = require('../model/Movies')

;(async () => {
  let movies = await Movies.find({
    $or: [
      {video: {$exists: false}},
      {video: null}
    ]
  }).exec()

  const script = path.resolve(__dirname, '../crawler/video')
  const child = cp.fork(script, [])  //返回子进程对象
  let invoked = false //调用的标识符，标识爬虫脚本有没有运行过

  child.on('error', err => {
    if (invoked) return
    invoked = true
    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = true
    let err = code === 0 ? null : new Error(`exit code ${code}`)
    console.log(err)
  })

  child.on('message',async data => {

    let doubanId = data.doubanId
    let movie = await Movies.findOne({
      doubanId: doubanId
    }).exec()

    if (data.video) {
      movie.video = data.video
      movie.cover = data.cover

      await movie.save()
    } else {
      await movie.remove()
    }
  })

  child.send(movies)

})()