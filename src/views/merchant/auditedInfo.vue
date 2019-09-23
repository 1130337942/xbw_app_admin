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
            >
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="商家名称:">
                            {{rulesForm.merchant_name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="手机号码:">
                            {{rulesForm.merchant_info?rulesForm.merchant_info.phone:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="商户分类:">
                            <el-select v-model="rulesForm.merchant_type">
                                <el-option :value="1" label="优店"></el-option>
                                <el-option :value="2" label="古玩"></el-option>
                                <el-option :value="3" label="画廊"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="缴费类型:">
                            {{rulesForm.payment_type=='1'?'保证金':'入驻费'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="入驻费:" prop="admission_money">
                            <!-- {{rulesForm.admission_money}} -->
                            <el-input v-model.number="rulesForm.admission_money"><span slot="prefix">￥</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="保证金:" prop="earnest_money">
                            <el-input v-model.number="rulesForm.earnest_money"><span slot="prefix">￥</span></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="logo图片:">
                            <div class="imageCon" @click="onViewImgClick(domain+rulesForm.logo)">
                                <img 
                                    v-if="rulesForm.logo"
                                    v-lazy="domain+rulesForm.logo+'?x-oss-process=image/resize,m_fill,h_120,w_120'" 
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
                        <el-form-item label="是否营业:" prop="do_business">
                            {{rulesForm.do_business==1?'营业':'暂不营业'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="首页置顶:" prop="home_top">
                            {{rulesForm.home_top==1?'首页置顶':'首页不置顶'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="栏目置顶:" prop="column_top">
                            {{rulesForm.column_top==1?'栏目置顶':'栏目不置顶'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="首页排序:" prop="home_sort">
                            {{rulesForm.home_sort||rulesForm.home_sort===0?rulesForm.home_sort:'尚未排序'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="栏目排序:" prop="column_sort">
                            {{rulesForm.column_sort||rulesForm.column_sort===0?rulesForm.column_sort:'尚未排序'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商户地址:">
                            {{rulesForm.province+'-'+rulesForm.city}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="店铺介绍:" prop="description">
                            <div v-html="rulesForm.description"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
            <!-- </el-form> -->
        <!-- </div> -->
        <div class="formTitle">认证资料-{{rulesForm.genre=='1'?'个人':'企业'}}</div>
        <!-- <div class="top"> -->
            <!-- <el-form
                :model="rulesForm"
                label-width="120px"
                ref="rulesForm"
                class="demo-ruleForm "
                label-position="right"
            > -->
                <el-row v-if="rulesForm.genre=='1'">
                    <el-col :span="10">
                        <el-form-item label="申请人:">
                            {{rulesForm.applicant}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证号:">
                            {{rulesForm.id_card}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证-正面照:" label-width="120px">
                            <div class="imageCon" @click="onViewImgClick(domain + rulesForm.id_card_facade)">
                                <img  
                                    v-if="rulesForm.id_card_facade"
                                    v-lazy="domain + rulesForm.id_card_facade+'?x-oss-process=image/resize,m_fill,h_120,w_120'" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证-反面照:" label-width="120px">
                            <div class="imageCon" @click="onViewImgClick(domain + rulesForm.id_card_back)">
                                <img  
                                    v-if="rulesForm.id_card_back"
                                    v-lazy="domain + rulesForm.id_card_back+'?x-oss-process=image/resize,m_fill,h_120,w_120'" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="身份证-手持照:" label-width="120px">
                            <div class="imageCon" @click="onViewImgClick(domain + rulesForm.id_card_handheld)">
                                <img  
                                    v-if="rulesForm.id_card_handheld"
                                    v-lazy="domain + rulesForm.id_card_handheld+'?x-oss-process=image/resize,m_fill,h_120,w_120'" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <!-- 个人/ -->
                </el-row>
                <el-row v-else>
                <!-- <el-row v-if="false"> -->
                    <!-- 企业 -->
                    <el-col :span="10">
                        <el-form-item label="公司名称:">
                            {{rulesForm.enterprise_name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="法人姓名:">
                            {{rulesForm.legal_person}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="法人身份证号:">
                            {{rulesForm.legal_person_id_card}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="法人身份证-正面照:" label-width="120px">
                            <div class="imageCon" @click="onViewImgClick(domain + rulesForm.legal_person_id_card_facade)">
                                <img  
                                    v-if="rulesForm.legal_person_id_card_facade"
                                    v-lazy="domain + rulesForm.legal_person_id_card_facade+'?x-oss-process=image/resize,m_fill,h_120,w_120'" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="法人身份证-反面照:" label-width="120px">
                            <div class="imageCon" @click="onViewImgClick(domain + rulesForm.legal_person_id_card_back)">
                                <img  
                                    v-if="rulesForm.legal_person_id_card_back"
                                    v-lazy="domain + rulesForm.legal_person_id_card_back+'?x-oss-process=image/resize,m_fill,h_120,w_120'" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="营业执照:">
                            <div class="imageCon" @click="onViewImgClick(domain + rulesForm.business_license)">
                                <img  
                                    v-if="rulesForm.business_license"
                                    v-lazy="domain + rulesForm.business_license+'?x-oss-process=image/resize,m_fill,h_120,w_120'" 
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
                            <el-button type="danger" @click="onSaveBtn(0)" size="medium">不通过</el-button>
                            <el-button type="primary" @click="onSaveBtn(1)" size="medium">通过</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-scrollbar>
    <el-dialog :visible.sync="viewVisible" title="预览">
        <div style="width:100%;height:100%;text-align:center;">
            <el-image :src="viewSrc" style="max-width:80%;max-height:80%;"/>
        </div>
    </el-dialog>
    </div>
</template>

<script>
import { getMerchantData , getAuditInfoData , auditMerchant } from '@/api/merchant';
export default {
    data(){
        let money = this.$money;
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
               }
            },
            rules:{
                // admission_money:[
                //     {validator:money,tirgger:'blur'},
                // ],
                // earnest_money:[
                //     {validator:money,tirgger:'blur'},
                // ],
                admission_money:[
                     { type: 'number', message: '该项必须为数字值'}
                ],
                earnest_money:[
                     { type: 'number', message: '该项必须为数字值'}
                ],
            },
            provinceArr:[],
            cityArr:[],
            merchantData:[],   //商户列表数据
            viewVisible:false,
            viewSrc:''
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
                console.log(res);
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
        onSaveBtn(result){  
            let { admission_money , earnest_money , merchant_type } = this.getParams;
            this.$refs['rulesForm'].validate()
            .then(()=>{
                return auditMerchant({
                    apply_id:this.$route.params.id,
                    admission_money,
                    earnest_money,
                    merchant_type,
                    result
                })
            })
            .then(res => {
                this.$message.success('操作成功!')
                this.$router.back();
            }).catch(err=>console.log(err))
            
        },
        onProvinceChange(id){
            this.cityArr = [];
            this.getArea({level:2,parent_id:id})
            .then(res=>{
                console.log(res)
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
        onViewImgClick(src){
            this.viewSrc = src;
            this.viewVisible = true;
        },
        getData(id,callback){
            getAuditInfoData({apply_id:id*1}).then(res => {
                this.rulesForm = res;
                console.log(res,'load')
                if(res.merchant_type===1){
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
    // cursor: pointer; !important;
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
}
</style>
