<template>
  <div class="home">
    <el-container>
      <el-aside class="aside-cont" width="175px">
        <div class="logo-box">寻宝网APP
          <!-- <img class="logo-img" src="../assets/images/logo3.png" alt="简算程序"> -->
          <!-- <span class="version">v1.0</span> -->
        </div>
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          router
          text-color="#000"
          width="180px"
          active-text-color="#409EFF">
          <!-- <div>
            <el-menu-item index="/main/newsCenter/articleLists">
              <i class="el-icon-folder-opened"></i>
              <img src="../assets/images/fir.jpg"  class="menu-icon">
              <span slot="title">文章列表</span>
            </el-menu-item>
          </div>
          <el-submenu index="/main/newsCenter/gallery">
            <template slot="title">
              <i class="el-icon-picture-outline"></i>
              <span>画廊</span>
            </template>
              <el-menu-item index="/main/newsCenter/gallery/notice">
                <span slot="title">画廊公告</span>
              </el-menu-item>
          </el-submenu> -->
          <nav-menu v-for="(item) in newNav"
            :key="item.index"
            :menuD="item"
          />
        </el-menu>
      </el-aside>
      <el-container class="index-cont">
        <el-header class="header-cont">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="(item, index) in this.breadcrumbList"
              :class="index==0?'el-bread-one':'el-bread-two'"
              :key="index"
            >{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <el-main class="content-box">
          <keep-alive :include="includeArr" :max="1">
            <router-view/>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import { debug } from 'util';
export default {
  name: "video_home",
  data() {
    return {
      defaultActive: "",
      isBind: true,
      breadcrumbList: [],
      realPath:''
    };
  },
  computed:{
    ...mapGetters('video',['newNav','includeArr'])
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        this.breadcrumbList = [];
        for (let i = 1; i < this.$route.matched.length; i++) {
          this.breadcrumbList.push(this.$route.matched[i].meta.title);
        }
      }

      if(this.$route.fullPath.indexOf("/videoManagement/videoList/addOrEdit")!=-1){
        this.realPath = '/videoManagement/videoList'
      }
      if(this.$route.fullPath.indexOf("/videoManagement/videoSection/addOrEditSec")!=-1){
        this.realPath = '/videoManagement/videoSection'
      }
      if(this.$route.fullPath.indexOf("/videoManagement/videoProgram/addOrEditProgram")!=-1){
        this.realPath = '/videoManagement/videoProgram'
      }
      if(this.$route.fullPath.indexOf("Program")!=-1){
        this.realPath = '/videoManagement/videoProgram'
      }
      this.defaultActive = this.$route.fullPath;
      if(this.realPath){
        this.defaultActive = this.realPath;
      }else{
        this.defaultActive = this.$route.fullPath;
      }
      this.realPath = '';
    }
  },
  mounted() {
    for (let i = 1; i < this.$route.matched.length; i++) {
      this.breadcrumbList.push(this.$route.matched[i].meta.title);
    }
    if(this.$route.fullPath.indexOf("/videoManagement/videoList/addOrEdit")!=-1){
      this.realPath = '/videoManagement/videoList'
    }
    if(this.$route.fullPath.indexOf("/videoManagement/videoProgram/addOrEditProgram")!=-1){
      this.realPath = '/videoManagement/videoProgram'
    }
    if(this.$route.fullPath.indexOf("/videoManagement/videoSection/addOrEditSec")!=-1){
      this.realPath = '/videoManagement/videoSection'
    }
    if(this.$route.fullPath.indexOf("Program")!=-1){
      this.realPath = '/videoManagement/videoProgram'
    }
    this.defaultActive = this.$route.fullPath;
    if(this.realPath){
      this.defaultActive = this.realPath;
    }else{
      this.defaultActive = this.$route.fullPath;
    }
    this.realPath = '';
  },
  created() {
    // console.log(this.newNav);
  },
  // beforeRouteEnter(to,from,next){
  //   if(getUtils().length>0){
  //     next();
  //   }else{
  //     exec(()=>next())
  //   }
  // },
  methods: {

  }
};
</script>

<style lang="scss"  scoped>
.home {
  height: 100%;
}
.el-container {
  height: 100%;
}
.menu-icon{
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: 10px;
}
.header-cont {
  display: flex;
  background-color: #fff;
  align-items: center;
  height: 40px !important;
  .el-breadcrumb {
    font-size: 12px !important;
  }
}
.aside-cont {
  background-color: #fff;
  .logo-box {
    font-size: 20px;
    width: 100%;
    height: 80px;
    line-height: 80px;  
    background-color: #fff;
    text-align: center;
    border-bottom: 1px solid #e7e9f2;
    // .logo-img {
    //   width: 136px;
    //   height: 43px;
    //   margin: 0px 8px 0 0;
    //   display: inline-block;
    //   vertical-align:middle;
    // }
    // .version {
    //   font-size: 12px;
    //   color: #555555;
    // }
  }
}
.content-box {
  height: 100%;
}
.el-menu-item.is-active {
  background: #E7E9F2;
}
.el-bread-one {
  /deep/ .el-breadcrumb__inner {
    color: rgba(16, 16, 16, 1);
  }
}
/deep/ .el-bread-two {
  color: #ff101010;
}
.el-menu {
  border: none;
}
.index-cont {
  padding: 20px;
}
.el-main {
  padding: 0;
}
.binding {
  background-color: #fa7673;
  height: 30px;
  width: 100%;
  font-size: 12px;
  line-height: 30px;
  color: #fff;
  padding-left: 20px;
  border-radius: 3px;
  position: relative;
  margin-bottom: 15px;
  .right {
    position: absolute;
    top: 7px;
    right: 20px;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
