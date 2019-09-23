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
                    label-width="120px"
                    class="demo-ruleForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="职位名称:" prop="name">
                                <el-input show-word-limit maxlength="12" v-model="ruleForm.name" placeholder="输入职位名称,不得超过12个字"></el-input>
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
                            <el-form-item label="职位分类:" class="form-box" prop="genre">
                                <el-select v-model="ruleForm.genre" placeholder="请选择">
                                    <el-option label="猎头招聘" value="猎头招聘"></el-option>
                                    <el-option label="社会招聘" value="社会招聘"></el-option>
                                    <el-option label="校园招聘" value="校园招聘"></el-option>
                                </el-select>
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
                            <el-form-item label="任职条件:">
                                <el-input show-word-limit maxlength="2000" :autosize="{ minRows: 4,}" type="textarea" v-model="ruleForm.claim"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="显示:">
                                <el-switch  @change="changeDetail(2)" v-model="ruleForm.release" :active-value="1" :inactive-value="0"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="岗位职责:">
                                <el-input style="width:100%;" show-word-limit maxlength="2000" :autosize="{ minRows: 4,}" type="textarea" v-model="ruleForm.duties"></el-input>
                            </el-form-item>
                        </el-col>                     
                    </el-row>
                    <el-form-item style="padding-left:40px;">
                        <el-button type="primary" @click="addOrEdit">提交</el-button>
                    </el-form-item>
                </el-form>
                <el-dialog title="图片列表" :visible.sync="dialogTableVisible">
                    <upload @upload="onUpload" :images="imgList" :propType="propType" genre="jobs"/>
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
            position_id:'',
            ruleForm:{
                name:"",
                genre:'',
                claim:'',
                duties:'',
                imageUrl: '',
                release:0,
                sort:0
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                genre: [
                    { required: true, message: '请先选择职位列表', trigger: 'change' },
                ],
            },
            dialogTableVisible:false,
            imgList:[]
        }
    },
    watch:{
        
    },
    created(){      
        this.position_id = this.$route.params.id;
        this.position_id!=-1?this.getData():'';
    },
    components: {  'upload': Upload },
    methods:{
        back(){
            this.$router.push({
                path: '/recruiting/jobListings',
            })
        },
        checkImage(){
            this.propType++;
            this.dialogTableVisible = true;
        },
        onUpload(item){
            this.ruleForm.imageUrl = item.url;
            this.dialogTableVisible = false;
        },
        addOrEdit(){
            let data = {};
            data.name = this.ruleForm.name;
            data.cover = this.ruleForm.imageUrl;
            data.sort = this.ruleForm.sort;
            data.release = this.ruleForm.release;
            this.ruleForm.genre?data.genre = this.ruleForm.genre:'';
            this.ruleForm.claim?data.claim = this.ruleForm.claim:'';
            this.ruleForm.duties?data.duties = this.ruleForm.duties:'';      
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if(this.position_id==-1){
                        // 添加    
                        this.axios.post(`position/add/`,data).then(res=>{
                            this.$message.success('添加成功');
                            this.$router.push({
                                path: '/recruiting/jobListings',
                            })                                                 
                        })
                    }else{
                        data.position_id = this.position_id;
                        this.axios.post(`position/edit/`,data).then(res=>{
                            this.$message.success('修改成功');
                            this.$router.push({
                                path: '/recruiting/jobListings',
                            })                                                 
                        })
                    }             
                }
            })          
        },
        getData(){
            this.axios.get(`position/info/`,{params:{position_id:this.position_id}}).then(res=>{
                this.ruleForm.name = res.name;
                this.ruleForm.imageUrl = res.cover;
                this.ruleForm.sort = res.sort;
                this.ruleForm.release = res.release;
                this.ruleForm.genre = res.genre;
                this.ruleForm.claim = res.claim;
                this.ruleForm.duties = res.duties;
            })
        },
        changeDetail(i){
            if(this.position_id!=-1){
                this.axios.post(`position/status/edit/`,{ position_id:this.position_id,key:i==1?'sort':'release',value:i==1?this.ruleForm.sort:this.ruleForm.release}).then(res=>{
                    this.$message.success('修改成功');
                })
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
        width: 90%;
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
    .el-form-item--small{
        width: 100%;
        /deep/ .el-form-item__content{
            width: calc(100% - 125px) !important;
        }
    }
    // .claim{
    //     .el-textarea{
    //         width: calc(100vw - 1050px) !important;
    //     }
    // }
    // .duties{
    //     .el-textarea{
    //         width: calc(100vw - 600px) !important;
    //     }
    //     .el-textarea__inner{
    //         width: 500px !important;
    //     }
    // }
}
</style>

