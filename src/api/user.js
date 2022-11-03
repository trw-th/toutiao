// 用户相关接口模块
import { request } from '../utils/request.js'
/**
 * @params 表示入参
 * @return 表示后端成功请求后的返回值
 * 说明 :用户登录
 * @params userName:用户名字String
 * @params password 密码:String
 *
 * @return userInfo 用户信息(返回值一般可以不写)
 */
export const userLogin = data => request({
  method: 'POST',
  url: '/login',
  data
})
