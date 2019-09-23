<template>
    <div class="panelBox">
        <div class="searchBox">
            <el-form 
                :model="rulesForm"
                ref="rulesForm"
                :inline="true"
                label-width="75px"
                @submit.native.prevent
            >
                <el-form-item label="姓名:" prop="name">
                    <el-input v-model="rulesForm.name" :maxlength="10" clearable @clear="onSearchClick"></el-input>
                </el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearchClick" native-type="submit">搜索</el-button>
            </el-form>
        </div>
        <div class="table-box">
            <el-button type="danger" plain icon="el-icon-delete" @click="onDeleteClick" :disabled="selectArr.length<1">删除</el-button>
            <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="onAddClick">添加</el-button>
            <el-table
                :data="tableData.items"
                :height="tableHeight"
                v-loading="tableLoading"
                size="medium"
                @selection-change="onSelectChange"
            >
                <!-- <el-table-column label="头像" prop="avatar">
                    <template slot-scope="scope">
                        <img v-lazy="scope.row.avatar" />
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" type="selection" width="80px"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="省份" prop="province"></el-table-column>

                <el-table-column label="粉丝数" prop="fans_count" min-width="140px"> 
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.fans_count" :min="0" controls-position="right" @change="onSwitchChange(scope.row,'fans_count')"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="排序" prop="sort" min-width="140px"> 
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort" :min="0" controls-position="right" @change="onSwitchChange(scope.row,'sort')"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="是否显示藏品" prop="display_only" min-width="80px"> 
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.display_only" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'display_only')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="是否推荐" prop="recommend" min-width="80px"> 
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.recommend" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'recommend')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="是否显示" prop="release" min-width="80px"> 
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.release" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'release')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="是否置顶" prop="top" min-width="80px"> 
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.top" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'top')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="300px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" plain icon="el-icon-edit" @click="onEditClick(scope.row)">编辑</el-button>
                        <el-button type="success" plain @click="onCollectionClick(scope.row)">相关藏品<i class="el-icon-caret-right"></i></el-button>
                        <el-button type="info" plain @click="onCommodityClick(scope.row)">相关商品<i class="el-icon-caret-right"></i></el-button>
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
import { getMessageList , editMessageStatus , delMessageData  } from '@/api/famous';
import { throws } from 'assert';
export default {
    name:'famous_message',
    data(){
        return {
            rulesForm:{
                name:''
            },
            tableData:{
                items:[],
                total:0
            },
            page:1,
            limit:10,
            tableLoading:false,
            tableHeight:'0px',
            selectArr:[],
        }
    },
    created(){
        this.tableHeight = (window.innerHeight - 330) +'px';
    },
    activated(){
        this.getData();
    },
    methods:{
        onSearchClick(){
          this.page=1;
          this.getData();  
        },
        onSwitchChange(record,target){
            editMessageStatus({
                celebrity_id:record.id,
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
        onSelectChange(selects){
            this.selectArr = selects;
        },
        onLimitChange(val){
            this.limit = val;
            this.getData();
        },
        onDeleteClick(){
            let celebrityIds = this.selectArr.map(item=>item.id);
            delMessageData({celebrity_ids:celebrityIds.join(',')})
            .then(res=>{
                this.$message.success('删除成功');
                this.getData();
            })
            .catch(err=>console.log(err));
        },
        onAddClick(){
            this.$router.push({
                path:`/famous/message/info/-1`
            })
        },
        onEditClick(record){
            this.$router.push({
                path:`/famous/message/info/${record.id}`
            })
        },
        onCollectionClick(record){
            this.$router.push({
                path:`/famous/collection/${record.id}`
            })
        },
        onCommodityClick(record){
            this.$router.push({
                path:`/famous/commodity/${record.id}`
            })
        },
        getData(){
            let params = {
                page:this.page,
                limit:this.limit,
                ...this.rulesForm 
            };
            this.tableLoading = true;
            getMessageList(this.$filterParams(params)).then(res=>{
                this.tableData = {
                    items:res.items,
                    total:res.total
                }
                this.tableLoading = false;
            }).catch(err=>{console.log(err);this.tableLoading = false;})
        },
        
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>