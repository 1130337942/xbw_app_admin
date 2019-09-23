<template>
    <div class="home">
        <div class="backImg" @click="onBackClick"></div>
        <div class="formTitle">藏品详情</div>
        <el-form 
            :model="rulesForm"
            ref="rulesForm"
            label-width="80px"
            :rules="rules"
            :inline="false"
        >
            <div class="formBox">
                <el-form-item label="藏品名" prop="name">
                    <el-input v-model="rulesForm.name" :maxlength="64">
                        <span slot="suffix">{{rulesForm.name.length||0}}/64</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="藏品估值" prop="valuation">
                    <el-input type="number" v-model.number="rulesForm.valuation"></el-input>
                </el-form-item>
                <el-form-item label="藏品类型" prop="genre_id">
                    <el-select v-model="rulesForm.genre_id"> 
                        <el-option
                            v-for="item in genreClassis"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收藏数" prop="collection_count">
                    <el-input-number v-model="rulesForm.collection_count" :min="0"></el-input-number>
                </el-form-item>

                <el-form-item label="略缩图" prop="thumbnail">
                    <div class="imageCon" @click="onCheckImgClick('thumbnail',1)" v-if="!rulesForm.thumbnail">
                        <i class="avatar-uploader-icon el-icon-plus"></i>
                    </div>
                    <div class="imageCon" @click="onCheckImgClick('thumbnail',1)" v-else>
                        <img v-lazy="domain+rulesForm.thumbnail+'?x-oss-process=image/resize,m_fill,h_120,w_120'" >
                    </div>
                </el-form-item>
                <el-form-item label="图片" prop="images">
                    <div class="flex_container">
                        <div class="imageCon" @click="onCheckImgClick('images',(9-rulesForm.images.length))" v-if="rulesForm.images.length<9" >
                            <i class="avatar-uploader-icon el-icon-plus"></i>
                        </div>
                        <div class="imageCon flex_item" v-for="(item,index) in rulesForm.images" :key="index">
                            <img v-lazy="domain+item+'?x-oss-process=image/resize,m_fill,h_120,w_120'" alt="">
                            <i class="imageCon-icon-delete el-icon-delete" @click="onDelImgClick(index)"></i>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="藏品简介" prop="introduction">
                    <!-- <el-input type="textarea" v-model="rulesForm.introduction" :maxlength="225"></el-input> -->
                    <quill-editor  v-model="rulesForm.introduction"  ref="rich_editor"></quill-editor>
                </el-form-item>
                <div class="textCenter">
                    <el-button type="danger" @click="onBackClick" >取消</el-button>
                    <el-button type="primary" @click="onSaveClick" >确定</el-button>
                </div>
            </div>
        </el-form>
        
        <el-dialog title="资源管理" :visible.sync="dialogVisit" @close="onClose">
            <resources ref="resources" :checkLength="checkLength"></resources>
            <div slot="footer">
                <el-button @click="dialogVisit=false">取消</el-button>
                <el-button type="primary" @click="onCheckOverClick">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getCollectionInfo , saveCollectionData } from '@/api/famous';
export default {
    data(){
        let positiveInteger = this.$positiveInteger;
        return {
            rulesForm:{
                name:'',
                valuation: '',
                genre_id: '',
                collection_count: '',
                introduction: '',
                thumbnail: '',
                images: [],
            },
            rules:{
                name:[{ required: true, message: "该项为必填项", trigger: "blur" }],
                thumbnail:[{ required: true, message: "该项为必填项", trigger: "blur" }],
                genre_id:[{ required: true, message: "该项为必填项", trigger: "blur" }],
                valuation: [{ required: true, message: "该项为必填项", trigger: "blur" },{validator:positiveInteger}],
                collection_count:[{required:false,message:'该项为必填项',trigger:'blur'},{validator:positiveInteger}],
            },

            checkLength:1,
            dialogVisit:false,
            collectionId:'',//藏品id
            celebrityId:'', //名家id
        }
    },
    computed:{
        genreClassis(){
            console.log(this.$store.state.genreClassis)
            return this.$store.state.genreClassis;
        },
        domain(){
            return this.$domainUrl();
        },
        editor() {
            return this.$refs.rich_editor.quill;
        },
    },
    created(){
        this.collectionId = this.$route.params.id;
        this.celebrityId = this.$route.params.celebrityId;
        if(this.collectionId!='-1'){
            this.getData();
        }
    },
    mounted(){
        var toolbar = this.editor.getModule('toolbar');
        toolbar.addHandler('thumbnail', value => {
            if (value) {
                this.$refs.uploader_btn.$el.click()
            } else {
                this.editor.format('thumbnail', false)
            }
        })
        this.$refs.rich_editor.quill.getModule('toolbar').addHandler('image', this.imgHandler); // 为图片ICON绑定事件
    },
    methods:{
        onSaveClick(){
            this.$refs.rulesForm.validate()
            .then(()=>{
                let params = {
                    ...this.rulesForm
                };
                this.collectionId!='-1'?
                    params.collection_id = this.collectionId 
                    : params.celebrity_id = this.celebrityId;
                return saveCollectionData(params,this.collectionId!='-1')
            })
            .then(res=>{
                this.$message.success('保存成功');
                this.$router.back();
            })
            .catch((err=>{console.log(err)}));
        },
        onBackClick(){
            this.$router.back();
        },
        onCheckImgClick(target,checkLength){
            this.checkTarget = target;
            this.checkLength = checkLength;
            this.dialogVisit = true;
        },
        onDelImgClick(index){
            this.rulesForm.images.splice(index,1);
        },
        imgHandler(state){
            if(state==true){
                this.checkTarget = 'quill';
                this.dialogVisit = true;
            }
        },
        onCheckOverClick(){
            let imgs = this.$refs.resources.api_getcheckItem();
            if(this.checkTarget==='images'){
                 this.rulesForm.images = this.rulesForm.images.concat(imgs.map(item=>'/'+item.folder_path+item.file_name))
            }else if(this.checkTarget==="quill"){
                let value = this.domain+'/'+imgs[0].folder_path+imgs[0].file_name
                let length = this.$refs.rich_editor.quill.getSelection().index;
                this.$refs.rich_editor.quill.insertEmbed(length, "image", value); // 调用编辑器的 insertEmbed 方法，插入URL
                this.$refs.rich_editor.quill.setSelection(length + 1);
            }else{
                this.rulesForm[this.checkTarget] = '/'+imgs[0].folder_path+imgs[0].file_name;
            }
            this.dialogVisit = false;
        },
        onClose(){
            this.$refs['resources'].api_clearCheck();
        },
        getData(){
            getCollectionInfo({collection_id:this.collectionId})
            .then(res=>{
                this.rulesForm = {
                    name:res.name,
                    valuation: res.valuation,
                    genre_id: res.genre_id,
                    collection_count: res.collection_count,
                    introduction: res.introduction,
                    thumbnail: res.thumbnail,
                    images: res.images,
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
</style>