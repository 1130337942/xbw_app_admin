<template>
    <div class="home">
        <div class="backImg" @click="onBackClick"></div>
        <div class="formTitle">百科详情</div>
        <el-form 
            :model="rulesForm" 
            :rules="rules"
            :inline="false"
            ref="rulesForm"
            class="formBox"
            label-width="120px"
        >
            <el-form-item prop="title" label="百科标题">
                <el-input v-model="rulesForm.title" :maxlength="25">
                    <span slot="suffix">{{rulesForm.title.length}}/25</span>
                </el-input>
            </el-form-item>
            <el-form-item prop="cover" label="百科封面">
                <div class="imageCon" @click="onCheckImgClick('cover')" v-if="rulesForm.cover">
                    <img v-lazy="domain+rulesForm.cover+'?x-oss-process=image/resize,m_fill,h_120,w_120'" alt="" class="avatar-uploader-icon" />
                </div>
                <div class="imageCon" @click="onCheckImgClick('cover')" v-else>
                    <div class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
                </div>
            </el-form-item>
            <el-form-item prop="introduction" label="简介">
                <el-input type="textarea" :autosize="true" v-model="rulesForm.introduction" :maxlength="255"></el-input>
            </el-form-item>
            <el-form-item prop="content" label="内容">
                 <quill-editor  v-model="rulesForm.content"  ref="rich_editor"></quill-editor>
            </el-form-item>
            <div class="textCenter">
                <el-button type="danger" @click="onBackClick">取消</el-button>
                <el-button type="primary" @click="onSaveClick">保存</el-button>
            </div>
        </el-form>
        <el-dialog title="图片资源" :visible.sync="dialogVisible" @close="onClose" :append-to-body="true">
            <resources ref="resources" :checkLength="1" />
            <div class="dialog-footer" slot="footer">
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button @click="onCheckChange" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import resources from '@/components/resources';
import {saveAntiqueData , getAntiqueInfo} from '@/api/encylopedias';
export default {
    components:{resources},
    data(){
        return {
            rulesForm:{
                title:'',
                cover:'',
                introduction:'',
                content:'',
            },
            rules:{
                title:[{required:true,message:'该项为必填项',trigger:'blur'}],
                cover:[{required:true,message:'该项为必填项',trigger:'blur'}],
                introduction:[{required:true,message:'该项为必填项',trigger:'blur'}],
                content:[{required:true,message:'该项为必填项',trigger:'blur'}],
            },

            dialogVisible:false,
            columnId:false,
            antiqueId:false,
        }
    },
    computed:{
        domain(){
            return this.$domainUrl();
        },
        editor() {
            return this.$refs.rich_editor.quill;
        },
    },
    created(){
        this.columnId = this.$route.query.columnId;
        this.antiqueId = this.$route.query.antique_id;
        if(this.antiqueId||this.antiqueId===0){
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
        imgHandler(state){
            if(state==true){
                this.onCheckImgClick('quillImg');
            }
        },
        onSaveClick(){
            let params = {
                ...this.rulesForm
            };
            this.antiqueId||this.antiqueId===0?params.antique_id=this.antiqueId*1:null;
            this.columnId||this.columnId===0?params.column_id=this.columnId*1:null;
            this.$refs['rulesForm'].validate()
            .then(()=>saveAntiqueData(params,this.antiqueId||this.antiqueId===0))
            .then(res=>{
                this.$message.success('保存成功!');
                this.$router.back();
            })
            .catch(err=>console.log(err))
        },
        onBackClick(){
            this.$router.back();
        },
        onCheckImgClick(target){
            this.target = target;
            console.log(target)
            this.dialogVisible = true;
        },

        onCheckChange(){
            let data = this.$refs['resources'].api_getcheckItem()[0];
            let url = '/' + data.folder_path + data.file_name;
            switch (this.target) {
                case 'quillImg':
                    let length = this.$refs.rich_editor.quill.getSelection().index;
                    this.$refs.rich_editor.quill.insertEmbed(length, "image", this.domain+url); // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$refs.rich_editor.quill.setSelection(length + 1);
                    break;
                case 'cover':
                    this.rulesForm.cover =  url;
                    break;
            }
            this.dialogVisible = false;
        },
        onClose(){
            this.$refs['resources'].api_clearCheck();
        },

        getData(){
            getAntiqueInfo({antique_id:this.antiqueId*1}).then(res=>{
                this.rulesForm = {
                    title:res.title,
                    cover:res.cover,
                    introduction:res.introduction,
                    content:res.content,
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
</style>