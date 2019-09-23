<template>
    <div class="home">
    <img @click="onBackBtn" class="image" src="../../assets/images/back.png">
    <el-scrollbar style="width:100%;height:100%">
      <div style="margin:30px 50px;font-size:20px;">基本信息</div>
      <div class="top">
            <el-form
                :model="rulesForm"
                label-width="90px"
                ref="rulesForm"
                class="demo-ruleForm "
                :rules="rules"
            >
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="商品名称:" prop="name">
                            <div>{{rulesForm.name}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品分类:" prop="genre">
                            <div>{{rulesForm.genre}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品编码:" prop="commodity_id">
                            <div>{{rulesForm.commodity_id}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品价格:" prop="price">
                            <div>{{rulesForm.price}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品略缩图:">
                            <el-image 
                                :src="domain+rulesForm.thumbnail" 
                                fit="scale-down"
                                style="width:100px; margin-left:5px;margin-top:5px;"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品图片:">
                            <div 
                                style="display:inline-block"
                                v-for="(item,index) in rulesForm.images"
                                :key="index">
                                <el-image v-if="item"
                                    :src="domain+item"
                                    fit="scale-down"
                                    style="width:100px; margin-left:5px;margin-top:5px;"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品年份:" prop="years">
                            <div>{{rulesForm.years}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品作者:" prop="merchantName">
                            <div>{{rulesForm.merchantName}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品副标题:" prop="subtitle">
                            <div>{{rulesForm.subtitle}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item  label="商品详情:">
                            <!-- <el-input type="textarea" v-model="rulesForm.abc"></el-input> -->
                            <div v-html="rulesForm.description"></div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item  label="回复内容:" prop="reply">
                            <el-input :autofocus="true" type="textarea" v-model="rulesForm.reply"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item class="marginBottom20">
                            <el-button type="primary" @click="onAuditBtn(1)" size="medium">通过</el-button>
                            <el-button type="danger" @click="onAuditBtn(0)" size="medium">不通过</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-scrollbar>
    </div>
</template>

<script>
import { reviewAudit } from '@/api/commodity';
export default {
    data(){
        return {
            rules:{
                // reply:[{ required: true, message: "请输入回复内容", trigger: "blur" }],
            },
            rulesForm: {
                name:'',
                commodity_id:'',
                price:'',
                images:['/icon.png'],
                years:'',
                subtitle:'',
                merchantName:'',
                description:'',
                reply:'',
                genre:''
            }
        }
    },
    computed:{
        domain(){
            return this.$domainUrl();
        }
    },
    created(){
        const record = this.$route.query.formData;
        this.rulesForm = {
            name            :record.snapshot.name,
            commodity_id    :record.commodity_id,
            price           :record.snapshot.price,
            images          :record.snapshot.images,
            years           :record.snapshot.years,
            subtitle        :record.snapshot.subtitle,
            merchantName    :record.merchant_info.name,
            description     :record.snapshot.description,
            thumbnail       :record.snapshot.thumbnail,
            genre           :(record.snapshot.genre_one||'')+'-'+(record.snapshot.genre_two||''),
            reply           :'',
        }
    },
    methods: {
        onBackBtn(){
            this.$router.back();
        },
        onAuditBtn(status){  //0不通过  1通过
            this.$refs['rulesForm']
            .validate()
            .then(()=>reviewAudit({
                review_id:this.$route.query.review_id,
                reply:this.rulesForm.reply||(status=='1'?'通过':'不通过'),
                application_status:status
            }))
            .then(res => {
                this.$message.success('操作成功!');
                this.$router.push({
                    path:'/commodity/audited'
                })
            }).catch(err=>{console.log(err)})
        },
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/formInfo.less');
.top {
    margin-left: 120px;
}
</style>
