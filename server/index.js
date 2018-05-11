const koa = require('koa2')

// const mongoose = require('mongoose')
// const render = require('koa-ejs');

const path = require('path');

const {connect} = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['router']

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => path.resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

//连接数据库
;(async () => {
  await connect()
  // require('./server/tasks/movie')
  // require('./server/tasks/api')
  const app = new koa()
  await useMiddlewares(app)
  app.listen(3000, () => console.log('服务器启动成功了'))
})()




