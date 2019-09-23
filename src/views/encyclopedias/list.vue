<template>
    <div class="panelBox">
        <div class="searchBox">
            <el-form ref="rulesForm" :model="rulesForm" :inline="true" label-position="left" @submit.native.prevent label-width="70px">
                <el-form-item label="百科标题" prop="title">
                    <el-input v-model="rulesForm.title" clearable @clear="onSearchClick" placeholder="请输入要百科标题"></el-input>
                </el-form-item>
                <el-form-item prop="release">
                    <el-radio-group v-model="rulesForm.release" @change="onSearchClick">
                        <el-radio-button :label="false">全部</el-radio-button>
                        <el-radio-button :label="0">不显示</el-radio-button>
                        <el-radio-button :label="1">显示</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="recommend">
                    <el-radio-group v-model="rulesForm.recommend" @change="onSearchClick">
                        <el-radio-button :label="false">全部</el-radio-button>
                        <el-radio-button :label="0">不推荐</el-radio-button>
                        <el-radio-button :label="1">推荐</el-radio-button>
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
                    native-type="submit"
                >重置</el-button>
            </el-form>
        </div>
        <div class="table-box">
            <div class="backImg" @click="onBackClick"></div>
            <el-button
                type="danger"
                icon="el-icon-delete"
                @click="onDeleteClick"
                plain
                :disabled="selectArr.length<1"
            >删除</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onAddClick" plain>添加</el-button>
            <el-table
               size="medium"
               :data="tableData.items"
               :height="tableHeight"
               v-loading="tableLoading"
               style="width: 100%;margin-top:10px;"
               @selection-change="onSelectChange"
            >
                <el-table-column type="selection" min-width="80px"></el-table-column>
                <el-table-column prop="title" label="标题" min-width="100px"></el-table-column>
                <!-- <el-table-column prop="introduction" label="简介" min-width="200px" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="sort" label="排序" min-width="140px">
                    <template slot-scope="scope"> 
                        <el-input-number v-model="scope.row.sort" :min="0" @change="onSwitchChange(scope.row,'sort')"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="release" label="是否显示" min-width="100px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.release" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'release')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="top" label="是否置顶" min-width="100px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.top" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'top')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="recommend" label="是否推荐" min-width="100px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.recommend" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'recommend')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" min-width="100px">
                    <template slot-scope="scope">
                        {{scope.row.create_time?scope.row.create_time.substring(0,10):scope.row.create_time}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" plain icon="el-icon-edit" @click="onEditClick(scope.row)">编辑</el-button>
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
</template>
<script>
import { getAntiqueList , editAntiqueStatus , delAntiqueData } from '@/api/encylopedias';
export default {
    data(){
        return {
            rulesForm:{
                title :'',
                release :false,
                recommend :false,
            },

            tableData:{
                items:[],
                total:0
            },
            page:1,
            limit:10,
            selectArr:[],
            tableHeight:'0px',
            tableLoading:false
        }
    },
    created(){
        this.tableHeight = (window.innerHeight - 330) + 'px';
        this.columnId = this.$route.params.id;
        this.getData();
    },
    methods:{
        onSearchClick(){
            this.page = 1;
            this.getData()
        },
        onResetClick(){
            this.page = 1;
            this.limit=10;
            this.$refs['rulesForm'].resetFields();
            this.getData()
        },
        onSwitchChange(record, target) {
            editAntiqueStatus({
                antique_id: record.id,
                key: target,
                value: record[target]
            })
            .then(res => {
                this.$message.success("修改成功!");
            })
            .catch(err => {
                this.getData();
                console.log(err);
            });
        },
        onSelectChange(selects){
            this.selectArr = selects;
        },
        onDeleteClick(){
            let ids = this.selectArr.map(item=>item.id)
            delAntiqueData({antique_ids:ids.join(',')}).then(res=>{
                this.$message.success("删除成功!");
                this.getData();
            }).catch(err=>console.log(err))
        },
        onAddClick(){
            this.$router.push({
                path:`/encyclopedias/listInfo`,
                query:{
                    columnId:this.columnId
                }
            })
        },
        onEditClick(record){
            this.$router.push({
                path:`/encyclopedias/listInfo`,
                query:{
                    antique_id:record.id
                }
            })
        },
        onBackClick(){
            this.$router.back();
        },
        onLimitChange(val){
            this.limit = val
            this.getData();
        },

        getData(){
            let params = {
                column_id:this.columnId,
                page:this.page,
                limit:this.limit,
                ...this.rulesForm
            }
            this.tableLoading = true;
            getAntiqueList(this.$filterParams(params))
            .then(res=>{
                this.tableData={
                    items:res.items,
                    total:res.total
                }
                this.tableLoading = false;
            }).catch(err=>{console.log(err);this.tableLoading=false;})
        }
    }
}
</script>
<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
</style>