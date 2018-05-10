const mongoose = require('mongoose')

exports.connect = () => {
  let  maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    mongoose.connect('mongodb://localhost:27017/douban-trailer')

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect('mongodb://localhost:3000/douban-trailer')
      } else {
        throw new Error('数据库出错了~~~~')
      }
    })

    mongoose.connection.on('error', err => {

      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect('mongodb://localhost:3000/douban-trailer')
      } else {
        throw new Error('数据库出错了~~~~')
      }

    })

    mongoose.connection.once('open', () => {
      resolve()
      console.log('数据库连接成功~~~')
    })

  })

}