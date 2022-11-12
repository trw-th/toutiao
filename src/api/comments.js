import { request } from '../utils/request.js'

// 取关用户
/**
 *  @params type 评论类型 a对文章的评论列表 c对评论的回复列表
 *  @params source  源id type为a时 =》 文章id type为c时=》 评论id
 * @params offset 评论id (通过评论id获取评论列表的偏移量，如过不传，则以最新的评论开始获取)
 *  @params limit 单页列表 获取的数量
 */
export const getComments = params => request({
  method: 'GET',
  url: '/v1_0/comments',
  params
})
