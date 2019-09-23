<template>
    <div class="home">
        <div class="backImg" @click="onBackClick"></div>
        <el-form
            :model="rulesForm"
            ref="rulesForm"
            :rules="rules"
            label-position="left"
            label-width="100px"
        >
            <div class="formTitle">拍品信息</div>
            <div class="formBox">
                <el-form-item prop="name" label="拍品名称">
                    <el-input v-model="rulesForm.name" :maxlength="20">
                        <span slot="suffix">{{rulesForm.name.length||0}}/20</span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="genre" label="拍品分类">
                    <el-cascader
                        v-model="rulesForm.genre"
                        :options="genreArr"
                        @active-item-change="onGenreChange"
                        :props="props"
                    ></el-cascader>
                </el-form-item>
                <el-form-item prop="recommendation" label="推荐描述">
                    <el-input type="textarea" v-model="rulesForm.recommendation" :autosize="{minRows:2}" :maxlength="500" show-word-limit></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="拍品介绍">
                    <el-input type="textarea" v-model="rulesForm.introduction" :autosize="{minRows:2}" :maxlength="200" show-word-limit></el-input>
                </el-form-item>
                <el-form-item prop="images" label="拍品图片">
                    <div class="flex_container">
                        <div class="imageCon flex_item" @click="onCheckResource('images','image',9-rulesForm.images.length)" v-if="(9-rulesForm.images.length)>0">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                        <div class="imageCon flex_item" v-for="(item,index) in rulesForm.images" :key="index">
                            <xb-image :src="item"  delBtn @delete="onDelResourcesClick(index,'images')" />
                        </div>
                    </div>
                </el-form-item>
                <el-form-item prop="videos" label="拍品视频">
                    <div class="flex_container">
                        <div class="imageCon flex_item" @click="onCheckResource('videos','video',9-rulesForm.videos.length)" v-if="(9-rulesForm.videos.length)>0">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                        <div class="imageCon flex_item" v-for="(item,index) in rulesForm.videos" :key="index">
                            <xb-image :src="item"  delBtn @delete="onDelResourcesClick(index,'videos')" type="video" />
                        </div>
                    </div>
                </el-form-item>
            </div>
            <div class="formTitle">拍品设置</div>
            <div class="formBox">
                <el-form-item prop="minimum_bid" label="最低出价">
                    <el-input-number v-model="rulesForm.minimum_bid" :min="0" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item prop="starting_price" label="起拍价">
                    <el-input-number v-model="rulesForm.starting_price" :min="0" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item prop="earnest_money" label="保证金">
                    <el-input-number v-model="rulesForm.earnest_money" :min="0" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item prop="commission" label="佣金">
                    <el-input-number v-model="rulesForm.commission" :min="0" controls-position="right" :disabled="goods_id!='-1'"></el-input-number>
                </el-form-item>
                <el-form-item prop="delay_minute" label="延时(分钟)">
                    <el-input-number v-model="rulesForm.delay_minute" :min="0" controls-position="right"></el-input-number>
                </el-form-item>
                <div class="timeFrame">
                    <!-- 开始时间不能早于:   {{getTimeFrame.start_time}}<br>
                    
                    结束时间不能晚于:   {{getTimeFrame.end_time}}<br> -->
                </div>
                <el-form-item prop="time" label="起始时间" >
                    <el-date-picker
                        v-model="rulesForm.time"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        unlink-panels
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item>
                
            </div>
        </el-form>
        <div class="formTitle">
            <el-card shadow="hover">
                <div slot="header" class="card-title">拍品特性 <el-button type="primary" icon="el-icon-plus" @click="onAddCharacterClick">添加</el-button></div>
                <el-table
                    :data="featuresInfo"
                >
                    <el-table-column label="名称" prop="name" min-width="100px"></el-table-column>
                    <el-table-column label="内容" prop="description" min-width="100px" show-word-limit></el-table-column>
                    <el-table-column label="创建时间" prop="create_time" min-width="100px"></el-table-column>
                    <el-table-column label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" plain @click="onDelCharacterClick(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
            
        <div class="formTitle">
            <el-card shadow="hover">
                <div slot="header" class="card-title">拍品属性 <el-button type="primary" icon="el-icon-plus" @click="onAddFeatureClick">添加</el-button></div>
                <el-form :model="featureForm" ref="featureForm" label-position="top" label-width="100px">
                    <el-form-item v-for="(item,index) in featureArr" :key="index" :rules="featureRules" :prop="item" :label="item">
                        <el-input v-model="featureForm[item]" style="width:326px;margin-right:10px;"></el-input> 
                        <el-button type="danger" icon="el-icon-delete" plain @click="onDelFeatureClick(index)"></el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <div class="textCenter" style="margin-top:30px">
                <el-button type="danger" @click="onBackClick">取消</el-button>
                <el-button type="primary" @click="onSaveClick">确定</el-button>
            </div>
        </div>

        <el-dialog title="图片资源" :visible.sync="resourceVisible" @close="onResourceClose" :append-to-body="true">
            <resources ref="resources" :checkLength="checkLength" :resourcesType="resourcesType" />
            <div class="dialog-footer" slot="footer">
            <el-button @click="resourceVisible=false">取消</el-button>
            <el-button @click="onCheckChange" type="primary">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加拍品特性" :visible.sync="featureVisit" @open="onOpen" @close="onClose">
            <div class="table-box">
                <el-table ref="featuresTable" 
                    :height="tableHeight" 
                    :data="featureTable.items" 
                    highlight-current-row
                    @current-change="onSelectChange"
                >
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column label="特性名称" prop="name" min-width="100px" align="center"></el-table-column>
                    <el-table-column label="创建时间" prop="create_time" min-width="100px" align="center"></el-table-column>
                </el-table>
                <div class="textCenter">
                    <el-pagination
                        style="margin-top:5px;"
                        @current-change="getFeatureData"
                        :current-page.sync="page"
                        :page-sizes="[10, 20, 50, 100]"
                        layout="total, prev, pager, next, jumper"
                        :total="featureTable.total"
                    ></el-pagination>
                </div>
            </div>
            <div slot="footer" class="footer">
                <el-button type="danger" @click="featureVisit=false">取消</el-button>
                <el-button type="primary" @click="onCheckFeatureClick">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import { getAuctionGoodsInfo , saveAuctionGoodsData ,
 saveGoodsFeatureData , getFeatureList , addCharacterData  , delCharacterData } from '@/api/auction';
import { mapGetters } from 'vuex';
export default {
    data(){
        return {
            goods_id:'',
            rulesForm:{
                name:'',
                genre:[],
                recommendation:'',
                introduction:'',
                images:[],
                videos:[],
                time:[],
                minimum_bid:'',
                starting_price:'',
                earnest_money:'',
                commission:'',
                delay_minute:'',
                customize_data:{}
            },
            rules:{
                name:[{required:true,message:'该项为必填项',trigger:'blur'}],
                introduction:[{required:true,message:'该项为必填项',trigger:'blur'}],
                images:[{required:true,message:'该项为必填项',trigger:'blur'}],
                videos:[{required:true,message:'该项为必填项',trigger:'blur'}],
                minimum_bid:[{required:true,message:'该项为必填项',trigger:'blur'}],
                starting_price:[{required:true,message:'该项为必填项',trigger:'blur'}],
                earnest_money:[{required:true,message:'该项为必填项',trigger:'blur'}],
                delay_minute:[{required:true,message:'该项为必填项',trigger:'blur'}],
                genre:[{required:true,message:'该项为必填项',trigger:'blur'}],
                commission:[{required:true,message:'该项为必填项',trigger:'blur'}],
                time:[{required:true,message:'该项为必填项',trigger:'blur'}],
            },
            featureRules:[{required:true,message:'该项为必填项',trigger:'blur'}],

            featureForm:{},
            featureArr:[], //拍品属性

            featuresInfo:[], //拍品特性
            selecter:[],
            page:1,
            featureTable:{
                items:[],
                total:0,
            },
            tableHeight:'100px',
            featureVisit:false,

            props: {
                label: 'name',
                value: 'id',
                children: 'children'
            },
            checkLength:1,
            checkTarget:'',
            resourceVisible:false,
            resourcesType:'image',
        }
    },
    computed:{
        genreArr(){
            return this.$store.state.genreClassis;
        },
        timeFrame(){
            return this.$store.state.auction.timeFrame;
        },
        pickerOptions(){
            let me = this;
            let timeFrame = this.getTimeFrame;
            return {
                disabledDate(data) {
                    let time = new Date(data);
                    return ( time > new Date(timeFrame.end_time).getTime() )||( time < new Date(timeFrame.start_time).getTime() );
                },
            }
        },
        ...mapGetters('auction',['getTimeFrame'])
    },
    watch:{
        featureArr:{
            handler:function(val,oldVal){
                let obj = {};
                for(let item of this.featureArr){
                    obj[item] = this.featureForm[item]||'';
                }
                this.featureForm = obj;
            },
            deep:true
        }
    },
    created(){
        this.tableHeight = (window.innerHeight /2 ) - 100 +'px'

        this.goods_id = this.$route.params.goodsId;
        this.auctions_id = this.$route.params.auctionsId;
        if(this.goods_id!='-1'){
            this.getData();
        }
    },
    methods:{
        onGenreChange(genre){
            if(genre.length===1){
                this.$store.dispatch('uploadGenreClassis_two',genre[0])
            }
        },
        onSaveClick(){
            let me = this;
            this.$refs['rulesForm'].validate()
            .then(()=>this.$refs['featureForm'].validate())
            .then(()=>{
                let { 
                    name , genre , recommendation , introduction , 
                    images , videos , time , minimum_bid , starting_price , 
                    earnest_money , delay_minute ,commission
                } = this.rulesForm;


                let params = {
                    auctions_id : this.auctions_id,
                    name  , recommendation , introduction , commission,
                    images , videos , minimum_bid , starting_price , 
                    earnest_money , delay_minute ,
                    genre_one:genre[0] , genre_two:genre[1],
                    start_time:time[0],end_time:time[1],
                    customize_data:this.featureForm
                };
                this.goods_id!='-1'?params.goods_id = this.goods_id:null;
                return saveAuctionGoodsData(this.$filterParams(params),this.goods_id!='-1')
            })
            .then(res=>{
                this.$message.success('保存成功');
                this.onBackClick();
            })
            .catch(err=>{console.log(err)})
        },
        onBackClick(){
            this.$router.back();
        },
        onCheckResource(target,type,length){
            this.resourcesType = type;
            this.checkLength = length;
            this.checkTarget = target;
            this.resourceVisible = true;
        },
        onCheckChange(){
            let data = this.$refs["resources"].api_getcheckItem();
            let resources = data.map(item=>'/'+item.folder_path+item.file_name)
            this.rulesForm[this.checkTarget] = this.rulesForm[this.checkTarget].concat(resources);
            this.resourceVisible = false;
        },
        onResourceClose(){
            this.$refs["resources"].api_clearCheck();
        },
        onDelResourcesClick(index,target){
            this.rulesForm[target].splice(index,1);
        },

        onAddFeatureClick(){
            let me = this;
            this.$prompt('请输入属性名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputErrorMessage: '属性名不能为空',
                inputValidator(val){
                    return val&&(val+'').trim()?true:false;
                },
            })
            .then((val)=>{
                me.featureArr.push(val.value);
                // me.featureForm[val.value] = '';
            })
            .catch(err=>{
                console.log(val,'error')
            })
        },
        onDelCharacterClick(record){
            delCharacterData({relation_id:record.relation_id})
            .then(res=>{
                let featureIndex ;
                this.featuresInfo.forEach((item,index)=>{
                    item.id===record.id?featureIndex = index:null;
                })
                this.featuresInfo.splice(featureIndex,1);
                this.$message.success('删除成功!');
            }).catch(err=>console.log(err))
        },
        onSelectChange(select){
            this.selecter = select
        },
        onAddCharacterClick(){
            this.featureVisit = true;
        },
        getFeatureData(){
            getFeatureList({page:this.page,limit:10})
            .then(res=>{
                this.featureTable = {
                    items:res.items,
                    total:res.total
                }
            }).catch(err=>console.log(err))
        },
        onCheckFeatureClick(){
            addCharacterData({ goods_id:this.goods_id , feature_id:this.selecter.id })
            .then(res=>{
                this.$message.success('添加成功!');
                this.featureVisit = false;
                this.featuresInfo.push({
                    ...this.selecter,
                    relation_id:res.id
                })
            }).catch(err=>console.log(err));
        },
        onOpen(){
            this.getFeatureData();
        },
        onClose(){
            this.$refs.featuresTable.clearSelection();
        },
        onDelFeatureClick(index){
            this.featureArr.splice(index,1);
        },
        getData(){
            this.$showLoading();
            getAuctionGoodsInfo({goods_id:this.goods_id*1 , features_info:1})
            .then(res=>{
                this.featuresInfo = res.features_info.map(item=>{
                    return {...item.feature , relation_id : item.feature_relation.id }
                })
                this.rulesForm = {
                    name  :  res.name,
                    genre  :  [res.genre_one,res.genre_two],
                    recommendation  :  res.recommendation,
                    introduction  :  res.introduction,
                    commission  :  res.commission,
                    images  :  res.images||[],
                    videos  :  res.videos||[],  
                    time  :  [res.start_time,res.end_time],
                    minimum_bid  :  res.minimum_bid,
                    starting_price  :  res.starting_price,
                    earnest_money  :  res.earnest_money,
                    delay_minute  :  res.delay_minute,
                }
                let arr = [];
                for(var i in res.customize_data) {
                    arr.push(i)
                }
                this.featureArr = arr;
                this.featureForm = res.customize_data;
                this.$store.dispatch('uploadGenreClassis_two',res.genre_one)
                this.$hideLoading();
            })
            .catch(err=>{console.log(err);this.$hideLoading();})
        },

        getTimeData(data){
            let time = new Date(data);
            return `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}  ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
.card-title {
    font-size: 20px;
    .el-button {
        float: right;
    }
}
.timeFrame {
    color: red;
}
</style>