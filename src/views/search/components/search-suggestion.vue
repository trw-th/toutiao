<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(value,index) in suggstions" :key="index" @click="$emit('search',value)">
    <template #title>
       <span v-html="hightLight(value)"></span>
    </template>
    </van-cell>
  </div>
</template>

<script>

import { getSearchSuggestionsAPI } from '../../../api/index.js'
import _ from 'lodash'
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      default: ''
    }
  },
  watch: {
    searchText: {
      handler: _.debounce(function () {
        this.loadSearchSuggestions()
      }, 200),
      immediate: true
    }
  },
  data () {
    return {
      suggstions: [] // 联想列表内容
    }
  },
  methods: {
    // 查询接口
    async loadSearchSuggestions () {
      try {
        const { data: res } = await getSearchSuggestionsAPI({
          q: this.searchText
        })
        console.log(res)
        this.suggstions = res.data.options
        // 如果res.data.options.length === 0
        // 如果 res.data.options[0] === null
        if (res.data.options.length === 0 || res.data.options[0] === null) {
          this.suggstions.splice(0, 1, this.searchText) // 删一个加一个this.searchText
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 让联想的内容和输入的内容相同的部分高亮
    hightLight (value) {
      const str = value.split(this.searchText).join(`<span style="color:red">${this.searchText}</span>`)
      return str
    }
  }
}
</script>

<style scoped lang="less"></style>
