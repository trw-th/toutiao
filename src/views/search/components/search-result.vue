<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
// 搜索结果
import { getSearchResultAPI } from '../../../api/index.js'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false, // 接口请求失败的错误信息提示状态值
      page: 1 // 当前页码
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }

      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 1000)
      try {
        // 获取下一页数据
        const { data: res } = await getSearchResultAPI({
          q: this.searchText,
          page: this.page,
          per_page: 10
        })
        console.log(res)
        // 2.获取数据后插入到list列表中，res.data.results
        this.list.push(...res.data.results)
        // 2.5 记录下一次查询时的时间戳
        // this.currentTimestemp = res.data.pre_timestamp
        // 记录下一次查询页码
        this.page++
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

<style scoped lang="less"></style>
