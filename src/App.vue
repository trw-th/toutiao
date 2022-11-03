<template>
  <div id="app">
    <!-- 一级路由 -->
    <i class="toutiao toutiao-shouye"></i>
    <div class="div1">标题1</div>
    <div class="div1">标题2</div>
    <router-view/>
  </div>
</template>

<script>
import { userLoginAPI } from './api/index.js'
export default {
  name: 'App',
  created () {
    this.requertList()
  },
  methods: {
    async requertList () {
      try {
        const res = await userLoginAPI()
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.div1{
  font-size: 20px;
}
</style>
