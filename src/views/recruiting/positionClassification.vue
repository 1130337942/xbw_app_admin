<template>
  <div class="ad-box">
    <div class="table-box">
        <el-table
            :height="tableHeight.height"
            :data="tableData.items"
            style="width: 100%;margin-top:10px">
            <el-table-column
                prop="id"
                label="ID"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                min-width="500">
            </el-table-column>
            <el-table-column
                prop="click"
                label="其他说明"
                min-width="100">
            </el-table-column>
            <el-table-column label="操作" align="left" min-width="180px">
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
        <el-dialog class="dia" title="修改分类" :visible.sync="dialogFormVisible" width="500px" @closed="diaClose">
            <el-form :model="dialogForm" label-width="100px" ref="dialogForm" :rules="rules">
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="其他说明:">
                    <el-input autosize type="textarea" v-model="dialogForm.describe" autocomplete="off"></el-input>
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
        dialogFormVisible:false,
        dialogForm:{
            name:'',
            describe:''
        },
        selectionTab:[],
        rules:{
            name: [
                { required: true, message: '请输入分类名称', trigger: 'blur' },
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
            this.dialogFormVisible = true;
        })     
    },
    diaClose(){
        this.$refs.dialogForm.resetFields();
        this.dialogForm.name = '';
        this.dialogForm.describe = '';
        this.getData();
    },
    addOrEdit(){
        let dataParams = {};
        dataParams.name = this.dialogForm.name;
        dataParams.link = this.dialogForm.link;
        this.$refs.dialogForm.validate((valid) => {
            if (valid) {
                dataParams.link_id = this.link_id;
                this.axios.post(`system/links/edit/`,dataParams).then(res=>{
                    this.$message.success('修改成功');
                    this.dialogFormVisible = false;
                })            
            } 
        });
    },
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

.el-textarea {
  width: 250px;
}
</style>

