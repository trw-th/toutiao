<template>
  <van-icon
        :color="attitude ===1?'#ff0000':'#777'"
        :name="attitude ===1?'good-job':'good-job-o'"
        @click="likeFollow"
        :loding="likeLoading"
      />
</template>

<script>
import { addLikeAPI, deleteLikeAPI } from '../../../api/index.js'
export default {
  name: 'likeArticle',
  props: {
    attitude: { // -1无状态 ，1点赞
      type: Number,
      default: -1
    },
    // value: {
    //   type: Boolean,
    //   default: false
    // },
    articleId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      likeLoading: false // 点赞加载状态
    }
  },
  methods: {
    // 关注，取消关注用户
    async likeFollow () {
      let massage = '已关注' // 为什么要写在外面以为报错的时候也要用这个变量
      try {
        this.likeLoading = true
        if (this.attitude === 1) {
          // 已点赞需要，取消点赞
          await deleteLikeAPI(this.articleId)
          massage = '取消点赞成功'
        } else {
          // 未点赞，需要点赞
          await addLikeAPI({
            target: this.articleId
          })
          massage = '点赞成功'
        }
        // this.attitude 是否是1 是1就变成-1 不是1就让他变成1
        this.$emit('update:attitude', this.attitude === 1 ? -1 : 1)
        this.$toast.success(massage)
      } catch (error) {
        console.log(error)
        massage = '网络异常，请稍后重试'
        this.$toast.fail(massage)
      }
      // 无论成功还是失败都需要关闭加载状态
      this.likeLoading = false
    }
  }
}
</script>

<style>

</style>
