<template>
    <div class="home">
    <img @click="onBackBtn" class="image" src="../../assets/images/back.png">
    <el-scrollbar style="width:100%;height:100%">
        <div class="formTitle">认证资料-{{rulesForm.merchant_genre==1?'个人':'企业'}}</div>
        <div class="top">
        
            <el-form
                :model="rulesForm"
                :rules="rules"
                label-width="120px"
                ref="rulesForm"
                class="demo-rulesForm "
                label-position="right"
            >
                <el-row >
                    <!-- 个人 -->
                    <el-col :span="10">
                        <el-form-item prop="applicant" label="申请人:">
                            <el-input v-model="rulesForm.applicant"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="id_card" label="身份证号:">
                            <el-input v-model="rulesForm.id_card"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="id_card_facade" label="身份证-正面照:" label-width="180px">
                            <div class="imageCon" @click="onCheckImgClick('id_card_facade')">
                                <el-image  
                                    v-if="rulesForm.id_card_facade"
                                    :src="domain+rulesForm.id_card_facade" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                            <span style="color:#F56C6C">建议尺寸1:1</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10"> 
                        <el-form-item prop="id_card_back" label="身份证-反面照:" label-width="180px">
                            <div class="imageCon" @click="onCheckImgClick('id_card_back')">
                                <el-image  
                                    v-if="rulesForm.id_card_back"
                                    :src="domain+rulesForm.id_card_back" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                            <span style="color:#F56C6C">建议尺寸1:1</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="id_card_handheld" label="身份证-手持照:" label-width="180px">
                            <div class="imageCon" @click="onCheckImgClick('id_card_handheld')">
                                <el-image  
                                    v-if="rulesForm.id_card_handheld"
                                    :src="domain+rulesForm.id_card_handheld" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                            <span style="color:#F56C6C">建议尺寸1:1</span>
                        </el-form-item>
                    </el-col>
                    <!-- 个人/ -->
                </el-row>
                <el-row v-if="rulesForm.merchant_genre!=1">
                    <!-- 企业 -->
                    <el-col :span="10">
                        <el-form-item prop="enterprise_name" label="公司名称:">
                            <el-input v-model="rulesForm.enterprise_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="legal_person" label="法人姓名:">
                            <el-input v-model="rulesForm.legal_person"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="legal_person_id_card" label="法人身份证号:">
                            <el-input v-model="rulesForm.legal_person_id_card"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="legal_person_id_card_facade" label="法人身份证-正面照:" label-width="180px">
                            <div class="imageCon" @click="onCheckImgClick('legal_person_id_card_facade')">
                                <el-image  
                                    v-if="rulesForm.legal_person_id_card_facade" 
                                    :src="domain+rulesForm.legal_person_id_card_facade" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                            <span style="color:#F56C6C">建议尺寸1:1</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="legal_person_id_card_back" label="法人身份证-反面照:" label-width="180px">
                            <div class="imageCon" @click="onCheckImgClick('legal_person_id_card_back')">
                                <el-image 
                                    v-if="rulesForm.legal_person_id_card_back" 
                                    :src="domain+rulesForm.legal_person_id_card_back" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                            <span style="color:#F56C6C">建议尺寸1:1</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="business_license" label="营业执照:">
                            <div class="imageCon" @click="onCheckImgClick('business_license')">
                                <el-image  
                                    v-if="rulesForm.business_license" 
                                    :src="domain+rulesForm.business_license" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                            <span style="color:#F56C6C">建议尺寸1:1</span>
                        </el-form-item>
                    </el-col>
                    <!-- 企业/  -->
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item  class="marginBottom20">
                            <el-button type="primary" @click="onSaveBtn(1)" size="medium">提交</el-button>
                            <el-button type="danger" @click="onCancelBtn(0)" size="medium">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-dialog title="图片资源" :visible.sync="dialogVisible" @close="onClose">
            <resources 
               
                ref="resources" 
                :checkLength="1"
            />
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button @click="onCheckChange" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </el-scrollbar>
    </div>
</template>

<script>
import { getMerchantData , getInfoData  } from '@/api/merchant';
import resources from '@/components/resources';
import { debug } from 'util';
export default {
    components:{resources},
    data(){
        return {
            rulesForm: {
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
                merchant_genre:1,
                merchant_id:'',
            },
            merchant_genre:1,
            merchant_id:'',
            rules:{
                applicant :[{required: true, message:'此项为必填项!'}],
                id_card :[{required: true, message:'此项为必填项!'}],
                id_card_facade :[{required: true, message:'此项为必填项!'}],
                id_card_back :[{required: true, message:'此项为必填项!'}],
                id_card_handheld :[{required: true, message:'此项为必填项!'}],
                enterprise_name :[{required: true, message:'此项为必填项!'}],
                legal_person :[{required: true, message:'此项为必填项!'}],
                legal_person_id_card :[{required: true, message:'此项为必填项!'}],
                legal_person_id_card_facade :[{required: true, message:'此项为必填项!'}],
                legal_person_id_card_back :[{required: true, message:'此项为必填项!'}],
                business_license :[{required: true, message:'此项为必填项!'}],
            },
            dialogVisible:false,
            checkImgTag : '',
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
        this.merchant_id = this.$route.params.id;
        this.merchant_genre = this.$route.params.genre;
        this.getData(this.merchant_id)
    },
    methods: {
        onBackBtn(){
            this.$router.back();
        },
        onSaveBtn(){ 
            let params = this.$filterParams(this.getParams,{merchant_genre:this.merchant_genre,merchant_id:this.merchant_id}); 
            this.$refs['rulesForm'].validate()//.then(res=>{console.log('success')})
            .then(()=>this.editInfoData(params))
            .then(res => {
                this.$message.success('保存成功!')
                this.$router.back();
            }).catch(err=>console.log(err));

        },
        onCancelBtn(){
            this.$router.back();
        },  
        onCheckImgClick(type){
            this.checkImgTag = type;
            this.dialogVisible = true;
        },
        onCheckChange(imgs){
            this.rulesForm[this.checkImgTag] = this.$replaceUrl(this.$refs['resources'].api_getcheckItem()[0].url);
            this.dialogVisible=false;
        },
        onClose(){
            this.$refs['resources'].api_clearCheck();
        },
        getData(id){
            this.getInfoData({merchant_id:id*1}).then(res => {
                this.rulesForm = {...res};
                this.rulesForm.id_card_facade = this.$replaceUrl(res.id_card_facade),
                this.rulesForm.id_card_back = this.$replaceUrl(res.id_card_back),
                this.rulesForm.id_card_handheld = this.$replaceUrl(res.id_card_handheld),
                this.rulesForm.legal_person_id_card_facade = res.legal_person_id_card_facade?this.$replaceUrl(res.legal_person_id_card_facade):'',
                this.rulesForm.legal_person_id_card_back = res.legal_person_id_card_back?this.$replaceUrl(res.legal_person_id_card_back):'',
                this.rulesForm.business_license = res.business_license?this.$replaceUrl(res.business_license):'',
                
                this.rulesForm.merchant_genre = this.$route.params.genre
                console.log(this.rulesForm.merchant_genre)
            })
        },
        getInfoData(params){
            return this.axios({
                method:'get',
                url:'merchant/info/authenticate_info/info/',
                params
            })
        },
        editInfoData(params){
            return this.axios({
                method:'post',
                url:'merchant/info/authenticate_info/edit/',
                data:params
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
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 8px;
    cursor: pointer;
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
    width:100px;
    max-height:100px; 
    margin-left:5px;
    margin-top:5px;
    overflow: hidden;
}
</style>
