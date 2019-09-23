<template>
    <div class="home">
        <img @click="back" class="image" src="../../assets/images/back.png">
        <el-scrollbar style="width:100%;height:100%">
            <div class="ac-box">
                <el-form
                    :rules="rules"
                    :model="ruleForm"
                    ref="ruleForm"
                    label-width="120px"
                    size="medium"
                    class="demo-ruleForm">
                    <el-form-item label="名称:" prop="name">
                        <el-input show-word-limit maxlength="16" v-model="ruleForm.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="广告分类:" prop="genre_id">
                        <el-select v-model="ruleForm.genre_id" placeholder="请选择">
                            <el-option
                            v-for="(item,index) in classList.items"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="广告源码:">
                        <el-input :autosize="{ minRows: 4,}" type="textarea" v-model="ruleForm.content" placeholder="文本/html"></el-input>
                    </el-form-item>
                    <el-form-item label="其他说明:">
                        <el-input :autosize="{ minRows: 4,}" show-word-limit maxlength="255" type="textarea" v-model="ruleForm.description"></el-input>
                    </el-form-item>
                    <el-form-item label="显示状态:">
                        <el-switch  v-model="ruleForm.release" @change="releaseChange" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="addOrEdit">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    data(){
        return{
            acticleId:'',
            ruleForm:{
                name:"",
                genre_id:'',
                content:'',
                description:"",
                release:0,
            },
            rules: {
                name: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                ],
                genre_id: [
                    { required: true, message: '请选择分类', trigger: 'change' },
                ],
            },
            classList:[]
        }
    },
    watch:{
        
    },
    created(){      
        this.getClass();
        this.acticleId = this.$route.params.id;
        this.acticleId!=-1?this.getData():'';       
    },
    methods:{
        back(){
            this.$router.push({
                path: '/advertising/advertisingList',
            })
        },
        addOrEdit(){
            let data = {};
            data.name = this.ruleForm.name;
            data.genre_id = this.ruleForm.genre_id;
            this.ruleForm.content?data.content = this.ruleForm.content:'';
            data.release = this.ruleForm.release;
            this.ruleForm.description?data.description = this.ruleForm.description:'';     
            data.release = this.ruleForm.release;                                     
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if(this.acticleId==-1){
                        // 添加    
                        this.axios.post(`advertising/add/`,data).then(res=>{
                            this.$message.success('添加成功');
                            this.$router.push({
                                path: '/advertising/advertisingList',
                            })                                                 
                        })
                    }else{
                        data.advertising_id = this.acticleId;
                        this.axios.post(`advertising/edit/`,data).then(res=>{
                            this.$message.success('修改成功');
                            this.$router.push({
                                path: '/advertising/advertisingList',
                            })                                                 
                        })
                    }
                    
                }
            })          
        },
        getData(){
            this.axios.get(`advertising/info/`,{params:{advertising_id:this.acticleId}}).then(res=>{
                this.ruleForm.name = res.name;
                this.ruleForm.genre_id = res.genre_id;
                this.ruleForm.content = res.content;
                this.ruleForm.description = res.description;
                this.ruleForm.release = res.release;
            })
        },
        getClass(){
            this.axios.get(`advertising/genre/list/`).then(res=>{
                this.classList = res;
            })
        },
        releaseChange(){
            if(this.acticleId!=-1){
                this.axios.post(`advertising/status/edit/`,{advertising_id:this.acticleId,key:'release',value:this.ruleForm.release}).then(res=>{
                    this.$message.success('取消修改成功');
                })
            }
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
            .imageBox{
                margin: 0 10px;
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
    .el-textarea{
        width: 400px;
    }
    /deep/ .el-input__count{
        height: 24px;
        line-height: 24px;
        bottom: 2px;
    }
}
</style>

