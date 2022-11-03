module.exports = {
  plugins: {
    //   autoprefixer,生成浏览器的css样式的前缀
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    //     },

    'postcss-pxtorem': {
      // 将37.5px转换为1rem
      rootValue: 37.5,
      // 匹配项目中全部文件中px
      propList: ['*']
    }
  }
}
