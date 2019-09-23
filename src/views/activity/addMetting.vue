<template>
  <div class="home">
    <img @click="onBackBtn" class="backImg" src="../../assets/images/back.png" />
    <div class="formTitle">添加会场</div>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="formBox">
      <el-form-item label="会场名称:" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入会场名称"
          maxlength="10"
          style="width:420px"
          clearable
        >
          <span slot="suffix">{{form.name.length||0}}/10</span>
        </el-input>
      </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="会场图标:" prop="icon">
        <div class="imageCon" @click.stop="onCheckImageClick('images')">
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
      <el-form-item label="app端模板名称:" prop="template_code">
        <el-input
          v-model="form.template_code"
          placeholder="请输入app端模板名称"
          :maxlength="20"
          style="width:420px"
          clearable
        >
          <span slot="suffix">{{form.template_code.length||0}}/20</span>
        </el-input>
      </el-form-item>
      <el-form-item label="会场描述:" prop="description">
        <el-input
          type="textarea"
          v-model="form.description"
          placeholder="请输入会场描述"
          :maxlength="200"
          style="width:420px"
          clearable
        >
          <span slot="suffix">{{form.description.length||0}}/200</span>
        </el-input>
      </el-form-item>
      <el-form-item label="会场规则:" prop="custom">
        <el-input
          type="textarea"
          v-model="form.custom"
          placeholder="请输入会场的规则"
          show-word-limit
          maxlength="600"
          style="width:420px;margin-bottom:50px;"
        >
          <span slot="suffix">{{form.custom.length||0}}/600</span>
        </el-input>
      </el-form-item>
      <div class="textCenter">
        <el-button type="danger" @click="onBackBtn">取消</el-button>
        <el-button type="primary" @click="onSaveClick()">提交</el-button>
      </div>
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
  getMettingInfo,
  saveMeetingsData,
  saveMettings
} from "@/api/activity";
import resources from "@/components/resources";
export default {
  components: {
    resources
  },
  data() {
    return {
      // 会场详情id
      venue_id: -1,
      form: {
        name: "",
        icon: "",
        template_code: "",
        description: "",
        custom: ""
      },
      rules: {
        name: [{ required: true, message: "请输入会场名称", trigger: "blur" }],
        icon: [{ required: true, message: "请选择会场图标", trigger: "change" }]
      },
      //   图片地址
      imageUrl: "",
      dialogTableVisible: false
    };
  },
  computed: {
    domain() {
      return this.$domainUrl();
    }
  },
  created() {
    this.venue_id = this.$route.params.id;
    if (this.venue_id != "-1") {
      this.getData(this.venue_id.id);
    }
  },
  methods: {
    //   右上角图标返回
    onBackBtn() {
      this.$router.push({
        path: "/activity/boutikque"
      });
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
      this.clickOrigin = type;
      this.dialogTableVisible = true;
    },
    onCheckChange() {
      // debugger;
      let data = this.$refs["resources"].api_getcheckItem(); //获取已选中的资源
      this.form.icon = this.$replaceUrl(data[0].url);
      this.dialogTableVisible = false;
    },
    onClose() {
      this.$refs["resources"].api_clearCheck(); //清除选中的资源
    },
    // 取消添加会场
    onBackBtn() {
      this.$router.push({
        path: "/activity/boutikque"
      });
    },
    // 会场详情
    getData(id) {
      getMettingInfo({ venue_id: this.venue_id }).then(res => {
        this.form = {
          venue_id: res.id,
          name: res.name,
          icon: res.icon,
          description: res.description,
          custom: res.custom,
          template_code: res.template_code?res.template_code:''
        };
      });
    },
    // 提交按钮
    onSaveClick() {
      let params = { ...this.form };
      this.venue_id != "-1" ? (params.venue_id = this.venue_id * 1) : null;
      this.$refs["form"]
        .validate()
        .then(() => saveMeetingsData(this.$filterParams(params), this.venue_id != "-1"))
        .then(res => {
          this.$message.success("保存成功!");
          this.$router.back();
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
</style>