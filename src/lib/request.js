import axios from 'axios'
import {message} from 'antd'

const defaultAxiosConf = {
  timeout: 5000
}

const _request = (params = {}, fn = () => {}) => {

  return axios({...defaultAxiosConf, ...params})
    .then(res => {
      const {success, data, err, code} = res.data

      if (code === 401) {
        window.location.href = '/'
      }

      if (success) {
        fn(false) //true?

        return data
      }

      throw err
    })
    .catch(err => {
      console.log('err' +err)
      fn(false)
      message.err(String(err || '网络错误'))
    })
}


export default (param) => {
  const type = typeof param
  console.log(type)

  if (type === 'function') {
    param(true)

    return (obj) => _request(obj, param)
  }

  if (type === 'object' && param !== null) {
    return _request(param)
  }

}