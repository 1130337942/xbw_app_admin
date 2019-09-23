<template>
  <div class="panelBox">
    <div class="searchBox">
      <el-form
        :inline="true"
        :model="rulesForm"
        ref="rulesForm"
        class="demo-form-inline"
        @submit.native.prevent
      >
        <el-form-item label="会场名称:" prop="name">
          <el-input v-model="rulesForm.name" placeholder="请输入会场名称" clearable @clear="onSearch"></el-input>
        </el-form-item>
        <el-form-item label="是否排序:" prop="sort">
          <el-radio-group v-model="rulesForm.sort" @change="onSearch">
            <el-radio-button :label="'-1'">不排序</el-radio-button>
            <el-radio-button :label="0">正序</el-radio-button>
            <el-radio-button :label="1">倒序</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示:" prop="display">
          <el-radio-group v-model="rulesForm.display" @change="onSearch">
            <el-radio-button :label="'-1'">全部</el-radio-button>
            <el-radio-button :label="1">显示</el-radio-button>
            <el-radio-button :label="0">不显示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" @click="onSearch" icon="el-icon-search" native-type="submit">搜索</el-button>
        <el-button type="info" icon="el-icon-refresh" @click="resetForm('rulesForm')">重置</el-button>
      </el-form>
    </div>
    <div class="table-box">
        <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="addMetting">添加</el-button>
      <!-- 表格部分 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        v-loading="tableLoading"
        tooltip-effect="dark"
        :height="tableHeight"
        @selection-change="onSelectionChange"
        size="meduim"
      >
        <el-table-column prop="name" label="会场名称">
        </el-table-column>
        <el-table-column prop="template_code" label="app端模板名"></el-table-column>
        <el-table-column prop="description" label="会场描述" show-overflow-tooltip></el-table-column>

        <el-table-column
          prop="display"
          label="是否显示"
          align="center"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.display"
              :active-value="1"
              :inactive-value="0"
              @change="onSwitchChange(scope.row,'display')"
              active-color="#1989FA"
              inactive-color="#848484"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="top" label="是否置顶" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.top"
              :active-value="1"
              :inactive-value="0"
              @change="onSwitchChange(scope.row,'top')"
              active-color="#1989FA"
              inactive-color="#848484"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.sort"
              controls-position="right"
              :min="0"
              @change="onSwitchChange(scope.row,'sort')"
              :disabled="tableLoading"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="时间"
          show-overflow-tooltip
          min-width="120px"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain @click="onEditClick(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="textCenter">
        <el-pagination
          @size-change="onLimitChange"
          @current-change="getData"
          :current-page.sync="page"
          :page-sizes="[10, 20, 30]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getMettingList, editSwitchStatus } from "@/api/activity";
import { log } from "util";
export default {
  data() {
    return {
      // 表单部分
      rulesForm: {
        name: "",
        sort: -1,
        display: -1
      },
      // 表格部分
      tableData: [],
      showValue: true,
      topValue: false,
      tableHeight:  "0px" ,
      tableLoading: false,
      selectArr: [],
      //   分页数据
      page: 1,
      limit: 10,
      total: null
    };
  },
  created() {
    this.tableHeight = window.innerHeight - 330 + "px";
    this.getData();
  },
  methods: {
    // 重置数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.page = 1 ; 
      this.limit = 10;
      this.getData();
    },
    // 搜索刷新列表
    getData() {
      let params = {
        page: this.page,
        limit: this.limit,
        ...this.rulesForm
      };
      this.tableLoading = true;
      getMettingList(this.$filterParams(params))
        .then(res => {
          this.tableData = res.items;
          this.total = res.total;
          this.page = res.page;
          this.tableLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    // 搜索数据
    onSearch() {
      this.page = 1;
      this.getData();
    },
    // 表格选择
    onSelectionChange(val) {
      this.selectArr = val;
    },
    // 添加会场
    addMetting() {
      this.$router.push({ path: `/activity/boutikque/addMetting/-1` });
    },
    // 修改会场
    onEditClick(record) {
      this.$router.push({
        path: `/activity/boutikque/addMetting/${record.id}`
      });
    },
    // 开关改变
    onSwitchChange(record, target) {
      editSwitchStatus({
        // 会场编号
        venue_id: record.id,
        // 开关名称
        key: target,
        //
        value: record[target]
      })
        .then(res => {
          this.$message.success("修改成功!");
        })
        .catch(err => {
          this.getData();
          console.log(err);
        });
    },
    // 分页容量
    onLimitChange(val) {
      this.limit = val;
      this.getData();
    },

  }
};
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>
