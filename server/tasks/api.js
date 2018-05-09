const api = `https://api.douban.com/v2/movie/subject/`

const rp = require('request-promise-native')

async function fetchMovie (item) {
  const url = api + item.doubanId

  const data = await rp(url)

  return data
}

;(async () => {
  let movies = [{
    doubanId: 27160683,
    title: '忍者蝙蝠侠',
    rate: 7.1,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2506695706.jpg'
  }, {
    doubanId: 24773958,
    title: '复仇者联盟3：无限战争',
    rate: 8.4,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2517753454.jpg'
  }, {
    doubanId: 3212397,
    title: '根西岛文学与土豆皮馅饼俱乐部',
    rate: 7.4,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2514882923.jpg'
  }]

  movies.map(async movie => {
    let movieData = await fetchMovie(movie)

    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.tags)
      console.log(movieData.summary)

    } catch (err) {
      console.log(err)
    }

  })

})()