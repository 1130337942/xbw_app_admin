<template>
    <el-dialog title="待选商品" :visible.sync="visit" width="80%" top="30px" @close="onOpen">
        <div class="panelBox">
            <div class="searchBox">
                <el-form :model="rulesForm" :inline="true" label-width="75px" ref="ruleForm" @submit.native.prevent>
                    <el-form-item prop="name" label="商品名称:">
                        <el-input v-model="rulesForm.name" clearable @clear="onSearchClick"></el-input>
                    </el-form-item>
                    <el-form-item prop="merchant_name" label="所属商铺:">
                        <el-select v-model="rulesForm.merchant_name" filterable remote 
                        :remote-method="uploadMerchantData" @change="onSearchClick" 
                        clearable @clear="onMerchantClear">
                            <el-option
                                v-for="item in merchantData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="一级分类:" prop="genre_one">
                    <el-select
                        v-model="rulesForm.genre_one"
                        @clear="onSearchClick"
                        @change="onOneGenerChange"
                        clearable
                    >
                        <el-option
                        v-for="(item,index) in classisOneData"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item prop="genre_two" label="二级分类:">
                    <el-select
                        v-model="rulesForm.genre_two"
                        :clearable="true"
                        @clear="onSearchClick"
                        :disabled="towGenerDisabled"
                        ref="genreTwoSelect"
                    >
                        <el-option
                        v-for="(item,index) in classisTwoData"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                    </el-form-item>
                    <el-button native-type="submit" @click="onSearchClick" type="primary" icon="el-icon-search">搜索</el-button>
                    <el-button type="info" @click="onResetClick" icon="el-icon-refresh">重置</el-button>
                </el-form>
            </div>
            <div class="table-box">
                <el-table
                    ref="dialogTable"
                    :height="tableHeight"
                    :data="tableData.items"
                     v-loading="tableLoadling"
                    @selection-change="onSelectChange"
                >
                    <el-table-column type="selection" width="60px"></el-table-column>
                    <el-table-column label="名称" prop="name" min-width="100px"></el-table-column>
                    <el-table-column label="所属店铺" min-width="100px">
                        <template slot-scope="scope">
                            {{scope.row.merchant_info.name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="一级分类" prop="genre_one" min-width="100px"></el-table-column>
                    <el-table-column label="二级分类" prop="genre_two" min-width="100px"></el-table-column>
                    <el-table-column label="价格" prop="price" min-width="100px"></el-table-column>
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
        <div slot="footer">
            <el-button class="dialogBtn" type="danger" @click="visit=false">取消</el-button>
            <el-button class="dialogBtn" type="primary" @click="onCheckClick" :disabled="selectArr.length<1">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { getMerchantData } from "@/api/merchant";
import { getCommoditylist , getAuditCascaderData, } from '@/api/commodity';
export default {
    data(){
        return {
            rulesForm:{
                name:'',
                merchant_name:'',
                genre_one:'',
                genre_two:'',
            },
            tableHeight:'0px',
            tableData:{
                items:[],
                total:0
            },
            page:1,
            limit:10,
            tableLoadling:false,
            visit:false,
            selectArr:[],

            classisOneData:[],
            classisTwoData:[],
            merchantData:[],
        }
    },
    computed:{
        towGenerDisabled() {
            return this.rulesForm.genre_one || this.rulesForm.genre_one === 0
                ? false
                : true;
        },
    },
    created(){
        this.tableHeight = (window.innerHeight - 500) +'px';
        this.getData();
        this.getCascaderData();
        getMerchantData({ limit: 20, page: 1 }).then(res => {
            this.merchantData = res.items;
        });
    },
    methods:{
        onSearchClick(){
            this.page = 1;
            this.getData();
        },
        onResetClick(){
            this.$refs.ruleForm.resetFields();
            this.getData();
        },
        onCheckClick(){
            this.$emit('checkOver',this.selectArr.map(item=>item.id))
            this.visit = false;
        },
        onSelectChange(selects){
            this.selectArr = selects;
        },
        onLimitChange(val){
            this.limit = val;
            this.getData();
        },
        onOneGenerChange(val) {
            val || val === 0 ? this.getCascaderData(val * 1) : null;
            this.rulesForm.genre_two = "";
        },
        uploadMerchantData(query) {
            if (query !== "") {
                getMerchantData({ name: query, limit: 50, page: 1 }).then(res => {
                    this.merchantData = res.items;
                });
            }
        },
        onMerchantClear() {
            getMerchantData({ limit: 50, page: 1 }).then(res => {
                this.merchantData = res.items;
            });
        },
        onOpen(){
            this.$refs.dialogTable.clearSelection()
        },
        getCascaderData(id) {
            let params = !id && id !== 0 ? {} : { superior_id: id };
            getAuditCascaderData(params).then(res => {
                if (id !== undefined) {
                    this.classisTwoData = res;
                    this.$refs["genreTwoSelect"].focus();
                } else {
                    this.classisOneData = res;
                }
            });
        },
        getData(){
            let params = {
                page:this.page,
                limit:this.limit,
                ...this.rulesForm
            }
            this.tableLoadling = true;
            getCommoditylist(this.$filterParams(params))
            .then(res=>{
                this.tableData = {
                    items:res.items,
                    total:res.total
                }
                this.tableLoadling = false;
            })
            .catch(err=>{console.log(err);this.tableLoadling=false;})
        },

        api_open(){
            this.visit = true;
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
.dialogBtn {
    width:120px;
    margin-left: 10px;
}
</style>