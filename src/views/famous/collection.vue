<template>
    <div class="panelBox">
        <div class="searchBox">
            <el-form 
                :model="rulesForm"
                ref="rulesForm"
                :inline="true"
                @submit.native.prevent
                label-width="80px"
            >
                <el-form-item label="藏品类型" prop="name">
                   <el-select v-model="rulesForm.name" clearable @clear="onSearchClick" > 
                        <el-option
                            v-for="item in genreClassis"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearchClick" native-type="submit">搜索</el-button>
            </el-form>
        </div>
        <div class="table-box">
            <div class="backImg" @click="onBackClick"></div>
            <el-button type="danger" icon="el-icon-delete" plain :disabled="selectArr.length<1" @click="onDelClick">删除</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" plain @click="onAddClick">添加</el-button>
            <el-table
                :data="tableData.items"
                v-loading="tableLoading"
                :height="tableHeight"
                size="medium"
                @selection-change="onSelectChange"
            >
                <el-table-column type="selection" width="60px"></el-table-column>
                <el-table-column label="名称" prop="name" min-width="100px"></el-table-column> 
                <!-- <el-table-column label="介绍" prop="introduction" min-width="200px" show-overflow-tooltip></el-table-column>  -->
                <el-table-column label="是否显示" prop="release" min-width="100px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.release" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'release')"></el-switch>
                    </template>
                </el-table-column> 
                <el-table-column label="收藏数" prop="collection_count" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.collection_count" :min="0" @change="onSwitchChange(scope.row,'collection_count')"></el-input-number>
                    </template>
                </el-table-column> 
                <el-table-column label="排序" prop="sort" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort" :min="0" @change="onSwitchChange(scope.row,'sort')"></el-input-number>
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
import { getCollectionData , editCollectionStatus , delCollectionData } from '@/api/famous'
export default {
    data(){
        return {
            rulesForm:{
                name:''
            },
            page:1,
            limit:10,
            selectArr:[],
            tableHeight:'0px',
            tableLoading:false,
            celebrityId:'',
            tableData:{
                items:[],
                total:0
            }
        }
    },
    computed:{
        genreClassis(){
            return this.$store.state.genreClassis;
        },
    },
    created(){
        this.tableHeight = (window.innerHeight - 330) +'px';
        this.celebrityId = this.$route.params.id;
        this.getData();
    },
    methods:{
        onSearchClick(){
            this.page =1;
            this.getData();
        },
        onAddClick(){
            this.$router.push({
                path:`/famous/collection/info/${this.celebrityId}/-1`,
            })
        },
        onEditClick(record){
            this.$router.push({
                path:`/famous/collection/info/${this.celebrityId}/${record.id}`,
                
            })
        },
        onDelClick(){
            let ids = this.selectArr.map(item=>item.id);
            delCollectionData({collection_ids:ids.join(',')})
            .then(res=>{
                this.$message.success('删除成功');
                this.getData();
            })
            .catch(err=>{console.log(err)})
        },
        onSwitchChange(record,target){
            editCollectionStatus({
                collection_id:record.id,
                key:target,
                value:record[target]
            })
            .then(res=>{
                this.$message.success('修改成功');
            })
            .catch(err=>{console.log(err);this.getData();})
        },
        onSelectChange(select){
            this.selectArr = select;
        },
        onLimitChange(val){
            this.limit = val;
            this.getData();
        },
        onBackClick(){
            this.$router.back();
        },
        getData(){
            let params = {
                celebrity_id:this.celebrityId,
                page:this.page,
                limit:this.limit,
                ...this.rulesForm
            }
            this.tableLoading = true;
            getCollectionData(this.$filterParams(params))
            .then(res=>{
                console.log(res)
                this.tableData = {
                    items:res.items,
                    total:res.total
                };
                this.tableLoading = false;
            }).catch(err=>{console.log(err);this.tableLoading = false;})
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>