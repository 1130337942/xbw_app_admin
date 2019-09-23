<template>
  <div class="panelBox">
    <div class="searchBox">
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
        @submit.native.prevent
      >
        <el-form-item label="主题名称:" prop="name">
          <el-input v-model="formInline.name" placeholder="请输入主题名称" clearable @clear="onSearch"></el-input>
        </el-form-item>
        <el-form-item label="会场编号:" prop="venue_id">
          <el-select
            v-model="formInline.venue_id"
            filterable
            remote
            :remote-method="uploadMerchantData"
            placeholder="请选择会场编号"
            clearable
            @change="onSearch"
            @clear="onSearch"
          >
            <el-option
              v-for="(item,index) in mtList"
              :key="index"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="top">
          <el-radio-group v-model="formInline.top" @change="onSearch">
            <el-radio-button :label="'-1'">全部</el-radio-button>
            <el-radio-button :label="0">不置顶</el-radio-button>
            <el-radio-button :label="1">置顶</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item  prop="sort">
          <el-radio-group v-model="formInline.sort" @change="onSearch">
            <el-radio-button :label="'-1'">不排序</el-radio-button>
            <el-radio-button :label="0">正序</el-radio-button>
            <el-radio-button :label="1">倒序</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item  prop="display">
          <el-radio-group v-model="formInline.display" @change="onSearch">
            <el-radio-button :label="'-1'">全部</el-radio-button>
            <el-radio-button :label="1">显示</el-radio-button>
            <el-radio-button :label="0">不显示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-button type="info" icon="el-icon-refresh" @click="resetForm('formInline')">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch" native-type="submit">搜索</el-button>
      </el-form>
    </div>
    <div class="table-box">
        <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="onAddBtn">添加</el-button>
        <!-- 表格部分 -->
        <el-table
          ref="multipleTable"
          :data="themeList"
          tooltip-effect="dark"
          :height="tableHeight.height"
          size="meduim"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="主题名称"></el-table-column>
          <el-table-column prop="template_code" label="app端模板名" width="150"></el-table-column>
          <el-table-column prop="subtitle" label="副标题"></el-table-column>
          <el-table-column label="会场编号">
            <template slot-scope="scope">
              <span>{{scope.row.venue_info.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="display"
            label="是否显示"
            width="100"
            show-overflow-tooltip
            align="center"
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
          <el-table-column prop="top" label="是否置顶" width="100" align="center" show-overflow-tooltip>
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
          <el-table-column label="排序" min-width="150px" align="center">
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
          <el-table-column label="操作" width="250" show-overflow-tooltip align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                plain
                type="primary"
                @click="onEditBtn(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                icon="el-icon-edit-outline"
                plain
                type="success"
                @click="onProgramBtn(scope.row)"
              >商品管理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="textCenter">
          <template>
            <el-pagination
              @size-change="onSizeChange"
              @current-change="getData"
              :current-page="page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </template>
        </div>
    </div>
  </div>
</template>
<script>
import {
  getMettingList,
  getThemeList,
  themeSwitchStatus,
  getThemeInfo
} from "@/api/theme";
export default {
  data() {
    return {
      tableHeight: { height: "0px" },
      tableLoading: false,
      // 会场列表数据
      mtList: [],
      // 表单部分
      formInline: {
        name: "",
        venue_id: "",
        top:'-1',
        display: '-1',
        sort: '-1'
      },
      // 主题列表数据
      themeList: [],
      // 弹出层日期值
      dataValue: "",
      // 弹出层
      outerVisible: false,
      innerVisible: false,
      // 是否显示
      radio1: "全部",

      // 主题列表>表格部分
      tableData: [],
      showValue: true,
      topValue: false,
      multipleSelection: [],
      //   分页数据
      page: 1,
      limit: 10,
      total: null,
      // 过期时间单选
      radio: "1",
      // 弹出层过期时间
      overdueTime: "",
      // 弹出层商品描述
      GoodsDesc: ""
    };
  },
  created() {
    this.tableHeight.height = window.innerHeight - 330 + "px";
    this.getMettingList();
    this.getData();
  },
  methods: {
    // 重置数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.page = 1;
      this.limit = 10;
      this.onSearch();
    },
    // 获取会场列表
    getMettingList() {
      getMettingList({ page: 1, limt: 50, display: -1 })
        .then(res => {
          this.mtList = res.items;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 远程搜索方法
    uploadMerchantData(query) {
      getMettingList({name:query, page: 1, limt: 50, display: -1 })
        .then(res => {this.mtList = res.items})
        .catch(err => {
          console.log(err);
        });
    },
    // 搜索刷新列表
    getData() {
      // 将参数储存在params中
      let params = {
        page: this.page,
        limit: this.limit,
        ...this.formInline
      };
      this.tableLoading = true;
      getThemeList(this.$filterParams(params))
        .then(res => {
          this.themeList = res.items;
          this.total = res.total;
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
    // 开关改变
    onSwitchChange(record, target) {
      themeSwitchStatus({
        // 主题编号
        theme_id: record.id,
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
    // 分页
    onSizeChange(val) {
      this.limit = val;
      this.getData();
    },

    // 添加主题
    onAddBtn() {
      this.$router.push({ path: `/activity/addThemeList/-1` });
    },
    // 修改主题
    onEditBtn(record) {
      this.$router.push({ path: `/activity/addThemeList/${record.id}` });
    },
    // 商品管理页面
    onProgramBtn(record) {
      this.$router.push({ path: `/activity/goodsProgram/${record.id}` });
    },
    // 主题详情
    getThemeInfo() {
      getThemeInfo({ theme_id: this.themeList.id }).then(res => {
        console.log(res);
      });
    },
    // 获取主题列表
    getThemeList() {
      getThemeList({
        venue_id: this.mtList.id,
        page: this.page,
        limit: this.limit,
        display: -1
      })
        .then(res => {
          console.log(res);
          this.themeList = res.items;
          this.total = res.total;
          this.page = res.page;
          console.log(this.themeList);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
</style>
