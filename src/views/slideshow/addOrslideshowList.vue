<template>
    <div class="home">
        <!-- <img @click="back" class="image" src="../../assets/images/back.png"> -->
        <el-scrollbar style="width:100%;height:100%">
            <div class="ac-box">
                <img @click="onBackClick" class="image" src="../../assets/images/back.png">
                <el-form
                    :rules="rules"
                    :model="ruleForm"
                    ref="ruleForm"
                    label-width="120px"
                    size="medium"
                    class="demo-ruleForm">
                    <el-form-item label="轮播图名称:" prop="name">
                        <el-input :readonly="readOnly" show-word-limit maxlength="16"  v-model="ruleForm.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="轮播时长(秒):">
                        <el-input-number :disabled="readOnly" v-model="ruleForm.interval" :min="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="图片:" prop="link">
                        <div class="allBox">
                            <div class="imageBox" v-if="!imgList.length">
                                <div class="imageCon" @click="checkImage(-2)">
                                    <i class="el-icon-plus avatar-uploader-icon"></i>
                                </div>
                                <!-- <el-input :readonly="readOnly" class="imagePut" v-model="ruleForm.link" placeholder="请输入链接"></el-input> -->
                            </div>
                            <div class="imageBox" v-show="imgList.length>0" v-for="(item,index) in imgList" :key="index" >
                                <div class="imageCon" @mouseover="imgMouseOver(index)" @mouseleave="imgMouseLeave(index)">
                                    <i v-show="!item.url" class="el-icon-plus avatar-uploader-icon"></i>
                                    <div class="layer"  v-show="imgIndex==index"><i @click.stop="onDelImgClick(index)" class="el-icon-delete" style="z-index=200;color:#fff;font-size:20px;"></i></div>
                                    <el-image v-show="item.url" style="width: 120px; height: 120px"  :src="item.url+'?x-oss-process=image/resize,m_fill,h_120,w_120'" fit="scale-down"></el-image>
                                </div>
                                <el-input :readonly="readOnly" class="imagePut" v-model="ruleForm.link" placeholder="请输入链接"></el-input>
                            </div>                           
                        </div>
                        <!-- <span style="color:#F56C6C">建议尺寸1:1</span> -->
                    </el-form-item>
                    <el-form-item label="描述:">
                        <el-input :readonly="readOnly" v-model="ruleForm.description" show-word-limit maxlength="255"  :autosize="{ minRows: 4,}" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="onAddOrEdit" v-if="!readOnly">提交</el-button>
                    </el-form-item>
                </el-form>

                <!-- <el-dialog title="图片列表" :visible.sync="dialogTableVisible">
                    <upload @upload="onUpload" :images="imgUpList" :propType="propType" genre="slideshow"/>
                </el-dialog> -->
                
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
import Upload from '../../components/upload'
import resources from '@/components/resources';
import { getSlidesInfo , addSlides , editSlides } from '@/api/slides';
// import { lookup } from 'dns';
export default {
    components: {  'upload': Upload ,resources},
    data(){
        return{
            propType:2,
            acticleId:'',
            ruleForm:{
                name:"",
                description:"",
                // release:0,
                interval:1,
                link:'',
                // sort:0
            },
            rules: {
                name: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                ],
                // link: [
                //     { required: true, message: '请输入链接', trigger: 'blur' },
                // ],
                // sort: [
                //     { required: true, message: '请输入排名', trigger: 'blur' },
                // ],
            },
            dialogTableVisible:false,
            imgList:[],
            imgUpList:[],
            imgIndex:-1,
            readOnly:false,
            urlDomain:'https://app-img.xunbaowang.net'
        }
    },
    computed:{
        getParams(){
            return this.ruleForm
        }
    },
    created(){      
        const lookId =  this.$route.params.lookId;
        this.acticleId = this.$route.params.id;
        if(this.acticleId!=-1&&!lookId&&lookId!==0){
            this.getData(this.acticleId)
        }else if(lookId||lookId===0){
            this.readOnly = true;
            this.getData(lookId)
        }
    },
    methods:{
        back(){
            this.$router.push({
                path: '/slideshow/slideshowList',
            })
        },
        onAddOrEdit(){
            if(this.imgList.length){
                let params = {
                    images:[this.$replaceUrl(this.imgList[0].url),this.getParams.link],
                    ...this.getParams
                }
                delete params.link
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        if(this.acticleId==-1){
                            // 添加    
                            params.column_id = this.$route.query.column_id;
                            addSlides(params).then(res=>{
                                this.$message.success('添加成功');
                                this.$router.back();                                
                            }).catch(()=>{});
                        }else{
                            params.carousel_id = this.acticleId;
                            editSlides(params).then(res=>{
                                this.$message.success('修改成功');
                                this.$router.back();                                
                            }).catch(()=>{});
                        }
                        
                    }
                })          
            }else{
                this.$message.warning('请选择图片')
            }
        },
        onBackClick(){ this.$router.back() },

        checkImage(i){
            if(i==this.imgIndex){
                return;
            }
            this.dialogTableVisible = true;
        },
        onUpload (item) {

            if(item.check==true){
                this.imgList.push({
                    url:item.url,
                    link:''
                })
            }else{
                for(let i = this.imgList.length-1;i>=0;i--){
                    if(this.imgList[i].url == item.url){
                        this.imgList.splice(i,1);
                    }
                }
            }
            for(const item of this.imgList){
                this.imgUpList.push(item.url);
            }
            this.imgUpList = Array.from(new Set(this.imgUpList));
            this.dialogTableVisible = false
        },
        onCheckChange(){
            let data = this.$refs['resources'].api_getcheckItem();
            this.imgList.push({
                url: data[0].url,
                link:''
            });
            this.dialogTableVisible=false;
        },
        onClose(){
            this.$refs['resources'].api_clearCheck();
        },
        getData(carouselId){
            getSlidesInfo({carousel_id:carouselId}).then(res=>{
                let images = res.images;
                this.ruleForm.interval = res.interval;
                this.ruleForm.name = res.name;
                this.ruleForm.description = res.description;
                // this.ruleForm.release = res.release;
                // this.ruleForm.sort = res.sort;
                this.ruleForm.link = images[1];

                this.imgList.push({
                    url:this.urlDomain+images[0],
                    link:images[1]
                })
                console.log(this.imgList)
            })
        },
        imgMouseOver(i){
            this.readOnly?null:this.imgIndex = i;
        },
        imgMouseLeave(i){
            this.imgIndex = -1;
        },
        onDelImgClick(i){
            this.imgList.splice(i,1);
            this.$message.success('删除成功');
            this.imgUpList = [];
            this.imgIndex = -1;
            for(const item of this.imgList){
                this.imgUpList.push(item.url);
            }
            this.imgUpList = Array.from(new Set(this.imgUpList));
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
        margin-top: 30px;
        .allBox{
            display: flex;
            flex-wrap: wrap;
            .imageBox{
                margin: 10px 10px;
                
                .imageCon{
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
                     
                .imagePut{
                    margin-top: 10px;
                    width: 150px;
                }        
            }
        }
    }
    .el-input{
        width: 400px;
    }
    /deep/ .el-input__count{
        height: 24px;
        line-height: 24px;
        bottom: 2px;
    }
    .el-textarea{
        width: 400px;
    }
}
</style>

