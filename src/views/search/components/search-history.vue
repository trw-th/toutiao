<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <!-- template标签的作用
       1.能让包裹的标签视为一个整体
       2.真实dom渲染时，并不会有多余标签的产生 -->
      <template v-if="isDeletShow" >
        <span @click="$emit('clearAll')">全部删除</span>
        <span @click="isDeletShow = false">完成</span>
      </template>
      <van-icon name="delete" v-else @click="isDeletShow = true"/><!-- 垃圾桶删除图标 -->
    </van-cell>
    <van-cell v-for="(value,index) in searchHistoryList" :key="index" :title="value" @click="onHistoryClick(value,index)">
      <van-icon name="close" v-show="isDeletShow"/>   <!-- 删除图标 -->
    </van-cell>

  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    searchHistoryList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isDeletShow: false, // 是否是删除状态
      searchHistoryListClone: this.searchHistoryList // 克隆
    }
  },

  methods: {
    onHistoryClick (value, index) {
      if (this.isDeletShow) {
        // 删除状态，删除历史记录
        this.searchHistoryListClone.splice(index, 1)
      } else {
        // 非删除状态进行点击搜索
        this.$emit('search', value)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
