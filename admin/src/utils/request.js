import axios from 'axios'
import { Message, Notification } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 500000 // 请求超时时间
})

axios.defaults.withCredentials = true // 保证不关闭浏览器 获取的session  一致

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // console.log(response, 'res')
    /**
     * status,100,101,200,400外的 进行拦截报错
     */
    const statusLsit = [100, 101, 200, 400]
    const res = response.data
    if (!statusLsit.includes(res.status)) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
      //   MessageBox.confirm(
      //     '你已被登出，可以取消继续留在该页面，或者重新登录',
      //     '确定登出', {
      //       confirmButtonText: '重新登录',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }
      //   ).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload() // 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }
      return Promise.reject('error')
    } else {
      if (res.status === 400 && res.message) {
        Notification({
          title: '提醒',
          message: res.message,
          type: 'error',
          duration: 5000
        })
      }
      if (res.status === 200 && res.message) {
        Message({
          message: res.message,
          type: 'success',
          duration: 2 * 1000
        })
      }
      if (res.status === 100 && res.message) {
        Notification({
          title: '提醒',
          message: res.message,
          type: 'warning',
          duration: 3000
        })
      }
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
