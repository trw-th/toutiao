import { request } from '../utils/request.js'

/**
 *  说明：根据频道获取文章列表
 *  @ params channel_id 频道id
 * @params timestamp 时间戳，请求新的推荐数据传当前的时间戳，请求历史推 荐传指定的时间戳
 *
 *
 *
*/
// 文章相关接口模块
export const getArticleList = params => request({
  method: 'GET',
  url: '/v1_0/articles',
  params
})

// 获取文章详情
export const getArticleById = articleId => request({
  method: 'GET',
  url: `/v1_0/articles/${articleId}`
})

// 收藏文章
/**
 *  @params data 需要收藏的文章id
 *
 *
 */

export const addCollect = data => request({
  method: 'POST',
  url: '/v1_0/article/collections',
  data
})

// 取关用户
/**
 *  @params target 需要取消收藏的文章id
 *
 *
 */
export const deleteCollect = target => request({
  method: 'DELETE',
  url: `/v1_0/article/collections/${target}`
})

// 点赞
export const addLike = data => request({
  method: 'POST',
  url: '/v1_0/article/likings',
  data
})

// 取关用户
/**
 *  @params target 需要取消点赞的文章id
 *
 *
 */
export const deleteLike = target => request({
  method: 'DELETE',
  url: `/v1_0/article/likings/${target}`
})
