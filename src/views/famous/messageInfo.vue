<template>
    <div class="home">
        <div class="backImg" @click="onBackClick"></div>
        <el-form
            :model="rulesForm"
            ref="rulesForm"
            label-width="80px"
        >   
            <div class="formTitle">名家信息详情</div>
            <div class="formBox">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="rulesForm.name" :maxlength="10">
                        <span slot="suffix">{{rulesForm.name.length||0}}/10</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-cascader
                        v-model="rulesForm.address"
                        :options="getAddress_province_city"
                        @active-item-change="onAddressChange"
                        :props="addressProps"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <div class="imageCon" @click="onCheckImgClick('avatar',1)" v-if="rulesForm.avatar">
                        <img v-lazy="domain+rulesForm.avatar+'?x-oss-process=image/resize,m_fill,h_120,w_120'" >
                    </div>
                    <div class="imageCon" @click="onCheckImgClick('avatar',1)" v-else>
                        <div class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
                    </div>
                </el-form-item>
                <el-form-item label="图片" prop="images">
                    <div class="flex_container">
                        <div class="imageCon" @click="onCheckImgClick('images',9-rulesForm.images.length)" v-if="rulesForm.images.length<9">
                            <div class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
                        </div>
                        <div v-for="(item,index) in rulesForm.images" :key="index" class="imageCon flex_item">
                            <img v-lazy="domain+item+'?x-oss-process=image/resize,m_fill,h_120,w_120'" >
                            <i class="imageCon-icon-delete el-icon-delete" @click="onDelImgClick(index)"></i>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="标签" prop="tags">
                    <el-tag
                        v-for="(tag,index) in rulesForm.tags"
                        type="success"
                        :key="index"
                        size="medium"
                        closable
                        :disable-transitions="false"
                        @close="onTagsClose({id:tag.id!=='noId'?tag.id:false,index})"
                    >
                        {{tag.tag_name}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-show="tagsInputVisit"
                        v-model.trim="tagsInput"
                        ref="saveTagInput"
                        size="small"
                        :autofocus="true"
                        @keyup.enter.native="onSaveTagClick"
                        @blur="onSaveTagClick"
                        :maxlength="8"
                    />
                    <el-button style="margin-left:0px;" type="primary" icon="el-icon-edit" plain v-if="!tagsInputVisit" @click="onAddTagsClick">添加标签</el-button>
                </el-form-item>
                <el-form-item label="简述" prop="introduction">
                    <el-input type="textarea" v-model="rulesForm.introduction" :maxlength="225"></el-input>
                </el-form-item>
                <div class="textCenter">
                    <el-button type="danger" @click="onBackClick">取消</el-button>
                    <el-button type="primary" @click="onSaveClick">确定</el-button>
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
import { saveMessageData , getMessageInfo , delTags } from '@/api/famous';
import { mapGetters } from 'vuex';
import { parse } from 'path';
export default {
    data(){
        return {
            celebrityId:'-1',
            rulesForm:{
                name: '',
                address: [],
                images:[],
                avatar:'',
                tags:[],
                introduction:''
            },
            addressProps: {
                label:'name',
                value: 'id',
                children: 'children'
            },

            tags:[],
            tagsInput:'',
            tagsInputVisit:false,
            checkTarget:'',
            dialogVisit:false,
            checkLength:1,
        }
    },
    computed:{
        addressArr(){
            return this.$store.state.address_province_city
        },
        domain(){
            return this.$domainUrl();
        },
        ...mapGetters(['getAddress_province_city'])
    },
    created(){
        
        this.celebrityId = this.$route.params.id;
        if(this.celebrityId!='-1'){
            this.getData()
        }
    },
    methods:{
        onAddressChange(val){
            if(val.length == 1){
                this.$store.dispatch('uploadCtiy_two',{provinceId:val[0],callback(d){
                    console.log(d);
                }});
            }
        },
        onSaveClick(){
            this.$refs.rulesForm.validate()
            .then(()=>{
                let params={...this.rulesForm};
                params.tags = params.tags.map(item=>item.value).join(',');
                params.province_id = params.address[0];
                params.city_id = params.address[1];
                delete params.address;
                return saveMessageData(this.$filterParams(params,(this.celebrityId!='-1'?{celebrity_id:this.celebrityId}:false)),this.celebrityId!='-1')
            })
            .then(res=>{
                this.$message.success('保存成功');
                this.$router.back();
            })
            .catch(err=>console.log(err))
        },
        onBackClick(){
            this.$router.back();
        },
        onAddTagsClick(){
            this.tagsInputVisit = true;
            this.$refs['saveTagInput'].focus();
        },
        onSaveTagClick(){
            if(this.tagsInput){
                this.rulesForm.tags.push({id:'noId',tag_name:this.tagsInput});
                this.tagsInput = '';
            }
            this.tagsInputVisit = false;
        },
        onTagsClose({id,index}){
            if(id){
                delTags({celebrity_id:this.celebrityId,tag_id:id})
                .then(res=>{
                    this.rulesForm.tags.splice(index,1);
                }).catch(err=>{console.log(err);this.$message.warning('标签删除失败')})
            }else{
                this.rulesForm.tags.splice(index,1);
            }
        },

        onCheckImgClick(target,checkLength){
            this.checkLength = checkLength;
            this.checkTarget = target;
            this.dialogVisit = true;
        },
        onCheckOverClick(){
            let imgs = this.$refs.resources.api_getcheckItem();
            if(this.checkTarget==='images'){
                 this.rulesForm.images = this.rulesForm.images.concat(imgs.map(item=>'/'+item.folder_path+item.file_name))
            }else{
                this.rulesForm[this.checkTarget] = '/'+imgs[0].folder_path+imgs[0].file_name;
            }
            this.dialogVisit = false;
        },
        onClose(){
            this.$refs['resources'].api_clearCheck();
        },
        onDelImgClick(index){
            this.rulesForm.images.splice(index,1);
        },
        getData(){
            getMessageInfo({celebrity_id:this.celebrityId*1}).then(res=>{
                this.onAddressChange([res.province_id])
                this.rulesForm = {
                    name: res.name||'',
                    address: [res.province_id,res.city_id],
                    images:res.images,
                    avatar:res.avatar||'',
                    tags:res.tags_info,
                    introduction:res.introduction||''
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
</style>