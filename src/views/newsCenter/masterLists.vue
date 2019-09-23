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
        <el-row>
          <el-col :span="12">
            <el-form-item label="头条名称:">
              <el-input @input="clearInput" @clear="clearTabel" clearable v-model="ruleForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否置顶:">
              <el-switch active-value="1" inactive-value="0" v-model="ruleForm.top"></el-switch>
            </el-form-item>
            <!-- <el-form-item label="显示:">
                   <el-switch  active-value="1" inactive-value="0" v-model="ruleForm.according"></el-switch>
                </el-form-item>
                <el-form-item label="推荐:">
                   <el-switch  active-value="1" inactive-value="0" v-model="ruleForm.order"></el-switch>
            </el-form-item>-->
          </el-col>
        </el-row>
        <el-form-item style="margin-top: 10px;">
          <el-button style="margin-left: 75px;" type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <!-- <el-row style="margin-top:10px;">
            <el-col :span="24">
                <el-form-item label="发布时间:">
                    <el-date-picker
                        @change="clearPick"
                        v-model="ruleForm.time"
                        type="datetimerange"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                </el-form-item>
            </el-col>
        </el-row>-->
      </el-form>
    </div>
    <div class="table-box">
      <el-button @click="delBtn(1)">删除</el-button>
      <el-button @click="delBtn(2)" plain type="primary">添加</el-button>
      <el-table
        size="medium"
        :height="tableHeight.height"
        :data="tableData.items"
        @selection-change="checkTable"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column label="头条名称" min-width="120">
          <!-- <template slot-scope="scope">
                    <div class="img-box">
                        <el-image style="height:80px;" fit="scale-down" v-show="scope.row.cover" :src="scope.row.cover"></el-image>
                    </div>                 
          </template>-->
        </el-table-column>
        <el-table-column prop="title" label="副标题" min-width="180"></el-table-column>
        <el-table-column label="是否置顶" min-width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.top" :active-value="1" :inactive-value="0" disabled></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column
                label="推荐"
                min-width="80">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.recommend"   :active-value="1"  :inactive-value="0"  disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="显示"
                min-width="80">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.release"   :active-value="1"  :inactive-value="0"  disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="排序"
                prop="sort"
                min-width="80">
        </el-table-column>-->
        <el-table-column prop="create_time" label="创建时间" min-width="180"></el-table-column>
        <el-table-column label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" icon="el-icon-edit" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:5px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        title: "",
        according: "",
        top: "",
        order: "",
        time: ""
      },
      currentPage: 1,
      tableHeight: { height: "" },
      tableData: "",
      selectionTab: []
    };
  },
  watch: {},
  created() {
    this.tableHeight.height = window.innerHeight - 330 + "px";
    this.getData();
    // this.axios.get(`http://test.xunbaowang.net/500/`)
  },
  methods: {
    search() {
      this.getData();
    },
    clearTabel() {
      this.getData();
    },
    clearPick() {
      if (this.ruleForm.time == "" || this.ruleForm.time == null) {
        this.getData();
      }
    },
    clearInput() {
      if (this.ruleForm.title == "") {
        this.getData();
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData() {
      let dataParams = {};
      this.ruleForm.title ? (dataParams.title = this.ruleForm.title) : "";
      this.ruleForm.according.toString()
        ? (dataParams.release = this.ruleForm.according)
        : "";
      this.ruleForm.top.toString() ? (dataParams.top = this.ruleForm.top) : "";
      this.ruleForm.order.toString()
        ? (dataParams.recommend = this.ruleForm.order)
        : "";
      dataParams.page = this.currentPage;
      this.ruleForm.time ? (dataParams.start_time = this.ruleForm.time[0]) : "";
      this.ruleForm.time ? (dataParams.end_time = this.ruleForm.time[1]) : "";
      this.axios.get(`news/list/`, { params: dataParams }).then(res => {
        this.tableData = res;
      });
    },
    delBtn(i) {
      // 1删除  2添加
      if (i == 1) {
        if (this.selectionTab.length > 0) {
          let seleteId = [];
          for (const item of this.selectionTab) {
            seleteId.push(item.id);
          }
          this.axios
            .delete(`news/delete/`, {
              params: { news_ids: seleteId.join(",") }
            })
            .then(res => {
              this.$message.success("删除成功");
              this.getData();
              this.selectionTab = [];
            });
        } else {
          this.$message.error("请先选择文章");
        }
      } else {
        this.$router.push({
          path: `/main/newsCenter/masterLists/addOrEdit/-1`
        });
      }
    },
    edit(row) {
      this.$router.push({
        path: `/main/newsCenter/masterLists/addOrEdit/${row.id}`
      });
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

