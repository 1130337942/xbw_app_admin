<template>
    <div class="home">
        <img @click="back" class="image" src="../../assets/images/back.png">
        <el-scrollbar style="width:100%;height:100%">
            <div class="ac-box">
                <el-form
                    :rules="rules"
                    :model="ruleForm"
                    :inline="true"
                    ref="ruleForm"
                    label-width="75px"
                    class="demo-ruleForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="标题:" prop="title">
                                <el-input :autosize="{ minRows: 4,}"  type="textarea" v-model="ruleForm.title" show-word-limit maxlength="255"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="封面图:">
                                <div class="imageCon" @click="checkImage">
                                    <el-image v-if="ruleForm.imageUrl" style="width: 120px; height: 120px" :src="ruleForm.imageUrl" fit="scale-down"></el-image>
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>                                  
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="简介:">
                                <el-input :autosize="{ minRows: 4,}" type="textarea" show-word-limit maxlength="255" v-model="ruleForm.introduction"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序:">
                                <el-input-number v-model="ruleForm.order" controls-position="right" :min="0" @change="sortChange"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="标签:">
                                <el-tag size="medium" :key="index" v-for="(tag,index) in dynamicTags" closable :disable-transitions="false" @close="handleClose(index)">{{tag.tag_name}}</el-tag>
                                <el-input class="input-new-tag" v-if="inputVisible" v-model="ruleForm.tags" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" ></el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="置顶:">
                                <el-switch @change="changeDetail(1)" v-model="ruleForm.top" active-value="1" inactive-value="0"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="来源:">
                                <el-input :autosize="{ minRows: 4,}" type="textarea" show-word-limit maxlength="255" v-model="ruleForm.source"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="显示:">
                                <el-switch  @change="changeDetail(2)" v-model="ruleForm.according" active-value="1" inactive-value="0"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="SEO标题:">
                                <el-input :autosize="{ minRows: 4,}" type="textarea" show-word-limit maxlength="255"  v-model="ruleForm.seoTitle"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="栏目推荐:">
                                <el-switch @change="changeDetail(3)" v-model="ruleForm.recommended" active-value="1" inactive-value="0"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="内容:" prop="content">
                        <quill-editor  v-model="ruleForm.content"  ref="rich_editor"></quill-editor>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="addOrEdit">提交</el-button>
                    </el-form-item>
                </el-form>
                <el-dialog title="图片列表" :visible.sync="dialogTableVisible">
                    <upload @upload="onUpload" :images="imgList" :propType="propType" genre="new" :type="type"/>
                </el-dialog>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import Upload from '../../components/upload';
// import {ImageDrop} from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-module'

