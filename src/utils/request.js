// 全局配置axios
import axios from 'axios'
// 创建并导出带有baseURL的axios方法
export const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})
