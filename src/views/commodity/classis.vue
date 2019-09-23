<template>
    <div class="panelBox">
        <div class="top">
            <el-form 
                :model="ruleForm"
                :inline="true"
                ref="ruleForm"
                label-width="75px"
                class="demo-ruleForm"
                @submit.native.prevent
            >
                <el-row>
                <el-col :span="12">
                    <el-form-item label="分类名称:" style="margin:10px;" prop="name">
                        <el-input @clear="onSearchClick" clearable v-model="ruleForm.name"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-form-item style="margin-top: 10px;">
                <el-button icon="el-icon-search" native-type="submit" style="margin-left: 75px;" type="primary" @click="onSearchClick">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-box">
            <el-button @click="onDelBtn" plain type="danger">删除分类</el-button>
            <el-button @click="onAddBtn" plain type="primary">添加分类</el-button>
            <el-table
                row-key="id"
                size="medium"
                :row-class-name="rowClassName"
                :data="tableData.items" 
                @selection-change="onSelectionChange" 
                v-loading="tableLoading"
                :height="tableHeight.height"
                style="width: 100%;margin-top:10px;"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="分类名称" prop="name" min-width="200px">
                    <!-- <template slot-scope="scope">
                        <el-table
                            row-key="id"
                            size="medium"
                            :row-class-name="rowClassName"
                            :data="scope.row.children" 
                            @selection-change="onSelectionChange" 
                            v-loading="tableLoading"
                            :height="tableHeight.height"
                            style="width: 100%;margin-top:10px;"
                        >
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column label="分类名称" prop="name" min-width="200px"></el-table-column>
                            <el-table-column label="分类图片" min-width="200px">
                                <template slot-scope="scope" min-width="200px">
                                    <el-image
                                        :src="domain+''+scope.row.icon+'?x-oss-process=image/resize,m_fill,h_100,w_100'"
                                        fit="scale-down"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="创建时间" prop="create_time"></el-table-column>
                            <el-table-column label="操作" min-width="200px" fixed="right">
                                <template slot-scope="scope">
                                    <el-button plain type="primary" icon="el-icon-edit" @click="onEditBtn(scope.row)">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>  
                    </template> -->
                </el-table-column>
                <el-table-column label="分类图片" min-width="200px">
                    <template slot-scope="scope" min-width="200px">
                        <el-image
                            :src="domain+''+scope.row.icon+'?x-oss-process=image/resize,m_fill,h_100,w_100'"
                            fit="scale-down"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="操作" min-width="200px" fixed="right">
                    <template slot-scope="scope">
                         <el-button plain type="primary" icon="el-icon-edit" @click="onEditBtn(scope.row)">修改</el-button>
                         <!-- <el-button v-if="!scope.row.superior_id&&scope.row.superior_id!==0" plain type="success" icon="el-icon-circle-plus-outline" @click="onEditBtn(scope.row)">添加</el-button> -->
                    </template>
                </el-table-column>
            </el-table>  
            <div class="textCenter">
                <el-pagination
                    style="margin-top:5px;"
                    @size-change="onLimitSizeChange"
                    @current-change="onCurrentChange"
                    :current-page.sync="page"
                    :page-size="limit"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"                   
                    :total="tableData.total"
                ></el-pagination>    
            </div> 
            <el-dialog 
                :title="dialog.title"
                :visible.sync="dialog.visible"
                @close="onDialogClose"
                width="40%"
            >
                <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="80px" style="margin:10px;" class="dialog_upload">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialogForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="别称" prop="stage_name">
                        <el-input v-model="dialogForm.stage_name"></el-input>
                    </el-form-item>
                    <el-form-item label="类型图标" prop="icon">
                        <!-- <el-input v-model="dialogForm.icon"></el-input> -->
                        <div class="imageCon" @click.stop="onCheckImageClick('images')">
                            <el-image
                                v-if="dialogForm.icon"
                                style="width: 120px; height: 120px"
                                :src="domain+dialogForm.icon+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
                                fit="scale-down"
                            ></el-image>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                        <span style="color:#F56C6C">建议尺寸1:1</span>
                    </el-form-item>
                    <el-form-item v-if="!dialog.isEdit" label="所属父类" prop="superior_id">
                        <el-select v-model="dialogForm.superior_id">
                            <el-option
                                v-for="item in tableData.items"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialog.visible = false">取 消</el-button>
                    <el-button type="primary" @click="onDialogSaveClick">确 定</el-button>
                </span>
                <el-dialog title="图片资源" :visible.sync="dialogTableVisible" @close="onClose"  append-to-body>
                    <resources 
                        ref="resources" 
                        :checkLength="1"
                    />
                    <div class="dialog-footer" slot="footer">
                        <el-button @click="dialogTableVisible=false">取消</el-button>
                        <el-button @click="onCheckChange" type="primary">确定</el-button>
                    </div>
                </el-dialog>
            </el-dialog>
        </div>
    </div>
</template>

