const koa = require('koa2')
const app = new koa()

app.use(async (ctx, next) => {
  ctx.body = '电影首页'
})

app.listen(3000, () => console.log('服务器启动成功了'))