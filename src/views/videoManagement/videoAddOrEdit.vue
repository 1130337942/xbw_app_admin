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
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="视频名称:" prop="title">
                <el-input
                  v-model="ruleForm.title"
                  show-word-limit
                  maxlength="255"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="副标题:" prop="seo_title">
                <el-input
                  v-model="ruleForm.seo_title"
                  show-word-limit
                  maxlength="255"
                ></el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="视频缩略图:" prop="cover">
                <div class="imageCon" @click="checkImage('cover','image')">
                  <el-image
                    v-if="ruleForm.cover"
                    style="width: 120px; height: 120px"
                    :src="ruleForm.cover+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
                    fit="scale-down"
                  ></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上传视频:" prop="imageUrl">
                <el-tooltip class="item" effect="dark" content="右键点击预览" placement="right-start">
                <div class="imageCon" @click="checkImage('imageUrl','video')" @click.right.prevent="onViewClick(videoUrl)">
                  <el-image
                    v-if="ruleForm.imageUrl"
                    style="width: 120px; height: 120px"
                    :src="ruleForm.imageUrl"
                    fit="scale-down"
                  ></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="视频简介:">
                <el-input
                  :autosize="{ minRows: 4,}"
                  type="textarea"
                  v-model="ruleForm.introduction"
                  show-word-limit
                  maxlength="255"
                  placeholder="视频简介"
                ></el-input>
              </el-form-item>
            </el-col>           
            <el-col :span="24">
              <el-form-item label="标签:">
                <el-tag size="medium" :key="index"  v-for="(tag,index) in dynamicTags" closable :disable-transitions="false" @close="handleClose(index)">{{tag}}</el-tag>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" >
                </el-input>
                <el-button v-else class="button-new-tag" @click="showInput">+标签</el-button>
                <!-- <el-select v-model="value" placeholder="请选择标签">
                  <el-option
                    v-for="item in tagsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="来源:">
                <el-input v-model="ruleForm.source" show-word-limit maxlength="255" placeholder="请输入来源"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="addOrEdit">提交</el-button>
            <el-button @click="back">取消</el-button>
          </el-form-item>
        </el-form>
        <el-dialog title="资源列表" 
            :visible.sync="dialogTableVisible" 
            >
            <resources 
              v-if="dialogTableVisible"
              ref="resources" 
              :resourcesType="uploadGenre"
              :checkLength="1"
            />
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogTableVisible=false">取消</el-button>
                <el-button @click="onUploadClick" type="primary">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="预览" 
            :visible.sync="viewVisite" 
            >
            <div class="viewVideo_box" v-if="viewVisite">
              <video :src="viewSrc" controls :style="viewStyle"></video>
            </div>
        </el-dialog>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import Upload from "../../components/upload";
