<template>
  <div class="home">
    <!-- <img @click="back" class="image" src="../../assets/images/back.png"> -->
    <el-scrollbar style="width:100%;height:100%">
      <div class="ac-box">
        <el-form
          :rules="rules"
          :model="ruleForm"
          ref="ruleForm"
          label-width="120px"
          size="medium"
          class="demo-ruleForm"
        >
          <el-form-item label="下载页面路径:">
            <span style="font-size:18px;">{{'https://m.xunbaowang.net/downloadapp'}}</span>
          </el-form-item>
          <el-form-item label="下载页面路径:">
            <div class="imageCon">
               <img v-lazy="'https://xbw-vue.oss-cn-hangzhou.aliyuncs.com/neoApp/241566640447.jpg'" >
            </div>
          </el-form-item>

          <el-form-item label="安卓下载路径:" prop="android_url">
            <el-input v-model="ruleForm.android_url" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="下载量:">
            <el-input-number v-model="ruleForm.download_number" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="每日下载增幅量:">
            <el-input-number v-model="ruleForm.download_daily_increase" :min="1"></el-input-number>
          </el-form-item>

          <el-form-item label="用户量:">
            <el-input-number v-model="ruleForm.user_number" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="每日用户增幅量:">
            <el-input-number v-model="ruleForm.user_daily_increase" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="海报图:" prop="images">
            <div class="allBox">
              <div class="imageBox" >
                <div class="imageCon" @click="checkImage(-2)">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </div>
              <div
                class="imageBox"
                v-show="imgList.length>0"
                v-for="(item,index) in imgList"
                :key="index"
              >
                <div
                  class="imageCon"
                  @mouseover="imgMouseOver(index)"
                  @mouseleave="imgMouseLeave(index)"
                >
                  <i v-show="!item" class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="layer" v-show="imgIndex==index">
                    <i
                      @click.stop="onDelImgClick(index)"
                      class="el-icon-delete"
                      style="z-index=200;color:#fff;font-size:20px;"
                    ></i>
                  </div>
                  <el-image
                    v-show="item"
                    style="width: 120px; height: 120px"
                    :src="item+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
                    fit="scale-down"
                  ></el-image>
                </div>
              </div>
            </div>
            <!-- <span style="color:#F56C6C">建议尺寸1:1</span> -->
          </el-form-item>
          <el-form-item label="描述:">
            <el-input
              v-model="ruleForm.introduction"
              show-word-limit
              maxlength="255"
              :autosize="{ minRows: 4,}"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveDownloadData">提交</el-button>
          </el-form-item>
        </el-form>

        <el-dialog title="图片资源" :visible.sync="dialogTableVisible" @close="onClose">
          <resources ref="resources" :checkLength="1" />
          <div class="dialog-footer" slot="footer">
            <el-button @click="dialogTableVisible=false">取消</el-button>
            <el-button @click="onCheckChange" type="primary">确定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import Upload from "../../components/upload";
import resources from "@/components/resources";
import { getDownloadData, saveDownloadData } from "@/api/download";
// import { lookup } from 'dns';
export default {
  components: { upload: Upload, resources },
  data() {
    return {
      ruleForm: {
        android_url: "",
        introduction: "",
        download_number: "",
        download_daily_increase: "",
        user_number: "",
        user_daily_increase: "",
        images: ""
      },
      rules: {
        android_url: [
          { required: true, message: "请输入安卓下载路径", trigger: "blur" }
        ]
        // sort: [{ required: true, message: "请输入排名", trigger: "blur" }]
      },
      dialogTableVisible: false,
      imgList: [],
      imgUpList: [],
      imgIndex: -1,
      urlDomain: "https://app-img.xunbaowang.net"
    };
  },
  computed: {
    getParams() {
      return this.ruleForm;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    saveDownloadData() {
    //   if (this.imgList.length) {
        let params = this.ruleForm
        // delete params.images;
        console.log(this.imgList)
        console.log(params)
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            saveDownloadData(params)
              .then(res => {
                this.$message.success("修改成功");
              })
              .catch(() => {});
          }
        });
    //   } else {
    //     this.$message.warning("请选择图片");
    //   }
    },

    checkImage(i) {
      if (i == this.imgIndex) {
        return;
      }
      this.dialogTableVisible = true;
    },
    onUpload(item) {
        console.log(item)
      if (item.check == true) {
        this.imgList.push(item);
      } else {
        for (let i = this.imgList.length - 1; i >= 0; i--) {
          if (this.imgList[i] == item) {
            this.imgList.splice(i, 1);
          }
        }
      }
      for (const item of this.imgList) {
        this.imgUpList.push(item);
      }
      this.imgUpList = Array.from(new Set(this.imgUpList));
      this.dialogTableVisible = false;
    },
    onCheckChange() {
      let data = this.$refs["resources"].api_getcheckItem();
      console.log(data)
      this.imgList.push(data[0].url);
      this.dialogTableVisible = false;
    },
    onClose() {
      this.$refs["resources"].api_clearCheck();
    },
    getData() {
      getDownloadData({}).then(res => {
        console.log(res);
        let images = res.images;
        this.ruleForm.android_url = res.android_url;
        this.ruleForm.introduction = res.introduction;
        this.ruleForm.download_number = res.download_number;
        this.ruleForm.download_daily_increase = res.download_daily_increase;
        this.ruleForm.user_number = res.user_number;
        this.ruleForm.user_daily_increase = res.user_daily_increase;
        this.ruleForm.images = images;
        this.imgList = images;
        console.log(this.imgList);
      });
    },
    imgMouseOver(i) {
      this.readOnly ? null : (this.imgIndex = i);
    },
    imgMouseLeave(i) {
      this.imgIndex = -1;
    },
    onDelImgClick(i) {
      this.imgList.splice(i, 1);
      this.$message.success("删除成功");
      this.imgUpList = [];
      this.imgIndex = -1;
      for (const item of this.imgList) {
        this.imgUpList.push(item);
      }
      this.imgUpList = Array.from(new Set(this.imgUpList));
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #fff;
  padding-top: 0px;
  .image {
    position: absolute;
    top: 0;
    right: 0;
    width: 44px;
    height: 44px;
    cursor: pointer;
    z-index: 1000;
  }
  .ac-box {
    margin-top: 30px;
    .allBox {
      display: flex;
      flex-wrap: wrap;
      .imageBox {
        margin: 10px 10px;
        display: inline-block;
        .imageCon {
          margin: 0 auto;
          width: 120px;
          height: 120px;
          border: 1px dashed #c0ccda;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 120px;
            height: 120px;
            line-height: 120px;
            text-align: center;
          }
          .layer {
            cursor: pointer;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.7;
            background-color: #000;
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        .imagePut {
          margin-top: 10px;
          width: 150px;
        }
      }
    }
  }
  .el-input {
    width: 400px;
  }
  /deep/ .el-input__count {
    height: 24px;
    line-height: 24px;
    bottom: 2px;
  }
  .el-textarea {
    width: 400px;
  }
}
</style>

