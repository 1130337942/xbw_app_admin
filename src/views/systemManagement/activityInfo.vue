<template>
    <div class="home">
        <el-scrollbar style="width:100%;height:100%">
        <div class="backImg" @click="onBackClick"></div>
        <div class="formTitle">活动详情</div>
        <el-form 
            ref="rulesForm"
            :model="rulesForm"
            label-width="100px"
            label-position="right"
            size="medium"
            class="formBox"
        >
            <el-row >
                <el-col :span="24">
                    <el-form-item label="活动标题:" prop="title" :rules="{required:true,message:'该项为必填项',trigger:'blur'}">
                        <el-input v-model="rulesForm.title" :maxlength="30">
                            <span slot="suffix">{{rulesForm.title.length||0}}/30</span>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="活动模版:" prop="template_code">
                        <el-input v-model="rulesForm.template_code" :maxlength="30">
                            <span slot="suffix">{{rulesForm.template_code.length||0}}/30</span>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="略缩图:" prop="thumbnail">
                        <div class="imageCon" @click="onCheckImgClick('thumbnail',1)" v-if="!rulesForm.thumbnail">
                            <div class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
                        </div>
                        <div class="imageCon" @click="onCheckImgClick('thumbnail',1)"  v-if="rulesForm.thumbnail">
                            <img v-lazy="domain+rulesForm.thumbnail+'?x-oss-process=image/resize,m_fill,h_120,w_120'">
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="活动内容图片:" prop="images">
                        <div class="flex_container">
                            <div class="imageCon flex_item" @click="onCheckImgClick('images',(9 - rulesForm.images.length))">
                                <div class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
                            </div>
                            <template v-if="rulesForm.images.length">
                                <div class="imageCon  flex_item" v-for="(item,index) in rulesForm.images" :key="index">
                                    <img v-lazy="domain+item+'?x-oss-process=image/resize,m_fill,h_120,w_120'">
                                    <div class="imageCon-icon-delete"><i class="el-icon-delete" @click="onDelImgClick(index)"></i></div>
                                </div>
                            </template>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-card style="width:100%;min-height:200px;margin-bottom:30px;" class="formBox">
            <div slot="header" class="clearfix">
                <span class="card_title">补充数据</span>
                <el-dropdown trigger="click" @command="onCommandClick">
                    <el-button type="primary" icon="el-icon-plus">添加补充数据<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="input">input(30)</el-dropdown-item>
                        <el-dropdown-item command="textArea">textArea(225)</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-form ref="formRule" :model="formRule" label-position="left" :inline="true">
                <div v-for="(item,index) in  formArr" :key="index">
                    <el-form-item :rules="{required: true, message: '该项为必填项', trigger: 'blur'}" :prop="item.prop" :label="item.prop">
                        <el-input v-if="item.component==='input'" v-model="formRule[item.prop]" :maxlength="item.maxLength||30"></el-input>
                        <el-input v-else-if="item.component==='textArea'" v-model="formRule[item.prop]" type="textarea" :maxlength="item.maxLength||30"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-delete" plain type="danger" @click="onDelcomClick(index)"></el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
            <div class="textCenter">
                <el-button type="danger" @click="onBackClick" >取消</el-button>
                <el-button type="primary" @click="onSaveClick" >确定</el-button>
            </div>
        </el-scrollbar>
        <el-dialog title="图片资源" :visible.sync="dialogTableVisible" @close="onClose">
            <resources 
                ref="resources" 
                :checkLength="checkLength"
            />
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogTableVisible=false">取消</el-button>
                <el-button @click="onCheckChange" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { saveActivityData , getActivityInfo } from '@/api/download';
export default {
    data(){
        return {
            rulesForm:{
                title:'',
                template_code:'',
                thumbnail:'',
                images:[],
            },
            formArr:[],  //补充数据 组件
            formRule:{},  //补充数据 数据模型

            dialogTableVisible:false,
            checkLength:1,
            target:'',
            activity_id:''
        }
    },
    computed:{
        domain(){
            return this.$domainUrl();
        }
    },
    watch:{
        formArr:{
            handler:function(oldVal,val){
                let obj = {};
                for(const item of val) {
                    obj[item.prop] = this.formRule[item.prop]||'';
                }
                this.formRule = obj;
            },
            deep:true
        }
    },
    created(){
        this.activity_id = this.$route.params.id;
        if(this.activity_id!='-1') {
            getActivityInfo({activity_id:this.activity_id}).then(record=>{
                // let record = this.$route.query;
                // let customize_data = record.customize_data;
                
                this.rulesForm = {
                    title: record.title||'',
                    template_code: record.template_code||'',
                    thumbnail: record.thumbnail||'',
                    images: record.images||[],
                };
                // this.formRule = customize_data
            }).catch(err=>console.log(err))
        }
    },
    mounted(){
        let customize_data = this.$route.query;
        let formArr = [];
        for(let i in customize_data) {
            formArr.push( customize_data[i].length>30?{component:'textArea',prop:i}:{component:'input',prop:i} )
        }
        this.formArr = formArr;
        setTimeout(() => {
            this.formRule = customize_data;
        }, 500);
    },
    methods:{
        onCommandClick(command){
            let component = {};
            let me = this;
            this.$prompt('请输入字段名','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            })
            .then(({value})=>{
                me.formRule[value] = '';
                if(command==='input'){
                    me.formArr.push({
                        component:'input',
                        prop:value,
                    });
                }else if(command==='textArea'){
                    me.formArr.push({
                        component:'textArea',
                        prop:value,
                        
                    });
                }
            }).catch(()=>{})
        },
        onDelcomClick(index){
            this.formArr.splice(index,1);
        },
        onBackClick(){
            this.$router.back();
        },
        onCheckImgClick(target,checkLength){
            this.target = target;
            this.checkLength = checkLength;
            this.dialogTableVisible = true;
        },
        onDelImgClick(index){
            this.rulesForm.images.splice(index,1);
        },
        onSaveClick(){
            let me = this;
            this.$refs['rulesForm'].validate()
            .then(()=> this.$refs['formRule'].validate() )
            .then(()=>{
                let params = {
                    title: me.rulesForm.title,
                    thumbnail: me.rulesForm.thumbnail||false,
                    images: me.rulesForm.images.length?me.rulesForm.images:false,
                    template_code: me.rulesForm.template_code||false,
                };
                let flag = (this.activity_id!='-1');
                flag?params.activity_id=(this.activity_id*1):null;
                me.formArr.length?params.customize_data=me.formRule:null;
                return saveActivityData(me.$filterParams(params),flag)
            })
            .then(res=>{
                this.$message.success('保存成功');
                this.$router.back();
            })
            .catch(err=>console.log(err))
        },
        onCheckChange(){
            let data = this.$refs['resources'].api_getcheckItem();
            if(this.target==='images'){
                const urlArr = data.map(item=>'/' + item.folder_path + item.file_name);
                this.rulesForm.images = this.rulesForm.images.concat(urlArr);
            }else{
                this.rulesForm[this.target]  = '/' + data[0].folder_path + data[0].file_name;
            }
            this.dialogTableVisible = false;
        },
        onClose(){
            this.$refs['resources'].api_clearCheck();
        },
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
.card_title {
    font-size: 20px;
}
.el-card {
    .el-dropdown {
        float: right;
    }
}
</style>