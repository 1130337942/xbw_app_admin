<template>
    <div class="panelBox">
        <div class="table-box">
            <el-button type="primary" icon="el-icon-circle-plus-outline" plain @click="onAddClick">新增机构</el-button>
            <div class="table-Button-right">
                <refreshBtn type="info" :btnDisabled.sync="tableLoading" size="medium" :circle="true" @onClick="onResetClick"/>
            </div>
            <el-table 
                :data="tableData.items"
                :height="tableHeight"
                size="medium"
                v-loading="tableLoading"
            >
                <el-table-column prop="name" label="机构名称" min-width="200px"></el-table-column>
                <el-table-column label="所在地址" min-width="200px">
                    <template slot-scope="scope">
                        {{ scope.row.province + '-' + scope.row.city }}
                    </template>
                </el-table-column>
                <el-table-column label="是否显示" min-width="80px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.display" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'display')" :disabled="tableLoading">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="是否置顶" min-width="80px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.top" :active-value="1" :inactive-value="0" @change="onSwitchChange(scope.row,'top')" :disabled="tableLoading">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="排序" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort" :min="0" @change="onSwitchChange(scope.row,'sort')" controls-position="right" :disabled="tableLoading">
                        </el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="粉丝数" min-width="140px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.fans" :min="0" @change="onSwitchChange(scope.row,'fans')" controls-position="right" :disabled="tableLoading">
                        </el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" plain @click="onEditClick(scope.row)">编辑</el-button>
                        <el-button type="success" plain @click="onActivityClick(scope.row)">拍卖会场<i class="el-icon-arrow-right"></i></el-button>
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

        
        <el-dialog title="机构详情" :visible.sync="dialogVisit" @close="onClose">
            <el-form 
                :model="dialogForm"
                ref="dialogForm"
                class="tableDialogForm"
                label-width="90px"
                label-position="left"
                :inline="false"
                :rules="rules"
            >
                <el-form-item prop="name" label="机构名称:">
                    <el-input v-model="dialogForm.name" :maxlength="20"><span slot="suffix">{{dialogForm.name.length||0}}/20</span></el-input>
                </el-form-item>
                <el-form-item prop="area" label="机构地址:">
                    <el-cascader
                        v-model="dialogForm.area"
                        :options="getAddress_province_city"
                        @active-item-change="onAddressChange"
                        :props="addressProps"
                    ></el-cascader>
                </el-form-item>
                <el-form-item prop="avatar" label="机构图标:">
                    <div class="imageCon" @click="onCheckImgClick" v-if="!dialogForm.avatar">
                        <i class="imageCon_icon el-icon-plus"></i>
                    </div>
                    <div class="imageCon" @click="onCheckImgClick" v-else>
                        <el-image :src="domain+dialogForm.avatar+'?x-oss-process=image/resize,m_fill,h_120,w_120'" style="width:120px;height:120px;">
                            <div slot="placeholder" class="textCenter"><i class="el-icon-loading"></i></div>
                            <div slot="error"><img :src="require('@/assets/images/load_err.png')"></div>
                        </el-image>
                    </div>
                </el-form-item>
                <el-form-item prop="introduction" label="机构介绍:">
                    <el-input type="textarea" v-model="dialogForm.introduction" :autosize="true" :maxlength="500"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="footer">
                <el-button type="danger" @click="dialogVisit=false">取消</el-button>
                <el-button type="primary" @click="onSaveClick">确定</el-button>
            </div>

            <el-dialog title="图片资源" :visible.sync="resourceVisible" @close="onResourceClose" :append-to-body="true">
                <resources ref="resources" :checkLength="1" />
                <div class="dialog-footer" slot="footer">
                <el-button @click="resourceVisible=false">取消</el-button>
                <el-button @click="onCheckChange" type="primary">确定</el-button>
                </div>
            </el-dialog>
        </el-dialog>
    </div>  
