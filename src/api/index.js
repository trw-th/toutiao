
import { userLogin, userSendSms, getUserInfo, getUserChannels, deleteFollow, addFollow } from './user'
import { getArticleList, getArticleById, addCollect, deleteCollect, addLike, deleteLike } from './article.js' // 获取用户推荐列表
import { getAllChannle, addUserChannel, deleteUserChannel } from './channle.js' // 全部列表
import { getSearchSuggestions, getSearchResult } from './search.js'
import { getComments } from './comments'
export const userLoginAPI = userLogin
export const userSendSmsAPI = userSendSms
export const getUserInfoAPI = getUserInfo
export const getUserChannelsAPI = getUserChannels
export const getArticleListAPI = getArticleList
export const getAllChannleAPI = getAllChannle
export const addUserChannelAPI = addUserChannel
export const deleteUserChannelAPI = deleteUserChannel
export const getSearchSuggestionsAPI = getSearchSuggestions
export const getSearchResultAPI = getSearchResult
export const getArticleByIdAPI = getArticleById
export const deleteFollowAPI = deleteFollow
export const addFollowAPI = addFollow
export const addcollectAPI = addCollect
export const deletecollectAPI = deleteCollect
export const addLikeAPI = addLike
export const deleteLikeAPI = deleteLike
export const getCommentsAPI = getComments
