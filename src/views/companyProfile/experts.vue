<template>
    <div class="home">
        <img @click="back" class="image" src="../../assets/images/back.png">
        <div class="ac-box">
            <el-form
                size="medium"
                :rules="rules"
                :model="ruleForm"
                ref="ruleForm"
                label-width="75px"
                class="demo-ruleForm">
                <el-form-item label="头像:" prop="imageUrl">
                    <div class="imageCon" @click="checkImage">
                        <el-image v-if="ruleForm.imageUrl" style="width: 120px; height: 120px" :src="ruleForm.imageUrl" fit="scale-down"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>                                  
                    </div>
                </el-form-item>
                <el-form-item label="姓名:"  prop="name">
                    <el-input v-model="ruleForm.name" show-word-limit maxlength="16"></el-input>
                </el-form-item>
                <el-form-item label="简介:" >
                    <el-input :autosize="{ minRows: 4,}" type="textarea" show-word-limit maxlength="16" v-model="ruleForm.introduction"></el-input>
                </el-form-item>
                <el-form-item label="详情:">
                    <el-input :autosize="{ minRows: 4,}" type="textarea" show-word-limit maxlength="200" v-model="ruleForm.description"></el-input>
                </el-form-item>
                <el-form-item label="排序:" >
                    <el-input-number v-model="ruleForm.sort" controls-position="right" :min="1" @change="changeState(1)"></el-input-number>
                </el-form-item>
               <el-form-item label="显示:"  >
                    <el-switch v-model="ruleForm.release" :active-value="1" :inactive-value="0" @change="changeState(2)"></el-switch>
                </el-form-item>               
                <el-form-item >
                    <el-button type="primary" @click="addOrEdit">提交</el-button>
                </el-form-item>
            </el-form>
            <el-dialog title="图片列表" :visible.sync="dialogTableVisible">
                <upload @upload="onUpload" :images="imgList" :propType="propType" genre="imgList"/>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Upload from '../../components/upload'
export default {
    data(){
        return{
            expert_id:'',
            ruleForm:{
                name:"",
                imageUrl: '',
                introduction:'',
                description:'',
                sort:0,
                release:0,
            },
            dialogTableVisible:false,
            propType:2,
            imgList:[],
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                imageUrl: [
                    { required: true, message: '请选择头像', trigger: 'change' },
                ],
            },
        }
    },
    watch:{
        
    },
    components: {  'upload': Upload },
    created(){
        this.expert_id = this.$route.params.id;
        this.expert_id!=-1?this.getData():'';
    },
    mounted () {
        
    },
    computed:{
       
    },
    methods:{
        back(){
            this.$router.push({
                path: '/companyProfile/invitedExperts',
            })
        },
        checkImage(){
            this.propType++;
            this.dialogTableVisible = true;
        },
        addOrEdit(){
            let data = {};
            data.name = this.ruleForm.name;
            data.avatar = this.ruleForm.imageUrl;
            this.ruleForm.introduction?data.introduction = this.ruleForm.introduction:'';
            data.release = this.ruleForm.release;
            this.ruleForm.description?data.description = this.ruleForm.description:'';     
            data.sort = this.ruleForm.sort;                                     
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if(this.expert_id==-1){
                        // 添加    
                        this.axios.post(`expert/add/`,data).then(res=>{
                            this.$message.success('添加成功');
                            this.$router.push({
                                path: '/companyProfile/invitedExperts',
                            })                                                 
                        })
                    }else{
                        data.expert_id = this.expert_id;
                        this.axios.post(`expert/edit/`,data).then(res=>{
                            this.$message.success('修改成功');
                            this.$router.push({
                                path: '/companyProfile/invitedExperts',
                            })                                                 
                        })
                    }
                    
                }
            })     
        },
        getData(){
            this.axios.get(`expert/info/`,{params:{expert_id:this.expert_id}}).then(res=>{
                this.ruleForm.name = res.name;
                this.ruleForm.imageUrl = res.avatar;
                this.ruleForm.introduction = res.introduction;
                this.ruleForm.description = res.description;
                this.ruleForm.release = res.release;
                this.ruleForm.sort = res.sort;         
            })
        },  
        onUpload(item){
            this.ruleForm.imageUrl = item.url;
            this.dialogTableVisible = false;
        },
        changeState(i){
            if(this.expert_id!=-1){
                this.axios.post(`expert/status/edit/`,{expert_id:this.expert_id,key:i==1?'sort':'release',value:i==1?this.ruleForm.sort:this.ruleForm.release}).then(res=>{
                    this.$message.success('修改成功');
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
    padding-top: 30px;
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
        margin: 0px auto 0; 
        .avatar-uploader  {
            width: 80px;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
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
    .el-input{
        width: 400px;
    }
    // .el-input-number{
    //     width: 400px;
    // }
    .el-textarea{
        width: 400px;
    }
    /deep/ .el-input__count{
        height: 26px;
        line-height: 30px;
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

