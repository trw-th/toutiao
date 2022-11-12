<template>
           <van-button
              class="follow-btn"
              type="info"
              color="#3296fa"
              round
              size="small"
              icon="plus"
            v-if="!isFollowed" @click="onFollow" :loading="followLoading">关注{{isFollowed}}</van-button>
             <van-button
              class="follow-btn"
              round
              size="small"
            v-else @click="onFollow" :loading="followLoading">已关注{{isFollowed}}</van-button>
</template>

<script>
import { deleteFollowAPI, addFollowAPI } from '../../../api/index.js'

export default {
  name: 'followIndex',
  // model: {
  //   prop: 'isFollowed', // 表示的是修改value名称的值，如prop:'isFollowed' 就将value替换成了isFollowed
  //   event: 'updateFollowed' // 表示的是修改了input名称的值 如event: 'updateFollowed' 就将input替换了updateFollowed
  // },
  props: {
    // articleInfo: {
    //   type: Object,
    //   default: () => ({})
    // },
    isFollowed: {
      type: Boolean,
      default: false
    },
    // value: {
    //   type: Boolean,
    //   default: false
    // },
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // articleInfoClon: this.articleInfo,
      followLoading: false // 加载关注按钮
    }
  },
  // 调用点击关注接口
  methods: {
    // 关注，取消关注用户
    async onFollow () {
      let massage = '已关注' // 为什么要写在外面以为报错的时候也要用这个变量
      try {
        this.followLoading = true
        if (this.isFollowed) {
          // 已关注，需要取关
          await deleteFollowAPI(this.userId)
          massage = '取关成功'
        } else {
          // 未关注，需要关注
          await addFollowAPI({
            target: this.userId
          })
          massage = '关注成功'
        }
        // 如果接口调用成功就会继续向下执行，将原本的状态取反
        // this.isFollowed = !this.articleInfoClon.is_followed
        //  v-model传递过来的参数，可以直接在子组件中通过以下方式修改
        // this.$emit('input', !this.value)
        // this.$emit('updateFollowed', !this.isFollowed)
        // .sync的方式来实现子父组件传参
        this.$emit('update:isFollowed', !this.isFollowed)
        this.$toast.success(massage)
      } catch (error) {
        console.log(error)
        // 当后端韩慧错误代码为400时，表明不可以关注自己 13911111111这个账号
        if (error.response && error.response.status === 400) {
          massage = '你不能关注自己'
        } else {
          massage = '网络异常，请稍后重试'
        }
        this.$toast.fail(massage)
      }
      // 无论成功还是失败都需要关闭加载状态
      this.followLoading = false
    }
  }
}
</script>

<style>

</style>
