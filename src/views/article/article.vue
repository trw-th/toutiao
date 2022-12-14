<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
      fixed
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap" >
      <!-- 加载中 - 作用仅是获取数据时的动画表现 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="articleInfo.art_id">
        <!-- 文章标题 -->
        <h1 class="article-title">{{articleInfo.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <!-- 头像 -->
          <template #icon>
            <van-image
              class="avatar"
              round
              fit="cover"
              :src="articleInfo.aut_photo"
            />
          </template>

          <template #title>
            <div class="user-name">{{articleInfo.aut_name}}</div>
          </template>

          <template #label>
            <div class="publish-date">{{articleInfo.pubdate |relativeTime}}</div>
          </template>

          <template #default>
            <!-- 使用关注组件 -->
            <!-- 通过v-model的方式传参 -->
              <!-- <FollowUser v-model="articleInfo.is_followed" :userId="articleInfo.aut_id"></FollowUser> -->
              <!-- 通过.sync的方式子父传参 -->
              <FollowUser :isFollowed.sync="articleInfo.is_followed" :userId="articleInfo.aut_id"></FollowUser>
          </template>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="articleInfo.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表区域 -->
        <CommentArticle :sourceId="articleInfo.art_id"></CommentArticle>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errorStatus===404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadGetArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <!-- 写评论按钮 -->
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
      >写评论</van-button>

      <!-- 评论数量显示 -->
    <van-icon
        name="comment-o"
        badge="123"
        color="#777"
    />
      <!-- 收藏文章 -->
      <CollectArticle :isCollected.sync="articleInfo.is_collected" :articleId="articleInfo.art_id"></CollectArticle>

      <!-- 点赞文章 -->
  <LikeArticle :attitude.sync="articleInfo.attitude" :articleId="articleInfo.art_id"></LikeArticle>

      <!-- 分享转发 -->
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
  </div>
</template>
<script>
import { getArticleByIdAPI } from '../../api/index.js'
import { ImagePreview } from 'vant' // 图片预览
import FollowUser from './components/follow-user.vue'
import CollectArticle from './components/collect-article.vue'
import LikeArticle from './components/like-article.vue'
import CommentArticle from './components/comment-article.vue'
// 目标1： 调用接口获取数据页面铺设
//   1. 在调用借口时，开启加载框，当接口响应数据后，关闭加载框并开启文章内容
//   2. 如果接口报错，错误代码为404时展示 资源不存在
//   3. 如果接口报错，错误代码为其他时，展示重试页面
//   4. 点击重试按钮可以重新请求数据
/*
  目标2：设置文章图片预览功能
  问题： 使用vant组件提供的 imagePreview 图片预览时出现了问题： this.$imagePreview 报错了。说明这个方法vant并没有全局注册到vue中 => 使用按需导入的方式来使用 ImagePreview 方法
  1. 通过尝试使用 imagePreview，了解到 将文章中所有的图片都放到images属性的数组中，将当前点击的那张图片所在的索引 作为 开启图片预览时的初始值
  2. 问：文章的图片从哪来的？ 答：从接口的content字符串中获取。
     但是：直接通过字符串解析非常困难，所有改变方针，通过dom操作来获取到文章内容标签下的所有img标签 => ref $refs
  3. 既然是dom操作，那么存在js与dom更新的异步问题 $nextTick 如果找不到 => setTimeout(, 0)
  4. 为每个img标签元素绑定 点击事件，插入 图片列表，同时表明当前点击事件应该打开的图片索引
*/
/*
  目标4：封装关注用户组件
  1. 原封不动复制template模板中的结构
  2. 从上往下阅读复制过去的结构代码，遇到变量就去原代码中复制
  3. 如果复制时由其他关联内容，也需要进行复制操作，尤其要注意相对路径的索引问题
  （前3补把子组件完成了）
  4. 在原组件中，通过从上往下阅读template模板中的结构，来一一进行删除操作（但只能删除不影响其他页面或数据的部分）
  5. 相关代码都删除完成后，删除模板内容
  6. 引入子组件
*/
/*
  目标5：关注用户优化操作
  描述：
  1. 在未关注状态下，点击按钮，进行已关注操作，  操作成功后弹出 操作成功
  2. 在已关注状态下，点击按钮，进行取消关注操作，操作成功后弹出 操作成功
  3. 当接口请求失败时， 提示操作失败
  4. 如果文章是当前用户编写的，点击关注，提示操作失败，接口返回错误信息为400，用户不可以关注自己

  业务优化：
  1. 关注/取关操作后，应当提升对应的提示语句： 关注成功/取关成功
  2. 如果用户想自己关注自己，应该提示： 不能关注自己
  3. 除2以外的错误问题： 网络异常，请稍后重试
*/
// 代码优化描述：
//   1. 为什么要去封装关注用户组件？ => 希望关注用户功能可以复用
//   2. 那既然是复用，逻辑相同，数据内容相同（当前关注状态和用户id） => 能否保证每一次使用这个组件时，我们的关注状态都叫做 is_followed 属性，用户id都叫做aut_id? => 无法保证每一次使用这个组件时，对象里的对应属性的名字相同 => 他就失去了复用的灵活性

//   解决方案：
//   1. 将需要的属性，作为自定义属性来进行子父组件的传参，通过这种传参方式，就可以忽略源数据中的属性名称了
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentArticle
  },
  data () {
    return {
      isLoading: false, // 加载状态
      articleInfo: {}, // 失败时的状态码
      errorStatus: 200 // 文章详情信息
    }
  },

  created () {
    // 调用获取文章详情的方法
    this.loadGetArticle()
  },
  mounted () {

  },
  methods: {
    // 更新状态
    // changeIsFollowedFn (newStatus) {
    //   this.articleInfo.is_followed = newStatus
    // },
    // 获取文章详情
    async loadGetArticle () {
      try {
        // 调用接口前，改为true
        this.isLoading = true
        const { data: res } = await getArticleByIdAPI(this.$route.params.articleId)
        // console.log(res)
        this.articleInfo = res.data
        // 获取所有的文字图片内容  涉及到dom元素的操作
        setTimeout(() => {
          this.previewImgage()
        }, 0)
      } catch (error) {
        //  先看报错信息有误响应参数，在判断参数中的code是否为404
        if (error.response && error.response.status === 404) {
          this.errorStatus = 404
        }
        // 提示
        this.$toast.fail('获取详情失败')
      }
      this.isLoading = false
    },
    // 操作dom方法
    previewImgage () {
      // 获取所有的img标签节点
      const articleContent = this.$refs['article-content']
      const domImgs = articleContent.querySelectorAll('img')
      // console.log(domImgs)
      // 获取图片列表
      const images = [...domImgs].map(img => img.src)
      // 遍历每一个元素，为他们绑定点击事件查看大图
      domImgs.forEach((img, index) => {
        img.onclick = () => {
          ImagePreview({
            images: images,
            startPosition: index // 点击图片后 ，展示的初始图片
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
// css样式引入
@import './style/github-markdown.css';
.article-container {
  .main-wrap {
    padding-top: 46px;
    padding-bottom: 44px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 20px;
      padding: 25px 16px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 16px;
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 9px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 12px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 12px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 85px;
        height: 29px;
      }
    }

    .article-content {
      padding: 27.5px 16px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 100px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 100px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 61px;
      color: #b4b4b4;
    }
    .text {
      font-size: 15px;
      color: #666666;
      margin: 16px 0 23px;
    }
    .retry-btn {
      width: 140px;
      height: 35px;
      line-height: 35px;
      border: 1px solid #c3c3c3;
      font-size: 15px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 8px;
        background-color: #e22829;
      }
    }
  }
}
</style>
