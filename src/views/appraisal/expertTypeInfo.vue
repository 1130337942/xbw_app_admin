<template>
    <div class="home">
        <div class="backImg" @click="onBackClick"></div>
        <el-form :model="rulesForm" ref="rulesForm" label-position="rigth" :rules="rules" label-width="140px" size="meidium">
            <div class="formTitle">专家类型</div>
            <div class="formBox">
                <!-- <el-form-item prop="icon" label="类型图标">
                    <div class="imageCon">
                        <img src="" alt="">
                    </div>
                </el-form-item> -->
                <el-form-item prop="genre" label="专家类型:">
                    <el-select v-model="rulesForm.genre">
                        <el-option
                            v-for="item in apparisalType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="level" label="专家等级:">
                    <el-input v-model="rulesForm.level" maxlength="10" style="width:217px;">
                        <span slot="suffix">{{rulesForm.level.length||0}}/10</span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="level_score" label="专家等级评分">
                    <el-input-number v-model="rulesForm.level_score" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item prop="graphic" label="图文鉴定费用(元):">
                    <el-input-number v-model="rulesForm.graphic" controls-position="right" :max="99999999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item prop="physical" label="实物鉴定费用(元):">
                    <el-input-number v-model="rulesForm.physical" controls-position="right" :max="99999999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item prop="on_site" label="上门鉴定费用(元):">
                    <el-input-number v-model="rulesForm.on_site" controls-position="right" :max="99999999" :min="0"></el-input-number>
                </el-form-item>
                <div class="textCenter">
                    <el-button @click="onBackClick" type="danger">取消</el-button>
                    <el-button @click="onSaveClick" type="primary">保存</el-button>
                </div>
            </div>
        </el-form>
    </div>
</template>
<script>
import { getAppraisalType , getExpertTypeInfo , saveExpertType } from '@/api/appraisal';
export default {
    data(){
        let positiveInteger = this.$positiveInteger;
        return {
            rulesForm:{
                genre:'',
                level:'',
                graphic:'',
                physical:'',
                on_site:'',
                sort:'',
                release:'',
                level_score:''
            },
            rules:{
                genre:[{required:true,message:'该项为必填项',trigger:'blur'}],
                level:[{required:true,message:'该项为必填项',trigger:'blur'}],
                level_score:[{required:true,message:'该项为必填项',trigger:'blur'}],
                graphic:[{required:true,message:'该项为必填项',trigger:'blur'},/*{validator:positiveInteger}*/],
                physical:[{required:true,message:'该项为必填项',trigger:'blur'},/*{validator:positiveInteger}*/],
                on_site:[{required:true,message:'该项为必填项',trigger:'blur'},/*{validator:positiveInteger}*/],
            },
            apparisalType:[],
            genreId:'-1',
        }
    },
    created(){  
        this.genreId = this.$route.params.id;
        if(this.genreId!='-1'){
            this.getData(this.genreId);
        }
        this.getGenreData();
    },
    methods:{
        getData(id){
            getExpertTypeInfo({genre_id:id}).then(res=>{
                this.rulesForm = res;
            })
        },
        getGenreData(){
            getAppraisalType().then(res=>{
                this.apparisalType = res
            })
        },
        onSaveClick(){
            let params = {
                ...this.rulesForm
            };
            if(this.genreId!='-1'){
                params.genre_id = this.genreId
            }
            this.$refs['rulesForm'].validate()
            .then(()=>saveExpertType(params,this.genreId!='-1'))
            .then(res=>{
                this.$message.success('保存成功!');
                this.$router.back();
            }).catch(err=>console.log(err))
        },
        onBackClick(){
            this.$router.back()
        },
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
</style>
