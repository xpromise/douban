const fs = require('fs')
const EventEmitter = require('events')

class EE extends EventEmitter {}
const yy = new EE()

yy.on('event', () => {
  console.log('哈哈哈哈哈哈')
})

setTimeout(() => {
  console.log('0 毫秒后到期执行的延时定时器')
}, 0)

setTimeout(() => {
  console.log('100 毫秒后到期执行的延时定时器')
}, 100)

setTimeout(() => {
  console.log('200 毫秒后到期执行的延时定时器')
}, 200)

fs.readFile('../package.json', err => {
  console.log('完成package.json文件的读取操作')
})

fs.readFile('../README.md', err => {
  console.log('完成README.md文件的读取操作')
})

setImmediate(() => {
  console.log('immediate 立即回调')
})

process.nextTick(() => {
  console.log('process.nextTick() 的回调函数')
})

Promise.resolve()
  .then(() => {
    yy.emit('event')
    
    process.nextTick(() => {
      console.log('process.nextTick()的第二次回调')
    })
    
    console.log('Promise的第一次回调')
  })
  .then(() => {
    console.log('Promise的第二次回调')
  })