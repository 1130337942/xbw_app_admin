<template>
  <div class="home">
    <img @click="back" class="image" src="../../assets/images/back.png">
    <el-scrollbar style="width:100%;height:100%">
      <div style="margin:30px 50px;color:#666;font-size:16px;">基本信息</div>
      <div class="ac-box">
        <el-form
          :rules="rules"
          :model="ruleForm"
          :inline="true"
          ref="ruleForm"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="版块名称:" prop="name">
                <el-input
                  v-model="ruleForm.name"
                  show-word-limit
                  maxlength="10"
                  placeholder="请输入版块名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="版块图片:" prop="icon">
                <div class="imageCon" @click="checkImage">
                  <el-image
                    v-if="ruleForm.icon"
                    style="width: 120px; height: 120px"
                    :src="ruleForm.icon+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
                    fit="scale-down"
                  ></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input
                  :autosize="{ minRows: 4,}"
                  type="textarea"
                  v-model="ruleForm.introduction"
                  show-word-limit
                  maxlength="255"
                  placeholder="版块备注"
                ></el-input>
              </el-form-item>
            </el-col>           
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="addOrEdit">提交</el-button>
            <el-button @click="back">取消</el-button>
          </el-form-item>
        </el-form>
        <!-- <el-dialog title="图片列表" :visible.sync="dialogTableVisible"> -->
          <!-- <upload -->
            <!-- @upload="onUpload" -->
            <!-- :images="imgList" -->
            <!-- :propType="propType" -->
            <!-- genre="video" -->
          <!-- /> -->
        <!-- </el-dialog> -->
        
        <el-dialog title="图片资源" :visible.sync="dialogTableVisible" @close="onClose">
          <resources 
              ref="resources" 
              :checkLength="1"
          />
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
import resources from '@/components/resources';
import { saveSectionVideo , getSectionVideoInfo  } from '@/api/videoManagement'
import * as AuthAction from '@/api/auth'
export default {
  data() {
    return {
        propType: 2,
        sectionId: "",
        ruleForm: {
            name: "",
            icon:'',
            introduction: "",
        },
        rules: {
            name: [{ required: true, message: "请输入视频名称", trigger: "blur" }],
            icon: [{ required: true, message: "请选择版块图片", trigger: "change" }],
        },
        dialogTableVisible:false,
        imgList: [],
        isEdit:false
    };
  },
  watch: {},
  created() {
    this.sectionId = this.$route.params.id;
    this.sectionId != -1 ? this.getData() : "";
  },
  components: { resources },
  mounted() {
    
  },
  computed: {
    
  },
  methods: {
    back() {
      this.$router.push({
        path: "/videoManagement/videoSection"
      });
    },
    checkImage(i) {
      this.dialogTableVisible = true;
    },
    onUpload(item) {
      this.ruleForm.icon = item.url;
      this.dialogTableVisible = false;
      this.imgList = [];
    },
    addOrEdit() {
        this.$refs.ruleForm.validate((valid) => {
            if (valid) {
                let dataParams = {};
                dataParams.name = this.ruleForm.name;
                dataParams.icon = this.ruleForm.icon;
                this.ruleForm.introduction?dataParams.introduction = this.ruleForm.introduction:'';
                this.sectionId != -1?dataParams.plate_id=this.sectionId:'';
                this.sectionId != -1?this.isEdit=true:this.isEdit = false;
                saveSectionVideo(dataParams,this.isEdit).then(res=>{
                    // if(res!=false){
                        this.isEdit==true?this.$message.success('修改成功'):this.$message.success('添加成功');
                        this.$router.push({
                            path: '/videoManagement/videoSection',
                        }) 
                    // }                 
                }).catch(()=>{console.log('promise.warn!!')})
            }
        })            
    },
    onClose(){
        this.$refs['resources'].api_clearCheck();
    },
    onCheckChange(){
      let data = this.$refs['resources'].api_getcheckItem();
      this.ruleForm['icon'] = data[0].url;
      this.dialogTableVisible=false;
    },
    getData() {
        getSectionVideoInfo({
            plate_id:this.sectionId
        }).then(res=>{
            this.ruleForm.name = res.name;
            this.ruleForm.icon = res.icon;
            res.introduction?this.ruleForm.introduction = res.introduction:'';
        }).catch(()=>{console.log('promise.warn!!')})     
    },
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
  .el-button {
    width: 100px;
    margin-top: 10px;
    margin-left: 90px;
  }
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
    width: 80%;
    height: 100%;
    margin: 20px auto 0;
    .avatar-uploader {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 120px;
      height: 120px;
    }
    .avatar-uploader:hover {
      border-color: #409eff;
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
  /deep/ .el-tag--medium {
    height: 32px;
    line-height: 28px;
    margin-right: 10px;
  }
  /deep/ .el-input__count {
    height: 25px;
    bottom: 2px;
    line-height: 25px;
  }
  .el-form-item--small {
    width: 100%;
    /deep/ .el-form-item__content {
      width: calc(100% - 90px) !important;
    }
  }
  .imageCon {
    width: 120px;
    height: 120px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    cursor: pointer;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
  }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.image-preview {
    width: 178px;
    height: 178px;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    float: left;
}

.image-preview .image-preview-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.image-preview .image-preview-wrapper img {
    width: 100%;
    height: 100%;
}

.image-preview .image-preview-action {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s;
    cursor: pointer;
    text-align: center;
    line-height: 200px;
}

.image-preview .image-preview-action .el-icon-delete {
    font-size: 32px;
}

.image-preview:hover .image-preview-action {
    opacity: 1;
}


</style>

