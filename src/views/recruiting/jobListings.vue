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
        <el-form-item label="岗位名称:" class="form-box">
            <el-input v-model="ruleForm.name" @input="clearInput" @clear="clearTabel" clearable></el-input>
        </el-form-item>
        <el-form-item label="显示:" class="form-box">
            <el-switch   v-model="ruleForm.release" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="职位分类:" class="form-box">
            <el-select v-model="ruleForm.genre"  placeholder="请选择">
                <el-option label="猎头招聘" value="猎头招聘"></el-option>
                <el-option label="社会招聘" value="社会招聘"></el-option>
                <el-option label="校园招聘" value="校园招聘"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="发布时间:" class="form-box">
            <el-date-picker
                @change="clearPick"
                v-model="ruleForm.time"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item class="form-box">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
        <el-button @click="delBtn(1)">删除</el-button>
        <el-button @click="delBtn(2)" plain type="primary">添加职位</el-button>
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
                label="招聘职位"
                min-width="100">
            </el-table-column>
            <el-table-column
                label="显示"
                min-width="80">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.release"   :active-value="1"  :inactive-value="0"  disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="发布时间"
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
            release:'',
            genre:'',
            time:'',
            according:''
        },
        currentPage: 1,
        tableHeight: { height: '' },
        tableData: [],
        selectionTab:[],
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
      if(this.ruleForm.name==''){
        this.getData();
      }
    },
    clearPick(){
        if(this.ruleForm.time==''||this.ruleForm.time==null){
            this.getData();
        }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData(){
        let dataParams = {};
        this.ruleForm.name?dataParams.keyword = this.ruleForm.name:'';
        dataParams.page = this.currentPage;
        this.ruleForm.release.toString()?dataParams.release = this.ruleForm.release:'';
        this.ruleForm.genre?dataParams.genre = this.ruleForm.genre:'';
        this.ruleForm.time?dataParams.start_time = this.ruleForm.time[0]:'';
        this.ruleForm.time?dataParams.end_time = this.ruleForm.time[1]:'';
        this.axios.get(`position/list/`,{params:dataParams}).then(res=>{
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
                this.axios.delete(`position/delete/`,{params:{position_ids:seleteId.join(',')}}).then(res=>{
                    this.$message.success('删除成功');
                    this.getData();
                    this.selectionTab = [];
                })
            }else{
                this.$message.error('请先选择职位');
            }
        }else{
            this.$router.push({
                path: `/recruiting/jobListings/addOrEdit/-1`,
            })
        }
    },
    edit(row){
        this.$router.push({
            path: `/recruiting/jobListings/addOrEdit/${row.id}`,
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
        padding: 20px;
        background-color: #fff;
        height: 100px;
        display: flex;
        align-items: center;
        .el-form-item{
            margin-bottom: 0px !important;
        }
        .el-form--inline{
            margin-bottom: 10px;
        }
    }
    .table-box{
        margin-top: 10px;
        background-color: #fff;
        padding: 20px;
    }
    .form-box{
        margin-top: 10px;
    }
}
</style>

