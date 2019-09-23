<template>
    <div class="panelBox">
        <div class="table-box">
            <el-button type="primary" icon="el-icon-circle-plus-outline" plain @click="onAddClick">新增特性</el-button>
            <div class="table-Button-right" style="margin-right:30px;">
                <refreshBtn type="info" :btnDisabled.sync="tableLoading" size="medium" :circle="true" @onClick="onResetClick"/>
            </div>
            <el-table
                :data="tableData.items"
                :height="tableHeight"
                v-loading="tableLoading"
                size="medium"
            >
                <el-table-column label="特性名称" prop="name" min-width="100px" align="center"></el-table-column>
                <el-table-column label="创建时间" prop="create_time" min-width="100px" align="center"></el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" plain @click="onEditClick(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" plain @click="onDelClick(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="textCenter">
                <el-pagination
                    style="margin-top:5px;"
                    @size-change="onLimitChange"
                    @current-change="getData"
                    :current-page.sync="page"
                    :page-size="limit"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.total"
                ></el-pagination>
            </div>
        </div>

        <el-dialog title="特性详情" :visible.sync="dialogVisit" @close="onClose">
            <el-form
                class="tableDialogForm"
                ref="dialogForm"
                :model="dialogForm"
                :rules="rules"
                label-position="left"
                label-width="80px"
            >
                <el-form-item label="特性名称" prop="name" >
                    <el-input v-model="dialogForm.name" :maxlength="6">
                        <span slot="suffix">{{dialogForm.name.length||0}}/6</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="特性描述" prop="description" >
                    <el-input type="textarea" v-model="dialogForm.description" :minlength="2" :maxlength="200" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="footer">
                <el-button type="danger" @click="dialogVisit = false">取消</el-button>
                <el-button type="primary" @click="onSaveClick">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import refreshBtn from '@/components/refreshBtn'
import { getFeatureList , saveFeatureData , delFeatureData } from '@/api/auction';
export default {
    name:'auction_feature',
    components:{refreshBtn},
    data(){
        return {
            tableData:{
                items:[],
                total:0
            },
            tableHeight:'0px',
            tableLoading:false,
            page:1,
            limit:10,   
            dialogForm:{
                name:'',
                description:''
            },
            rules:{
                name:[ {required:true,message:'该项为必填项',tirgget:'blur'} ],
                description:[ {required:true,message:'该项为必填项',tirgget:'blur'} ]
            },
            dialogVisit:false,
            submitIng:false
        }
    },
    created(){
        this.tableHeight = (window.innerHeight - 240) + 'px';
        this.getData();
    },
    methods:{
        onLimitChange(val){ 
            this.limit = val;
            this.getData();
        },
        onResetClick(val){
            this.limit = 10;
            this.page = 1;
            this.getData();
        },
        onDelClick(record){
            this.$confirm('该操作将彻底删除该特性,是否继续?','提示',{
                confirmButtonText:'确定',
                cancleButtonText:'取消'
            })
            .then(()=>{
                return delFeatureData({feature_id:record.id})
            })
            .then(res=>{
                this.$message.success('删除成功');
                this.getData();
            })
            .catch(err=>{console.log(err)})

        },
        onAddClick(){
            this.dialogVisit = true;
            // this.$refs.dialogForm.clearValidate();
        },
        onEditClick(record){
            this.dialogVisit = true;
            this.dialogForm = {
                feature_id:record.id,
                name:record.name,
                description:record.description
            }
        },
        onClose(){
            this.dialogForm = {
                name:'',
                description:''
            }
            this.$refs.dialogForm.resetFields();
        },
        onSaveClick(){
            this.$refs.dialogForm.validate()
            .then(()=>{
                this.submitIng = true;
                let params = {...this.dialogForm};
                return saveFeatureData(params,params.feature_id||params.feature_id===0);
            })
            .then(res=>{
                this.$message.success('保存成功');
                this.submitIng = false;
                this.dialogVisit = false
                this.getData();
            })
            .catch(err=>{console.log(err);this.submitIng=false;})
        },
        getData(){
            let params = {
                page:this.page,
                limit:this.limit
            }
            this.tableLoading = true;
            getFeatureList(params).then(res=>{
                this.tableData={
                    items:res.items,
                    total:res.total
                }
                this.tableLoading = false;
            }).catch(err=>{console.log(err);this.tableLoading=false});
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>