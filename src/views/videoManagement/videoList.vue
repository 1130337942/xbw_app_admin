<template>
  <!--  视频中心 > 视频管理  -->
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
        <el-form-item label="视频名称:" prop="keyword">
          <el-input
            @input="clearInput"
            @clear="clearTabel"
            clearable
            v-model="ruleForm.keyword"
            placeholder="请输入视频名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间:" prop="time">
          <el-date-picker
            v-model="ruleForm.time"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            @clear="onSearchClick"
            @change="onSearchClick"
          ></el-date-picker>
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
        size="medium"
        v-loading="tableLoading"
        :height="tableHeight.height"
        :data="tableData.items"
        @selection-change="checkTable"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="视频编号" min-width="100"></el-table-column>
        <el-table-column prop="title" label="视频名称" min-width="180"></el-table-column>
        <el-table-column prop="seo_title" label="副标题" min-width="180"></el-table-column>
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
          :total="tableData.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getListData } from "@/api/videoManagement";
export default {
  name:'videoManage_list',
  data() {
    return {
      ruleForm: {
        keyword: "",
        time: ""
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

      selectionTab: [],
      tableHeight: { height: "" },

      isCreate: false //是否已经创建实例
    };
  },
  watch: {},
  created() {
    this.tableHeight.height = window.innerHeight - 330 + "px";
    this.getData();
  },
  methods: {
    onSearchClick() {
      this.page = 1;
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
      this.ruleForm.keyword ? (dataParams.title = this.ruleForm.keyword) : "";
      this.ruleForm.time ? (dataParams.start_time = this.ruleForm.time[0]) : "";
      this.ruleForm.time ? (dataParams.end_time = this.ruleForm.time[1]) : "";
      this.tableLoading = true;
      getListData(dataParams)
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
        path: `/videoManagement/videoList/addOrEdit/-1`,
        query: {
          way: "videoList"
        }
      });
    },
    onDelBtn() {
      if (this.selectionTab.length > 0) {
        let seleteId = [];
        for (const item of this.selectionTab) {
          seleteId.push(item.id);
        }
        this.$confirm(
          "直接删除视频源将删除相关栏目的视频记录, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() =>
            this.axios.delete(`video/delete/`, {
              params: { video_ids: seleteId.join(",") }
            })
          )
          .then(res => {
            this.$message.success("删除成功");
            this.getData();
            this.selectionTab = [];
          })
          .catch(err => console.log(err));
      } else {
        this.$message.error("请先选择视频列表");
      }
    },

    onEditBtn(row) {
      this.$router.push({
        path: `/videoManagement/videoList/addOrEdit/${row.id}`,
        query: {
          way: "videoList"
        }
      });
    },
    checkTable(selection) {
      this.selectionTab = selection;
    }
  }
};
</script>

<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>

