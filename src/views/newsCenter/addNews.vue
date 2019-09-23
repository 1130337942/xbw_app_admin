<template>
  <div class="home">
    <img @click="onBackBtn" class="image" src="../../assets/images/back.png">
    <el-scrollbar style="width:100%;height:100%">
      <div style="margin:30px 50px;font-size:20px;">基本信息</div>
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
              <el-form-item label="头条名称:" prop="title">
                <el-input
                  v-model="ruleForm.title"
                  show-word-limit  
                  maxlength="225"
                  placeholder="请输入头条名称（1~225个字）"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="副标题:" prop="seo_title">
                <el-input
                  type="textarea"
                  :autosize="true"
                  v-model="ruleForm.seo_title"
                  show-word-limit
                  maxlength="225"
                  placeholder="请输入副标题（1~225个字）"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="新闻简介:" prop="introduction">
                <el-input
                  type="textarea"
                  :autosize="true"
                  v-model="ruleForm.introduction"
                  show-word-limit
                  maxlength="225"
                  placeholder="请输入新闻简介（1~225个字）"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="文章详情:" prop="content">
                <quill-editor  v-model="ruleForm.content"  ref="rich_editor"></quill-editor>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编辑人员:">
                <el-input v-model="ruleForm.creator" show-word-limit maxlength="16" placeholder="输入编辑人员名称（1~16个字）"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="来源:">
                <el-input v-model="ruleForm.source" show-word-limit maxlength="225" placeholder="输入公告的来源（1~225个字）"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="封面图:" prop="cover">
                <div class="imageCon" @click="checkImage('cover')">
                  <el-image
                    v-if="ruleForm.cover"
                    style="width: 120px; height: 120px"
                    :src="ruleForm.cover+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
                    fit="scale-down"
                  ></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                <span style="color:#F56C6C">建议尺寸1:1</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="来源logo:" prop="source_logo">
                <div class="imageCon" @click="checkImage('source_logo')">
                  <el-image
                    v-if="ruleForm.source_logo"
                    style="width: 120px; height: 120px"
                    :src="ruleForm.source_logo+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
                    fit="scale-down"
                  ></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                <span style="color:#F56C6C">建议尺寸1:1</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="标签:">
                <el-tag
                    v-for="(item,i) in editTabArr"
                    :key="i"
                    closable
                    size="medium"
                    :disable-transitions="false"
                    @close="onTabClose(item.id,i)"
                >
                {{item.tag_name}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="editTabVisible"
                    v-model="editTabItem"
                    ref="saveTagInput"
                    size="small"
                    maxlength="8"
                    @keyup.enter.native="onInputConfirm"
                    @blur="onInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新标签</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否原创:">
                <el-switch
                  v-model="ruleForm.original"
                  :active-value="1"
                  :inactive-value="2"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="onSaveBtn">提交</el-button>
            <el-button @click="onBackBtn">取消</el-button>
          </el-form-item>
        </el-form>
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
// import Upload from "../../components/upload";
import resources from '@/components/resources';
import { getNewsInfo , saveNew , deltagData } from '@/api/newCenter';
export default {
  data() {
    return {
        propType: 2,
        panelType:'',  // # 添加 编辑
        acticleId: '', //文章id
        ruleForm:{
            title:'',
            content:'',
            creator:'',
            source:'',
            seo_title:'',
            introduction:'',
            cover:'',         //封面图
            source_logo:'',       //来源logo
            original:2,//来源
        },
        clickOrigin:'',   //正在选取图片的项
        rules: {
            title: [{ required: true, message: "请输入头条名称", trigger: "blur" }],
            cover: [{ required: true, message: "请选择封面图片", trigger: "blur" }],
            tags: [{ required: true, message: "请输入标签", trigger: "blur" }],
            content: [{ required: true, message: "请输入内容", trigger: "blur" }]
        },

        editTabVisible:false,  //添加标签input
        editTabArr:[],
        editTabItem:'',

        dynamicTags: [],
        detailTags: [],
        inputVisible: false,
        dialogTableVisible: false,
        imgList: [],
        type: 0, //0图片上传 1富文本上传

        domain:'https://app-img.xunbaowang.net',
    };
  },
  watch: {},
  computed: {
    editor() {
      return this.$refs.rich_editor.quill;
    },
    getTags() {
        return this.editTabArr.map(function(item){
            if(item.id==='null'){
                return item.tag_name
            }
        })
    }
  },
  components: { 
    // upload: Upload ,
    resources 
  },
  created() {
    this.panelType = this.$route.params.type
    switch (this.panelType) {
        // case 'add':

        //     break;
        case 'edit':
            this.acticleId = this.$route.params.id;
            this.ruleForm.news_id = this.$route.params.id;
            this.getData();
            break;
    }
  },
  mounted() {
    var toolbar = this.editor.getModule('toolbar');
    toolbar.addHandler('thumbnail', value => {
        if (value) {
            this.$refs.uploader_btn.$el.click()
        } else {
            this.editor.format('thumbnail', false)
        }
    })
    this.$refs.rich_editor.quill.getModule('toolbar').addHandler('image', this.imgHandler); // 为图片ICON绑定事件
    // this.$refs.rich_editor.quill.getModule('toolbar').addHandler('video', this.videoHandler)  // 为视频ICON绑定事件
  },
  methods: {
    imgHandler(state){
        if(state==true){
            this.type = 1;
            this.dialogTableVisible = true;
        }
    },
    checkImage(tager) {  //选择图片
      this.propType++;
      this.type = 0;
      // this.ruleForm.imageUrl?this.imgList.push(this.ruleForm.imageUrl):'';
      this.clickOrigin = tager
      this.dialogTableVisible = true;
    },
    onUpload(item) {
      if (item.type == 1) {
        if (item.url != null && item.url.length > 0) {
          // 将文件上传后的URL地址插入到编辑器文本中
          let value = item.url;
          value = value.indexOf("http") !== -1 ? value : "http:" + value;
          let length = this.$refs.rich_editor.quill.getSelection().index;
          this.$refs.rich_editor.quill.insertEmbed(length, "image", value); // 调用编辑器的 insertEmbed 方法，插入URL
          this.$refs.rich_editor.quill.setSelection(length + 1);
        } else {
          this.$message.error(`图片插入失败`);
        }
      } else {
        this.ruleForm[this.clickOrigin] = item.url;
      }
      this.dialogTableVisible = false;  
      this.imgList = [];
    },
    onCheckChange(){
      let data = this.$refs['resources'].api_getcheckItem();
      if (this.type == 1) {
        if (data != null && data.length) {
          // 将文件上传后的URL地址插入到编辑器文本中
          let value = data[0].url;
          let length = this.$refs.rich_editor.quill.getSelection().index;
          this.$refs.rich_editor.quill.insertEmbed(length, "image", value); // 调用编辑器的 insertEmbed 方法，插入URL
          this.$refs.rich_editor.quill.setSelection(length + 1);
        } else {
          this.$message.error(`图片插入失败`);
        }
      } else {
        this.ruleForm[this.clickOrigin] = data[0].url;
      }
      this.dialogTableVisible=false;
    },
    onClose(){
        this.$refs['resources'].api_clearCheck();
    },
    onSaveBtn() {
        let params = {
            tags:this.getTags.join(','),
            ...this.ruleForm
        }
        params.news_id = params.news_id*1;
        params.cover = this.$replaceUrl(params.cover);
        params.source_logo = this.$replaceUrl(params.source_logo);
        this.$refs['ruleForm'].validate()
            .then(() => saveNew(params,this.panelType==='edit') )
            .then(res => {
                this.$message.success('保存成功!');   
                this.onBackBtn();
            }).catch(()=>{console.log('promise.warn!!')})
    },
    onBackBtn() {
      this.$router.push({
        path: '/main/newsCenter/news'
      });
    },
    Upload(file) {
      this.axios.get(`source/get_token/`).then(res => {
        let OSS = require("ali-oss");
        let client = new OSS({
          region: "oss-cn-hangzhou",
          accessKeyId: res.Credentials.AccessKeyId,
          accessKeySecret: res.Credentials.AccessKeySecret,
          stsToken: res.Credentials.SecurityToken,
          bucket: "xbw-web"
        });
        client.put(file.file.name, file.file).then(res => {
          let url = client.signatureUrl(file.file.name, {
            process: "image/resize,w_80"
          });
          this.ruleForm.imageUrl = url.split("?")[0];
          this.$message.success("上传成功");
        });
      });
    },
    onInputConfirm(){  //生成标签
        let editTabItem = this.editTabItem;
        if (editTabItem) {
          this.editTabArr.push({
              tag_name:editTabItem,
              id:'null'
          });
        }
        this.editTabVisible = false;
        this.editTabItem = '';
    },
    showInput() {  //激活标签input
      this.editTabVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    getData() {
      getNewsInfo({ news_id: this.acticleId } )
        .then(res => {
          this.ruleForm.title = res.title
          this.ruleForm.content = res.content
          this.ruleForm.creator = res.creator
          this.ruleForm.source = res.source
        //   this.ruleForm.tags = res.tags
          this.ruleForm.cover = this.domain + res.cover;
          this.ruleForm.seo_title = res.seo_title;
          this.ruleForm.introduction = res.introduction;
          this.ruleForm.source_logo = this.$domainUrl() + res.source_logo;
          this.ruleForm.original = res.original||0;
          this.editTabArr = res.tags_info;
        }).catch(()=>{console.log('promise.warn!!')});
    },
    sortChange() {
      if (this.acticleId != -1) {
        this.axios
          .post(`news/status/edit/`, {
            news_id: this.acticleId,
            key: "sort",
            value: this.ruleForm.order
          })
          .then(res => {
            this.$message.success("修改成功");
          });
      }
    },
    onTabClose(tagId,index) {
      if (tagId === 'null') {
        this.editTabArr.splice(index, 1);
      } else {
        deltagData({ news_id: this.acticleId, tag_id: tagId})
          .then(res => {
            this.editTabArr.splice(index, 1);
          }).catch(err=>{console.log(err);});
      }
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
      width: 80px;
      height: 80px;
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
  /deep/ .ql-container {
    height: 350px;
  }
  /deep/ .ql-picker {
    line-height: 24px;
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
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
}
</style>

