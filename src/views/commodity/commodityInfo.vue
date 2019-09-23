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
                label-position="right"
            >
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="商品名称:" prop="name">
                            <el-input v-model="rulesForm.name" maxlength="20" >
                                <span slot="suffix">{{rulesForm.name.length||0}}/20</span>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品编号:" prop="code">
                            <!-- <el-input v-model="rulesForm.name" ></el-input> -->
                            {{rulesForm.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品分类:" prop="genre">
                            <el-cascader
                                :options="cascaderOptions"
                                @active-item-change="onGenerItemChange"
                                :change-on-select="false"
                                v-model="rulesForm.genre"
                                :props="cascaderProps"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商户编号:" prop="merchant_id">
                            <!-- <el-input v-model="rulesForm.merchant_id" ></el-input> -->
                            <el-select 
                                v-model="rulesForm.merchant_id"
                                :filterable="true"
                                :remote="true"
                                :clearable="true"
                                :remote-method="uploadMerchantData"
                                @clear="uploadMerchantData"
                            >
                                <el-option
                                    v-for="(item,index) in merchantData"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="10">
                        <el-form-item label="排序:" prop="sort">
                            <el-input-number 
                            v-model="rulesForm.sort" 
                            controls-position="right" 
                            :min="0"></el-input-number>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="10">
                        <el-form-item label="是否精品:" prop="boutique">
                            <el-switch v-model="rulesForm.boutique" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="10">
                        <el-form-item label="是否推荐:" prop="recommend">
                            <el-switch v-model="rulesForm.recommend" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否显示:" prop="release">
                            <el-switch v-model="rulesForm.release" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否置顶:" prop="top">
                            <el-switch v-model="rulesForm.top" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="10">
                        <el-form-item label="商品略缩图:">
                            <div class="imageCon" @click="onCheckImageClick('thumbnail',1)">
                                <el-image  
                                    v-if="rulesForm.thumbnail"
                                    :src="domain+rulesForm.thumbnail+'?x-oss-process=image/resize,m_fill,h_120,w_120'" 
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                            <span style="color:#F56C6C">建议尺寸1:1</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品图片:">
                            <div 
                                style="display:inline-block;position:relative;"
                                class="imageCon"
                                v-for="(item,index) in rulesForm.images"
                                :key="index"
                                @mouseover="imageDelete=index"
                                @mouseleave="imageDelete=-1"
                            >
                                <el-image
                                    :src="domain+item+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
                                    fit="scale-down"
                                    class="commodityImg"
                                />
                                <div class="imageDelet" :class="[imageDelete===index?'':'hidden']" @click="onDelImgClick(index)"><i class="el-icon-delete"></i></div>
                            </div>
                            <div v-if="rulesForm.images.length<9" class="imageCon" @click.stop="onCheckImageClick('images',(9-rulesForm.images.length))">
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                            <span style="color:#F56C6C">建议尺寸1:1</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品价格:" prop="price">
                            <el-input-number v-model="rulesForm.price"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品年份:" prop="years">
                            <el-input-number v-model="rulesForm.years"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品作者:" prop="author">
                            <el-input v-model="rulesForm.author" maxlength="20" >
                                <span slot="suffix">{{rulesForm.author.length||0}}/20</span>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品副标题:" prop="subtitle" label-width="100px">
                            <el-input v-model="rulesForm.subtitle"  maxlength="20" >
                                <span slot="suffix">{{rulesForm.subtitle.length||0}}/20</span>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item  label="商品详情:" prop="description">
                            <quill-editor  v-model="rulesForm.description"  ref="rich_editor"></quill-editor>
                            <!-- <div v-html="rulesForm.description"></div> -->
                        </el-form-item>
                    </el-col>
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
    <el-dialog title="图片资源" :visible.sync="dialogTableVisible" @close="onClose"  append-to-body>
        <resources 
            ref="resources" 
            :checkLength="checkLength"
        />
        <div class="dialog-footer" slot="footer">
            <el-button @click="dialogTableVisible=false">取消</el-button>
            <el-button @click="onCheckChange" type="primary">确定</el-button>
        </div>
    </el-dialog>
    </div>
</template>

<script>
import {getMerchantData} from '@/api/merchant';
import resources from '@/components/resources';
import { getAuditCascaderData , addCommoditylist , getCommodityInfot , delTags } from '@/api/commodity';
import {mapActions, mapGetters} from 'vuex';
export default {
    data(){
        return {
            propType: 2,
            rules:{
                name:[{ required: true, message: "请输入商品名称", trigger: "blur" }],
                subtitle:[{ required: true, message: "请输入副标题", trigger: "blur" }],
                years:[{ required: true, message: "请输入年限", trigger: "blur" }],
                price:[{ required: true, message: "请输入价格", trigger: "blur" }],
                merchant_id:[{ required: true, message: "请选择所属商铺", trigger: "blur" }],
                genre:[{ required: true, message: "请选择商品的分类", trigger: "blur" }],
            },
            rulesForm: {
                // sort:0,
                // boutique:0,
                // recommend:0,
                // top:0,
                // release:1,
                name:'',
                merchant_id:'',
                price:'',
                images:[],
                years:'',
                subtitle:'',
                author:'',
                description:'',
                reply:'',
                genre:[],
                thumbnail:''
            },
            dialogTableVisible:false,
            clickOrigin:'',   //正在选取图片的项
            
            imgList: [],
            type: 0, //0头像上传 1富文本上传

            cascaderOptions:[],
            cascaderProps:{
                label:'name',
                value: 'id',
                children: 'children'
            },
            
            merchantData:[],   //商户列表数据
            imageDelete:-1,

            checkLength:1,
        }
    },
    components: { 
        resources
    },
    computed:{
        domain(){
            return this.$domainUrl();
        },
        editor() {
            return this.$refs.rich_editor.quill;
        },
        getParams(){
            return {...this.rulesForm};
        },
    },
    created(){
        const record = this.$route.query.record;

        if(this.$route.query.record!='-1'){
            getCommodityInfot({commodity_id:record.id}).then(res => {
                const that =this;
                this.rulesForm = {
                    
                    // sort            :res.sort,
                    // boutique        :res.boutique,
                    // recommend       :res.recommend,
                    // top             :res.top,
                    name            :res.name,
                    code            :res.code,
                    price           :res.price,
                    images          :res.images.length?res.images:[],
                    thumbnail       :res.thumbnail,
                    years           :res.years,
                    subtitle        :res.subtitle,
                    author          :res.author,
                    merchant_id     :record.merchant_info.id,
                    description     :res.description,
                    genre           :[res.genre_one,res.genre_two],
                    // release         :res.release
                }
                this.getCascaderData().then(()=>{
                    let tagIndex = 0;
                    this.cascaderOptions.filter(function(item,index){
                        if(item.id == res.genre_one){//  66 => res.genre_one
                            tagIndex = index
                            return
                        }
                    })
                    this.getCascaderData(res.genre_one,tagIndex).then(()=> console.log(this.cascaderOptions,'two'));// =>res.genre_one
                }).catch(err=>console.log(err));
                this.uploadMerchantData(record.merchant_info.name)
            })
        }else{
            this.getCascaderData()  
            this.uploadMerchantData()
        }
    },
    mounted(){
        var toolbar = this.editor.getModule('toolbar');
        toolbar.addHandler('thumbnail', value => {
            if (value) {
                this.$refs.uploader_btn.$el.click()
            } else {
                this.editor.format('thumbnail', false)
            }
        })
        this.$refs.rich_editor.quill.getModule('toolbar').addHandler('image', this.imgHandler); // 为图片ICON绑定事件
    },
    methods: {
        imgHandler(state){
            if(state==true){
                this.type = 1;
                this.dialogTableVisible = true;
            }
        },
        getCascaderData(id,tagIndex){
            if(id||id===0){
                return getAuditCascaderData({superior_id:id,limit:100}).then(res => {
                    this.cascaderOptions[tagIndex].children = res;
                    return Promise.resolve();
                })
            }else{
                return getAuditCascaderData({limit:100}).then(res => {
                    this.cascaderOptions = res;
                    return Promise.resolve();
                })
            }
        },
        onCheckImageClick(tager,checkLength) {  //选择图片
            this.propType++;
            this.type = 0;
            this.clickOrigin = tager
            this.checkLength = checkLength;
            this.dialogTableVisible = true;

        },
        onGenerItemChange(val){
            if(!val[1]&&val[1]!==0){
                let tagIndex = 0;
                this.cascaderOptions.filter(function(item,index){
                    if(item.id == val[0]){
                        tagIndex = index
                        return
                    }
                })
                this.getCascaderData(val[0],tagIndex);
            }
        },
        onBackBtn(){
            this.$router.back();
        },
        onDelImgClick(index){
            this.rulesForm.images.splice(index,1);
        },
        onSaveBtn(){  
            let params = this.getParams,
                isEdit = this.$route.query.record!='-1';
            
            params.genre_one = params.genre[0]
            params.genre_two = params.genre[1];
            params.genre = false;
            params.images = params.images.map(item=>{
                return this.$replaceUrl(item)
            })
            if(params.thumbnail){
                params.thumbnail =this.$replaceUrl(params.thumbnail)
                this.$refs['rulesForm']
                .validate()
                .then(()=>addCommoditylist( this.$filterParams(params,isEdit?{commodity_id:this.$route.query.record.id}:false), isEdit))
                .then(res => {
                    this.$message.success('操作成功!');
                    this.$router.back();
                }).catch(err=>{console.log(err)})
            }else{
                this.$message.warning('请选择商品略缩图!')
            }
        },
        onCancelBtn(){
            this.$router.back();
        },
        onCheckChange(){
            let data = this.$refs['resources'].api_getcheckItem();
            if (this.type == 1) {
                if (data != null && data.length) {
                // 将文件上传后的URL地址插入到编辑器文本中
                let value = data[0].url;
                let length = this.$refs.rich_editor.quill.getSelection().index;
                this.$refs.rich_editor.quill.insertEmbed(length, "image", value); // 调用编辑器的 insertEmbed 方法，插入URL
                this.$refs.rich_editor.quill.setSelection(length + 1);
                } else {
                this.$message.error(`图片插入失败`);
                }
            } else {
                switch (this.clickOrigin) {
                    case 'thumbnail':
                        this.rulesForm.thumbnail = this.$replaceUrl(data[0].url);
                        break;
                    case 'images':
                        let imgs = data.map(item=>{
                            return this.$replaceUrl(item.url);
                        })
                        this.rulesForm.images = this.rulesForm.images.concat(imgs);
                        break
                }
            }
            this.dialogTableVisible=false;
        },
        onClose(){
            this.$refs['resources'].api_clearCheck();
        },
        uploadMerchantData(query){
            let params = this.$filterParams({name:query,limit:10,page:1})
            getMerchantData(params).then(res=>{
                this.merchantData = res.items;
            }).catch(err=>console.log(err))
        },
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
