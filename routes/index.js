const Router = require('koa-router')
const Movies = require('../model/Movies')
const router = new Router()

router.get('/movies/all', async (ctx, next) => {
  const movies = await Movies.find({}).sort({
    'meta.createdAt': -1
  })

  ctx.body = {
    movies
  }
})

router.get('/movies/detail/:id', async (ctx, next) => {
  const id = ctx.params.id

  const movie = await Movies.findOne({_id: id})

  ctx.body = {
    movie
  }

})

module.exports = router
