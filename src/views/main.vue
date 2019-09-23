<template>
  <div class="main-wrap">
    <el-container>
      <el-aside width="60px" class="hear-aside">
        <div class="menu-container">
          <el-scrollbar>
            <div class="logo" style="height:80px;">
              <img src="../assets/images/logo-header.png" alt="寻宝网" />
            </div>
            <el-row class="tac">
              <el-col :span="24">
                <el-menu :default-active="selectPath" router class="el-menu-vertical-demo">
                  <!-- <el-menu-item index="/main" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/general-situation.png">
                        <div class="menu-p">概况</div>
                      </div>
                    </el-col>
                  </el-menu-item>-->
                  <el-menu-item index="/main" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/new-center.png" />
                        <div class="menu-p">新闻中心</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <el-menu-item index="/videoManagement" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/new-center.png" />
                        <div class="menu-p">视频中心</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <el-menu-item index="/encyclopedias" style="padding:0;" >
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/new-center.png" />
                        <div class="menu-p">百科</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <!-- <el-menu-item index="/recruiting" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/recruiting.png">
                        <div class="menu-p">招贤纳士</div>
                      </div>
                    </el-col>
                  </el-menu-item>-->
                  <!-- <el-menu-item index="/companyProfile" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/company-profile.png">
                        <div class="menu-p">公司简介</div>
                      </div>
                    </el-col>
                  </el-menu-item>-->
                  <el-menu-item index="/appraisal" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/new-center.png" />
                        <div class="menu-p">鉴宝管理</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <el-menu-item index="/activity" style="padding:0;" >
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/new-center.png"/>
                        <div class="menu-p">精品管理</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <el-menu-item index="/auction" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/new-center.png"/>
                        <div class="menu-p">拍卖管理</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <el-menu-item index="/slideshow" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/shuffling-figure.png" />
                        <div class="menu-p">轮播图</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <el-menu-item index="/famous" style="padding:0;" >
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/shuffling-figure.png" />
                        <div class="menu-p">名家管理</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <!-- <el-menu-item index="/advertising" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/advertising.png">
                        <div class="menu-p">广告管理</div>
                      </div>
                    </el-col>
                  </el-menu-item>-->
                  <el-menu-item index="/commodity" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/advertising.png" />
                        <div class="menu-p">商品管理</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <el-menu-item index="/merchant" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/recruiting.png" />
                        <div class="menu-p">商户管理</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <el-menu-item index="/imagemanage" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/imageing.png" />
                        <div class="menu-p">资源管理</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                  <el-menu-item index="/systemManagement" style="padding:0;">
                    <el-col :span="24" class="elcolspan">
                      <div class="h-menu">
                        <img class="menu-img" src="../assets/menu-icons/systeming.png" />
                        <div class="menu-p">系统管理</div>
                      </div>
                    </el-col>
                  </el-menu-item>
                </el-menu>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
          <div style="height:82px;"><!--占位文本流--></div>
          <div style="position:absolute;bottom:30px;left:10px;">
            <!-- <router-link to="javascript:;" @click="logout">
              <i class="el-icon-back"></i>退出
            </router-link>-->
            <span style="display:block;cursor: pointer;" v-popover:userseting>
              <img
                style="width:40px;height:40px;display:block;margin:0 auto;"
                src="../assets/images/mine.png"
                alt="头像"
              />
            </span>
            <el-popover ref="userseting" placement="right" width="166" trigger="click">
              <!-- <div style="width:166px;height:164px;"></div> -->
              <div class="user-popover-box">
                <p @click="logout">
                  <span>退出登入</span>
                </p>
              </div>
            </el-popover>
          </div>
      </el-aside>
      <el-main>
        <router-view class="content-box" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import * as AuthAction from "../api/auth";
