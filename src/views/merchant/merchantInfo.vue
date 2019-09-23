<template>
    <div class="home">
    <img @click="onBackBtn" class="image" src="../../assets/images/back.png">
    <el-scrollbar style="width:100%;height:100%">
      <div class="formTitle">基本信息</div>
      <div class="top">
            <el-form
                :model="rulesForm"
                label-width="90px"
                ref="rulesForm"
                class="demo-ruleForm "
                label-position="right"
                :rules="rules"
                :inline="false"
            >
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="商家名称:">
                            {{rulesForm.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="手机号码:">
                            {{rulesForm.phone}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="商户分类:">
                            {{merchantType}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="入驻费:" prop="admission_money">
                            <!-- ￥{{rulesForm.admission_money}} -->
                            <el-input v-model="rulesForm.admission_money" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="保证金:" prop="earnest_money">
                            <!-- ￥{{rulesForm.earnest_money}} -->
                            <el-input v-model="rulesForm.earnest_money" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="logo图片:">
                            <div class="imageCon">
                                <img
                                    v-if="rulesForm.logo"
                                    :src="domain+rulesForm.logo+'?x-oss-process=image/resize,m_fill,h_120,w_120'" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="店铺分类:">
                            {{rulesForm.genre=='1'?'个人商家':'企业商家'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="收藏数量:" prop="collection">
                            <el-input-number style="width:180px" controls-position="rigth" v-model="rulesForm.collection" :min="0"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="店铺评分:" prop="score">
                            <!-- {{rulesForm}} -->
                            <el-input-number  v-if="rulesForm.merchant_type===2" v-model="rulesForm.score" :max="10" :min="1"></el-input-number>
                            <el-rate
                               v-else
                                v-model="rulesForm.score"
                                :max="5"
                                :allow-half="true"
                            ></el-rate>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否营业:" prop="do_business">
                            <!-- <el-switch v-model="rulesForm.do_business" :active-value="1" :inactive-value="0"></el-switch> -->
                            {{rulesForm.do_business==1?'营业':'暂不营业'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="首页置顶:" prop="home_top">
                            <!-- <el-switch v-model="rulesForm.home_top" :active-value="1" :inactive-value="0"></el-switch> -->
                            {{rulesForm.home_top==1?'首页置顶':'首页不置顶'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="栏目置顶:" prop="column_top">
                            <!-- <el-switch v-model="rulesForm.column_top" :active-value="1" :inactive-value="0"></el-switch> -->
                            {{rulesForm.column_top==1?'栏目置顶':'栏目不置顶'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="首页排序:" prop="home_sort">
                            <!-- <el-input-number v-model="rulesForm.home_sort"></el-input-number> -->
                            {{rulesForm.home_sort}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="栏目排序:" prop="column_sort">
                            <!-- <el-input-number v-model="rulesForm.column_sort"></el-input-number> -->
                            {{rulesForm.column_sort}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商户地址:">
                            <el-select v-model="rulesForm.province_id" placeholder="省" @change="onProvinceChange">
                                <el-option
                                    v-for="item in provinceArr"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-model="rulesForm.city_id" placeholder="市" >
                                <el-option
                                    :readOnly="!rulesForm.city_id&&rulesForm.city_id"
                                    v-for="item in cityArr"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="店铺介绍:" prop="description">
                            <!-- {{rulesForm.description}} -->
                            <div v-html="rulesForm.description"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div v-if="false" class="formTitle">认证资料-{{rulesForm.genre=='1'?'个人':'企业'}}</div>
        <div class="top">
            <el-form
                :model="rulesForm"
                label-width="120px"
                ref="rulesForm"
                class="demo-ruleForm "
                label-position="right"
            >
                <!-- <el-row v-if="rulesForm.genre=='0'"> -->
                <el-row v-if="false">
                    <!-- 个人 -->
                    <el-col :span="10">
                        <el-form-item label="申请人:">
                            {{rulesForm.merchant_sub.applicant}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证号:">
                            {{rulesForm.merchant_sub.id_card}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证-正面照:" label-width="120px">
                            <div class="imageCon">
                                <el-image  
                                    v-if="rulesForm.thumbnail"
                                    :src="domain + rulesForm.merchant_sub.id_card_facade" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证-反面照:" label-width="120px">
                            <div class="imageCon">
                                <el-image  
                                    v-if="rulesForm.thumbnail"
                                    :src="domain + rulesForm.merchant_sub.id_card_back" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证-手持照:" label-width="120px">
                            <div class="imageCon">
                                <el-image  
                                    v-if="rulesForm.thumbnail"
                                    :src="domain + rulesForm.merchant_sub.id_card_handheld" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <!-- 个人/ -->
                </el-row>
                <!-- <el-row v-else> -->
                <el-row v-if="false">
                    <!-- 企业 -->
                    <el-col :span="10">
                        <el-form-item label="公司名称:">
                            {{rulesForm.merchant_sub.enterprise_name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="法人姓名:">
                            {{rulesForm.merchant_sub.legal_person}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="法人身份证号:">
                            {{rulesForm.merchant_sub.legal_person_id_card}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="法人身份证-正面照:" label-width="120px">
                            <div class="imageCon">
                                <el-image  
                                    :src="domain + rulesForm.merchant_sub.legal_person_id_card_facade" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="法人身份证-反面照:" label-width="120px">
                            <div class="imageCon">
                                <el-image  
                                    :src="domain + rulesForm.merchant_sub.legal_person_id_card_back" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="营业执照:">
                            <div class="imageCon">
                                <el-image  
                                    :src="domain + rulesForm.merchant_sub.business_license" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <!-- 企业/  -->
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item class="marginBottom20">
                            <el-button type="primary" @click="onSaveBtn(1)" size="medium">提交</el-button>
                            <el-button type="danger" @click="onCancelBtn(0)" size="medium">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-scrollbar>
    </div>
</template>

<script>
import { getMerchantData , getInfoData , editInfoData } from '@/api/merchant';
import { format } from 'path';
import { callbackify } from 'util';
export default {
    data(){
        let positiveInteger = this.$positiveInteger;
        return {
            rulesForm: {
               merchant_sub:{
                    applicant:'',
                    id_card:'',
                    id_card_facade:'',
                    id_card_back:'',
                    id_card_handheld:'',
                    enterprise_name:'',
                    legal_person:'',
                    legal_person_id_card:'',
                    legal_person_id_card_facade:'',
                    legal_person_id_card_back:'',
                    business_license:'',
               },
                collection:'',
            },
            provinceArr:[],
            cityArr:[],
            merchantData:[],   //商户列表数据
            rules:{
                collection:[{ validator:positiveInteger,trigger:'blur'},{required: true,message:'该项为必填项',trigger:'blur'}],
                admission_money:[{ type: 'number', message: '该项必须为数字值',trigger:'blur'},{required: true,message:'该项为必填项',trigger:'blur'}],
                earnest_money:[{ type: 'number', message: '该项必须为数字值',trigger:'blur'},{required: true,message:'该项为必填项',trigger:'blur'}]
            }
        }
    },
    computed:{
        domain(){
            return this.$domainUrl();
        },
        getParams(){
            return this.rulesForm;
        },
        merchantScore(){
            return this.rulesForm.score*0.5
        },
        merchantType(){
            let ret = '';
            switch (this.rulesForm.merchant_type) {
                case 1:
                    ret = '优店';
                    break;
                case 2:
                    ret = '古玩';
                    break;
                case 3:
                    ret = '画廊';
                    break;
            }
            return ret
        },
    },
    created(){
        const id = this.$route.params.id;
        this.getData(id,(data)=>{
            this.getArea({level:1}).then(res=>{
                this.provinceArr = res
                return this.getArea({level:2,parent_id:data.province_id})
            }).then(res=>{
                this.cityArr = res
            })
        })

    },
    methods: {
        onBackBtn(){
            this.$router.back();
        },
        onSaveBtn(){  
            let {
                id:merchant_id , merchant_type,
                score , province_id ,city_id ,admission_money
                ,earnest_money , collection
            } = this.getParams;
            this.$refs['rulesForm'].validate()
            .then(()=>{
                return editInfoData({
                    merchant_id,
                    merchant_type,
                    admission_money,
                    earnest_money,
                    province_id ,city_id, 
                    collection,
                    score:merchant_type!==2?score*2:score,
                })
            })
            .then(res => {
                this.$message.success('保存成功!')
                this.$router.back();
            }).catch(err=>console.log(err))
            
        },
        onCancelBtn(){
            this.$router.back();
        },  
        onProvinceChange(id){
            this.cityArr = [];
            this.getArea({level:2,parent_id:id})
            .then(res=>{
                this.rulesForm.city_id = ''
                this.cityArr = res;
            })
        },
        getArea(params){
            return this.axios({
                url:'area/',
                params
            })
        },
        getData(id,callback){
            getInfoData({merchant_id:id*1}).then(res => {
                this.rulesForm = res;
                if(res.merchant_type!==2){
                    this.rulesForm.score = res.score*0.5;
                }
                callback?callback(res):'';
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
.top {
    margin-left: 120px;
}
.imageCon {
    cursor:default !important;
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 8px;
    overflow: hidden;
}
.imageDelet {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.7);
    text-align: center;
    line-height: 117px;
    i {
        font-size: 20px;
        color: #ffffff
    }
}
.imageCon .hidden{display: none;}
.commodityImg {
    width:120px;
    max-height:120px; 
    overflow: hidden;
}
</style>
