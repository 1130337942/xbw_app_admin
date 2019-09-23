<template>
    <div class="home">
        <div class="backImg" @click="onBackClick"></div>
        <div class="formTitle">专家资料</div>
        <el-form
            class="formBox"
            ref="rulesForm"
            :model="rulesForm"
            :inline="false"
            :rules="rules"
            label-width="120px"
        >
            <el-form-item prop="avatar" label="专家头像:">
                <div class="imageCon" @click="onCheckImgClick" v-if="rulesForm.avatar">
                    <img v-lazy="domain+rulesForm.avatar+'?x-oss-process=image/resize,m_fill,h_120,w_120'" alt="" class="avatar-uploader-icon" />
                </div>
                <div class="imageCon" @click="onCheckImgClick" v-else>
                    <div class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
                </div>
            </el-form-item>
            <el-form-item prop="name" label="专家姓名:">
                <el-input v-model="rulesForm.name" :maxlength="10">
                    <span slot="suffix">{{rulesForm.name.length||0}}/10</span>
                </el-input>
            </el-form-item>
            <el-form-item prop="phone" label="专家联系方式:">
                <el-input v-model="rulesForm.phone" ></el-input>
            </el-form-item>
            <el-form-item prop="introduction" label="专家简介:">
                <el-input type="textarea" v-model="rulesForm.introduction" :maxlength="255">
                    <span slot="suffix">{{rulesForm.introduction.length||0}}/255</span></el-input>
            </el-form-item>
            <el-form-item prop="expert_in" label="擅长方向:">
                <el-input type="textarea" v-model="rulesForm.expert_in" :maxlength="255">
                    <span slot="suffix">{{rulesForm.expert_in.length||0}}/255</span></el-input>
            </el-form-item>
            <el-form-item prop="leave_comments" label="专家留言:">
                <el-input type="textarea" v-model="rulesForm.leave_comments" :maxlength="255">
                    <span slot="suffix">{{rulesForm.leave_comments.length||0}}/255</span></el-input>
            </el-form-item>
            <el-form-item prop="advisory_num" label="已咨询次数:">
                <el-input-number v-model="rulesForm.advisory_num" style="width:200px;"></el-input-number>
            </el-form-item>
            <el-form-item prop="recommend_star" label="推荐星级:">
                <el-rate v-model="rulesForm.recommend_star" show-text :texts=[1,2,3,4,5]></el-rate>
            </el-form-item>
        </el-form>
        
        <div class="formTitle" v-if="expert_id!='-1'">专家类型管理</div>
        <div class="formBox" v-if="expert_id!='-1'">
            <el-button icon="el-icon-circle-plus-outline" type="success" plain @click="onAddClick">添加专家类别</el-button>
            <el-table 
                :data="tableData"
                border
                style="width: 100%;margin-top:10px;"
                size="medium"
            >
                <el-table-column label="类型名称" min-width="100px" >
                    <template slot-scope="scope">
                        {{scope.row.genre_info.genre_name}}
                    </template>
                </el-table-column>
                <el-table-column label="专家等级" min-width="100px" >
                    <template slot-scope="scope">
                        {{scope.row.genre_info.level}}
                    </template>
                </el-table-column>
                <el-table-column label="是否显示" min-width="100px" >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.release" :active-value="1" :inactive-value="0" disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  min-width="200px">
                    <template slot-scope="scope">
                        <el-button @click="onEditClick(scope.row)" plain type="primary" icon="el-icon-edit">修改</el-button>
                        <el-button @click="onDeleteClick(scope.row)" plain type="danger" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="formBox">
            <div class="textCenter" style="margin-top:20px;margin-bottom;">
                <el-button @click="onBackClick" type="danger">取消</el-button>
                <el-button @click="onSaveClick" type="primary">保存</el-button>
            </div>
        </div>
        
        <el-dialog title="图片资源" :visible.sync="dialogVisible" @close="onClose">
            <resources 
                ref="resources" 
                :checkLength="1"
            />
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button @click="onCheckChange" type="primary">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="tableDialogTitle" :visible.sync="tableDialogVisit" @close="onDialogClose">
            <el-form :model="tableDialogForm" :rules="dialogRules" ref="tableDialogForm" class="tableDialogForm" label-position="right" :inline="true">
                <el-form-item label="鉴定服务:" prop="serves">
                    <el-checkbox-group v-model="tableDialogForm.serves" size="small">
                        <el-checkbox :label="1" border>图文鉴定</el-checkbox>
                        <el-checkbox :label="2" border>实物鉴定</el-checkbox>
                        <el-checkbox :label="3" border>上门鉴定</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="类别:" prop="genre">
                    <el-select v-model="tableDialogForm.genre">
                        <el-option
                            v-for="item in apparisalType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="等级:" prop="level">
                    <el-input v-model="tableDialogForm.level" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="是否显示:" prop="release">
                    <el-switch v-model="tableDialogForm.release" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="tableDialogVisit=false">取消</el-button>
                <el-button @click="onSaveDialogFormClick" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getExpertInfo , saveExpertData  , getExpertGenreData,
    getAppraisalType , saveExpertTypeData , delExpertTypeData } from "@/api/appraisal";
