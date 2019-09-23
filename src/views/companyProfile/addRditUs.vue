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
                                <el-input v-model="ruleForm.title" show-word-limit maxlength="4" placeholder="输入文章标题,4个字"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序:">
                                <el-input-number v-model="ruleForm.sort" controls-position="right" :min="1" @change="changeDetail(1)"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="显示:">
                                <el-switch  @change="changeDetail(2)" v-model="ruleForm.release" :active-value="1" :inactive-value="0"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">                        
                            <el-form-item label="置顶:">
                                <el-switch  @change="changeDetail(3)" v-model="ruleForm.top" :active-value="1" :inactive-value="0"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="内容:">
                                <quill-editor v-model="ruleForm.content"  ref="rich_editor"></quill-editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="图片:">
                                <p style="color:#606266;">可上传多张照片</p>
                                <div class="allBox">
                                    <div class="imageBox" v-show="exceed==false">
                                        <div class="imageCon" @click="checkImage">
                                            <i class="el-icon-plus avatar-uploader-icon"></i>
                                        </div>
                                    </div>
                                    <div class="imageBox" v-show="imgList.length>0" v-for="(item,index) in imgList" :key="index" @mouseover="imgMouseOver(index)" @mouseleave="imgMouseLeave(index)">
                                        <div class="imageCon" @click="checkImage"  >
                                            <i v-show="!item" class="el-icon-plus avatar-uploader-icon"></i>
                                            <el-image v-show="item" style="width: 120px; height: 120px"  :src="item" fit="scale-down"></el-image>
                                        </div>
                                        <div class="layer"  v-show="imgIndex==index"><i @click="delImg(index)" class="el-icon-delete" style="z-index=200;color:#fff;font-size:20px;"></i></div>
                                    </div>                           
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item style="padding-left:20px;">
                        <el-button type="primary" @click="addOrEdit">提交</el-button>
                    </el-form-item>
                </el-form>
                <el-dialog title="图片列表" :visible.sync="dialogTableVisible" class="dia">
                    <upload @upload="onUpload" :images="rich_editor_list==true?[]:imgList" :propType="propType" genre="jobs" :type="type"/>
                </el-dialog>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import Upload from '../../components/upload'
export default {
    data(){
        return{
            propType:2,
            acticleId:'',
            ruleForm:{
                title:"",
                content:'',
                release:0,
                top:0,
                sort:''
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                ],
            },
            dynamicTags: [],
            detailTags:[],
            inputVisible: false,
            dialogTableVisible:false,
            imgList:[],
            exceed:false,
            imgIndex:-1,
            type:0, //0头像上传 1富文本上传
            rich_editor_list:false
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
        });
        this.$refs.rich_editor.quill.getModule('toolbar').addHandler('image', this.imgHandler); // 为图片ICON绑定事件
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
                this.rich_editor_list = true;
                this.dialogTableVisible = true;               
            }
        },
        back(){
            this.$router.push({
                path: '/companyProfile/aboutUs',
            })
        },
        addOrEdit(){
            let data = {};
            this.ruleForm.content?data.content = this.ruleForm.content:'';
            data.title = this.ruleForm.title;
            this.imgList.length>0?data.images = this.imgList:'';
            data.top = this.ruleForm.top;
            data.recommend = this.ruleForm.recommended;
            data.release = this.ruleForm.release;
            data.sort = this.ruleForm.sort.toString();
            let tags = [];                      
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if(this.acticleId==-1){
                        // 添加    
                        this.axios.post(`about/add/`,data).then(res=>{
                            this.$message.success('添加成功');
                            this.$router.push({
                                path: '/companyProfile/aboutUs',
                            })                                                 
                        })
                    }else{
                        data.about_id = this.acticleId;
                        this.axios.post(`about/edit/`,data).then(res=>{
                            this.$message.success('修改成功');
                            this.$router.push({
                                path: '/companyProfile/aboutUs',
                            })                                                 
                        })
                    }
                    
                }
            })          
        },
        getData(){
            this.axios.get(`about/info/`,{params:{about_id:this.acticleId}}).then(res=>{
                this.ruleForm.content = res.content;
                this.ruleForm.title = res.title;                
                this.ruleForm.imageUrl = res.cover;
                this.ruleForm.top = res.top;
                this.ruleForm.release = res.release;   
                this.ruleForm.sort = res.sort;    
                this.imgList = res.images;
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
                this.axios.post(`about/status/edit/`,{ about_id:this.acticleId,key:i==1?'sort':i==2?'release':'top',value:i==1?this.ruleForm.sort:i==2?this.ruleForm.release:this.ruleForm.top}).then(res=>{
                    this.$message.success('修改成功');
                })
            }
        },
        checkImage(){
            this.type = 0;
            this.rich_editor_list = false;
            this.dialogTableVisible = true;
        },
        onUpload (item) {
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
                this.dialogTableVisible = false;
            }else{
                if(this.imgList.length>=9){
                    this.exceed = true;
                    return;
                }
                if(item.check==true){         
                    this.exceed = false;
                    this.imgList.push(item.url)
                }else{
                    for(let i = this.imgList.length-1;i>=0;i--){
                        if(this.imgList[i] == item.url){
                            this.imgList.splice(i,1);
                        }
                    }
                }
            }    
            
            
        },
        imgMouseOver(i){
            this.imgIndex = i;
        },
        imgMouseLeave(i){
            this.imgIndex = -1;
        },
        delImg(i){
            this.imgList.splice(i,1);
            this.$message.success('删除成功');
            if(this.imgList.length<9){
                this.exceed = false;
            }
        },
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
        .avatar {
            width: 120px;
            height: 120px;
            display: block;
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
    /deep/ .ql-container{
        height: 350px;
    }
    /deep/ .ql-picker{
        line-height: 24px;
    }
    .dia{
        padding-bottom: 20px;
    }
    /deep/ .el-input__count{
        height: 24px;
        line-height: 24px;
        bottom: 2px;
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
    .allBox{
        display: flex;
        flex-wrap: wrap;
        .imageBox{
            margin: 10px 10px;
            position: relative;
            .imageCon{
                margin: 0 auto;
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
            .layer{
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: .7;
                background-color: #000;
                z-index: 100;
                display: flex;
                justify-content: center;
                align-items: center;
            }          
        }
    }
}
</style>

