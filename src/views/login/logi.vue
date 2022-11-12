<template>
 <div class="login-container">
  <!-- 头部标题 -->
    <van-nav-bar title="标题" class="page-nav-bar">
        <template #left>
            <van-icon name="cross" @click="$router.back()"></van-icon>
        </template>
    </van-nav-bar>
 <!-- form表单 -->
<van-form @submit="onSubmit" ref="loginForm">
  <!-- 手机号输入 -->
  <van-field v-model="user.mobile" name="mobile" label="手机号"
placeholder="手机号" :rules="userRules.mobile"
  >
  <!-- 输入手机图标 -->
  <template #left-icon><i class="toutiao toutiao-shouji"></i></template></van-field>
  <!-- 输入验证码 -->
  <van-field
    v-model="user.code"
    name="验证码"
    label="验证码"
    placeholder="验证码"
    :rules="userRules.code"
  >
  <!-- 验证图标 -->
  <template #left-icon>
    <i class="toutiao toutiao-yanzhengma"></i>
  </template>
  <!-- 验证按钮 -->
    <template #button>
      <van-count-down :time="6*1000" format="ss秒" v-if="isCountDownShow" @finish="isCountDownShow = false"/>
      <van-button class="smsBtn" native-type="button" size="small" type="primary" round @click="sendSms" v-else>发送验证码</van-button>
    </template>
  </van-field>
  <!-- 提交按钮 -->
  <div style="margin: 16px;">
    <van-button  block type="info" native-type="submit">提交</van-button>
  </div>
</van-form>
 </div>
</template>

<script>
/*
  目标1： 提交登录
  1. 输入手机号，验证码246810，实现提交操作
  2. 在api中创建登录接口
  3. 在api/index.js 统一导出接口
  4. 设置提交方法逻辑
*/
/*
  目标2：发送验证码
  1. 通过点击验证码，通过手机号请求接口
  2. 当请求成功时要切换倒计时功能，阻止频繁的短信发送
  3. 如果手机号不符合规则，那么不允许发送请求
*/
import { userLoginAPI, userSendSmsAPI } from '../../api/index.js'
export default {
  name: 'loginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isCountDownShow: false,
      userRules: {
        mobile: [{ required: true, message: '请填写手机号' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机格式错误' }],

        code: [{ required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 通过加载提示来阻止用户高频的请求点击
        this.$toast.loading({
          duration: 0, // 当这个属性的属性值为0的时候会持续触发显示加载提示，直到触发成功或失败才关闭
          message: '登录中...', // 提示内容
          forbidClick: true // 是否禁用背景点击
        })
        const res = await userLoginAPI({
          mobile: this.user.mobile,
          code: this.user.code
        })
        console.log(res)
        this.$router.back()
        this.$toast.success('成功文案')
        console.log(res.data.data)
        this.$store.commit('setUser', res.data.data)
      } catch (error) {
        // 通过不同的响应代码来判断提示错误的内容
        if (error.response && error.request.status === 400) {
          this.$toast.fail('失败文案')
        } else {
          this.$toast.fail('网络异常，请稍后重试')
        }
      }
    },

    // 验证码提交
    async sendSms () {
      try {
        // 通过from表单的验证规则，来判断是否符合手机格式
        await this.$refs.loginForm.validate('mobile')
        // 如果一个接口返回成功的返回值不需要在代码找那个使用，则可以省略赋值操作
        await userSendSmsAPI(this.user.mobile) // 返回的是一个promies对象所以可以用在 await
        this.$toast.success('发送验证码成功')
        this.isCountDownShow = true
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 404) {
          this.$toast.fail('手机号不正确2')
        } else if (error.response && error.response.status === 429) {
          this.$toast.fail('访问繁忙请一分钟后重试')
        } else if (error.name === 'mobile') {
          this.$toast.fail('手机号不正确')
        } else {
          this.$toast.fail('网络错误')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  .login-container{
 .smsBtn{
    color: #666666;
    background-color: #ededed;
    border: none;
 }
  }
</style>
