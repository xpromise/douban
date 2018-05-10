const cp = require('child_process')
const path = require('path')
const Movies = require('../../model/Movies')

;(async () => {
  const script = path.resolve(__dirname, '../crawler/trailer-list')
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

  child.on('message', data => {
    let result = data.result

    result.forEach(async item => {
      let movie = await Movies.findOne({doubanId: item.doubanId})

      if (!movie) {
        movie = new Movies(item)
        await movie.save()
      }
    })
    console.log(result)
  })

})()