// Quill.register('modules/imageResize', ImageResize)
// Quill.register('modules/imageDrop', ImageDrop)
export default {
    data(){
        return{
            propType:2,
            acticleId:'',
            ruleForm:{
                title:"",
                imageUrl: '',
                introduction:'',
                order:'',
                tags:'',
                top:0,
                source:'',
                according:0,
                seoTitle:'',
                recommended:0,
                content:''
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                ]
            },
            dynamicTags: [],
            detailTags:[],
            inputVisible: false,
            dialogTableVisible:false,
            imgList:[],
            type:0 //0头像上传 1富文本上传
        }
    },
    watch:{
        
    },
    created(){      
        this.acticleId = this.$route.params.id;
        this.acticleId!=-1?this.getData():'';
    },
    components: {  'upload': Upload },
    mounted () {
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
    computed:{
        editor () {
            return this.$refs.rich_editor.quill
        }
    },
    methods:{
        imgHandler(state){
            if(state==true){
                this.type = 1;
                this.dialogTableVisible = true;
            }
        },
        back(){
            this.$router.push({
                path: '/main/newsCenter/articleLists',
            })
        },
        checkImage(){
            this.propType++;
            this.type = 0;
            // this.ruleForm.imageUrl?this.imgList.push(this.ruleForm.imageUrl):'';
            this.dialogTableVisible = true;
        },
        onUpload(item){
            if(item.type==1){
                if (item.url != null && item.url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
                    let value = item.url
                    value = value.indexOf('http') !== -1 ? value : 'http:' + value;
                    let length = this.$refs.rich_editor.quill.getSelection().index;
                    this.$refs.rich_editor.quill.insertEmbed( length,'image', value);   // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$refs.rich_editor.quill.setSelection(length + 1)
                } else {
                    this.$message.error(`图片插入失败`)
                }
            }else{
                this.ruleForm.imageUrl = item.url;
            }    
            this.dialogTableVisible = false;
            this.imgList = [];
        },
        addOrEdit(){
            let data = {};
            data.content = this.ruleForm.content;
            data.title = this.ruleForm.title;
            data.introduction = this.ruleForm.introduction;
            data.source = this.ruleForm.source;
            data.seo_title = this.ruleForm.seoTitle;
            data.cover = this.ruleForm.imageUrl;
            data.top = this.ruleForm.top;
            data.recommend = this.ruleForm.recommended;
            data.release = this.ruleForm.according;
            data.sort = this.ruleForm.order.toString();
            let tags = [];
            if(this.dynamicTags.length>0){
                for(const item of this.dynamicTags){
                    tags.push(item.tag_name)
                }
            }           
            tags.length>0?data.tags =tags.join(','):'';                         
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if(this.acticleId==-1){
                        // 添加    
                        this.axios.post(`news/add/`,data).then(res=>{
                            this.$message.success('添加成功');
                            this.$router.push({
                                path: '/main/newsCenter/articleLists',
                            })                                                 
                        })
                    }else{
                        data.news_id = this.acticleId;
                        this.axios.post(`news/edit/`,data).then(res=>{
                            this.$message.success('修改成功');
                            this.$router.push({
                                path: '/main/newsCenter/articleLists',
                            })                                                 
                        })
                    }
                    
                }
            })          
        },
        Upload(file){
            this.axios.get(`source/get_token/`).then(res=>{
                let OSS = require('ali-oss');
                let client = new OSS({
                    region: "oss-cn-hangzhou",
                    accessKeyId: res.Credentials.AccessKeyId,
                    accessKeySecret: res.Credentials.AccessKeySecret,
                    stsToken: res.Credentials.SecurityToken,
                    bucket: "xbw-app"
                })
                client.put(file.file.name,file.file).then(res=>{
                    let url = client.signatureUrl(file.file.name, {'process' : 'image/resize,w_80'});
                    this.ruleForm.imageUrl = url.split('?')[0];
                    this.$message.success('上传成功');
                })
            })
        },
        getData(){
            this.axios.get(`news/info/`,{params:{news_id:this.acticleId}}).then(res=>{
                this.ruleForm.content = res.content;
                this.ruleForm.title = res.title;
                this.ruleForm.introduction = res.introduction;
                this.ruleForm.source = res.source;
                this.ruleForm.seoTitle = res.seo_title;
                this.ruleForm.imageUrl = res.cover;
                this.ruleForm.top = res.top.toString();
                this.ruleForm.recommended = res.recommend.toString();
                this.ruleForm.according = res.release.toString();   
                this.ruleForm.order = res.sort;    
                this.dynamicTags = res.tags_info;
            })
        },
        sortChange(){
            if(this.acticleId!=-1){
                this.axios.post(`news/status/edit/`,{ news_id:this.acticleId,key:'sort',value:this.ruleForm.order}).then(res=>{
                    this.$message.success('修改成功');
                })
            }
        },
        changeDetail(i){
            if(this.acticleId!=-1){
                if(i==1){
                    this.axios.post(`news/status/edit/`,{ news_id:this.acticleId,key:'top',value:this.ruleForm.top}).then(res=>{
                        this.$message.success('修改成功');
                    })
                }else if(i==2){
                    this.axios.post(`news/status/edit/`,{ news_id:this.acticleId,key:'release',value:this.ruleForm.according}).then(res=>{
                        this.$message.success('修改成功');
                    })
                }else{
                    this.axios.post(`news/status/edit/`,{ news_id:this.acticleId,key:'recommend',value:this.ruleForm.recommended}).then(res=>{
                        this.$message.success('修改成功');
                    })
                }
            }
        },
        handleClose(i) {
            if(this.acticleId==-1){
                this.dynamicTags.splice(i, 1);
            }else{
                this.axios.delete(`news/tag/release/`,{params:{ news_id:this.acticleId,tag_id:this.dynamicTags[i].id}}).then(res=>{
                    this.$message.success('删除成功');
                    this.getData();
                })
            }         
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.ruleForm.tags;
            if (inputValue) {
                this.dynamicTags.push({
                    id:this.dynamicTags.length,
                    tag_name:inputValue
                });
            }
            this.inputVisible = false;
            this.ruleForm.tags = '';
        }
    }
}
</script>
<style lang="scss" scoped>
.home{
    height: 100%;
    width: 100%;
    position: relative;
    background-color: #fff;
    padding-top: 0px;
    .image{
        position: absolute;
        top: 0;
        right: 0;
        width: 44px;
        height: 44px;
        cursor: pointer;
        z-index: 1000;
    }
    .ac-box{
        width: 80%;
        height: 100%;
        margin: 20px auto 0; 
        .avatar-uploader  {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width: 80px;
            height: 80px;
        }
        .avatar-uploader:hover {
            border-color: #409EFF;
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
    /deep/ .ql-container{
        height: 350px;
    }
    /deep/ .ql-picker{
        line-height: 24px;
    }
    /deep/ .el-tag--medium {
        height: 32px;
        line-height: 28px;
        margin-right: 10px;
    }
    /deep/ .el-input__count{
        height: 25px;
        bottom: 2px;
        line-height: 25px;
    }
    .el-form-item--small{
        width: 100%;
        /deep/ .el-form-item__content{
            width: calc(100% - 90px) !important;
        }
    }
    .imageCon{
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

