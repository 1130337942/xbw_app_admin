<template>
  <div class="ad-box">
    <div class="table-box">
        <el-button @click="delBtn(1)" class="red-btn">删除</el-button>
        <el-button @click="delBtn(2)" plain type="primary">添加链接</el-button>
        <el-table
            @selection-change="checkTable"
            :height="tableHeight.height"
            :data="tableData.items"
            style="width: 100%;margin-top:10px">
            <el-table-column
                align="center"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="id"
                label="ID"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                min-width="180">
            </el-table-column>
            <el-table-column
                prop="click"
                label="点击次数"
                min-width="100">
            </el-table-column>
            <el-table-column
                label="显示"
                min-width="120">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.release"   :active-value="1" :inactive-value="0"  disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序"
                min-width="80">
            </el-table-column>
            <el-table-column label="操作" align="left" min-width="180px">
                <template slot-scope="scope">
                    <el-button plain  type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top:5px;"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="tableData.total">
        </el-pagination>
        <el-dialog class="dia" :title="dialogFormVisibleTitle" :visible.sync="dialogFormVisible" width="500px" @closed="diaClose">
            <el-form :model="dialogForm" label-width="100px" ref="dialogForm" :rules="rules">
                <el-form-item label="名称:" prop="name">
                    <el-input show-word-limit maxlength="255" v-model="dialogForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="网站地址:" prop="link">
                    <el-input show-word-limit maxlength="255" v-model="dialogForm.link" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序:" >
                    <el-input-number @change="swChange(1)" v-model="dialogForm.sort" controls-position="right" :min="0" ></el-input-number>
                </el-form-item>
                <el-form-item label="显示:" >
                    <el-switch @change="swChange(2)" v-model="dialogForm.release" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrEdit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        currentPage: 1,
        tableHeight: { height: '' },
        tableData: [],
        dialogFormVisibleTitle:'添加链接',
        dialogFormVisible:false,
        dialogForm:{
            name:'',
            link:'',
            sort:0,
            release:0
        },
        selectionTab:[],
        rules:{
            name: [
                { required: true, message: '请输入网站名称', trigger: 'blur' },
            ],
            link: [
                { required: true, message: '请输入网站名称', trigger: 'blur' },
            ],
        },
        link_id:''
    }
  },
  watch: {

  },
  created () {
    this.tableHeight.height = window.innerHeight - 220 + 'px';
    this.getData();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData(){
        let dataParams = {};
        dataParams.page = this.currentPage;
        this.axios.get(`system/links/list/`,{params:dataParams}).then(res=>{
          this.tableData = res;
        })
    },
    edit(row){
        this.axios.get(`system/links/info/`,{params:{link_id:row.id}}).then(res=>{
            this.link_id = row.id;
            this.dialogForm.name = res.name;
            this.dialogForm.link = res.link;
            this.dialogForm.sort = res.sort;
            this.dialogForm.release = res.release;
            this.dialogFormVisibleTitle = '修改';
            this.dialogFormVisible = true;
        })     
    },
    delBtn(i){
        // 1删除  2添加
        if(i==1){
            if(this.selectionTab.length>0){
                let seleteId = [];
                for(const item of this.selectionTab){
                    seleteId.push(item.id);
                }
                this.axios.delete(`system/links/delete/`,{params:{link_ids:seleteId.join(',')}}).then(res=>{
                    this.$message.success('删除成功');
                    this.getData();
                    this.selectionTab = [];
                })
            }else{
                this.$message.error('请先选择链接');
            }
        }else{
            this.dialogFormVisible = true;
        }
    },
    diaClose(){
        this.$refs.dialogForm.resetFields();
        this.dialogFormVisibleTitle = '添加链接';
        this.dialogForm.name = '';
        this.dialogForm.link = '';
        this.dialogForm.sort = '';
        this.dialogForm.release = 0;
        this.getData();
    },
    addOrEdit(){
        let dataParams = {};
        dataParams.name = this.dialogForm.name;
        dataParams.link = this.dialogForm.link;
        dataParams.sort = this.dialogForm.sort;
        dataParams.release = this.dialogForm.release;
        this.$refs.dialogForm.validate((valid) => {
            if (valid) {
                if(this.dialogFormVisibleTitle=='添加链接'){
                    this.axios.post(`system/links/add/`,dataParams).then(res=>{
                        this.$message.success('添加成功');                       
                        this.dialogFormVisible = false;
                    })
                }else{
                    dataParams.link_id = this.link_id;
                    this.axios.post(`system/links/edit/`,dataParams).then(res=>{
                        this.$message.success('修改成功');
                        this.dialogFormVisible = false;
                    })
                }
                
            } 
        });
    },
    checkTable(selection){
      this.selectionTab = selection;
    },
    swChange(i){
        if(this.link_id){
            this.axios.post(`system/links/status/edit/`,{link_id:this.link_id,key:i==1?'sort':'release',value:i==1?this.dialogForm.sort:this.dialogForm.release}).then(res=>{
                this.$message.success('修改成功');
            })          
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.ad-box{
    height: 100%;
    .table-box{
        background-color: #fff;
        padding: 20px;
    }
}
.el-input {
  width: 250px;
}
.dia{
    .el-input-number{
        width: 250px;
    }
}
/deep/ .el-input__count{
    height: 24px;
    line-height: 24px;
    bottom: 2px;
}
.el-textarea {
  width: 250px;
}
</style>