<script>
// import Upload from '../../components/upload'
import resources from '@/components/resources';
import { getClassisData , saveClassisData , delClassisData } from '@/api/commodity'
export default {
    name:'commodity_classis',
    components:{
        resources
    },
    data (){
        return {
            ruleForm: {
                name:'',
                stage_name:'',
            },
            tableData:{
                items:[],
                total:0
            },
            page:1,
            limit:10,
            tableLoading:false,
            tableHeight:{height:'0px'},
            
            dialog:{
                title:'添加',
                visible:false,
            },
            dialogRules:{
                name:[{ required: true, message: '请填写分类名称', trigger: 'blur' }],
                icon:[{ required: true, message: '请输入类型图标', trigger: 'blur' }],
            },
            dialogForm:{
                name:'',
                icon:'',
                superior_id:'',
            },
            selectArr:[],
            propType: 2,
            imgList: [],
            type: 0, //0头像上传 1富文本上传
            dialogTableVisible:false,

            isCreate:false
        }
    },
    computed:{
        getParams(){
            let params = {
                page:1,
                limit:10,
            }
            this.ruleForm.name?params.name=this.ruleForm.name:null;
            return params
        },
        domain(){
            return this.$domainUrl();
        }
    },
    created(){
        this.tableHeight.height = window.innerHeight - 330 + "px";
        this.getData();
        this.isCreate = true;
    },
    activated(){
        console.log('activated');
        this.isCreate?this.getData():null;
    },
    methods: {
        onSearchClick(){
            this.page = 1;
            this.getData();
        },
        onAddBtn(){
            this.dialog = {
                title:'添加板块/栏目',
                visible:true,
            }
        },
        onEditBtn(record){
            this.dialog = {
                title:'编辑板块/栏目',
                visible:true,
                isEdit:true,
                genre_id:record.id,
            }
            this.dialogForm={
                name:record.name,
                icon:record.icon,
                stage_name:record.stage_name
            }
        },
        onDelBtn(){
            if(this.selectArr.length>0){
                let ids = this.selectArr.map(function(item){
                    return item.id
                })
                delClassisData({genre_ids:ids.join(',')})
                    .then(res => {
                        this.page = 1;
                        this.getData();
                        this.$message.success('删除成功!')
                    }).catch(()=>{})
            }else{
                this.$message.warning('请选择需要删除的分类!')
            }
        },
        onSelectionChange(select){
            this.selectArr = select;
        },
        onLimitSizeChange(val){
            this.limit = val
            this.getData();
        },
        onCurrentChange(){
            this.getData();
        },
        onDialogSaveClick(){
            this.$refs['dialogForm'].validate()
                .then(()=> {
                    let params = this.$filterParams(this.dialogForm, this.dialog.isEdit ? {genre_id:this.dialog.genre_id} : undefined)
                    return saveClassisData(params,this.dialog.isEdit) 
                })
                .then(res => {
                    this.dialog.visible = false;
                    this.getData();
                    this.$message.success('保存成功!')
                })
                .catch((err)=>{ console.log(err)})
            //
        },
        onDialogClose(){
            this.dialogForm={
                name:'',
                icon:'',
                stage_name:'',
                superior_id:'',
            }
            this.$refs['dialogForm'].clearValidate();
        },
        rowClassName({row,rowIndex}){  //table 样式
            if(row.superior_id!==null&&row.superior_id!==undefined){
                return 'tabelChildren'
            }else {
                return 'tabelParent'
            }
        },
        getData(){
            this.tableLoading = true
            getClassisData(this.getParams).then(res => {
                this.tableData = {
                    items:res.items,
                    total:res.total,
                }
                this.tableLoading = false;
            }).catch(()=>{this.tableLoading=true})
        },
        onCheckImageClick(type){
            this.type = 0;
            // this.ruleForm.imageUrl?this.imgList.push(this.ruleForm.imageUrl):'';
            this.clickOrigin = type
            this.dialogTableVisible = true;
        },
        onCheckChange(){
            let data = this.$refs['resources'].api_getcheckItem();
            this.dialogForm.icon = this.$replaceUrl(data[0].url);
            this.dialogTableVisible=false;
        },
        onClose(){
            this.$refs['resources'].api_clearCheck();
        },
        // onUpload(item) {
        //     console.log(item);
        //     if (item.type == 1) {
        //         if (item.url != null && item.url.length > 0) {
        //         // 将文件上传后的URL地址插入到编辑器文本中
        //         let value = item.url;
        //         value = value.indexOf("http") !== -1 ? value : "http:" + value;
        //         let length = this.$refs.rich_editor.quill.getSelection().index;
        //         this.$refs.rich_editor.quill.insertEmbed(length, "image", value); // 调用编辑器的 insertEmbed 方法，插入URL
        //         this.$refs.rich_editor.quill.setSelection(length + 1);
        //         } else {
        //         this.$message.error(`图片插入失败`);
        //         }
        //     } else {
        //         this.dialogForm.icon = this.$replaceUrl(item.url);
        //     }
        //     this.dialogTableVisible = false;  
        //     this.imgList = [];
        // },
    }

}
</script>

<style lang="scss">
    @import '../../assets/css/searchAndTabel.scss';
    .dialog_upload {
        .imageCon {
            vertical-align: middle;
            margin-right: 8px;
            margin-bottom: 8px;
            width: 121px;
            height: 120px;
            border: 1px dashed #c0ccda;
            cursor: pointer;
        }
        .imageCon .hidden{display: none;}
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 120px;
          height: 120px;
          line-height: 120px;
          text-align: center;
        }
    }
    .panelBox .el-table__body-wrapper {
        overflow-y: auto !important;
    }
</style>
