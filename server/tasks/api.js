const rp = require('request-promise-native')
const Movies = require('../../model/Movies')
const Categories = require('../../model/Categories')

const api = `https://api.douban.com/v2/movie/`

async function fetchMovie (item) {
  const url = api + item.doubanId

  let data = await rp(url)
  
  try {
    data = JSON.parse(data)
  } catch (e) {
    console.log(e)
  }

  return data
}

;(async () => {
  let movies = await Movies.find({
    $or: [
      {summary: {$exists: false}},
      {summary: null},
      {summary: ''},
      {title: ''},
      {year: {$exists: false}}
    ]
  })

  for (let i = 0, length = [movies[0]].length; i < length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []
      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.rawTitle || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2500

        for (let j = 0, length = movie.movieTypes.length; j < length; j++) {

          let item = movie.movieTypes[i]

          let cat = await Categories.findOne({
            name: item
          })

          if (!cat) {
            cat = new Categories({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()

          if (!movie.categories) {
            movie.categories.push(cat._id)
          } else {
            if (movie.categories.indexOf(cat._id) === -1) {
              movie.categories.push(cat._id)
            }
          }
        }

        let dates = movieData.attrs.pubdate || []
        let pubdates = []
        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'
            if (parts[1]) {
              country = parts[1].split(')')[0]
            }
            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })
        movie.pubdate = pubdates
      }

      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })
      console.log(movie)

      await movie.save()
    }
  }

})()