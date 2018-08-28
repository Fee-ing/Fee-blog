import { API, APPINFO } from './index'
import { toast } from '../plugins/func'

import axios from 'axios'
import MD5 from 'md5'

let timestamp = new Date().getTime()

let axiosIns = axios.create({
  baseURL: API.baseAPI,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'X-LC-Id': APPINFO.appId,
    'X-LC-Sign': `${MD5(timestamp.toString() + APPINFO.appKey)},${timestamp}`
  },
  timeout: 5000
})

let Request = {}
let requestMethod = ['get', 'post', 'put', 'delete']
requestMethod.forEach(method => {
  Request[method] = (url, data, config) => {
    return new Promise((resolve, reject) => {
      axiosIns[method](url, data, config).then(response => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.data)
        } else {
          toast({
            title: '请求错误'
          })
          reject(response)
        }
      }).catch(err => {
        toast({
          title: (err.response.data && err.response.data.error) || '请求错误'
        })
        reject(err)
      })
    })
  }
})

export default Request
