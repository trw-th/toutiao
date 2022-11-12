<template>
<van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  :error.sync="error"
    error-text="请求失败，点击重新加载"
  @load="onLoad"
>
<CommentItem v-for="item in list" :key="item.com_id" :comment="item"></CommentItem>
</van-list>
</template>

<script>
import { getCommentsAPI } from '../../../api/index.js'
import CommentItem from './comment-item.vue'
export default {
  name: 'commentArticle',
  components: {
    CommentItem
  },
  props: {
    sourceId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      error: false // 接口请求失败时的错误信息提示状态栏
    }
  },
  methods: {
    async onLoad () {
      try {
        const { data: res } = await getCommentsAPI({
          type: 'a',
          source: this.sourceId,
          offset: this.offset,
          limit: 10
        })
        console.log(res)
        // 2.获取数据后插入到list列表中，res.data.results
        this.list.push(...res.data.results)
        // 2.5 记录下一次查询offset评论id
        this.offset = res.data.last_id
        // 3.加载状态结束
        this.loading = false
        // 4.判断数据是否全部加载完成 - 后端数据返回的数据数组没有内容了，表明没有下一页、
        if (res.data.results.length === 0) {
          this.finished = true
        }
      } catch (error) {
        // 5.如果报错也需要主动关闭加载状态
        this.loading = false
        console.log(error)
        // 6.主动开启错误提示错误状态
        this.error = true
      }
    }
  }
}
</script>

<style>

</style>
