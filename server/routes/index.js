// const Router = require('koa-router')
const Movies = require('../model/Movies')
// const router = new Router()
const {get, post, put, controller} = require('../lib/decorator')

@controller('/api/v0/movies')
export class movieController {
  @get('/')
  // @login()
  // @admin(['developer'])
  // @log

  async getMovies (ctx, next) {
    const movies = await Movies.find({}).sort({
      'meta.createdAt': -1
    })
    ctx.body = {
      movies
    }
  }

  // @post
  // @required({body: ['username', 'douabnId']})

  @get('/:id')
  async getMovieDetail (ctx, next) {
    const id = ctx.params.id

    const movie = await Movies.findOne({_id: id})

    ctx.body = {
      movie
    }
  }
}

// module.exports = router
