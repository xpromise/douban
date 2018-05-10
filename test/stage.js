const fs = require('fs')
const EventEmitter = require('events')

class EE extends EventEmitter {}
const yy = new EE()


yy.on('event', () => {
  console.log('哈哈哈哈哈哈')
})

console.log(Date.now()) //1525940859814


setTimeout(() => {
  console.log('0 毫秒后到期执行的延时定时器  ' + Date.now())   //1525940859820  //6毫秒
}, 0)

setTimeout(() => {
  console.log('20 毫秒后到期执行的延时定时器' + Date.now())
}, 20)

setTimeout(() => {
  console.log('30 毫秒后到期执行的延时定时器')
}, 30)

fs.readFile('../package.json', err => {
  setTimeout(() => {
    console.log('0 毫秒后到期执行的延时定时器  ' + Date.now())   //1525940859820  //6毫秒
  }, 0)
  console.log('完成package.json文件的读取操作  ' + Date.now())  //7毫秒
  setImmediate(() => {
    console.log('immediate 立即回调  ' + Date.now())
  })
})

fs.readFile('../README.MD', err => {
  console.log('完成README.MD  ' + Date.now()) //7毫秒
})

fs.readFile('../../../性能优化.zip', err => {
  console.log('完成01.jpg  ' + Date.now()) //7毫秒
})

setImmediate(() => {
  console.log('immediate 立即回调  ' + Date.now())
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