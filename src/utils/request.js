// 全局配置axios
import axios from 'axios'
import store from '../store/index.js'
// 创建并导出带有baseURL的axios方法
export const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})
/*
  目标3： 设置请求头
  1. 统一传入请求头
  2. 什么时候统一传请求头？ => 只要有token，就把请求头传给后端
  3. 在哪设置？ => 在axios请求拦截器中统一设置请求头信息
*/

/*
  目标3： 设置请求头
  1. 统一传入请求头
  2. 什么时候统一传请求头？ => 只要有token，就把请求头传给后端
  3. 在哪设置？ => 在axios请求拦截器中统一设置请求头信息
*/
// axios请求拦截器
request.interceptors.request.use(config => {
  // config:本次请求的配置对象(这个对象中就有我们传递的参数)
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }

  // 最后必须将config return 出去
  return config
})
