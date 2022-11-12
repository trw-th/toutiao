// 说明：根据全部文章列表
import { request } from '../utils/request.js'
/**
 *
 *
*/
// 全部文章列表相关接口模块
export const getAllChannle = params => request({
  method: 'GET',
  url: '/v1_0/channels',
  params
})
// 数据持久化的新增数据列表
export const addUserChannel = item => request({
  method: 'PATCH',
  url: '/v1_0/user/channels',
  data: {
    channels: [item]
  }
})
// 数据持久化的删除数据列表
export const deleteUserChannel = channelId => request({
  method: 'DELETE',
  url: `/v1_0/user/channels/${channelId}`
})
