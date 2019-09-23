<template>
<!--  新闻中心 > 板块管理  -->
  <div class="ad-box">

    <div class="top">
      <img @click="back" class="image" src="../../assets/images/back.png">
      <el-form
        :model="ruleForm"
        :inline="true"
        ref="ruleForm"
        label-width="75px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="视频名称:">
              <el-input @input="clearInput" @clear="clearTabel" clearable v-model="ruleForm.title" placeholder="请输入栏目名称"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="是否推荐:">
                <el-switch  v-model="ruleForm.release" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="是否置顶:">
                <el-switch   v-model="ruleForm.top" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-form-item style="margin-top: 10px;">
          <el-button style="margin-left: 75px;" type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-box">
      <el-button @click="onDelBtn" plain type="danger">删除</el-button>
      <el-button @click="onAddBtn" plain type="primary">添加</el-button>
      <el-table
        size="medium"
        v-loading = "tableLoading"
        :height="tableHeight.height"
        :data="tableData.items"
        @selection-change="checkTable"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="视频名称" min-width="100" :formatter="nameFormat"></el-table-column>
        <el-table-column  label="是否推荐" min-width="100">
          <template slot-scope="scope">
            <el-switch @change="changeState(1,scope.row)" v-model="scope.row.recommend" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否置顶" min-width="100">
          <template slot-scope="scope">
            <el-switch @change="changeState(2,scope.row)" v-model="scope.row.top" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" min-width="100">
          <template slot-scope="scope">
            <el-switch @change="changeState(3,scope.row)" v-model="scope.row.release" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" min-width="150">
          <template slot-scope="scope">
            <el-input-number @change="changeState(4,scope.row)" v-model="scope.row.sort" controls-position="right" :min="0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="120"></el-table-column>
        <el-table-column label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" icon="el-icon-edit" @click="onEditBtn(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textCenter">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="limit"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total">
        </el-pagination>
      </div>
      <el-dialog title="视频列表" :visible.sync="dialogTableVisible" width="80%" top="5vh" @closed="diaClose">
        <el-form :model="dialogTableForm" :inline="true" ref="dialogTableForm" label-width="75px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="视频名称:">
                <el-input @input="clearDiaInput" @clear="clearDiaTabel" clearable v-model="dialogTableForm.title" placeholder="请输入栏目名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间:">
                  <el-date-picker
                    v-model="dialogTableForm.time"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="margin-top: 10px;">
            <el-button style="margin-left: 75px;" type="primary" @click="onDiaSearch">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-button @click="onDiaDelBtn" plain type="danger">删除</el-button>
        <el-button @click="onDiaAddBtn" plain type="primary">添加</el-button>
        <el-table size="medium" v-loading = "tableLoading" :height="tableDiaHeight.height" :data="diaData.items" @selection-change="checkDiaTable" style="width: 100%;margin-top:10px;">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="视频编号" min-width="100"></el-table-column>
          <el-table-column prop="title" label="视频名称" min-width="180"></el-table-column>
          <el-table-column prop="seo_title" label="副标题" min-width="180"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" min-width="120"></el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-button plain type="primary" icon="el-icon-edit" @click="onEditDiaBtn(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="textCenter">
          <el-pagination
              @current-change="diaCurrentChange"
              :current-page.sync="diaPage"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="diaData.total">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="addColumnVideo">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getNewsList,getColumnList } from '@/api/videoManagement'
export default {
  data() {
    return {
        ruleForm: {
            title: '',
            release:'',
            top:''
        },
        dialogTableForm:{
          title:'',
          time:''
        },
        dialogTableVisible:false,
        page: 1,
        limit:10,
        diaPage:1,
        // diaLimit:10,
        tableData: {
            total:0,
            items:[],
        },
        diaData: {
            total:0,
            items:[],
        },
        tableLoading:false,

        editForm:{
            name:''
        },
        eidtRules:{
            name:[{ required: true, message: '请输入活动名称', trigger: 'blur' }]
        },
        isEdit:false,
        tagsList:[],
        selectionTab: [],
        selectionDiaTab :[],
        tableHeight: { height: "" },
        tableDiaHeight: { height: "" },
        column_id:''
    };
  },
  watch: {},
  created() {
    this.column_id = this.$route.params.id;
    this.tableHeight.height = window.innerHeight - 330 + "px";
    this.tableDiaHeight.height = window.innerHeight - 500 + "px";
    this.getData();    
  },
  methods: {
    back() {
      this.$router.push({
        path: "/videoManagement/videoProgram"
      });
    },
    onSearch() {
      this.getData();
    },
    clearTabel() {
      this.getData();
    },
    clearInput() {
      if (this.ruleForm.title == "") {
        this.getData();
      }
    },
    onDiaSearch() {
      this.getVideoData();
    },
    clearDiaTabel() {
      this.getVideoData();
    },
    clearDiaInput(){
      if (this.dialogTableForm.title == "") {
        this.getVideoData();
      }
    },
    handleCurrentChange(val) {  //当前页
      this.page = val;
      this.getData();
    },
    diaCurrentChange(val){
      this.diaPage = val;
      this.getVideoData();
    },
    // diaSizeChange(val){
    //   this.diaLimit = val;
    //   this.getVideoData();
    // },
    handleSizeChange(val){ //每条页数
      this.limit = val;
      this.getData();
    },
    getData() {
        let dataParams = {};
        dataParams.page = this.page;
        dataParams.limit = this.limit;
        dataParams.column_id = this.column_id;
        this.ruleForm.title?dataParams.title = this.ruleForm.title:'';
        this.tableLoading = true;
        getColumnList(dataParams).then(res => {
            this.tableData = {
                items:res.items,
                total:res.total
            }
            this.tableLoading = false;
        }).catch(()=>{console.log('promise.warn!!')})
    },
    onAddBtn(){
      this.getVideoData();        
    },
    onDiaAddBtn(){
      this.$router.push({
          path: `/videoManagement/videoList/addOrEdit/-1`,
          query:{
            way:'columnVideo',
            id:this.column_id
          }
      })
    },
    addColumnVideo(){
      if (this.selectionDiaTab.length > 0) {
        let seleteId = [];
        for (const item of this.selectionDiaTab) {
          seleteId.push(item.id);
        }
        this.axios
          .post(`video/column/video/add/`, { video_ids: seleteId.join(","),column_id:this.column_id })
          .then(res => {
            this.$message.success("添加成功");
            this.getData();
            this.selectionDiaTab = [];
            this.dialogTableVisible = false;
          });
      } else {
        this.$message.error("请先选择视频列表");
      }
    },
    onDiaDelBtn(){
      if (this.selectionDiaTab.length > 0) {
        let seleteId = [];
        for (const item of this.selectionDiaTab) {
          seleteId.push(item.id);
        }
        this.axios
          .delete(`video/delete/`, {
            params: { video_ids: seleteId.join(",") }
          })
          .then(res => {
            this.$message.success("删除成功");
            this.getData();
            this.selectionDiaTab = [];
          });
      } else {
        this.$message.error("请先选择视频列表");
      }
    },
    onDelBtn() {
      if (this.selectionTab.length > 0) {
        let seleteId = [];
        for (const item of this.selectionTab) {
          seleteId.push(item.id);
        }
        this.axios
          .delete(`video/column/video/delete/`, {
            params: { video_ids: seleteId.join(",") }
          })
          .then(res => {
            this.$message.success("删除成功");
            this.getData();
            this.selectionTab = [];
          });
      } else {
        this.$message.error("请先选择栏目视频");
      }
    },
    changeState(i,row){
      // 1推荐 2置顶 3显示 4排序
      let dataParams = {};
      dataParams.video_id = row.id;
      dataParams.column_id = this.column_id;
      switch (i) {
        case 1:
          dataParams.key = 'recommend';
          dataParams.value = row.recommend;
          break;
        case 2:
          dataParams.key = 'top';
          dataParams.value = row.top;
          break;
        case 3:
          dataParams.key = 'release';
          dataParams.value = row.release;
          break;
        default:
          dataParams.key = 'sort';
          dataParams.value = row.sort;
          break;
      }
      this.axios.post(`video/column/video/status/edit/`, dataParams)
          .then(res => {
            this.$message.success("修改成功");
            this.getData();
            dataParams = {};
          });
    },
    onEditBtn(record){
      this.$router.push({
          path: `/videoManagement/videoList/addOrEdit/${record.video_info.id}`,
          query:{
            way:'columnVideo',
            id:this.column_id
          }
      })
    },
    onEditDiaBtn(row){
      this.$router.push({
          path: `/videoManagement/videoList/addOrEdit/${row.id}`,
          query:{
            way:'columnVideo',
            id:this.column_id
          }
      })
    },
    checkTable(selection) {
      this.selectionTab = selection;
    },
    checkDiaTable(selection){
      this.selectionDiaTab = selection;
    },
    diaClose(){
      this.dialogTableForm.title = '';
      this.dialogTableForm.time = '';
      this.diaData.total = 0;
      this.diaData.items = [];
      this.selectionDiaTab = [];
    },
    getVideoData() {
        let dataParams = {};
        dataParams.page = this.diaPage;
        // dataParams.limit = this.diaLimit;
        dataParams.column_id = this.column_id;
        this.dialogTableForm.title?dataParams.title = this.dialogTableForm.title:'';
        this.dialogTableForm.time?dataParams.start_time = this.dialogTableForm.time[0]:'';
        this.dialogTableForm.time?dataParams.end_time = this.dialogTableForm.time[1]:'';
        this.tableLoading = true;
        // console.log(dataParams)
        // debugger
        // return 
        getNewsList(dataParams).then(res => {
            this.diaData = {
                items:res.items,
                total:res.total
            }
            this.dialogTableVisible = true;
            this.tableLoading = false;
        }).catch(()=>{console.log('promise.warn!!')})
    },
    nameFormat(record){
      return record.video_info.title;
    }
  }
};
</script>

<style lang="scss" scoped>
.ad-box {
  height: 100%;
  .top {
    padding-left: 20px;
    background-color: #fff;
    height: 100px;
    display: flex;
    align-items: center;
    position: relative;
    .image {
      position: absolute;
      top: 0;
      right: 0;
      width: 44px;
      height: 44px;
      cursor: pointer;
      z-index: 1000;
    }
    .demo-ruleForm {
      width: 100%;
      .el-input {
        width: 250px;
      }
    }
    .el-form-item {
      margin-bottom: 0px !important;
    }
  }
  .table-box {
    margin-top: 10px;
    background-color: #fff;
    padding: 20px;
  }
  .el-image {
    border: solid 1px #eee;
    padding: 5px 0;
  }
  .dialog-footer{
    text-align: center !important;
  }
  // .img-box{
  //     border: solid 1px #eee;
  //     padding: 5px 0;
  // }
}
</style>

