<template>
  <div class="article-list-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :success-text="successText" success-duration="2000">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="onLoad"
        >
    <!-- <van-cell v-for="(item,index) in list" :key="index" :title="item.title" /> -->
    <ArticleItem v-for="(item,index) in list" :key="index" :article="item"></ArticleItem>
  </van-list>
</van-pull-refresh>
</div>
</template>
<script>
import { getArticleListAPI } from '../../../api/index.js'
import ArticleItem from './article-item.vue'
export default {
  name: 'articleList',
  components: {
    ArticleItem
  },
  props: {
    channelId: {
      type: Number,
      default: 0
    }

  },
  data () {
    return {
      list: [],
      loading: false,
      error: false, // 接口请求失败时的错误信息提示状态栏
      finished: false,
      refreshing: false,
      currentTimestemp: null,
      successText: '刷新成功'
    }
  },
  methods: {
    /*
  van-list 个属性和方法的作用
  @load 事件： 当van-list组件初始化或翻到块下一页时自定触发的事件，获取下一页的数据

  loading: 控制加载中的状态，当loading变量为true时，会阻止@load事件的触发、当@load事件触发时，loading会自动变成true，当我们数据获取完成后需要主动将它改为false

  finished: 是否列表加载完成状态
  如果finished为true时，无论loading为何值，@load事件均不会再触发，当完成时，列表最后会显示 finished-text 属性后的文本内容
*/
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
        const { data: res } = await getArticleListAPI({
          channel_id: this.channelId,
          timestamp: this.currentTimestemp || Date.now() // Date.now()当前时间戳
          // 如果currentTimestemp有值 ，则直接用currentTimestemp，如果没有值，就用当前时间戳
        })
        console.log(res)
        // 2.获取数据后插入到list列表中，res.data.results
        this.list.push(...res.data.results)
        // 2.5 记录下一次查询时的时间戳
        this.currentTimestemp = res.data.pre_timestamp
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
    },
    async onRefresh () {
      try {
        const { data: res } = await getArticleListAPI({
          channel_id: this.channelId,
          timestamp: Date.now() // Date.now()当前时间戳
          // 如果currentTimestemp有值 ，则直接用currentTimestemp，如果没有值，就用当前时间戳
        })
        console.log(res)
        // 下拉获取到新数据后放到list数组
        this.list.unshift(...res.data.results)
        // 3.加载状态结束
        this.refreshing = false
        this.successText = `刷新成功，更新了${res.data.results.length}数据`
      } catch (error) {
        // 如果报错了 也需要主动关闭加载状态
        this.refreshing = false
      }
    }
  }
}
</script>

<style>

.article-list-container{
   height: 527px;
   overflow-y:auto ;
}
</style>
