<template>
  <div class="ad-box">
    <div class="top">
      <el-form
        :model="ruleForm"
        :inline="true"
        ref="ruleForm"
        label-width="75px"
        class="demo-ruleForm">
        <el-form-item label="名称:">
            <el-input v-model="ruleForm.name" @input="clearInput" @clear="clearTabel" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
        <el-button @click="delBtn(1)">删除</el-button>
        <el-button @click="delBtn(2)" plain type="primary">添加分类</el-button>
        <el-table
            :height="tableHeight.height"
            :data="tableData.items"
            @selection-change="checkTable"
            style="width: 100%;margin-top:10px;">
            <el-table-column
                align="center"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                min-width="250">
            </el-table-column>
            <el-table-column
                prop="description"
                label="其他说明"
                min-width="180">
            </el-table-column>
            <el-table-column label="操作"  min-width="120">
                <template slot-scope="scope">
                    <el-button plain  type="primary" icon="el-icon-edit" @click="edit(scope.row)">修改</el-button>
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
        <el-dialog class="dia" :title="dialogFormVisibleTitle" :visible.sync="dialogFormVisible" @closed="diaClose">
          <el-form :rules="rules" :model="dialogForm" ref="dialogForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="名称" prop="name">
              <el-input show-word-limit maxlength="16" v-model="dialogForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="其他说明" >
              <el-input show-word-limit maxlength="255" type="textarea"  :autosize="{ minRows: 4,}" v-model="dialogForm.description" autocomplete="off"></el-input>
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
      num:1,
      ruleForm: {
        name: '',
      },
      dialogForm:{
        name:'',
        description:''
      },
      rules: {
        name: [
          { required: true, message: '名称', trigger: 'blur' },
        ]
      },
      currentPage: 1,
      pageSize:20,
      dt: '',
      tableHeight: { height: '' },
      tableData: [],
      selectionTab:[],
      dialogFormVisibleTitle:'添加分类',
      dialogFormVisible:false,
      genre_id:''
    }
  },
  watch: {

  },
  created () {
    this.tableHeight.height = window.innerHeight - 330 + 'px';
    this.getData();
  },
  methods: {
    search(){
      if(this.ruleForm.name==''){
        this.$message.error('请先输入条件');
      }else{
        this.getData();
      }
    },
    clearTabel(){
      this.getData();
    },
    clearInput(){
      if(this.ruleForm.name==''){
        this.getData();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData(){
      let dataParams = {};
      this.ruleForm.name?dataParams.keyword = this.ruleForm.name:'';
      dataParams.page = this.currentPage;
      this.axios.get(`advertising/genre/list/`,{params:dataParams}).then(res=>{
          this.tableData = res;
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
            this.axios.delete(`advertising/genre/delete/`,{params:{genre_ids:seleteId.join(',')}}).then(res=>{
                this.$message.success('删除成功');
                this.getData();
                this.selectionTab = [];
            })
          }else{
            this.$message.error('请先选择广告类型');
          }
        }else{
          this.dialogFormVisible = true;
        }
    },
    edit(row){
      this.axios.get(`advertising/genre/info/`,{params:{genre_id:row.id}}).then(res=>{
        this.dialogFormVisibleTitle = '修改分类';
        this.dialogForm.name = res.name;
        this.dialogForm.description = res.description;
        this.dialogFormVisible = true;
        this.genre_id = row.id;
      })
    },
    checkTable(selection){
      this.selectionTab = selection;
    },
    addOrEdit(){
      let dataParams = {};
      dataParams.name = this.dialogForm.name;
      this.dialogForm.description?dataParams.description = this.dialogForm.description:'';
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if(this.dialogFormVisibleTitle=='添加分类'){
            this.axios.post(`advertising/genre/add/`,dataParams).then(res=>{
              this.$message.success('添加成功');           
              this.dialogFormVisible = false;
              this.getData();
            })
          }else{
            dataParams.genre_id = this.genre_id;
            this.axios.post(`advertising/genre/edit/`,dataParams).then(res=>{
              this.$message.success('修改成功');           
              this.dialogFormVisible = false;
              this.getData();
            })
          }
        }
      });     
    },
    diaClose(){
      this.$refs.dialogForm.resetFields();
      this.dialogForm.name = '';
      this.dialogForm.description = '';
      this.dialogFormVisibleTitle = '添加分类';
    }
  }
}
</script>

<style lang="scss" scoped>
.ad-box{
    height: 100%;
    .top{
        padding-left: 20px;
        background-color: #fff;
        height: 100px;
        display: flex;
        align-items: center;
        .el-form-item{
            margin-bottom: 0px !important;
        }
    }
    .table-box{
        margin-top: 10px;
        background-color: #fff;
        padding: 20px;
    }
    .dia{
      .el-input{
        width: 300px;
      }
      .el-textarea{
        width: 300px;
      }
      /deep/ .el-input__count{
        height: 24px;
        line-height: 24px;
        bottom: 2px;
      }
    }
}
</style>

