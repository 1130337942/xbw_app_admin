<template>
  <div class="add-themeList">
    <img @click="onBackBtn" class="image" src="../../assets/images/back.png" />
    <div class="title">添加主题</div>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="addForm">
      <el-form-item label="主题名称:" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入主题名称"
          maxlength="6"
          style="width:420px"
          clearable
        >
          <span slot="suffix">{{form.name.length||0}}/6</span>
        </el-input>
      </el-form-item>
      <el-form-item label="副标题:" prop="subtitle">
        <el-input
          v-model="form.subtitle"
          placeholder="请输入副标题"
          maxlength="64"
          style="width:420px"
          clearable
        >
          <span slot="suffix">{{form.subtitle.length||0}}/64</span>
        </el-input>
      </el-form-item>
      <el-form-item label="会场编号:" prop="venue_id">
        <el-select
          v-model="form.venue_id"
          filterable
          remote
          :remote-method="uploadMerchantData"
          placeholder="请选择会场编号"
          clearable
        >
          <el-option
            v-for="(item,index) in mtList"
            :key="index"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="主题图标" prop="icon">
        <div class="imageCon" @click.stop="onCheckImageClick('icon')">
          <el-image
            v-if="form.icon"
            style="width: 120px; height: 120px"
            :src="domain+form.icon+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
            fit="scale-down"
          ></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
        <span style="color:#F56C6C">建议尺寸1:1</span>
      </el-form-item>

      <el-form-item label="大主题图标">
        <div class="imageCon" @click.stop="onCheckImageClick('big_icon')">
          <el-image
            v-if="form.big_icon"
            style="width: 120px; height: 120px"
            :src="domain+form.big_icon+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
            fit="scale-down"
          ></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
        <span style="color:#F56C6C">建议尺寸1:1</span>
      </el-form-item>

      <el-form-item label="小主题图标">
        <div class="imageCon" @click.stop="onCheckImageClick('small_icon')">
          <el-image
            v-if="form.small_icon"
            style="width: 120px; height: 120px"
            :src="domain+form.small_icon+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
            fit="scale-down"
          ></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
        <span style="color:#F56C6C">建议尺寸1:1</span>
      </el-form-item>

      <el-form-item label="app端模板名称:" clearable>
        <el-input
          v-model="form.template_code"
          placeholder="请输入app端模板名称"
          maxlength="200"
          style="width:420px"
          clearable
        >
          <span slot="suffix">{{form.template_code.length||0}}/200</span>
        </el-input>
      </el-form-item>
      <el-form-item label="主题描述:">
        <el-input
          v-model="form.description"
          placeholder="请输入主题描述"
          maxlength="200"
          style="width:420px"
          clearable
        >
          <span slot="suffix">{{form.description.length||0}}/200</span>
        </el-input>
      </el-form-item>
      <el-form-item label="主题规则:">
        <el-input
          type="textarea"
          v-model="form.custom"
          placeholder="请输入主题的规则"
          show-word-limit
          maxlength="600"
          style="width:420px"
        >
          <span slot="suffix">{{form.custom.length||0}}/600</span>
        </el-input>
      </el-form-item>
      <el-form-item label="商品描述:" prop="lock_recommendation">
        <el-radio v-model="form.lock_recommendation" :label="1" @click="mustFill">必填</el-radio>
        <el-radio v-model="form.lock_recommendation" :label="0" @click="notMustFill">非必填</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button @click="onBackBtn" type="danger">取消</el-button>
        <el-button type="primary" @click="onSaveClick()">提交</el-button>
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
</template>
<script>
import {
  getMettingList,
  getThemeInfo,
  addTheme,
  saveThemesData
} from "@/api/theme";
import resources from "@/components/resources";
export default {
  components: {
    resources
  },
  data() {
    return {
      clickOrigin: "",
      // 会场列表
      mtList: [],
      // 主题详情id
      theme_id: null,
      // 表单信息
      form: {
        venue_id: "",
        name: "",
        subtitle: "",
        icon: "",
        lock_recommendation: 0,
        big_icon: "",
        small_icon: "",
        description: "",
        custom: "",
        template_code: ""
      },
      rules: {
        name: [{ required: true, message: "请输入主题名称", trigger: "blur" }],
        subtitle: [
          { required: true, message: "请输入副标题", trigger: "blur" }
        ],
        venue_id: [
          { required: true, message: "请输入会场编号", trigger: "blur" }
        ],
        icon: [
          { required: true, message: "请选择主题图标", trigger: "change" }
        ],
        lock_recommendation: [
          { required: true, message: "请选择商品描述", trigger: "change" }
        ]
      },
      //   图片地址
      imageUrl: "",
      dialogTableVisible: false
      //   商品描述单选
      // lock_recommendation: ""
    };
  },
  created() {
    this.getMettingList();
    this.getThemeList();
    this.theme_id = this.$route.params.id;
    if (this.theme_id != "-1") {
      this.getData(this.theme_id);
    }
  },
  computed: {
    domain() {
      return this.$domainUrl();
    }
  },
  methods: {
    //   右上角图标返回
    // onBackBtn() {
    //   this.$router.push({
    //     path: "/activity/boutikque"
    //   });
    // },
    onSubmit() {
      console.log("submit!");
    },
    // 图片上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 提交表单
    onCheckImageClick(type) {
      this.type = 0;
      // this.ruleForm.imageUrl?this.imgList.push(this.ruleForm.imageUrl):'';
      this.clickOrigin = type;
      this.dialogTableVisible = true;
    },
    onCheckChange() {
      let data = this.$refs["resources"].api_getcheckItem(); //获取已选中的资源
      this.form[this.clickOrigin] = this.$replaceUrl(data[0].url);
      // this.form.big_icon = this.$replaceUrl(data[0].url);
      // this.form.small_icon = this.$replaceUrl(data[0].url);
      this.dialogTableVisible = false;
    },
    onClose() {
      this.$refs["resources"].api_clearCheck(); //清除选中的资源
    },
    // 商品描述单选
    mustFill() {
      console.log("为必填");
    },
    notMustFill() {
      console.log("为非必填");
    },
    // 取消添加会场
    onBackBtn() {
      this.$router.push({
        path: "/activity/themeList"
      });
    },
    // 获取会场列表
    getMettingList() {
      getMettingList({ page: 1, limt: 10, display: -1 })
        .then(res => {
          this.mtList = res.items;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取主题列表
    getThemeList() {
      // getThemeList({
      //   venue_id: this.mtList.id,
      //   page: this.page,
      //   limit: this.limit,
      //   display: -1
      // })
      //   .then(res => {
      //     console.log(res);
      //     this.themeList = res.items;
      //     this.total = res.total;
      //     this.page = res.page;
      //     console.log(this.themeList);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    // 远程搜索方法
    uploadMerchantData(query) {
      if (query !== "") {
        // 获取会场列表
        getMettingList({ page: 1, limt: 10, display: -1 })
          .then(res => {})
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 添加主题
    addTheme() {
      // 提交前校验
      this.$refs.form.validate(valid => {
        if (valid) {
          let dataParams = {};
          dataParams.venue_id = this.form.venue_id;
          dataParams.name = this.form.name;
          dataParams.subtitle = this.form.subtitle;
          dataParams.icon = this.form.icon;
          dataParams.big_icon = this.form.big_icon;
          dataParams.small_icon = this.form.icon;
          dataParams.lock_recommendation = this.form.lock_recommendation;
          // this.form.big_icon
          //   ? (dataParams.form.big_icon = this.form.big_icon)
          //   : "";
          // this.form.small_icon
          //   ? (dataParams.form.small_icon = this.form.small_icon)
          //   : "";
          this.form.description
            ? (dataParams.description = this.form.description)
            : "";
          this.form.custom ? (dataParams.custom = this.form.custom) : "";
          this.form.template_code
            ? (dataParams.template_code = this.form.template_code)
            : "";
          // this.sectionId != -1 ? (dataParams.plate_id = this.sectionId) : "";
          // this.sectionId != -1 ? (this.isEdit = true) : (this.isEdit = false);
          addTheme(dataParams)
            .then(res => {
              // console.log(res);
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$router.back();
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    // 主题详情
    getData(id) {
      getThemeInfo({ theme_id: id }).then(res => {
        console.log(res);
        this.form.name = res.name;
        this.form.subtitle = res.subtitle;
        this.form.venue_id = res.venue_id;
        this.form.icon = res.icon;
        this.form.big_icon = res.big_icon;
        this.form.small_icon = res.small_icon;
        this.form.template_code = res.template_code?res.template_code:'';
        this.form.description = res.description;
        this.form.custom = res.custom;
        this.form.lock_recommendation = res.lock_recommendation;
      });
    },
    // 提交按钮
    onSaveClick() {
      let params = { ...this.form };
      this.theme_id != "-1"
        ? ((params.theme_id = this.theme_id * 1),
          this.$delete(params, "venue_id"),
          this.$delete(params, "lock_recommendation"))
        : null;
      this.$refs["form"]
        .validate()
        .then(() => saveThemesData(params, this.theme_id != "-1"))
        .then(res => {
          this.$message.success("保存成功!");
          this.$router.back();
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
<style lang="less">
.add-themeList {
  position: relative;
  background-color: #fff;
  padding: 20px;
  .image {
    position: absolute;
    top: 0;
    right: 0;
    width: 44px;
    height: 44px;
    cursor: pointer;
    z-index: 1000;
  }
  .title {
    color: #666666;
    font-size: 16px;
    margin-bottom: 40px;
  }
  //   上传照片样式
  .addForm {
    .imageCon {
      vertical-align: middle;
      margin-right: 8px;
      margin-bottom: 8px;
      width: 121px;
      height: 120px;
      border: 1px dashed #c0ccda;
      cursor: pointer;
    }
    .imageCon .hidden {
      display: none;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
  }
  //   .avatar-uploader .el-upload {
  //     border: 1px dashed #dcdfe6;
  //     border-radius: 6px;
  //     cursor: pointer;
  //     position: relative;
  //     overflow: hidden;
  //   }
  //   .avatar-uploader .el-upload:hover {
  //     border-color: #409eff;
  //   }
  //   .avatar-uploader-icon {
  //     font-size: 28px;
  //     color: #8c939d;
  //     width: 178px;
  //     height: 178px;
  //     line-height: 178px;
  //     text-align: center;
  //   }
  //   .avatar {
  //     width: 178px;
  //     height: 178px;
  //     display: block;
  //   }
}
</style>