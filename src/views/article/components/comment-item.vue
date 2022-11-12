<template>
  <van-cell class="comment-item-container">
    <template #icon>
      <van-image
        round
        class="avatar"
        fit="cover"
        :src="comment.aut_photo"
      />
    </template>

    <template #title>
      <span class="title">{{comment.aut_name}}</span>
    </template>

    <template #label>
      <p class="comment-content">{{comment.content}}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{comment.pubdate | relativeTime}}</span>
        <van-button class="comment-info" round type="default" size="mini">回复 {{comment.reply_count}}</van-button>
      </div>
    </template>

    <template #default>
      <van-button class="reply-btn" icon="good-job-o" size="mini">
        <!-- 如果没有人电站，则显示'赞' 如过有人点赞，则显示点赞的数量 -->
        {{comment.like_count ===0 ?'赞':comment.like_count}}
        </van-button>
    </template>
  </van-cell>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
.comment-item-container {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }

  .title {
    color: #406599;
    font-size: 13px;
  }

  .comment-content {
    font-size: 12px;
  }

  .bottom-info {
    display: flex;
    align-items: center;
    .comment-pubdate {
      color: #222;
      margin-right: 14px;
    }

    .comment-info {
      color: #222;
      width: 67.5px;
    }
  }

  .reply-btn {
    font-size: 10px;
    border: none;
  }
}
</style>
