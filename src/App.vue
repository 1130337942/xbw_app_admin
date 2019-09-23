<template>
  <div id="app">
    <router-view/>
    <!-- <upload-task-bar ref="uploadTaskBar"/> -->
  </div>
</template>


<script>
export default {
  data () {
    return {
      selectPath: "",
      realPath: "",
      breadcrumbList: [],
      tableHeight: { "min-height": "" },
      domainUrl:'https://app-img.xunbaowang.net',
    };
  },
  mounted () {

  },
  created () {
    this.$store.dispatch('uploadProvince_two')
  },

  methods: {
    // getUploadTaskBar(){
    //   return this.$refs['uploadTaskBar']
    // }
  }
};
</script>
<style lang="less">
*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
  font-size: 12px !important;
}
a {
  text-decoration: none;
}
img {
  border: 0;
  border: none;
  display: block;
}
ul,
li {
  list-style: none;
  margin: 0;
}
a {
  text-decoration: none;
}
img {
  border: 0px;
  border: none;
  display: block;
}
// .el-menu-item-group__title {
//   padding: 0 !important;
// }
// .el-aside {
//   width: 175px !important;
//   overflow-x: hidden !important;

// }
.scroll_content::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
.scroll_content .-o-scrollbar {
  -moz-appearance: none !important;
  background: rgba(0, 255, 0, 0) !important;
}
.el-upload-list--picture-card .el-upload-list__item {
  background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCACWAJYDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAB38VaEVaEVaEVaEVaEVaEVaEVaEVaCKLUVaEVaEVaEVaEVaEVaEVaEVaEVaCKLUVaEVaEVaEVaEVaEVaEVaEVaEVaCKLUVaEVaEVaEVaEVaEVaEVaEVaEVaCKLUVaEVaEVaEVaEVaEVaEVaEVaEVaCKLUVaEVaEVaEVaEVaEVaEVaEVaEVaCKLUVaEVaEVaEVaEVaEVaEVaEVaEVaCKLUVaEVaEVaEVaEVaEVaEVaEVaEVaCKLUVaEVaEVaEVaEVaEVaEVaEVaEVaCKLUULUULUULUULUULUULUULUULUULQP/8QAFBABAAAAAAAAAAAAAAAAAAAAgP/aAAgBAQABBQI0/wD/xAAUEQEAAAAAAAAAAAAAAAAAAABg/9oACAEDAQE/AUn/xAAUEQEAAAAAAAAAAAAAAAAAAABg/9oACAECAQE/AUn/xAAUEAEAAAAAAAAAAAAAAAAAAACA/9oACAEBAAY/AjT/AP/EABQQAQAAAAAAAAAAAAAAAAAAAID/2gAIAQEAAT8hNP8A/9oADAMBAAIAAwAAABDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/xAAUEQEAAAAAAAAAAAAAAAAAAABg/9oACAEDAQE/EEn/xAAUEQEAAAAAAAAAAAAAAAAAAABg/9oACAECAQE/EEn/xAAUEAEAAAAAAAAAAAAAAAAAAACA/9oACAEBAAE/EDT/AP/Z") !important;
  // line-height: 148px;
}
.img-uploader .el-upload--picture-card {
  margin: 0 8px 8px 0;
}
.img-uploader .el-upload-list--picture-card .el-upload-list__item-thumbnail{
  height: auto!important;
  display: inline-block;
  margin: auto 0;
}
</style>


