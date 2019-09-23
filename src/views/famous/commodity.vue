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
            <div class="backImg" @click="onBackClick"></div>
            <el-button plain type="danger" icon="el-icon-delete" @click="onDeleteClick" :disabled="selectArr.length<1">删除</el-button>
            <el-button plain type="primary" icon="el-icon-circle-plus-outline" @click="onAddClick">添加</el-button>
            <el-table
                :data="tableData.items"
                size="medium"
                :height="tableHeight"
                v-loading="tableLoading"
                @selection-change="onSelectChange"
            >
                <el-table-column type="selection" width="60px"></el-table-column>
                <el-table-column label="商品名称" min-width="100px">
                    <template slot-scope="scope">
                        {{scope.row.commodity_info.name}}
                    </template>
                </el-table-column>
                <el-table-column prop="collection_count" label="收藏数" min-width="100px"></el-table-column>
                <el-table-column prop="recommend" label="是否推荐" min-width="100px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.recommend" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'recommend')"></el-switch>
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
                <el-table-column prop="sort" label="排序" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort" @change="onSwitchChange(scope.row,'sort')"></el-input-number>
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
        <check-table-dialog ref="checkDialog" @checkOver="onCheckOver" ></check-table-dialog>
    </div>
</template>
<script>
import checkTableDialog from './checkTableDialog.vue'
import { getCommodityData , addCommodityData , delCommodityData ,  editCommodityStatus } from '@/api/famous';
export default {
    components:{checkTableDialog},
    data(){
        return {
            rulesForm:{
                name:''
            },
            tableData:{
                items:[],
                total:0
            },
            tableHeight:'0px',
            celebrityId:'',
            limit:10,
            page:1,
            dialogVisit:false,
            selectArr:[]
        }
    },
    created(){
        this.tableHeight = (window.innerHeight - 330) +'px';
        this.celebrityId = this.$route.params.id;
        this.getData();
    },
    methods:{

        onSearchClick(){
            this.page=1;
            this.getData();
        },
        onAddClick(){
            this.$refs.checkDialog.api_open()
        },
        onDeleteClick(){
            let ids = this.selectArr.map(item=>item.id)
            delCommodityData({
                commodity_ids:ids.join(',')
            })
            .then(res=>{
                this.$message.success('删除成功');
                this.getData();
            })
            .catch(err=>{console.log(err)})
        },
        onSelectChange(selects){
            this.selectArr = selects;
        },
        onSwitchChange(record,target){
            editCommodityStatus({
                commodity_id:record.id,
                key:target,
                value:record[target]
            })
            .then(res=>{
                this.$message.success('编辑成功')
            })
            .catch(err=>{console.log(err);this.getData();})
        },
        onLimitChange(val){
            this.limit = val
        },
        onCheckOver(ids){
            addCommodityData({
                celebrity_id:this.celebrityId,
                commodity_ids:ids.join(',')
            })
            .then((res)=>{
                this.$message.success('添加成功');
                this.getData()
            })
            .catch(err=>{console.log(err)})
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
            };
            this.tableLoading = true;
            getCommodityData(this.$filterParams(params))
            .then(res=>{
                console.log(res)
                this.tableData={
                    items:res.items,
                    total:res.total
                }
                this.tableLoading = false
            })
            .catch(err=>{
                console.log(err);
                this.tableLoading = false
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>