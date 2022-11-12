<template>
    <div class="search-container">
    <form action="/"  class="search">
        <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="isResultShow = false"
         />
</form>
<!-- // 搜索结果 -->
<SearchResult v-if="isResultShow" :searchText="searchText"></SearchResult>
<!-- // 联想搜索 -->
<SearchSuggestion v-else-if="searchText" :searchText="searchText" @search="onSearch"></SearchSuggestion>
<!-- // 搜索历史 -->
<SearchHistory v-else :searchHistoryList="searchHistoryList" @search="onSearch" @clearAll="searchHistoryList = []"></SearchHistory>
    </div>

</template>

<script>
/*
  目标1： 各组件的切换逻辑
  业务分析
  1. 初始化状态先                  搜索历史
  2. 当输入框中有值时              联想列表
  3. 通过某个状态值的变化来控制     搜索结果列表
  4. 当聚焦搜索框时，搜索结果会消失

                  searchText       isResultShow
  搜索历史             X                 X
  联想列表             √                 X
  搜索结果列表          √                √
*/
/*
  目标2： 联想搜索
  1. 当输入框中输入内容时，会实时的获取联想内容 => watch 监听器当数据改变时触发查询功能
    1.1 当空字符串输入第一个字符内容时，并没有触发监听器 => 因为只有有值时才会将组件渲染到真实dom上，所有watch在监听初期，字符串中就至少有第一个字符
    => 解决方案，通过watch的完整写法中的immediate立即执行属性来解决这一缺陷
  2. 将查询的结果渲染到页面上
    2.1 发现如果后端没有查到相关联想数据，有可能会返回带有null的数组，也有可能会返回空数组 => 只要后端查询某个字符串没有查到相关内容时，让这个字符串本身作为一个列表元素
*/
// 3. 在测试查询联想列表时，发现删除字符时查询的频率过于频繁，所以决定对该查询进行防抖优化 => lodash中有一个专门处理防抖的方法 debounce(funtion(){},延时时间)
// 4. 联想查询结果的富文本配置
//     4.1 通过v-html来显示带有标签的文本
//     4.2 如何替换一个字符串中符合要求的字符？ => replace 来替换符合要求的文本（搜索框中的内容）
//     str.replace('1', '<span style="color: red;">1</span>')

//     如： 101 => 1 => <span style="color: red;">1</span>
//         => <span style="color: red;">1</span>0<span style="color: red;">1</span>
// 高亮关键字
// value：当前需要高亮处理的字符串
/*
      replace() 的第一个参数如果是字符串只能替换第一个找到的字符
      它的第一个参数如果传的是一个正则表达式，则会找到字符串中所有符合要求的部分并替换
    */
/*
      split(需要切割的字符目标) => 将所有符合输入框内容的部分切割成逗号  如： 101 => [ , 0, ]
      join(主要将逗号改为怎样的字符) => 将所有的逗号全部转化为带有标签的内容 如 [ , 0, ] => s0s
    */
/*
  /*
  目标4： 搜索历史
  1. 只有通过搜索结果(触发onSearch方法)的行为，会将输入框中的内容设置到搜索历史列表中
  2. 关于搜索列表的排序规则： 最新搜索的排在最前面，不能有重复的搜索记录
  3. 通过垃圾桶和完成按钮来实现删除状态与查询状态的切换
  4. 在删除状态下点击单元格进行历史记录的删除，在查询状态下点击单元格进行结果查询
  5. 点击全部删除按钮，清空历史列表
  规律： 如果发现子组件中无法通过拷贝的方式进行数据修改时，立马转化为让父组件自己去修改
    6. 搜索历史的数据持久化
  6.1 初始化数据时尝试从本地存储中获取
   6.2 数据变化时，更新本地存储数据
*/

import SearchHistory from './components/search-history.vue' // 搜索历史
import SearchSuggestion from './components/search-suggestion.vue' // 联想搜索
import SearchResult from './components/search-result.vue' // 搜索结果
import { setItem, getItem } from '../../utils/storage.js'
export default {
  name: 'searchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data () {
    return {
      searchText: '', // 用户在input输入的内容
      isResultShow: false, // 是否展示搜索结果
      searchHistoryList: getItem('TOUTIAO_SEARCHHISTORY') || []// 搜索历史列表
    }
  },
  watch: {
    'searchHistoryList' () {
      setItem('TOUTIAO_SEARCHHISTORY', this.searchHistoryList)
    }
  },
  methods: {
    onSearch (value) {
      // 输入内容后敲击回车时触发的查询方法
      console.log(value)
      //   更新文本内容
      this.searchText = value
      // 判断输入的是否为空
      if (this.searchText.trim().length === 0) return
      // 存储添加历史搜索记录
      // 在添加元素之前把原数组中的相同元素给删除
      const index = this.searchHistoryList.indexOf(this.searchText)
      if (index !== -1) {
        // 找到了相同的元素，把找到的元素给删除掉
        this.searchHistoryList.splice(index, 1)
      }
      this.searchHistoryList.unshift(this.searchText)
      // 开启搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}

</script>

<style scoped lang="less">
 .search-container{
    padding-top:54px ;
 .search{
    position: fixed;
    top:0;
    left:0;
    right:0;
    z-index: 1;
    .van-search__action{
        color: #fff;
    }
 }
 }
</style>
