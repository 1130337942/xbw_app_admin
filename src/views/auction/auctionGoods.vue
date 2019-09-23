<template>
    <div class="panelBox">
        <div class="table-box">
            <el-button type="primary" icon="el-icon-circle-plus-outline" plain @click="onAddClick">新增拍品</el-button>
            <div class="backImg" @click="onBackClick"></div>
            <div class="table-Button-right" style="margin-right:30px;">
                <refreshBtn type="info" :btnDisabled.sync="tableLoading" size="medium" :circle="true" @onClick="onResetClick"/>
            </div>
            <el-table
                size="medium"
                :data="tableData.items"
                :height="tableHeight"
                v-loading="tableLoading"
            >
                <el-table-column prop="name" label="商品名称" min-width="100px"></el-table-column>
                <el-table-column prop="start_time" label="拍卖开始时间" min-width="110px"></el-table-column>
                <el-table-column prop="end_time" label="拍卖结束时间" min-width="110px"></el-table-column>
                <el-table-column prop="fettle" label="拍卖状态" min-width="100px" :formatter="onFettleFormat"></el-table-column>
                <el-table-column prop="recommend" label="是否推荐" min-width="80px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.recommend" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'recommend')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort" :min="0" @change="onSwitchChange(scope.row,'sort')" controls-position="right"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="visitor_count" label="浏览量" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.visitor_count" :min="0" @change="onSwitchChange(scope.row,'visitor_count')" controls-position="right"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="bid_count" label="出价次数" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.bid_count" :min="0" @change="onSwitchChange(scope.row,'bid_count')" controls-position="right"></el-input-number>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="like_count" label="点赞次数" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.like_count" :min="0" @change="onSwitchChange(scope.row,'like_count')" controls-position="right"></el-input-number>
                    </template>
                </el-table-column> -->
                <el-table-column prop="collection_count" label="收藏数" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.collection_count" :min="0" @change="onSwitchChange(scope.row,'collection_count')" controls-position="right"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200px" fixed="right">
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
</template>
<script>
import refreshBtn from '@/components/refreshBtn';
import { getAuctionGoodsList , editAuctionGoodsStatus , delAuctionGoodsData } from '@/api/auction';
export default {
    components:{refreshBtn},
    data(){
        return {
            tableData:{
                items:[],
                total:0
            },
            page:1,
            limit:10
        }
    },
    created(){
        this.tableHeight = (window.innerHeight - 230)+'px'
        this.auctions_id = this.$route.params.id;
        this.getData();
    },
    methods:{
        onDeleteClick(record){
            this.$confirm('此操作将删除该件拍品,是否继续?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            })
            .then(()=>{
                delAuctionGoodsData({goods_id:record.id})
                .then(res=>{
                    this.$message.success('删除成功');
                    this.getData();
                }).catch(err=>{console.log(err)})
            })
        },
        onAddClick(){
            this.$router.push({
                path:`/auction/auctionGoods/info/-1/${this.auctions_id}`
            })
        },
        onEditClick(record){
            this.$router.push({
                path:`/auction/auctionGoods/info/${record.id}/${this.auctions_id}`
            })
        },
        onBackClick(){
            this.$router.back();
        },
        onSwitchChange(record,target){
            editAuctionGoodsStatus({
                goods_id:record.id,
                key:target,
                value:record[target],
            })
            .then(res=>{
                this.$message.success('编辑成功');
            })
            .catch(err=>{console.log(err);this.getData();})
        },
        onResetClick(){
            this.page = 1;
            this.limit = 10;
            this.getData();
        },
        onLimitChange(val){
            this.limit = val;
            this.getData()
        },
        onFettleFormat(record){ 
            switch (record.fettle) {
                case -1 :
                    return '等待开始';
                case 0 :
                    return '已结束';
                case 1 :
                    return '拍卖中'
            }
        },
        getData(){
            let params = {
                auctions_id:this.auctions_id,
                page:this.page,
                limit:this.limit
            }
            this.tableLoading = true;
            getAuctionGoodsList(params).then(res=>{
                this.tableData = {
                    items:res.items,
                    total:res.total
                };
                this.tableLoading = false;
            })
            .catch(err=>{
                console.log(err);
                this.tableLoading = false;
            });
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>