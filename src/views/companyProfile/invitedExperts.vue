<template>
  <div class="ad-box">
    <div class="top">
      <el-form
        :model="ruleForm"
        :inline="true"
        ref="ruleForm"
        label-width="75px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题:">
            <el-input v-model="ruleForm.title" @input="clearInput" @clear="clearTabel" clearable></el-input>
        </el-form-item>
        <el-form-item label="显示:">
            <el-switch v-model="ruleForm.release" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="">
          <el-button style="margin-left:20px;" type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
        <el-button @click="delBtn(1)">删除</el-button>
        <el-button @click="delBtn(2)" plain type="primary">添加专家</el-button>
        <el-table
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
              prop="introduction"
              label="简介"
              min-width="250">
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
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        num:1,
        ruleForm: {
            title: '',
            release:'',
        },
        currentPage: 1,
        tableHeight: { height: '' },
        tableData: [],
        selectionTab:[]
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
      this.getData();    
    },
    clearTabel(){
      this.getData();
    },
    clearInput(){
      if(this.ruleForm.title==''){
        this.getData();
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData(){
      let dataParams = {};
      this.ruleForm.title?dataParams.keyword = this.ruleForm.title:'';
      this.ruleForm.release.toString()?dataParams.release = this.ruleForm.release:'';
      dataParams.page = this.currentPage;
      this.axios.get(`expert/list/`,{params:dataParams}).then(res=>{
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
            this.axios.delete(`expert/delete/`,{params:{expert_ids:seleteId.join(',')}}).then(res=>{
                this.$message.success('删除成功');
                this.getData();
                this.selectionTab = [];
            })
          }else{
            this.$message.error('请先选择广告类型');
          }
        }else{
          this.$router.push({
              path: `/companyProfile/invitedExperts/experts/-1`,
          })
        }
    },
    edit(row){
      this.$router.push({
        path: `/companyProfile/invitedExperts/experts/${row.id}`,
      })
    },
    checkTable(selection){
      this.selectionTab = selection;
    },
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
}
</style>

