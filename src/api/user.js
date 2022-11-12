// 用户相关接口模块
import { request } from '../utils/request.js'
/**
 * @params 表示入参
 * @return 表示后端成功请求后的返回值
 * 说明 :用户登录
 * @params mobile:手机号String
 * @params code 验证码:String
 *
 *  1. 201 OK
    2. 400 请求参数错误
        包括：参数缺失、手机号格式不正确、验证码失效等
    3. 507 服务器数据库异常
 * @return userInfo 用户信息(返回值一般可以不写)
 */
export const userLogin = data => request({
  method: 'POST',
  url: '/v1_0/authorizations',
  data
})

export const userSendSms = mobile => request({
  method: 'GET',
  url: `/v1_0/sms/codes/${mobile}`
})

/*
  目标3： 设置请求头
  1. 统一传入请求头
  2. 什么时候统一传请求头？ => 只要有token，就把请求头传给后端
  3. 在哪设置？ => 在axios请求拦截器中统一设置请求头信息
*/
export const getUserInfo = () => request({
  method: 'GET',
  url: '/v1_0/user'
})

// 获取用户频道列表
export const getUserChannels = () => request({
  method: 'GET',
  url: '/v1_0/user/channels'
})
// 关注用户
/**
 *  @params target 需要关注的用户id
 *
 *
 */
export const addFollow = data => request({
  method: 'POST',
  url: '/v1_0/user/followings',
  data
})

// 取关用户
/**
 *  @params target 需要取关的用户id
 *
 *
 */
export const deleteFollow = target => request({
  method: 'DELETE',
  url: `/v1_0/user/followings/${target}`
})
