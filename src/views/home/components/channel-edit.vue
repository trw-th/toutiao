<template>
    <div class="channel-edit-container">
      <!-- 我的频道标题 -->
      <van-cell title="我的频道">
        <template #default>
          <van-button
            plain
            round
            type="danger"
            size="mini"
            class="edit-btn"
            @click="isEdit=!isEdit"
          >{{isEdit?'完成':'编辑'}}</van-button>
        </template>
      </van-cell>

      <!-- 我的频道宫格 -->
      <van-grid :gutter="10" class="my-grid">
        <van-grid-item
          class="channel-item"
          v-for="(channels,index) in myChannels"
          :key="channels.id"
          :icon="(isEdit && index !==0)?'close':''"
          :text="channels.name"
          close
          :class="{active_red:active === index}"
          @click="onChannelClick(index,channels.id)"
        />
      </van-grid>

      <!-- 频道推荐 -->
      <van-cell title="频道推荐"></van-cell>

      <!-- 频道推荐宫格 -->
      <van-grid :gutter="8" class="recommend-grid">
        <van-grid-item
          class="channel-item"
          v-for="value in newRecommendChannels"
          :key="value.id"
          icon="plus"
          :text="value.name"
          @click="onAddChannel(value)"
        />
      </van-grid>
    </div>
  </template>

<script>
import _ from 'lodash' // lodash库 里面有一个_.differenceBy的方法可以用于筛选数组，
import { setItem } from '../../../utils/storage.js'
import { addUserChannelAPI, deleteUserChannelAPI } from '../../../api/index.js'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    },
    allChannes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    recommendChannels () {
    // 1.从allChannels中通过过滤器进行筛选
      const list = this.allChannes.filter(channel => {
        // 在filter中返回true时候 ，这个元素会添加到新的数组中
        // 在filter 中返回为false时  ，这个元素会被过滤掉
        // 当前循环的元素如果没有出现在 myChannels数组里，那么返回true
        return !this.myChannels.find(mychannel => {
          return mychannel.id === channel.id
        })
      })
      console.log(list, '推荐列表')
      return list
    },

    /* ------------------------------------------------------------------------- */
    newRecommendChannels () {
      // differenceBy(目标数组，差异数组，比较条件)
      return _.differenceBy(this.allChannes, this.myChannels, 'id')
    }
  },
  data () {
    return {
      myChannelsClone: this.myChannels,
      isEdit: false // 控制当前编辑的状态值
    }
  },
  methods: {
    // 点击频道推荐里面的内容，添加到我的频道当中
    async onAddChannel (channel) {
      this.myChannelsClone.push(channel)
      //  数据持久化
      if (this.$store.state.user.token) {
        // 已经登录
        try {
          await addUserChannelAPI({
            id: channel.id,
            seq: this.myChannels.length
          })
          this.$toast.success('添加成功')
        } catch (error) {
          console.log(error)
        }
      } else {
        setItem('TOUTIAO_MYCHANNELS', this.myChannels)
      }
    },
    // 点击我的频道触发的方法
    async onChannelClick (index, channelId) {
      if (this.isEdit) {
        // 编辑状态  删除频道
        if (index !== 0) {
          this.myChannelsClone.splice(index, 1)
          //  如果删除的元素小于等于当前高亮的索引，需要让active减1
          if (index <= this.active) {
            this.$emit('updata-active', this.active - 1, true)
          }
        }

        if (this.$store.state.user.token) {
        // 已经登录
          try {
            await deleteUserChannelAPI(channelId)
            this.$toast.success('删除成功')
          } catch (error) {
            console.log(error)
            this.$toast.success('删除失败')
          }
        } else {
          setItem('TOUTIAO_MYCHANNELS', this.myChannels)
        }
      } else {
        this.$emit('updata-active', index)
      }
    }
  }
}

</script>

  <style scoped lang="less">
  .channel-edit-container {
    .my-grid {
        :deep(.active_red){
            .van-grid-item__text{
                color: red !important;;
            }
        }
      .edit-btn {
        padding: 0 12px;
      }

      :deep(.channel-item) {
        .van-grid-item__content {
          background-color: #f5f5f6;
        }

        .van-grid-item__text {
          font-size: 12px;
          color: #222222;
          margin-top: 0;
        }

        .van-icon-close {
          position: absolute;
          font-size: 16px;
          top: -7px;
          right: -7px;
          color: #d9d6d9;
        }
      }
    }
    .recommend-grid {
      :deep(.channel-item) {
        .van-grid-item__content {
          white-space: nowrap;
          flex-direction: row;
          background-color: #f5f5f6;
          padding: 16px 4px;
        }

        .van-grid-item__text {
          font-size: 12px;
          color: #222222;
          margin-top: 0;
        }

        .van-icon-plus {
          font-size: 12px;
          margin-right: 2px;
        }
      }
    }
  }
  </style>
