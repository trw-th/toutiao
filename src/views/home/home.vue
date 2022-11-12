<template>
    <div class="home-container">
      <!-- 头部导航 -->
      <van-nav-bar class="page-nav-bar" fixed>
        <template #title>
          <van-button
          round
          type="info"
          size="small"
          class="search-btn"
          icon="search"
          to="/search">圆形按钮</van-button>
        </template>
    </van-nav-bar>

    <!-- 频道列表 -->
        <!-- 频道列表
      v-model 表示绑定当前激活标签对应的索引值，默认选中第一个
      animated 转场动画 在标签中直接写某个属性名如 animated === :animated="true"
      swipe-threshold 滚动阈值，表示最低滑动的标签数
      title 表示的是页面上的标题内容
      <van-tab>标签中设置内容区域 后续设置的表格数据放置在双标签中
    -->
    <van-tabs class="channel-tabs" v-model="active" animated swipe-threshold="3" >
      <van-tab :title="channel.name" v-for="channel in userChannels" :key="channel.id" >
        <ArticleList :channelId="channel.id"></ArticleList>
      </van-tab>
      <template #nav-right>
        <div class="placeholder"></div>
        <div class="hamburger-btn" @click="isChannelEditShow=true">
          <i class="toutiao toutiao-gengduo"></i>
        </div>
      </template>
    </van-tabs>

    <!-- 弹框的代码区域一般都写在template的最后面 -->
    <van-popup v-model="isChannelEditShow" position="bottom" :style="{ height: '100%' }" closeable close-icon-position="top-left" class="channel-edit-popup">
          <ChannelEdit :myChannels="userChannels" :allChannes="allChannes" :active="active" @updata-active="upDataActive"></ChannelEdit>
    </van-popup>
    </div>
  </template>
<script>

/*
  目标1：通过接口获取并展示频道列表数据
  1. 在api的功能文件中封装接口
  2. 在index.js中统一导出
  3. 在需要的文件中倒入接口方法并在合适的生命周期中调用
  4. 封装独一的调用方法
  5. 创建变量接收数据，并渲染到页面上
*/
/* 目标2: 实现频道编辑弹框
  1. 使用弹框组件van-popup来实现弹框效果
  2. 通过子父组件传参，将我的频道列表传递给弹框频道编辑组件，渲染数据
  3. 通过父组件中的active频道选中索引值，来让编辑频道组件中的我的频道高亮
  4. 渲染推荐频道数据内容（ 推荐频道 = 全部频道 - 我的频道 ） => 过滤数组 */

/*  目标3: 实现频道编辑中的增加，删除，切换操作
  1. 当点击频道推荐中的选项时，将该选项添加到我的频道中（问题： 需不需要删除推荐频道中的当前选项？ =》 不需要）
  2. 实现删除和切换频道
  2.1 点击编辑、完成按钮，实现删除和切换频道的操作, 只有在编辑状态时，才显示删除图标
  2.2 当为非编辑状态时，点击选项为切换操作
    - 点击选项时，切换了首页的频道选项 active
    - 同时会关闭弹框
   */

/*
  需求2：获取频道列表逻辑修改
  业务场景
  1. $store.state.user.token 存在时   => 已登录， 携带token调用查询接口
  2. $store.state.user.token 不存在时 => 未登录， 通过本地存储中获取数据
  3. $store.state.user.token 不存在时 => 未登录 => 没有本地存储数据 => 不携带token调用查询接口

  => 代码情景
  1. 调用接口 => $store.state.user.token || !getItem('TOUTIAO_MYCHANNELS')
  2. 本地存储 => ELSE
*/
/*
  需求1： 新增删除频道时的数据处理
  1. 判断用户是否登录 => $store.state.user.token
  2. 如果已登录，则调用接口，进行新增操作
  3. 如果未登录，则进行本地存储
*/
import { getUserChannelsAPI, getAllChannleAPI } from '../../api/index.js'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue' // 弹框内容
import { getItem } from '../../utils/storage.js'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      userChannels: [],
      allChannes: [],
      isChannelEditShow: false
    }
  },
  created () {
    // 获取频道列表
    this.loadUserChannels()
    // 获取全部频道列表
    this.loadAllChannles()
  },

  methods: {
    // 获取用户列表
    async loadUserChannels () {
      try {
        // 结构赋值
        if (this.$store.state.user.token || !getItem('TOUTIAO_MYCHANNELS')) {
          const { data: res } = await getUserChannelsAPI()
          console.log(res)
          this.userChannels = res.data.channels
        } else {
          this.userChannels = getItem('TOUTIAO_MYCHANNELS')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取全部列表
    async  loadAllChannles () {
      try {
        // 结构赋值
        const { data: res } = await getAllChannleAPI()
        console.log(res)
        this.allChannes = res.data.channels
      } catch (error) {
        console.log(error)
      }
    },
    upDataActive (index, falg = false) {
      this.active = index
      if (!falg) {
        this.isChannelEditShow = false
      }
    }
  }
}
</script>

  <style scoped  lang="less">
   .home-container{
    padding-top: 90px;
    padding-bottom: 50px; ;
    :deep(.van-nav-bar__title) {
      max-width:unset
    }
    .channel-edit-popup{
      padding-top:50px;
      box-sizing: border-box;
    }
     .search-btn{
      width: 300px;
      background-color: #5babfb;
     }
     :deep(.channel-tabs) {
      .van-tabs__wrap{
        width: 100%;
        z-index: 2;
        position: fixed;
        top: 46px;
      }
    .van-tab {
      width: 100px;
      border-right: 1px solid #f3f3f3;
    }

    .van-tabs__line {
      background-color: #3296fa;
      height: 4px;
      width: 16px;
    }
    .placeholder {
      flex-shrink: 0; /* 让当前元素不参与flex布局计算 */
      width: 32px;
      height: 44px;
    }

    .hamburger-btn {
      z-index: 999;
      position: fixed;
      right: 0;
      background-color: #ffffff;
      width: 32px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;

      &::before {
        content: '';
        background-image: url('../../assets/gradient-gray-line.png');
        width: 1px;
        height: 44px;
        position: absolute;
        left: 0;
      }
    }
  }
   }
  </style>
