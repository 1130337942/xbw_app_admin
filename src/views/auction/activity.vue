<template>
    <div class="panelBox">
        <div class="table-box">
            <el-button type="primary" icon="el-icon-circle-plus-outline" plain @click="onAddClick">新增拍卖专场</el-button>
            <div class="backImg" @click="onBackClick"></div>
            <div class="table-Button-right" style="margin-right:30px;">
                <refreshBtn type="info" :btnDisabled.sync="tableLoading" size="medium" :circle="true" @onClick="onResetClick"/>
            </div>
            <el-table 
                size="medium"
                :height="tableHeight"
                :data="tableData.items"
                v-loading="tableLoading"
            >
                <el-table-column prop="name" label="名称" min-width="100px"></el-table-column>
                <el-table-column label="开始时间" prop="start_time" min-width="150px"></el-table-column>
                <el-table-column label="结束时间" prop="end_time" min-width="150px"></el-table-column>
                <el-table-column label="排序" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort" controls-position="right" :min="0" :disabled="tableLoading" @change="onSwitchChange(scope.row,'sort')"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="是否显示" min-width="80px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.display" :active-value="1" :inactive-value="0" :disabled="tableLoading" @change="onSwitchChange(scope.row,'display')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="是否置顶" min-width="80px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.top" :active-value="1" :inactive-value="0" :disabled="tableLoading" @change="onSwitchChange(scope.row,'top')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="是否正在调整" min-width="80px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.fettle" :active-value="1" :inactive-value="0" :disabled="tableLoading" @change="onSwitchChange(scope.row,'fettle')"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" plain @click="onEditClick(scope.row)">编辑</el-button>
                        <el-button type="success" plain @click="onGoodsClick(scope.row)">拍品<i class="el-icon-arrow-right"></i></el-button>
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

        <el-dialog title="专场管理" :visible.sync="dialogVisit" width="80%" @close="onClose">
            <el-form 
                class="tableDialogForm"
                ref="dialogForm"
                :model="dialogForm"
                :rules="rules"
                label-width="110px"  
                label-position="top"  
            >
                <el-form-item prop="name" label="拍卖会名:" >
                    <el-input v-model="dialogForm.name" :maxlength="24">
                        <span slot="suffix">{{dialogForm.name.length||0}}/24</span>
                    </el-input>
                </el-form-item>
                <el-form-item prop="commission" label="拍卖会佣金:" >
                    <el-input-number v-model="dialogForm.commission" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item prop="introduction" label="拍卖会介绍:" >
                    <el-input type="textarea" :autosize="true" v-model="dialogForm.introduction" :maxlength="500"></el-input>
                </el-form-item>
                <el-form-item prop="delay_minute" label="延时时间:" >
                    <el-input-number v-model="dialogForm.delay_minute" controls-position="right" :min="0" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item prop="time" label="拍卖会起始时间:" label-width="130px">
                    <el-date-picker
                        v-model="dialogForm.time"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        unlink-panels
                    >
                    </el-date-picker>
                    <!-- :picker-options="pickerOptions" -->
                </el-form-item>
                <el-form-item prop="template_code" label="app端模板名:" >
                    <div style="padding-bottom:10px;">
                        <el-button plain type="primary" round @click="oncheckTempClick('special')">专场拍</el-button>
                        <el-button plain type="success" round @click="oncheckTempClick('synchronous')">同步拍</el-button>
                        <el-button plain type="info" round @click="oncheckTempClick('daily')">每日拍</el-button>
                    </div>
                    <el-row>
                        <el-col :span="14">
                            <el-input 
                                v-model="dialogForm.template_code" 
                                :prefix-icon="inEditing?'el-icon-edit':''"
                                :readonly="!inEditing"
                                :maxlength="inEditing?17:30"
                                ref="templateInput"
                            >
                                <span slot="suffix">
                                    {{ (inEditing&&dialogForm.template_code)?'_'+timing:'' }}
                                    <span style="margin-left:10px">{{dialogForm.template_code.length||0}} / {{inEditing?17:30}}</span>
                                </span>
                            </el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button v-show="!inEditing" type="primary" icon="el-icon-edit" style="margin-left:10px" @click="onEditTemplateClick">编辑</el-button>
                            <el-button v-show="inEditing" type="success" icon="el-icon-check" style="margin-left:10px" @click="onSaveTemplateClick">保存</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="footer">
                <el-button type="danger" @click="dialogVisit=false">取消</el-button>
                <el-button type="primary" :loading="isSubmiting" :disabled="isSubmiting||inEditing" @click="onSaveClick">确定</el-button>
            </div>
        </el-dialog>    
    </div>
