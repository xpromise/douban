const koa = require('koa2')
const mongoose = require('mongoose')
const render = require('koa-ejs');
const path = require('path');
// const {commonTpl} = require('./tpl')
const {connect} = require('./db/init')

const Movies = require('./model/Movies')
const Categories = require('./model/Categories')
const Users = require('./model/Users')

//连接数据库
;(async () => {
  await connect()

  const movies = await Movies.find({})
  
  console.log(movies)
})()

const app = new koa()

render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,  //默认布局的文件
  viewExt: 'html', //文件后缀名
  cache: false, //是否缓存
  debug: false //是否调试bug
})

app.use(async (ctx, next) => {
  const users = [{
    name: 'sunwukong',
    age: 18
  },{
    name: 'zhubajie',
    age: 16
  }]

  await ctx.render('template', {users})
})

app.listen(3000, () => console.log('服务器启动成功了'))