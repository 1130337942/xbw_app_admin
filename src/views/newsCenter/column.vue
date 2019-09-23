<template>
  <div class="ad-box">
    <div class="top">
      <el-form
        :model="ruleForm"
        :inline="true"
        ref="ruleForm"
        label-width="75px"
        @submit.native.prevent
      >
      <el-form-item label="栏目名称:" prop="keyword">
        <el-input
          @clear="onSearchClcik"
          clearable
          v-model="ruleForm.keyword"
          placeholder="请输入栏目名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="板块名称:" prop="superior_id">
        <el-select
          clearable
          v-model="ruleForm.superior_id"
          @clear="onSearchClcik"
          @change="onSearchClcik"
          placeholder="请选择板块名称"
        >
          <el-option v-for="i in plateStore" :key="i.index" :label="i.name" :value="i.index"></el-option>
        </el-select>
      </el-form-item>
      <el-button icon="el-icon-search" native-type="submit" type="primary" @click="onSearchClcik">搜索</el-button>
      <el-button icon="el-icon-refresh"  type="info" @click="onResetClcik">重置</el-button>
      </el-form>
    </div>

    <div class="table-box">
      <el-button @click="onDelBtn" plain type="danger" icon="el-icon-delete">删除</el-button>
      <el-button @click="onAddBtn" plain type="primary" icon="el-icon-circle-plus-outline">添加</el-button>
      <el-table
        size="medium"
        :loading="tableLoading"
        :height="tableHeight.height"
        :data="tableData.items"
        style="width: 100%;margin-top:10px;"
        :cell-style="cellStyle"
        @cell-click="onCellClick"
        @selection-change="onCheckSelect"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="id" label="栏目ID" min-width="120"></el-table-column>
        <el-table-column align="center" prop="name" label="栏目名称" min-width="120"></el-table-column>
        <el-table-column align="center" prop="news_num" label="关联新闻" min-width="180"></el-table-column>
        <el-table-column align="center" prop="plate_name" label="父级板块" min-width="80"></el-table-column>
        <el-table-column align="center" prop="create_time" label="创建时间" min-width="180"></el-table-column>
        <el-table-column align="center" label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" icon="el-icon-edit" @click="onEditBtn(scope.row)">修改</el-button>
            <el-button
              plain
              type="info"
              icon="el-icon-document"
              @click="onNewsInfoBtn(scope.row)"
            >关联新闻</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @closed="onResetEditForm">
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editRules"
        label-position="left"
        label-width="80px"
      >
        <el-row>
          <el-col :span="14" :offset="5">
            <el-form-item label="栏目名称" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14" :offset="5" v-if="!isEdit">
            <el-form-item label="父板块" prop="superior_id">
              <el-select v-model="editForm.superior_id">
                <el-option v-for="i in plateStore" :key="i.index" :label="i.name" :value="i.index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14" :offset="5">
            <el-form-item label="栏目描述" prop="introduction">
              <el-input type="textarea" v-model="editForm.introduction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onWindowSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getColumnData, saveColumnData, delPlateData } from "@/api/newCenter";
import plateVue from "./plate.vue";
export default {
  name: "newsCenter_column",
  data() {
    return {
      plateStore: [],
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

      tableHeight: { height: "" },

      dialogFormVisible: false,
      editForm: {
        name: "",
        superior_id: "",
        introduction: ""
      },
      isEdit: false,
      editRules: {
        name: [{ required: true, message: "请输入栏目名称", trigger: "blur" }],
        superior_id: [
          { required: true, message: "请选择所属板块", trigger: "change" }
        ]
      },
      dialogTitle: "",
      selectionTab: []
    };
  },
  activated() {
    let plate_id = this.$route.params.id;
    plate_id ? (this.ruleForm.superior_id = plate_id * 1) : null;
    console.log(plate_id);
    this.getData();
    this.axios.get("news/column/tree/").then(res => {
      this.plateStore = res;
    });
  },
  created() {
    this.tableHeight.height = window.innerHeight - 330 + "px";
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.label == "关联新闻") {
        //指定坐标
        return "cursor:pointer;color:#0079ef;";
      } else {
        return "";
      }
    },
    onSearchClcik() {
      this.page = 1;
      this.getData();
    },
    onResetClcik(){
      this.$refs.ruleForm.resetFields();
      this.limit = 10
      this.onSearchClcik()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    getData() {
      let params = {
        page: this.page,
        limit: this.limit,
        ...this.ruleForm
      };
      for (let i in params) {
        if (!params[i] && params[i] !== 0) {
          delete params[i];
        }
      }
      this.tableLoading = true;
      getColumnData(params)
        .then(res => {
          this.tableData = {
            items: res.items,
            total: res.total
          };
          this.page = res.page;
          this.tableLoading = false;
        })
        .catch(() => {
          console.log("promise.warn!!");
        });
    },

    onAddBtn() {
      this.dialogFormVisible = true;
      this.dialogTitle = "添加栏目";
    },
    onDelBtn() {
      if (this.selectionTab.length > 0) {
        let seleteId = [];
        for (const item of this.selectionTab) {
          seleteId.push(item.id);
        }
        delPlateData({ plate_ids: seleteId.join(",") })
          .then(res => {
            this.$message.success("删除成功");
            this.getData();
            this.selectionTab = [];
          })
          .catch(() => {});
      } else {
        this.$message.error("请先选择需要删除的板块!");
      }
    },
    onCheckSelect(select) {
      this.selectionTab = select;
    },
    onEditBtn(record) {
      this.dialogTitle = "编辑栏目";
      this.editForm = {
        name: record.name,
        introduction: record.introduction,
        column_id: record.id
      };
      this.isEdit = true;
      this.dialogFormVisible = true;
      // return false
    },
    onNewsInfoBtn(record) {
      this.$router.push({
        path: `/main/newsCenter/column/news/${record.id}`
      });
    },

    onResetEditForm() {
      //重置dialog的form
      this.editForm = {
        name: "",
        superior_id: "",
        introduction: ""
      };
      this.isEdit = false;
      this.$refs["editForm"].resetFields();
    },
    onWindowSave() {
      this.$refs["editForm"]
        .validate()
        .then(() => saveColumnData(this.editForm, this.isEdit))
        .then(res => {
          if (res.error_code * 1 !== 1001) {
            this.dialogFormVisible = false;
            this.getData();
            this.$message.success("保存成功!");
          } else {
            this.$message.error(res.message.field.name[0]);
          }
        })
        .catch(() => {
          console.log("promise.warn!!");
        });
    },

    onCellClick(row, column, cell, event) {
      // 打开相关栏目的新闻
      if (column.label === "关联新闻") {
        console.log(row, column, cell, event);
        this.$router.push({
          path: `/main/newsCenter/column/news/${row.id}`
        });
      }
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
// }
</style>

