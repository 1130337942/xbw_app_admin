<template>
<!--  新闻中心 > 板块管理  -->
  <div class="ad-box">

    <div class="table-box">
      <el-button @click="onDelBtn" plain type="danger" icon="el-icon-delete">删除</el-button>
      <el-button @click="onAddBtn" plain type="primary"  icon="el-icon-circle-plus-outline">添加</el-button>
      <el-table
        :cell-style="cellStyle"
        size="medium"
        v-loading = "tableLoading"
        :height="tableHeight.height"
        :data="tableData.items"
        @selection-change="checkTable"
        style="width: 100%;margin-top:10px;"
        @cell-click="clickTab"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="视频ID" min-width="120"></el-table-column>
        <el-table-column prop="name" label="视频名称" min-width="120"></el-table-column>
        <el-table-column prop="column_num" label="关联栏目" min-width="180"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="120"></el-table-column>
        <el-table-column label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" icon="el-icon-edit" @click="onEditBtn(scope.row)">修改</el-button>
            <el-button plain type="info" icon="el-icon-document" @click="onInfoBtn(scope.row)">相关栏目</el-button>
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
    </div>
  </div>
</template>

<script>
import { getSectionListData  } from '@/api/videoManagement'
export default {
  name:'videoManage_section',
  data() {
    return {
      ruleForm: {
        keyword: '',
      },

      page: 1,
      limit:10,
      tableData: {
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

      selectionTab: [],
      tableHeight: { height: "" },
    };
  },
  watch: {},
  activated(){
    this.getData();
  },
  created() {
    this.tableHeight.height = window.innerHeight - 220 + "px";
  },
  methods: {
    cellStyle({row, column, rowIndex, columnIndex}){ 
      if(column.label=='关联栏目'){ 
        //指定坐标 
        return 'cursor:pointer;color:#0079ef' 
      }else{ 
          return '' 
      } 
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
    handleCurrentChange(val) {  //当前页
        this.page = val;
        this.getData();
    },
    handleSizeChange(val){ //每条页数
        this.limit = val;
        this.getData();
    },
    getData() {
        this.tableLoading = true;
        getSectionListData({
            page:this.page,
            limit:this.limit,
        }).then(res => {
            this.tableData = {
                items:res.items,
                total:res.total
            }
            this.tableLoading = false;
        }).catch(()=>{console.log('promise.warn!!')})
    },
    clickTab(row, column, cell, event){
      if(column.label=='关联栏目'){
        this.$router.push({
          path: `/videoManagement/videoProgram`,
          query:{
            name:row.name
          }
        })
      }
    },
    onAddBtn(){
        this.$router.push({
            path: `/videoManagement/videoSection/addOrEditSec/-1`,
        })
    },
    onDelBtn() {
        if (this.selectionTab.length > 0) {
          let seleteId = [];
          for (const item of this.selectionTab) {
            seleteId.push(item.id);
          }
           this.$confirm('直接删除板块将删除所有所属的子栏目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => this.axios.delete(`video/plate/delete/`, {
              params: { plate_ids: seleteId.join(",") }
          })).then(res => {
              this.$message.success("删除成功");
              this.getData();
              this.selectionTab = [];
          }).catch(err=>console.log(err))
        } else {
          this.$message.error("请先选择版块");
        }
    },
    onEditBtn(row){
        this.$router.push({
            path: `/videoManagement/videoSection/addOrEditSec/${row.id}`,
        })
    },
    onInfoBtn(row){
        this.$router.push({
          path: `/videoManagement/videoProgram`,
          query:{
            name:row.name
          }
        })
    },
    checkTable(selection) {
      this.selectionTab = selection;
    }
  }
};
</script>

<style lang="scss" scoped>
.ad-box {
  height: 100%;
  .table-box {
    background-color: #fff;
    padding: 20px;
  }
  .el-image {
    border: solid 1px #eee;
    padding: 5px 0;
  }
  // .img-box{
  //     border: solid 1px #eee;
  //     padding: 5px 0;
  // }
}
</style>

