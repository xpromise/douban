const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies
} = require('../service/movie')

const {
  get,
  post,
  put,
  controller
} = require('../lib/decorator')

@controller('/api/v0/movies')
export class movieController {
  @get('/')
  // @login()
  // @admin(['developer'])
  // @log
  
  async getMovies (ctx, next) {

    const {type, year} = ctx.query
    const movies = await getAllMovies()

    ctx.body = {
      success: true,
      data: movies
    }
  }

  // @post
  // @required({body: ['username', 'douabnId']})

  @get('/detail/:id')
  async getMovieDetail (ctx, next) {
    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}