import resources from "../../components/resources";
import { saveVideo,getListideoInfo  } from '@/api/videoManagement'
import * as AuthAction from '@/api/auth'
export default {
  data() {
    return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        propType: 2,
        videoId: "",
        ruleForm: {
            title: "",
            seo_title: "",
            cover:'',
            imageUrl:'',
            introduction: "",
            tags: "",
            source: "",
        },
        rules: {
            title: [{ required: true, message: "请输入视频名称", trigger: "blur" }],
            seo_title: [{ required: true, message: "请输入副标题", trigger: "blur" }],
            cover: [{ required: true, message: "请选择视频缩略图", trigger: "change" }],
            imageUrl:[{ required: true, message: "请上传视频", trigger: "change" }]
        },
        dialogTableVisible:false,
        imgList: [],
        type: 0, //0头像上传 1富文本上传
        video:0,
        tagsList:[],
        videoUrl:"",
        isEdit:false,
        way:'',
        wayId:'',
        realTags:[],//后台返回的tags列表

        uploadGenre:'video',  //选择的资源类型
        checkTaget:'',

        video_duration:0,//视频时长

        viewSrc:'', //预览链接
        viewVisite:false,
        viewStyle:''
    };
  },
  watch: {},
  created() {
    this.videoId = this.$route.params.id;
    this.way = this.$route.query.way;
    this.$route.query.id?this.wayId = this.$route.query.id:'';
    this.videoId != -1 ? this.getData() : "";
    // this.getTagsList();
  },
  components: { upload: Upload , resources },
  mounted() {
    // let 
  },
  computed: {
    domain(){
      return  this.$domainUrl();
    },
    lastVideoUrl(){
      return  this.$lastVideoUrl();
    },
  },
  methods: {
    onViewClick(url){ 
      console.log(url)
      this.viewSrc = url;
      this.viewVisite = true;
    },
    handleClose(index) {
      console.log(this.realTags);
      // console.log(this.dynamicTags[index])
      let id;
      let isAre = this.realTags.some(r=>{
        if(r.tag_name == this.dynamicTags[index]){
          id = r.id;
          return id;
        }
      })
      if(isAre==true){
        this.axios.delete(`video/tag/release/`, {
          params: { video_id: this.videoId,tag_id:id }
        })
        .then(res => {
          this.$message.success("删除成功");
          this.getData();
        });
      }else{
        this.dynamicTags.splice(index, 1);
        this.$message.success("删除成功");
      }   
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;     
      if (inputValue) {
        let isAre = this.dynamicTags.some(r=>{
          return r == inputValue.trim();
        })
        if(isAre==true){
          this.$message.warning("标签名重复");
        }else{
          this.dynamicTags.push(inputValue);
          this.inputVisible = false;
          this.inputValue = '';
        }      
      }
      
    },
    back() {
      this.way=='videoList'?this.$router.push({path: "/videoManagement/videoList"}):this.$router.push({
          path: `/videoManagement/videoProgram/columnVideo/${this.wayId}`,
        });
    },
    checkImage(taget,genre) {
      this.uploadGenre = genre  //选择的资源类型 image video
      this.checkTaget = taget;   
      this.dialogTableVisible = true;
    },
    onUploadClick() {
      let data  = this.$refs['resources'].api_getcheckItem()[0]
      if(this.checkTaget==='imageUrl') {
        console.log(data)
        this.videoUrl = data.url;
        this.ruleForm.imageUrl = data.url + this.lastVideoUrl;  //略缩图
        this.video_duration = data.duration;
      }else{
        this.ruleForm[this.checkTaget] =  data.url
      }
      
      this.dialogTableVisible = false;
    },
    addOrEdit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let dataParams = {};
          dataParams.title = this.ruleForm.title;
          dataParams.seo_title = this.ruleForm.seo_title;
          dataParams.cover = this.$replaceUrl(this.ruleForm.cover);
          dataParams.url = this.$replaceUrl(this.videoUrl);
          dataParams.video_duration = this.video_duration;
          this.ruleForm.introduction?dataParams.introduction = this.ruleForm.introduction:'';
          this.ruleForm.source?dataParams.source = this.ruleForm.source:'';
          this.dynamicTags.length>0?dataParams.tags = this.dynamicTags.join(','):'';
          this.videoId != -1?dataParams.video_id=this.videoId:'';
          this.videoId != -1?this.isEdit=true:this.isEdit = false;
          // console.log(dataParams)
          saveVideo(dataParams,this.isEdit).then(res=>{
            // if(res!=false){
                this.isEdit==true?this.$message.success('修改成功'):this.$message.success('添加成功');
                this.way=='videoList'?this.$router.push({path: "/videoManagement/videoList"}):this.$router.push({
                  path: `/videoManagement/videoProgram/columnVideo/${this.wayId}`,
                });
            // }                 
          }).catch(()=>{console.log('promise.warn!!')})
        }
      })
      
    },
    getData() {
      getListideoInfo({
            video_id:this.videoId
        }).then(res=>{
          console.log(res)
          this.ruleForm.title = res.title;
          this.ruleForm.seo_title = res.seo_title;
          this.ruleForm.cover = this.$domainUrl() + res.cover;
          this.ruleForm.imageUrl = this.$domainUrl() + res.url+'?x-oss-process=video/snapshot,t_10000,m_fast';
          this.video_duration = res.video_duration;
          this.videoUrl = this.$domainUrl() + res.url;
          res.introduction?this.ruleForm.introduction = res.introduction:'';
          res.source?this.ruleForm.source = res.source:'';  
          this.dynamicTags = [];    
          this.realTags = [];   
          if(res.tags_info.length>0){
            this.realTags = res.tags_info;
            for(const item of res.tags_info){
              this.dynamicTags.push(item.tag_name)
            }
          }
        }).catch(()=>{console.log('promise.warn!!')})
    },
    onResourceOpen(){
      this.$refs['resources'].api_initResources();
    },
    getTagsList(){
      this.axios.get(`video/tag/list/`).then(res=>{
        this.tagsList = res.items;
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.viewVideo_box {
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
  video {
    margin:0 auto;
    max-width:46vw;
    max-height:60vw;
  }
}
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.home {
  .el-button.button-new-tag {
    margin-top: 0px;
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

</style>