</template>
<script>
import refreshBtn from '@/components/refreshBtn'; 
import { getOriginList , editOriginStatus , saveOriginData } from '@/api/auction'
export default {
    name:'auction_originList',
    components:{refreshBtn},
    data(){
        return {
            tableData:{
                items:[],
                total:0
            },
            tableHeight:'0px',
            tableLoading:false,
            page:1,
            limit:10,
            dialogForm:{
                name:'',
                avatar:'',
                introduction:'',
                area:[]
            },
            rules:{
                name:[{ required: true, message: "该项为必填项", trigger: "blur" }],
                avatar:[{required:true,message:'该项为必填项',trigger:'blur'}],
                introduction:[{required:true,message:'该项为必填项',trigger:'blur'}],
                area:[{required:true,message:'该项为必填项',trigger:'blur'}],
            },
            addressProps: {
                label:'name',
                value: 'id',
                children: 'children'
            },
            dialogVisit:false,
            resourceVisible:false
        }
    },
    computed:{
        domain(){
            return this.$domainUrl();
        },
        getAddress_province_city(){
            return this.$store.state.address_province_city;
        }
    },
    created(){
        this.tableHeight = (window.innerHeight - 220 ) + 'px';
        this.getData();
    },
    methods: {
        onAddressChange(val){
            if(val.length == 1){
                this.$store.dispatch('uploadCtiy_two',{provinceId:val[0],callback(d){
                    console.log(d);
                }});
            }
        },
        onAddClick(){
            this.dialogVisit = true;
        },
        onResetClick(){
            this.page = 1;
            this.limit = 10;
            this.getData();
        },
        onEditClick(record){
            this.dialogForm = {
                id:record.id,
                name:record.name,
                avatar:record.avatar,
                introduction:record.introduction,
                area:[record.province_id,record.city_id],
            };
            this.dialogVisit = true;
        },
        onActivityClick(record){
            this.$router.push({
                path:`/auction/activity/${record.id}`
            })
        },
        onLimitChange(val){
            this.limit = val;
            this.getData();
        },
        onSwitchChange(record,target){
            editOriginStatus({
                organization_id:record.id,
                key:target,
                value:record[target]
            })
            .then(res=>{
                this.$message.success('修改成功!');
            })
            .catch(err=>{console.log(err);this.getData();})
        },

        onCheckImgClick(){
            this.resourceVisible = true;
        },
        onClose(){
            this.dialogForm = {
                name:'',
                avatar:'',
                introduction:'',
                area:[],
            }
          this.$refs["dialogForm"].clearValidate();
          this.dialogVisit = false;
        },
        onCheckChange(){
            let data = this.$refs["resources"].api_getcheckItem()[0];
            this.dialogForm.avatar = '/'+data.folder_path+data.file_name;
            this.resourceVisible = false;
        },
        onResourceClose(){
            this.$refs["resources"].api_clearCheck();
        },
        onSaveClick(){
            this.$refs.dialogForm.validate()
            .then(()=>{
                let {name,avatar,introduction} = this.dialogForm;
                let params = {
                    name,avatar,introduction,
                    province_id:this.dialogForm.area[0],
                    city_id:this.dialogForm.area[1],
                };
                this.dialogForm.id||this.dialogForm===0?params.organization_id = this.dialogForm.id:null;
                return saveOriginData(params,(this.dialogForm.id||this.dialogForm.id===0))
            })
            .then(res=>{
                this.getData();
                this.$message.success('保存成功');
                this.dialogVisit = false;
            })
            .catch(err=>console.log(err))
        },
        getData(){
            let params={
                page: this.page,
                limit: this.limit,
            }
            this.tableLoading = true;
            getOriginList(params)
            .then(res=>{
                this.tableLoading = false;
                this.tableData = {
                    items:res.items,
                    total:res.total
                }
            })
            .catch(err=>{console.log(err);this.tableLoading=false;})
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>