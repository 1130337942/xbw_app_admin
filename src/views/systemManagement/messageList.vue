<template>
  <div class="ad-box">
    <div class="top">
      <el-form
        :model="ruleForm"
        :inline="true"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm">
        <el-form-item label="留言时间:">
            <el-date-picker
              @change="changeTime"
              v-model="ruleForm.time"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
        <el-button class="red-btn" @click="del">删除</el-button>
        <el-table
          size="medium"
          @selection-change="checkTable"
          :height="tableHeight.height"
          :data="tableData.items"
          style="width: 100%;margin-top:10px;">
          <el-table-column
              align="center"
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="name"
              label="姓名"
              min-width="180">
          </el-table-column>
          <el-table-column
              prop="email"
              label="邮箱"
              min-width="180">
          </el-table-column>
          <el-table-column
              prop="phone"
              label="电话"
              min-width="180">
          </el-table-column>
          <el-table-column
              prop="create_time"
              label="留言时间"
              min-width="180">
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100">
              <template slot-scope="scope">
                <el-button plain  type="primary" icon="el-icon-edit" @click="look(scope.row)">查看</el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-dialog title="留言内容" :visible.sync="dialogTableVisible" @closed="diaClose">
          <div class="mess-cntent">{{content}}</div>
        </el-dialog>
        <el-pagination
            style="margin-top:5px;"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="tableData.total">
        </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        time: '',
      },
      currentPage: 1,
      tableHeight: { height: '' },
      tableData: [],
      selectionTab:[],
      dialogTableVisible:false,
      content:''
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
      if(this.ruleForm.time==''||this.ruleForm.time==null){
        this.$message.error('请先输入条件');
      }else{
        this.getData();
      }
    },
    changeTime(){
      this.ruleForm.time==null?this.getData():'';
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    del(){
      if(this.selectionTab.length>0){
        let seleteId = [];
        for(const item of this.selectionTab){
            seleteId.push(item.id);
        }
        this.axios.delete(`system/message/delete/`,{params:{message_ids:seleteId.join(',')}}).then(res=>{
            this.$message.success('删除成功');
            this.getData();
            this.selectionTab = [];
        })
      }else{
        this.$message.error('请先选择留言');
      }
    },
    getData(){
      let dataParams = {};
      dataParams.page = this.currentPage;
      this.ruleForm.time?dataParams.start_time = this.ruleForm.time[0]:'';
      this.ruleForm.time?dataParams.end_time = this.ruleForm.time[1]:'';
      this.axios.get(`system/message/list/`,{params:dataParams}).then(res=>{
        this.tableData = res;
      })
    },
    checkTable(selection){
      this.selectionTab = selection;
    },
    look(row){
      if(row.content){
        this.content = row.content;
        this.dialogTableVisible = true;
      }else{
        this.$message.error('暂无留言内容');
      }    
    },
    diaClose(){
      this.content = '';
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
    .mess-cntent{
      padding: 10px 10px;
    }
}
/deep/ .el-input {
  width: 250px;
}
.el-textarea {
  width: 250px;
}
</style>

