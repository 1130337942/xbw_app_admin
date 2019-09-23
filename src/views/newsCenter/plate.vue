<template>
  <!--  新闻中心 > 板块管理  -->
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
        <el-row>
          <!-- <el-col :span="12"> -->
          <el-form-item label="板块名称:">
            <el-input
              @input="clearInput"
              @clear="clearTabel"
              clearable
              v-model="ruleForm.keyword"
              placeholder="请输入板块名称"
            ></el-input>
          </el-form-item>
          <!-- </el-col> -->
        </el-row>
        <el-form-item style="margin-top: 10px;">
          <el-button
            icon="el-icon-search"
            style="margin-left: 10px;"
            type="primary"
            @click="onSearchClick"
            native-type="submit"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-box">
      <el-button @click="onDelBtn" plain type="danger" icon="el-icon-delete">删除</el-button>
      <el-button @click="onAddBtn" plain type="primary" icon="el-icon-circle-plus-outline">添加</el-button>
      <el-table
        size="medium"
        v-loading="tableLoading"
        :height="tableHeight.height"
        :data="tableData.items"
        :cell-style="cellStyle"
        style="width: 100%;margin-top:10px;"
        @cell-click="clickTab"
        @selection-change="checkTable"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="板块ID" min-width="120"></el-table-column>
        <el-table-column prop="name" label="板块名称" min-width="120"></el-table-column>
        <el-table-column prop="column_num" label="关联栏目" min-width="80"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="180"></el-table-column>
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
          :total="tableData.total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="板块编辑" :visible.sync="dialogFormVisible" @closed="editForm={name:''}">
      <el-form :model="editForm" label-position="left" :rules="eidtRules" ref="editForm">
        <el-form-item lable="板块名称" label-width="80px" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onEditwindowSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPlateData, savePlateData, delPlateData } from "@/api/newCenter";
export default {
  name: "newsCenter_plate",
  data() {
    return {
      ruleForm: {
        keyword: ""
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
        name: [{ required: true, message: "请输入板块名称", trigger: "blur" }]
      },
      dialogFormVisible: false,
      isEdit: false,

      selectionTab: [],
      tableHeight: { height: "" }
    };
  },
  watch: {},
  activated() {
    this.getData();
  },
  created() {
    this.tableHeight.height = window.innerHeight - 330 + "px";
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.label == "关联栏目") {
        //指定坐标
        return "cursor:pointer;color:#0079ef";
      } else {
        return "";
      }
    },
    onSearchClick() {
      this.page = 1;
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
      this.tableLoading = true;
      getPlateData({
        page: this.page,
        limit: this.limit,
        ...this.ruleForm
      })
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
      this.dialogFormVisible = true;
      this.isEdit = false;
    },
    onDelBtn() {
      if (this.selectionTab.length > 0) {
        let seleteId = [];
        for (const item of this.selectionTab) {
          seleteId.push(item.id);
        }
        this.$confirm("直接删除板块将删除所有所属的子栏目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => delPlateData({ plate_ids: seleteId.join(",") }))
          .then(res => {
            this.$message.success("删除成功");
            this.getData();
            this.selectionTab = [];
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message.error("请先选择需要删除的板块!");
      }
    },

    onEditBtn(record) {
      this.editForm = {
        name: record.name,
        plate_id: record.id
      };
      this.dialogFormVisible = true;
      this.isEdit = true;
    },
    onInfoBtn(row) {
      this.$router.push({
        path: `/main/newsCenter/column/${row.id}`,
        query: {
          name: row.name
        }
      });
    },
    onEditwindowSave() {
      //提交编辑
      this.$refs["editForm"]
        .validate()
        .then(res => {
          savePlateData(this.editForm, this.isEdit)
            .then(res => {
              this.$message.success("保存成功");
              this.getData();
              this.dialogFormVisible = false;
            })
            .catch(() => {
              console.log("promise.warn!!");
            });
        })
        .catch(() => {});
    },
    clickTab(row, column, cell, event) {
      if (column.label == "关联栏目") {
        this.$router.push({
          path: `/main/newsCenter/column/${row.id}`,
          query: {
            name: row.name
          }
        });
      }
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
  .top {
    padding-left: 20px;
    background-color: #fff;
    height: 100px;
    display: flex;
    align-items: center;
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
  // .img-box{
  //     border: solid 1px #eee;
  //     padding: 5px 0;
  // }
}
</style>