import navMenu from "@/components/navMenu";
export default {
  components: {
    navMenu
  },
  data() {
    return {
      selectPath: "",
      realPath: "",
      breadcrumbList: [],
      tableHeight: { "min-height": "" }
    };
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        this.breadcrumbList = [];
        for (let i = 1; i < this.$route.matched.length; i++) {
          this.breadcrumbList.push(this.$route.matched[i].meta.title);
        }
        if (this.$route.fullPath.split("/")[1] == "index") {
          this.selectPath = "/main";
        } else {
          this.selectPath = "/" + this.$route.fullPath.split("/")[1];
        }
      }
    }
  },

  mounted() {
    if (this.$route.fullPath.split("/")[1] == "index") {
      this.selectPath = "/main";
    } else {
      this.selectPath = "/" + this.$route.fullPath.split("/")[1];
    }
  },
  created() {},
  methods: {
    getUploadTaskBar() {
      return this.$refs["uploadTaskBar"];
    },
    logout() {
      this.$confirm("此操作将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message.success("退出成功");
          AuthAction.removeToken();
          this.$router.push({ path: "/login" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.main-wrap {
  height: 100vh;
  .menu-container {
    height: calc(100% - 82px);
  }
  /deep/ .hear-aside {
    color: #333;
    background-color: #1989fa;
    // .el-menu-vertical-demo  火狐兼容性
    .el-menu-vertical-demo {
      width: 60px;
      padding: 0;
      height: 60px;
      /deep/ .el-menu-item:focus,
      .el-menu-item:hover {
        background-color: #0174e8;
      }
      .elcolspan {
        height: 100%;
        .h-menu {
          height: 100%;
          text-align: center;
          color: #fff;
          // background-color: #1989FA;
          line-height: 0px !important;
          padding-top: 10px;
          &:hover {
            background-color: #0174e8;
          }
          .menu-img {
            width: 20px;
            height: 20px;
            margin: 0px auto 0;
            background-size: 100% 100%;
          }
          .menu-p {
            margin-top: 3px;
            width: 100%;
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            text-align: center;
          }
        }
      }
      /deep/ .el-menu-item {
        padding: 0;
        height: 60px;
      }
    }
  }
  .el-menu-item.is-active {
    background: #0174e8;
  }
  .logo {
    width: 60px;
    height: 80px;
    img {
      width: 60px;
      height: 80px;
    }
  }
  .el-scrollbar {
    height: 100%;
    width: 60px;
  }
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden !important;
    padding: 0;
  }
  .el-menu {
    border: none;
    background-color: #1989fa;
  }
  // .el-menu-item {
  //   width: 60px !important;
  //   min-width: 0 !important;
  //   padding: 0;
  // }
  .el-container {
    height: 100%;
    border: 1px solid #eee;
  }
  .el-main {
    background: #e9ecf3;
    // background: #b0adad;
    padding: 0;
    .content-box {
      margin: 0;
      height: 100%;
      // padding: 20px;
      // background: #fff;
      // height: calc(100% - 100px);
    }
    .content-title {
      padding-left: 15px;
      height: 40px;
      font-size: 14px;
      color: #101010;
      line-height: 40px;
      background: #fff;
      margin-bottom: 10px;
    }
  }
}

.el-input {
  width: 230px;
}
.el-textarea {
  width: 230px !important;
}
.el-input-number .el-input {
  width: 130px !important;
}
.el-menu-item-group__title {
  padding: 0 !important;
}
.el-breadcrumb {
  height: 40px;
  line-height: 40px !important;
}
.el-message-box__header {
  border-bottom: 1px solid #cccccc;
}
.el-message-box.my-message-box {
  width: 958px;
}
.login-input input {
  border: none;
}
.el-upload-list--picture-card .el-upload-list__item {
  line-height: 148px !important;
  text-align: center;
  padding: 10px;
}
.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  height: auto !important;
  width: auto !important;
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
  display: inline-block;
}
.user-popover-box {
  width: 166px;
  height: 46px;
  background: #eeeeee;
  position: absolute;
  top: 0;
  left: 0;
  p {
    border-top: 2px solid #ffffff;
    height: 46px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
  }
  p:hover {
    background: #1989fa;
    span {
      color: #ffffff;
    }
  }
  p:nth-of-type(1) {
    border: none;
  }
}
</style>