</template>
<script>
import { getActivityList , editActivityStatus , saveActivityData } from '@/api/auction'
import refreshBtn from '@/components/refreshBtn'
import { debug } from 'util';
import { mapMutations } from 'vuex';
export default {
    name:'auction_activity',
    components:{refreshBtn},
    data(){
        const special = this.$special;
        return {
            organization_id:'',
            tableHeight:'0px',
            tableData:{
                items:[],
                total:0
            },
            page:1,
            limit:10,
            tableLoading:false,

            dialogVisit:false,
            dialogForm:{
                name:'',
                introduction:'',
                commission:'',
                time:[],
                delay_minute:'',
                template_code:'',
            },
            isSubmiting:false,
            rules:{
                name:[{required:true,message:'该项为必填项',trigger:'blur'}],
                introduction:[{required:true,message:'该项为必填项',trigger:'blur'}],
                time:[{required:true,message:'该项为必填项',trigger:'blur'}],
                template_code:[{required:true,message:'该项为必填项',trigger:'blur'}/*,{validator:special,trigger:'blur'}*/],
            },
            nameSearch:[
                { value: "专场拍", template: "special" },
                { value: "同步拍", template: "synchronous" },
                { value: "每日拍", template: "daily" },
            ],
            timing:'',
            inEditing:false
        }
    },
    computed:{
        pickerOptions(){
            function getDayDate(num){
                let time = new Date();
                return time.setTime(time.getTime() + 3600 * 1000 * 24 * num)
            }
            return {
                shortcuts:[{
                    text: '最近一天',
                    onClick(picker) { picker.$emit('pick', [new Date(), getDayDate(1)]);console.log(getDayDate(1)) }
                },{
                    text: '最近两天',
                    onClick(picker) { picker.$emit('pick', [new Date(), getDayDate(2)]);console.log(getDayDate(2)) }
                },{
                    text: '最近三天',
                    onClick(picker) { picker.$emit('pick', [new Date(), getDayDate(3)]);console.log(getDayDate(3)) }
                },{
                    text: '一周',
                    onClick(picker) { picker.$emit('pick', [new Date(), getDayDate(7)]);console.log(getDayDate(7)) }
                }]
            }
        },
        getTime(){
            return new Date().getTime();
        }
    },
    created(){
        this.tableHeight = (window.innerHeight - 230)+'px'
        this.organization_id = this.$route.params.id;
        this.getData();
    },
    methods:{
        onAddClick(){
            this.timing = this.getTime;
            this.dialogVisit = true;
        },
        onResetClick(){
            this.page = 1;
            this.limit = 10;
            this.getData();
        },
        onEditClick(record){
            this.dialogForm = {
                auctions_id:record.id,
                name:record.name,
                introduction:record.introduction,
                commission:record.commission,
                delay_minute:record.delay_minute,
                time:[ record.start_time , record.end_time ],
                template_code:record.template_code,
            };
            this.timing = record.template_code?record.template_code.split('_')[1]:''
            this.dialogVisit = true;
        },
        onSwitchChange(record,target){
            editActivityStatus({
                auctions_id:record.id,
                key:target,
                value:record[target]
            }).
            then(res=>{
                this.$message.success('设置成功');
            })
            .catch(err=>{console.log(err);this.getData()})
        },
        onLimitChange(val){
            this.limit = val;
            this.getData();
        },
        oncheckTempClick(tempText){
            if(this.inEditing){
                this.dialogForm.template_code = tempText;
            }else{
                this.dialogForm.template_code = tempText+ '_' +this.timing;
            }
        },
        onEditTemplateClick(){
            this.inEditing = true;
            this.$refs.templateInput.focus();
            this.dialogForm.template_code = this.dialogForm.template_code.split('_')[0];
        },
        onSaveTemplateClick(){
            this.inEditing = false;
            this.dialogForm.template_code = ( this.dialogForm.template_code ?this.dialogForm.template_code+'_'+this.timing:'');
        },
        onSaveClick(){
            let me = this;
            this.$refs.dialogForm.validate()
            .then(()=>{
                this.isSubmiting = true;
                let { name, introduction, time, template_code , commission , delay_minute} =me.dialogForm;
                let params = {
                    name, introduction, template_code,commission,delay_minute,
                    start_time:time[0],
                    end_time:time[1]
                }
                if(me.dialogForm.auctions_id||me.dialogForm.auctions_id===0) {
                    params.auctions_id=me.dialogForm.auctions_id
                    params.template_code = template_code
                }else{
                    params.organization_id=me.organization_id *1
                    params.template_code = params.template_code;
                }
                params.organization_id=me.organization_id *1
                return saveActivityData(params,me.dialogForm.auctions_id||me.dialogForm.auctions_id===0)
            })
            .then(res=>{
                me.getData();
                me.$message.success('保存成功');
                me.dialogVisit = false;
                me.isSubmiting = false;
            })
            .catch(err=>{console.log(err);me.isSubmiting = false;})
        },
        onClose(){
            this.dialogForm = {
                name:'',
                introduction:'',
                time:[],
                template_code:'',
            }
            this.inEditing = false;
            this.$refs.dialogForm.clearValidate();
        },
        onBackClick(){
            this.$router.back();
        },
        onGoodsClick(record){
            this.$router.push({
                path:`/auction/auctionGoods/${record.id}`
            });
            this.changeTimeFrame([record.start_time,record.end_time]);
        },
        getData(){
            let params = {
                organization_id : this.organization_id,
                page:this.page,
                limit :this.limit
            };
            this.tableLoading = true
            getActivityList(params).then(res=>{
                this.tableData = {
                    items:res.items,
                    total:res.total
                };
                this.tableLoading = false
            }).catch(err=>{console.log(err);this.tableLoading=false})
        },
        ...mapMutations('auction',['changeTimeFrame'])
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>
<style lang="less">
.autocompleteCls li {
    line-height: normal;
    padding: 7px;
    .diaglog_name {
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .dialog_template {    
        font-size: 12px;
        color: #b4b4b4;
    }
}
</style>