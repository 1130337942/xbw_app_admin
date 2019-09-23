<template>
  <div class="ad-box">
    <div class="table-box">
        <el-button @click="onDelBtn(1)" plain type="danger" icon="el-icon-delete" :disabled="selectionTab.length<1">删除</el-button>
        <el-button @click="onAddPlateBtn(2)" plain type="primary" icon="el-icon-circle-plus-outline">添加板块</el-button>
        <el-table
            row-key="id"
            :data="tableData.items"
            @selection-change="onCheckTableChange"
            @cell-click="onCellClick"
            :row-class-name="rowClassName"
            :cell-style="cellStyle"
            style="width: 100%;margin-top:10px;"
            v-loading="loading"
            size="medium"
        ><!--:height="tableHeight.height"-->
            <el-table-column
                align="center"
                type="selection"
                width="55"
            ></el-table-column>
            <el-table-column prop="name" label="板块名称" min-width="180" align="center"></el-table-column>
            <el-table-column prop="id" label="板块ID" min-width="180" align="center"></el-table-column>
            <el-table-column prop="carousel_num" label="轮播图数量" min-width="180"  align="center"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="180" align="center"></el-table-column>
            <el-table-column label="操作"  min-width="200px">
                <template slot-scope="scope" align="center">
                    <el-button plain  type="success" icon="el-icon-edit" @click="onEditBtn(scope.row)">修改</el-button>
                    <el-button plain  type="primary" icon="el-icon-circle-plus-outline" 
                        @click="onAddColumnBtn(scope.row)"
                        v-if="!scope.row.superior_id&&scope.row.superior_id!==0"
                    >添加栏目</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="textCenter">
            <el-pagination
                @size-change="onSizeChange"
                @current-change="onCurrentChange"
                :current-page="page"
                :page-size="limit"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total"
            ></el-pagination>
        </div>
        <el-dialog 
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            @close="onDialogClose"
            width="50%"
        >
            <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-position="left">
                <el-form-item label="名称" prop="name"> 
                    <el-input v-model="dialogForm.name" :maxlength="16"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark"> 
                    <el-input type="textarea" v-model="dialogForm.remark" :maxlength="255"></el-input>
                </el-form-item>
                <el-form-item label="app模版" prop="template_code"> 
                    <el-input v-model="dialogForm.template_code" :maxlength="30"></el-input>
                </el-form-item>
                <!-- <el-form-item label="图标" prop="icon"> 
                    <el-input v-model="dialogForm.icon"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSaveBtn(dialogType.type==='edit',dialogType.column_id)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { getSlidesData , saveSlidesData , delSlidesData } from '@/api/slides';
import { debug } from 'util';
export default {
    name:'slides',
    data () {
        return {
        num:1,
        page: 1,
        limit:10,
        dt: '',
        tableHeight: { height: '' },
        tableData: {
            items:[],
            total:0
        },
        loading:false,
        selectionTab:[],

        dialogType:{
            title:'plate',
            type:'add',
            column_id:''
        },
        dialogForm:{
            superior_id :'',
            name :'',
            icon :'',
            remark:'',
            template_code:''
        },
        dialogRules:{
            name:[{required: true, message: '该项为必填项', trigger: 'blur' }]
        },
        dialogVisible:false,

        carouselList:[],
        carouselsec:0
        }
    },
    computed: {
        dialogTitle(){
            return (this.dialogType.type==='edit'?'编辑':'添加') + (this.dialogType.title==='plate'?'板块':'栏目');
        },
        isAddColumn(){
            return this.dialogType.title!=='plate'&&this.dialogType.type!=='edit';
        },
        getDialogFormData(){  //获取dialogForm数据 
            let ret = {};
            for(let i in this.dialogForm){
                this.dialogForm[i]||this.dialogForm[i]===0?ret[i]=this.dialogForm[i]:null;
            }
            return ret
        }
    },
    created () {
        this.tableHeight.height = window.innerHeight - 230 + 'px';
        this.getData();
    },
    methods: {
        getData(){
          let dataParams = {
              page : this.page,
              limit : this.limit,
          };
          this.loading = true;
          getSlidesData(dataParams).then(res => {
            this.tableData = {
                items:res.items,
                total:res.total
            };
            this.loading = false;    
          }).catch(()=>{console.log('promise.warn!!')})
        },
        onSizeChange(val) {
          this.limit = val;
          this.getData();
        },
        onCurrentChange(val) {
          this.page = val;
          this.getData();
        },

        onAddPlateBtn(){ //添加 板块
            this.dialogType={
                title:'plate',
                type:'add'
            }
            this.dialogVisible = true;
        },
        onAddColumnBtn(record){ //添加 栏目
            this.dialogType={
                title:'column',
                type:'add',
                column_id:record.id
            }
            this.dialogVisible = true;
        },
        onDelBtn(){
            let columnIds = this.selectionTab.map(function(item){
                return item.id
            });
            if(columnIds.length){
                delSlidesData({ column_ids:columnIds.join(',') }).then(res => {
                    this.$message.success('删除成功!');
                    this.getData();
                }).catch(()=>{console.log('promise.warn!!')})
            }else{
                this.$message.warning('请选择需要删除的 栏目/板块 !')
            }
        },
        onEditBtn(record){
            this.dialogType={
                title:record.superior_id||record.superior_id===0?'column':'plate',
                type:'edit',
                column_id:record.id
            }
            this.dialogForm = {
                superior_id :'',
                name :record.name,
                icon :record.icon,
                remark :record.remark,
                template_code :record.template_code?record.template_code:'',
            }
            this.dialogVisible = true;
        },
        onCheckTableChange(selection){
            this.selectionTab = selection;
        },
        imgClick(item){
            if(item.link){
            window.open(item.link)
            }
        },
        rowClassName({row,rowIndex}){  //table 样式
            if(row.superior_id!==null&&row.superior_id!==undefined){
                return 'tabelChildren'
            }else {
                return 'tabelParent'
            }
        },
        onSaveBtn(isEdit,columnId){
            let params = this.getDialogFormData;
            isEdit?params.column_id= columnId:null;
            !isEdit&&this.dialogType.title==='column'?params.superior_id= columnId:null;
            this.$refs['dialogForm'].validate()
                .then( () => saveSlidesData(params,isEdit) )
                .then(res => {
                    this.$message.success('保存成功!')
                    this.dialogVisible = false;
                    this.getData();
                }).catch(()=>{console.log('promise.warn!!')})
        },
        onDialogClose(){
            this.dialogForm = {
                superior_id :'',
                name :'',
                icon :'',
            };
            this.$refs['dialogForm'].clearValidate()
        },
        onCellClick(record, column, cell, event){
            if(column.label==='轮播图数量'){
                this.$router.push(
                    {path:`/slideshow/slideshowList/${record.id}`}
                )
            }
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            return column.label =='轮播图数量'?'cursor:pointer;color:#0079ef' :'';
            
        },
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/css/searchAndTabel.scss';
    .el-table {
        .tabelChildren {background: #333333 !important;}
    }
</style>

