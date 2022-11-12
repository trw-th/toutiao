// 搜索联想接口
import { request } from '../utils/request.js'

/**
 *
  说明:获取联想建议列表
 *  @params q 需要联想查询的内容String
 *
 *
 */
export const getSearchSuggestions = params => request({
  method: 'GET',
  url: '/v1_0/suggestion',
  params
})

// 获取搜索结果接口
export const getSearchResult = params => request({
  method: 'GET',
  url: '/v1_0/search',
  params
})
