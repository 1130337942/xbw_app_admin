<template>
    <div class="box">
      
        <div class="top">
        <el-form
            :model="ruleForm"
            :inline="true"
            ref="ruleForm"
            label-width="75px"
            class="demo-ruleForm"
        >
            <el-row>
            <el-col :span="12">
                <el-form-item label="新闻标题:">
                    <el-input @clear="onSearchBtn" clearable v-model="ruleForm.title" placeholder="请输入新闻标题"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="编号搜索:">
                    <el-input @clear="onSearchBtn" clearable v-model="ruleForm.news_id	" placeholder="请输入新闻编号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="时间区间">
                    <el-date-picker
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="ruleForm.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @clear="onSearchBtn"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-col>
            </el-row>
            <el-form-item style="margin-top: 10px;">
            <el-button style="margin-left: 75px;" type="primary" @click="onSearchBtn">搜索</el-button>
            </el-form-item>
        </el-form>
        </div>

        <el-table 
            :data="tableData.items" 
            @selection-change="onSelectionChange" 
            v-loading="tableLoading"
            height="260"
            size="medium"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="新闻编号" min-width="100px"></el-table-column>
            <el-table-column prop="title" label="新闻标题" min-width="100px"></el-table-column>
            <el-table-column prop="seo_title" label="副标题" min-width="100px"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="100px"></el-table-column>
        </el-table>   
        <div class="textCenter">
            <el-pagination
                style="margin-top:5px;"
                @current-change="onCurrentChange"
                :current-page.sync="page"
                layout="total, prev, pager, next, jumper"
                :total="tableData.total"
            ></el-pagination>    
        </div> 
    </div>    
</template>

<script>
import { getNewsListData , addNewsListData } from '@/api/newCenter';
import { Promise } from 'q';
export default {
    name:'addColumnNew',
    props:{
        columnId:{
            required:true,
        }
    },
    data(){
        return {
            ruleForm:{
                title:'',
                news_id	:'',
                time:[]
            },

            page:1,
            tableData:{
                items:[],
                total:0
            },
            tableLoading:false,

            tableSelect:[]

        }
    },
    computed :{
        getRuleForm(){
            let ret = {
                page: this.page,
                column_id:this.columnId,
            }
            this.ruleForm.title ? ret.title=this.ruleForm.title : null;
            this.ruleForm.time&&this.ruleForm.time[0] ? ret.start_time=this.ruleForm.time[0] : null;
            this.ruleForm.time&&this.ruleForm.time[1] ? ret.end_time=this.ruleForm.time[1] : null;
            this.ruleForm.news_id ? ret.news_id=this.ruleForm.news_id : null;

            return ret
        }
    },

    created(){
        this.getData();
    },
    methods: {
        init(){
            this.tableLoading=false;
            this.getData();
        },
        getData(){
            this.tableLoading = true 
            getNewsListData(this.getRuleForm).then(res => {
                this.tableLoading = false
                this.tableData = {
                    items:res.items,
                    total: res.total
                }
            }).catch(()=>{
                this.tableLoading = false
            })
        },

        onSearchBtn(){
            this.getData();
        },

        onSelectionChange(select){
            this.tableSelect = select;
        },
        onCurrentChange(page){
            this.page = page;
            this.getData();
        },
        getSelectData(){
            let newsId = this.tableSelect.map(function(item){
                return item.id
            }),
                column_id = this.$route.params.id;
            if(newsId.length>0){
                addNewsListData({column_id,news_ids:newsId.join(',')})
                    .then(res => {
                        this.$message.success('保存成功!')
                        this.$emit('uploadTable');
                        this.$emit('closeWindow');
                    }).catch(()=>{console.log('promise.warn!!')})
            }else{
                this.$message.warning('请选择要添加的新闻!')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .box {height: 100%;}
    .top {
        padding-left: 20px;
        background-color: #fff;
        height: 130px;
        display: flex;
        align-items: center;
        .demo-ruleForm {
        width: 100%;
        .el-input {
            width: 250px;
        }
        }
        .el-form-item {
        margin-bottom: 0px !important;
        }
    }
    .el-col {
        margin-top: 10px;
        // margin-bottom: 10px;
    }
</style>
