import axios from 'axios'
import serverInfo from '../config/serverInfo'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress'
export default () => {
  axios.defaults.baseURL = serverInfo.mainServer // 配置axios请求的地址
  axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'
  axios.defaults.crossDomain = true
  axios.defaults.withCredentials = true // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
  axios.defaults.headers.common['Authorization'] = '' // 设置请求头为 Authorization

  // 配置发送请求前的拦截器 可以设置token信息
  axios.interceptors.request.use(config => {
    NProgress.start()
    return config
  }, error => {
    return Promise.reject(error)
  })

  // 配置响应拦截器
  axios.interceptors.response.use(res => {
    NProgress.done()
    // 这里面写所需要的代码
    if (res.data.code === 0) {
      // 全局登陆过滤，未登录时 返回登陆页面
      window.location.href = serverInfo.mainServer
      return false
    } else if (res.data.code !== 200) {
      Message.error({
        message: res.data.msg
      })
    } else {
    }
    return Promise.resolve(res)
  }, error => {
    Message.error({
      message: error
    })
    return Promise.reject(error)
  })
  return axios
}
