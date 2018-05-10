
const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
const accessKey = config.qiniu.accessKey
const secretKey = config.qiniu.secretKey
//定义鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
//自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
// var options = {
//   scope: bucket,
//   expires: 7200
// }
//上传凭证
// const putPolicy = new qiniu.rs.PutPolicy(options);
// const uploadToken = putPolicy.uploadToken(mac);

const cfg = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)
// 空间对应的机房
// cfg.zone = qiniu.zone.Zone_z1;

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(url, bucket, key, function(err, respBody, respInfo) {
      /*
      url : 网络资源地址
      bucket : 创建的存储空间名称
      key ：指定资源名称名字（重命名）
       */
      if (err) {
        console.log(err);
        //throw err;
        reject(err)
      } else {
        if (respInfo.statusCode === 200) {
          console.log(respBody)
          resolve({key})
        } else {
          reject(respInfo)
        }
      }
    })
  })
}

;(async () => {
  let movies = [{
    video: 'http://vt1.doubanio.com/201805101136/33e5266ee2a63b6d7fa87fd10a8088ca/view/movie/M/302270554.mp4',
    doubanId: '27160683',
    cover: 'https://img3.doubanio.com/img/trailer/medium/2513586693.jpg?',
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2513982852.jpg'
  }]

  movies.map(async movie => {
    if (movie.video && !movie.key) {
      try {
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')
        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }
      } catch (e) {
        console.log(e)
      }
    }
  })

})()
