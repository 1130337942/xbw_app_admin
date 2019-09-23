<template>
    <div class="home">
        <div class="panelBox">
            <div class="searchBox">
                <el-form ref="ruleForm" :model="rulesForm" inline label-width="75px" @submit.native.prevent>
                    <el-form-item label="活动标题:" prop="title">
                        <el-input v-model="rulesForm.title" :maxlength="30" placeholder="请输入活动标题"></el-input>
                    </el-form-item>
                    <el-form-item label="模版名称:" prop="template_code">
                        <el-input v-model="rulesForm.template_code" :maxlength="30" placeholder="请输入模版名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="display">
                        <el-radio-group v-model="rulesForm.display" @change="onSearchClick">
                            <el-radio-button label="-1">全部</el-radio-button>
                            <el-radio-button :label="0">不显示</el-radio-button>
                            <el-radio-button :label="1">显示</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="sort">
                        <el-radio-group v-model="rulesForm.sort" @change="onSearchClick">
                            <el-radio-button label="-1">不排序</el-radio-button>
                            <el-radio-button :label="0">正序</el-radio-button>
                            <el-radio-button :label="1">倒序</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="rop">
                        <el-radio-group v-model="rulesForm.rop" @change="onSearchClick">
                            <el-radio-button label="-1">全部</el-radio-button>
                            <el-radio-button :label="0">不置顶</el-radio-button>
                            <el-radio-button :label="1">置顶</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-button
                        icon="el-icon-search"
                        type="primary"
                        @click="onSearchClick"
                        native-type="submit"
                    >搜索</el-button>
                    <el-button
                        icon="el-icon-refresh"
                        type="info"
                        @click="onResetClick"
                    >重置</el-button>
                </el-form>
            </div>
            <div class="table-box">
                <!-- <el-button type="danger" icon="el-icon-delete" plain @click="onDeleteClick" :disabled="selectArr.length<1">删除</el-button> -->
                <el-button type="primary" icon="el-icon-circle-plus-outline" plain @click="onAddClick">添加</el-button>
                <el-table 
                    :data="tableData.items" 
                    :height="tableHeight"
                    size="medium"
                    v-loading="tableLoading"
                    @selection-change="onSelectChange"
                >
                    <el-table-column type="selection" min-width="40px"></el-table-column>
                    <el-table-column label="活动标题" prop="title" min-width="100px"></el-table-column> 
                    <el-table-column label="app模版" prop="template_code" min-width="120px"></el-table-column>
                    <el-table-column label="排序" prop="sort" min-width="140px">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.sort" :min="0" @change="onSwitchChange(scope.row,'sort')"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="置顶" prop="top" min-width="80px">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.top" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'top')"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time" min-width="100px"></el-table-column>
                    <el-table-column label="操作" min-width="200px">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" plain @click="onEditClick(scope.row)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" plain @click="onDeleteClick(scope.row)">删除</el-button>
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
        </div>
    </div>
</template>
<script>
import { getActivityData , editActivityStatus , delActivityData } from '@/api/download';
export default {
    name:'systemManagement_activity',
    data(){
        return {
            rulesForm:{
                title:'',
                template_code:'',
                display:'-1',
                sort:'-1',
                rop:'-1',
            },

            tableData:{
                items:[],
                total:0
            },
            page:1,
            limit:10,
            tableLoading:false,
            selectArr:[]
        }
    },
    created(){
        this.tableHeight = (window.innerHeight - 320) + 'px'
    },
    activated(){
        this.getData()
    },
    methods:{
        onSearchClick(){
            this.page = 1;
            this.getData();
        },
        onResetClick(){
            this.$refs.ruleForm.resetFields();
            this.limit = 10
            this.onSearchClick()
        },
        onDeleteClick(record){
            // let ids = this.selectArr.map(item=>item.id);
            this.$confirm('您将删除该活动,是否继续?','提示',{
                confirmButtonText:'确定',
                cancleButtonText:'取消',
            })
            .then(()=>delActivityData({activity_id:record.id}))
            .then(res=>{
                this.$message.success('删除成功');
                this.getData();
            }).catch(err=>console.log(err))

        },
        onAddClick(){
            this.$router.push({
                path:`/systemManagement/activity/info/-1`
            })
        },
        onEditClick(record){
            this.$router.push({
                path:`/systemManagement/activity/info/${record.id}`,
                query:record.customize_data
            })
        },
        onSwitchChange(record,target){
            editActivityStatus({
                activity_id:record.id,
                key:target,
                value:record[target]
            })
            .then(res=>{
                this.$message.success('修改成功!');
            })
            .catch(err=>{
                console.log(err);
                this.getData();
            })
        },
        onLimitChange(val){
            this.limit = val;
            this.getData();
        },
        onSelectChange(selects){
            this.selectArr = selects
        },

        getData(){
            let params = {
                page:this.page,
                limit:this.limit,
                ...this.rulesForm
            }
            this.tableLoading = true;
            getActivityData(this.$filterParams(params))
            .then(res=>{
                console.log(res);
                this.tableData = {
                    items:res.items,
                    total:res.total
                };
                this.tableLoading = false;
            }).catch(err=>{console.log(err);this.tableLoading=false;})
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>