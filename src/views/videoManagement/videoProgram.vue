<template>
  <!--  新闻中心 > 栏目管理  -->
  <div class="ad-box">
    <div class="top">
      <el-form
        :model="ruleForm"
        :inline="true"
        ref="ruleForm"
        label-width="75px"
        class="demo-ruleForm"
        @submit.native.prevent
      >
        <el-form-item label="栏目名称:" prop="keyword">
          <el-input
            @input="clearInput"
            @clear="clearTabel"
            clearable
            v-model="ruleForm.keyword"
            placeholder="请输入栏目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属板块:" prop="superior_id">
          <el-select
            v-model="ruleForm.superior_id"
            placeholder="请选择版块"
            clearable
            @clear="onSearchClick"
            @change="onSearchClick"
          >
            <el-option
              v-for="item in tagsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            native-type="submit"
            type="primary"
            @click="onSearchClick"
            icon="el-icon-search"
          >搜索</el-button>
          <el-button
            type="info"
            @click="onResetClick"
            icon="el-icon-refresh"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-box">
      <el-button @click="onDelBtn" plain type="danger" icon="el-icon-delete">删除</el-button>
      <el-button @click="onAddBtn" plain type="primary" icon="el-icon-circle-plus-outline">添加</el-button>
      <el-table
        :cell-style="cellStyle"
        size="medium"
        v-loading="tableLoading"
        :height="tableHeight.height"
        :data="tableData.items"
        @selection-change="checkTable"
        style="width: 100%;margin-top:10px;"
        @cell-click="clickTab"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="栏目ID" min-width="100"></el-table-column>
        <el-table-column prop="name" label="栏目名称" min-width="100"></el-table-column>
        <el-table-column prop="video_num" label="视频数量" min-width="100"></el-table-column>
        <el-table-column prop="plate_name" label="所属板块" min-width="100"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="120"></el-table-column>
        <el-table-column label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" icon="el-icon-edit" @click="onEditBtn(scope.row)">修改</el-button>
            <el-button plain type="info" icon="el-icon-document" @click="onInfoBtn(scope.row)">相关视频</el-button>
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
          :total="tableData.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getProgramList, getSectionListData } from "@/api/videoManagement";
export default {
  name:'videoManage_program',
  data() {
    return {
      ruleForm: {
        keyword: "",
        superior_id: ""
      },

      page: 1,
      limit: 10,
      tableData: {
        total: 0,
        items: []
      },
      tableLoading: false,

      editForm: {
        name: ""
      },
      eidtRules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }]
      },
      isEdit: false,
      tagsList: [],
      selectionTab: [],
      tableHeight: { height: "" },
      plateId: ""
    };
  },
  watch: {},
  activated(){
    this.$route.query.name ? (this.plateId = this.$route.query.name) : "";
    this.getPlateList();
    this.plateId ? "" : this.getData();
  },
  created() {
    this.tableHeight.height = window.innerHeight - 330 + "px";
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.label == "视频数量") {
        //指定坐标
        return "cursor:pointer;color:#0079ef";
      } else {
        return "";
      }
    },
    onSearchClick() {
      this.getData();
    },
    onResetClick(){
      this.$refs['ruleForm'].resetFields();
      this.limit = 10
      this.onSearchClick()
    },
    clearTabel() {
      this.getData();
    },
    clearInput() {
      if (this.ruleForm.title == "") {
        this.getData();
      }
    },
    handleCurrentChange(val) {
      //当前页
      this.page = val;
      this.getData();
    },
    handleSizeChange(val) {
      //每条页数
      this.limit = val;
      this.getData();
    },
    getData() {
      let dataParams = {};
      dataParams.page = this.page;
      dataParams.limit = this.limit;
      this.ruleForm.keyword ? (dataParams.keyword = this.ruleForm.keyword) : "";
      this.ruleForm.superior_id
        ? (dataParams.superior_id = this.ruleForm.superior_id)
        : "";
      this.tableLoading = true;
      getProgramList(dataParams)
        .then(res => {
          this.tableData = {
            items: res.items,
            total: res.total
          };
          this.tableLoading = false;
        })
        .catch(() => {
          console.log("promise.warn!!");
        });
    },

    onAddBtn() {
      this.$router.push({
        path: `/videoManagement/videoProgram/addOrEditProgram/-1`
      });
    },
    onDelBtn() {
      if (this.selectionTab.length > 0) {
        let seleteId = [];
        for (const item of this.selectionTab) {
          seleteId.push(item.id);
        }
        this.axios
          .delete(`video/plate/delete/`, {
            params: { plate_ids: seleteId.join(",") }
          })
          .then(res => {
            this.$message.success("删除成功");
            this.getData();
            this.selectionTab = [];
          });
      } else {
        this.$message.error("请先选择视频列表");
      }
    },

    onEditBtn(row) {
      this.$router.push({
        path: `/videoManagement/videoProgram/addOrEditProgram/${row.id}`
      });
    },
    onInfoBtn(row) {
      this.$router.push({
        path: `/videoManagement/videoProgram/columnVideo/${row.id}`
      });
    },
    checkTable(selection) {
      this.selectionTab = selection;
    },
    clickTab(row, column, cell, event) {
      if (column.label == "视频数量") {
        debugger;
        this.$router.push({
          path: `/videoManagement/videoProgram/columnVideo/${row.id}`
        });
      }
    },
    getPlateList() {
      getSectionListData()
        .then(res => {
          this.tagsList = res.items;
          for (const item of this.tagsList) {
            if (this.plateId && item.name == this.plateId) {
              this.ruleForm.superior_id = item.id;
              this.getData();
              return;
            }
          }
        })
        .catch(() => {
          console.log("promise.warn!!");
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
// .ad-box {
//   height: 100%;
//   .top {
//     padding-left: 20px;
//     background-color: #fff;
//     height: 100px;
//     display: flex;
//     align-items: center;
//     .demo-ruleForm {
//       width: 100%;
//       .el-input {
//         width: 250px;
//       }
//     }
//     .el-form-item {
//       margin-bottom: 0px !important;
//     }
//   }
//   .table-box {
//     margin-top: 10px;
//     background-color: #fff;
//     padding: 20px;
//   }
//   .el-image {
//     border: solid 1px #eee;
//     padding: 5px 0;
//   }
//   // .img-box{
//   //     border: solid 1px #eee;
//   //     padding: 5px 0;
//   // }
// }
</style>