import resources from '@/components/resources';
export default {
    components:{
        resources
    },
    data(){
        let positiveInteger = this.$positiveInteger;
        return {
            rulesForm:{
                avatar:'',
                name:'',
                phone:'',
                introduction:'',
                expert_in:'',
                leave_comments:'',
                recommend_star:5,
                advisory_num:0,
            },
            rules:{
                avatar:[{required:true,message:"该项为必填项",trigger:'blur'}],
                name:[{required:true,message:"该项为必填项",trigger:'blur'}],
                introduction:[{required:true,message:"该项为必填项",trigger:'blur'}],
                expert_in:[{required:true,message:"该项为必填项",trigger:'blur'}],
                leave_comments:[{required:true,message:"该项为必填项",trigger:'blur'}],
                recommend_star:[{required:true,message:"该项为必填项",trigger:'blur'}],
                advisory_num:[{required:true,message:"该项为必填项",trigger:'blur'},{validator:positiveInteger}],
                phone:[
                    {required:true,message:"该项为必填项",trigger:'blur'},
                    {
                        validator: (rule, value, callback) => {
                        this.$phoneRule(value) || !value
                            ? callback()
                            : callback(new Error("请输入正确的电话号码"));
                        },
                        trigger: "blur"
                    }
                ],
            },
            tableData:[],
            dialogVisible:false,

            expert_id:'-1',
            tableDialogForm:{
                expert_id:'',
                serves: [],
                genre: [],
                level: '',
                release: 0,
            },
            tableDialogTitle:'',
            tableDialogVisit:false,
            apparisalType:[],
            dialogRules:{
                serves: [{required:true,message:"该项为必填项",trigger:'blur'}],
                genre: [{required:true,message:"该项为必填项",trigger:'blur'}],
                level: [{required:true,message:"该项为必填项",trigger:'blur'}],
                release: [{required:true,message:"该项为必填项",trigger:'blur'}],
            }
        }
    },
    computed:{
        domain(){
            return this.$domainUrl();
        },
    },
    created(){
        this.expert_id = this.$route.params.id;
        if(this.expert_id!='-1'){
            this.getData(this.expert_id);
            this.getTableData(this.expert_id);
            this.getGenreData();
        }
    },
    methods:{
        getTableData(id){
            getExpertGenreData({expert_id:id})
            .then(res=>{
                this.tableData = res
            })
        },
        onAddClick(){
            this.tableDialogTitle = '添加专家类型'
            this.tableDialogVisit = true
        },
        onEditClick(record){
            this.tableDialogTitle = '编辑专家类型'
            this.tableDialogForm = {
                expert_genre_id:record.id,
                serves: record.serves.split(',').map(item=>item*1),
                genre: record.genre_info.genre,
                level: record.genre_info.level,
                release: record.release,
            }
            this.tableDialogTitle = '编辑专家类型'
            this.tableDialogVisit = true
        },
        onDeleteClick(record){
            delExpertTypeData({expert_genre_id:record.id})
            .then(res=>{
                this.$message.success('删除成功');
                this.getTableData(this.expert_id);
            })
        },
        getGenreData(){
            getAppraisalType().then(res=>{
                this.apparisalType = res
            })
        },
        onSaveDialogFormClick(){
            let params = {...this.tableDialogForm};
            params.serves = params.serves.join(',');
            params.expert_id = this.expert_id*1;
            this.$refs['tableDialogForm'].validate()
            .then(()=>saveExpertTypeData(params,(params.expert_genre_id||params.expert_genre_id===0)))
            .then(res=>{
                this.getTableData(this.expert_id)
                this.$message.success('专家类型保存成功!');
                this.tableDialogVisit = false;
            })
            .catch(err=>{console.log(err)})
        },
        onDialogClose(){
            this.tableDialogForm = {
                serves: [],
                genre: '',
                level: '',
                release: '',
            };
            this.$refs['tableDialogForm'].clearValidate()
        },

        onSaveClick(){
            let params ={...this.rulesForm};
            this.expert_id!='-1'?params.expert_id = (this.expert_id*1):null;
            this.$refs['rulesForm'].validate()
            .then(()=>saveExpertData(params,this.expert_id!='-1'))
            .then(res=>{
                this.$message.success('保存成功!');
                this.$router.back();
            })
            .catch(err=>console.log(err))
        },
        onBackClick(){
            this.$router.back();
        },
        getData(id){
            getExpertInfo({expert_id:this.expert_id}).then(res=>{
                this.rulesForm = {
                    avatar:res.avatar,
                    name:res.name,
                    phone:res.phone,
                    introduction:res.introduction,
                    expert_in:res.expert_in,
                    leave_comments:res.leave_comments,
                    recommend_star:res.recommend_star,
                    advisory_num:res.advisory_num,
                };
            })
        },

        
        onCheckImgClick(type){
            this.dialogVisible = true;
        },
        onCheckChange(){
            let data = this.$refs['resources'].api_getcheckItem();
            this.rulesForm.avatar = this.$replaceUrl(data[0].url);
            this.dialogVisible=false;
        },
        onClose(){
            this.$refs['resources'].api_clearCheck();
        },
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
.tableDialogForm {
    width: 80%;
    min-width: 450PX;
    margin: 0 auto;
}
</style>
