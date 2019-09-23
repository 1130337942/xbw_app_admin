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
              <el-form-item label="栏目名称:" prop="name">
                <el-input
                  v-model="ruleForm.name"
                  show-word-limit
                  placeholder="请输入栏目名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="videoId==-1">
              <el-form-item class="plate" label="父级板块:" prop="superior_id">
                <el-select v-model="ruleForm.superior_id" placeholder="请版块">
                  <el-option
                    v-for="item in tagsList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <!-- <div class="p">若不选择父级分类，则默认为一级分类。</div> -->
              </el-form-item>
              <br>
              
            </el-col>           
            <el-col :span="24">
              <el-form-item label="栏目图片:" prop="icon">
                <div class="imageCon" @click="checkImage">
                  <el-image
                    v-if="ruleForm.icon"
                    style="width: 118px; height: 118px"
                    :src="ruleForm.icon+'?x-oss-process=image/resize,m_fill,h_118,w_118'"
                    fit="scale-down"
                  ></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="简介:">
                <el-input
                  :autosize="{ minRows: 4,}"
                  type="textarea"
                  v-model="ruleForm.introduction"
                  show-word-limit
                  maxlength="255"
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
          <!-- <upload
            @upload="onUpload"
            :images="imgList"
            :propType="propType"
            genre="video"
            :video="video"
          />
        </el-dialog> -->
      </div>
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
    </el-scrollbar>
  </div>
</template>

<script>
import resources from '@/components/resources';
import Upload from "../../components/upload";
import { savePlateVideo,getSectionListData,getSectionVideoInfo  } from '@/api/videoManagement'
import * as AuthAction from '@/api/auth'
export default {
  data() {
    return {
        propType: 2,
        videoId: "",
        ruleForm: {
            name: "",
            superior_id: "",
            icon:'',
            introduction: "",
        },
        rules: {
            name: [{ required: true, message: "请输入视频名称", trigger: "blur" }],
            icon: [{ required: true, message: "请选择图片", trigger: "change" }],
            superior_id: [{ required: true, message: "请选择父级板块", trigger: "change" }],
        },
        dialogTableVisible:false,
        imgList: [],
        type: 0, //0头像上传 1富文本上传
        video:0,
        tagsList:[],
        videoUrl:"",
        isEdit:false,
        domain:'https://app-img.xunbaowang.net'
    };
  },
  watch: {},
  created() {
    this.videoId = this.$route.params.id;
    this.getPlateList();
    this.videoId != -1 ? this.getData() : "";
    console.log(this.videoId==-1)
  },
  components: { resources },
  mounted() {
    
  },
  computed: {
  },
  methods: {
    back() {
      // this.$router.push({
      //   path: "/videoManagement/videoProgram"
      // });
      this.$router.back()
    },
    checkImage(i) {
      this.dialogTableVisible = true;
    },
    onUpload(item) {
      console.log(item)
      this.ruleForm.icon = item.url;  
      this.dialogTableVisible = false;
      this.imgList = [];
    },
    addOrEdit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let dataParams = {};
          dataParams.name = this.ruleForm.name;
          dataParams.icon = this.$replaceUrl(this.ruleForm.icon);
          this.ruleForm.introduction?dataParams.introduction = this.ruleForm.introduction:'';
          this.ruleForm.superior_id?dataParams.superior_id = this.ruleForm.superior_id:'';
          this.videoId != -1?dataParams.column_id=this.videoId:'';
          this.videoId != -1?this.isEdit=true:this.isEdit = false;
          savePlateVideo(dataParams,this.isEdit).then(res=>{
            // if(res!=false){
                this.isEdit==true?this.$message.success('修改成功'):this.$message.success('添加成功');
                this.$router.push({
                    path: '/videoManagement/videoProgram',
                }) 
                // this.$router.back()
            // }                 
          }).catch((err)=>{console.log('promise.warn!!',err)})
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
            plate_id:this.videoId
        }).then(res=>{

          res.introduction? this.ruleForm.introduction = res.introduction:'';
          this.ruleForm.name = res.name;
          this.ruleForm.icon = this.$domainUrl() + res.icon ;
        //   res.superior_idres.superior_id = this.ruleForm.icon;
        }).catch(()=>{console.log('promise.warn!!')})
    },
    getPlateList(){
        getSectionListData().then(res=>{
            this.tagsList = res.items;
        }).catch(()=>{console.log('promise.warn!!')})
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
    .plate{
        position: relative;
        .p{
            position: absolute;
            bottom: -18px;
            left: 0px;
            height: 18px;
            color: rgba(16, 16, 16, 1);
            font-size: 12px;
            text-align: right;
            line-height: 18px;
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


</style>

