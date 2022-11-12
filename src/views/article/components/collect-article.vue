<template>
    <van-icon
        :name="isCollected?'star':'star-o'"
        :color="isCollected ? '#ffa500':'#777'"
        @click="onCollect"
        :loding="collectLoading"
      />
</template>

<script>
import { addcollectAPI, deletecollectAPI } from '../../../api/index.js'
export default {
  name: 'collectIndex',
  props: {
    isCollected: {
      type: Boolean,
      default: false
    },
    articleId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      collectLoading: false // 收藏加载状态
    }
  },
  methods: {
    // 关注，取消关注用户
    async onCollect () {
      let massage = '已关注' // 为什么要写在外面以为报错的时候也要用这个变量
      try {
        this.collectLoading = true
        if (this.isCollected) {
          // 已关注，需要取关
          await deletecollectAPI(this.articleId)
          massage = '取消收藏成功'
        } else {
          // 未关注，需要关注
          await addcollectAPI({
            target: this.articleId
          })
          massage = '收藏成功'
        }
        this.$emit('update:isCollected', !this.isCollected)
        this.$toast.success(massage)
      } catch (error) {
        console.log(error)

        massage = '网络异常，请稍后重试'
        this.$toast.fail(massage)
      }
      // 无论成功还是失败都需要关闭加载状态
      this.collectLoading = false
    }
  }

}
</script>

<style>

</style>
