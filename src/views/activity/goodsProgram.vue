<template>
  <div class="panelBox">
    <div class="searchBox">
      <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" @submit.native.prevent>
        <el-form-item label="商品搜索:" prop="name">
          <el-input v-model="formInline.name" placeholder="请输入商品编号或名称搜索" clearable @clear="onSearch"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺:" prop="merchant_id">
          <el-select v-model="formInline.merchant_id" filterable remote :remote-method="uploadMerchantData" placeholder="请选择所属店铺" clearable @clear="onSearch" @change="onSearch">
            <el-option
              v-for="(item,index) in merchantList"
              :key="index"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级分类:" prop="genre_one">
          <el-select
            v-model="formInline.genre_one"
            clearable
            @clear="onSearch"
            @change="onOneGenerChange"
          >
            <el-option
              v-for="(item,index) in firstClassify"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类:" prop="genre_two">
          <el-select
            v-model="formInline.genre_two"
            :clearable="true"
            @clear="onSearch"
            :disabled="towGenerDisabled"
            ref="genreTwoSelect"
          >
            <el-option
              v-for="(item,index) in secondClassify"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button type="info" icon="el-icon-refresh" @click="resetForm('formInline')">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch" native-type="submit">搜索</el-button>
      </el-form>
    </div>
    <div class="table-box">
        <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="outerVisible = true">
          添加
        </el-button>
      <!-- 表格部分 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark" 
        :height="tableHeight.height"
        style="width: 100%;"
        size="medium"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="commodity_info.name" label="商品名称"></el-table-column>
        <el-table-column prop="merchant_info.name" label="所属店铺"></el-table-column>
        <el-table-column prop="commodity_info.genre_one" label="一级分类" show-overflow-tooltip></el-table-column>
        <el-table-column prop="commodity_info.genre_two" label="二级分类" show-overflow-tooltip></el-table-column>
        <el-table-column prop="recommend" label="是否推荐" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.recommend"
              :active-value="1"
              :inactive-value="0"
              @change="onSwitchChange(scope.row,'recommend')"
              active-color="#1989FA"
              inactive-color="#848484"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="top" label="是否置顶" width="80" show-overflow-tooltip align="center">
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
            <el-input-number v-model="scope.row.sort" controls-position="right" :min="0" @change="onSwitchChange(scope.row,'sort')" :disabled="tableLoading"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="到期时间" width="150" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="操作" width="200" show-overflow-tooltip align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit-outline" type="primary" plain @click="onEditClick(scope.row)">修改</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" width="80" @click="onRemoveBtn(scope.row)" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textCenter">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 50]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 添加弹出层 -->
    <el-dialog title="选择商品" :visible.sync="outerVisible" width="88%">
      <el-form :inline="true" :model="dioForm" ref="dioForm" class="demo-form-inline">
        <el-form-item label="商品搜索:">
          <el-input v-model="dioForm.name" placeholder="请输入商品名称" clearable @clear="onDioSearch"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺:" prop="merchant_name">
          <el-select
            v-model="dioForm.merchant_name"
            filterable
            remote
            :remote-method="uploadMerchantData"
            placeholder="请选择所属店铺"
            clearable
            @clear="onDioSearch"
          >
            <el-option
              v-for="(item,index) in merchantList"
              :key="index"
              :value="item.name"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级分类:" prop="genre_one">
          <el-select v-model="dioForm.genre_one" clearable @clear="onDioSearch" @change="onDioOneGenerChange">
            <el-option
              v-for="(item,index) in firstClassify"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类:" prop="genre_two">
          <el-select v-model="dioForm.genre_two" :clearable="true" @clear="onDioSearch" :disabled="dioTowGenerDisabled" ref="genreTwoSelect">
            <el-option
              v-for="(item,index) in secondClassify"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button type="info" icon="el-icon-refresh" @click="dioResetForm('dioForm')">重置</el-button>
        <el-button type="primary" style="margin-bottom:20px;" @click="onDioSearch">搜索</el-button>
      </el-form>
      <!-- 下部表格 -->
      <el-table
        ref="singleTable"
        :data="dioData"
        highlight-current-row
        border
        tooltip-effect="dark"
        :height="dioTableHeight.height"
        style="width: 100%;"
        @current-change="radioCurrentChange"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="name" label="商品名称"></el-table-column>
        <el-table-column property="merchant_info.name" label="所属店铺"></el-table-column>
        <el-table-column property="genre_one" label="一级分类" show-overflow-tooltip></el-table-column>
        <el-table-column property="genre_two" label="二级分类" show-overflow-tooltip></el-table-column>
        <el-table-column property="create_time" label="创建时间" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 弹出层分页 -->
      <div class="textCenter">
        <el-pagination
          @size-change="diologSizeChange"
          @current-change="dioCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30]"
          :page-size="dioLimit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dioTotal"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onNextStep" :disabled="nextFlag">下一步</el-button>
        <el-button @click="cnacleBtn">取消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层第二层 -->
    <el-dialog
      width="70%"
      title="添加主题商品"
      :visible.sync="innerVisible"
      append-to-body
      @close="onClose"
    >
      <div class="addThemeGoods">
        <el-form ref="secDiologData"  :model="secDiologData"><!--:rules="rules"-->
          <p style="font-size:20px; margin-bottom:20px;">
            商品:
            <span>{{goodsName}}</span>
          </p>
          <p style="margin-bottom:20px;">
            请选择商品过期时间
            <span style="font-size:12px;color:#F56C6C;">(过期时间为选择时期的第二天凌晨0:00移出会场)</span>
          </p>
          <el-radio v-model="radio" label="1">添加时间</el-radio>
          <el-radio v-model="radio" label="2">永不过期</el-radio>
          <br />
          <el-form-item prop="expired_date" :rules="[{ required: true, message: '年龄不能为空'}]" v-if="radio==1">
            <el-date-picker
              v-model="secDiologData.expired_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择过期时间"
              style="margin:20px auto;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="请添加该商品描述:" prop="recommendation">
            <span v-if="(lock_recommendation == 0)">(此项为非必填)</span>
            <el-input
              type="textarea"
              v-model="secDiologData.recommendation"
              placeholder="请添加该商品描述"
              show-word-limit
              maxlength="200"
            >
              <span slot="suffix">{{secDiologData.recommendation.length||0}}/200</span>
            </el-input>
          </el-form-item>
          <el-button type="info" @click="onPreBtn" v-if="isDisplay">上一步</el-button>
          <el-button type="primary" @click="onSaveClick">确认提交</el-button>
          <el-button @click="innerVisible = false">取消</el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMettingList,
  getMerchantList,
  getGoods,
  getThemeGoods,
  getAuditCascaderData,
  getThemeInfo,
  addThemeGood,
  removeThemeGood,
  editThemeGood,
  goodsSwitchStatus
} from "@/api/theme";
import { setTimeout } from "timers";
import { parse } from 'path';
export default {
  data() {
    return {
      tableHeight: { height: "0px" },
      dioTableHeight: { height: "0px" },
      // 一级分类
      firstClassify: [],
      // 二级分类
      secondClassify: [],
      tableLoading: false,
      // 主题编号
      theme_id: null,
      // 店铺列表
      merchantList: [],
      // 弹出层日期值
      dataValue: "",
      // 弹出层
      outerVisible: false,
      innerVisible: false,
      // 是否显示
      radio1: "全部",
      // 表单部分
      formInline: {
        name: "",
        merchant_id: "",
        genre_one: "",
        genre_two: ""
      },
      // 弹出层表单
      dioForm: {
        name: "",
        merchant_name: "",
        genre_one: "",
        genre_two: ""
      },
      // 弹出层商品名称
      goodsName: "",
      // 上一步按钮显示
      isDisplay: true,
      // 表格部分
      tableData: [],
      // 弹出层表格
      dioData: [],

      showValue: true,
      topValue: false,
      recmValue: true,
      // 多选框数据
      multipleSelection: [],
      // 下一步按钮
      nextFlag: true,
      //   分页数据
      page: 1,
      limit: 10,
      total: null,
      //   弹出层分页数据
      dioPage: 1,
      dioLimit: 10,
      dioTotal: null,
      // 过期时间单选
      radio: "1",
      // 第一层弹出层数据
      dialogData: {
        theme_id: null,
        commodity_id: null
      },
      // 第二层弹出层数据
      secDiologData: {
        expired_date: "",
        recommendation: ""
      },
      // 弹出层校验规则
      rules: {
        expired_date: [{ required: true, message: "请选择过期时间", trigger: "change" }]
      },
      // 商品描述是否必填
      lock_recommendation: null
    };
  },
  computed: {
    // 二级分类禁用
    towGenerDisabled() {
      return this.formInline.genre_one || this.formInline.genre_one === 0
        ? false
        : true;
    },
    // 弹出层二级分类禁用
    dioTowGenerDisabled() {
      return this.dioForm.genre_one || this.dioForm.genre_one === 0
        ? false
        : true;
    }
  },
  created() {
    this.tableHeight.height = window.innerHeight - 350 + "px";
    this.dioTableHeight.height = window.innerHeight - 580 + "px";
    this.theme_id = this.dialogData.theme_id = parseInt(this.$route.params.id);
    this.getMerchantList();
    this.getGoods();
    this.getData();
    this.getCascaderData();
  },
  methods: {
    // 搜索刷新列表
    getData() {
      let params = {
        page: this.page,
        limit: this.limit,
        ...this.formInline
      };
      this.tableLoading = true;
      getThemeGoods(this.$filterParams(params,{theme_id:this.theme_id,recommend:-1}))
        .then(res => {
          this.tableData = res.items;
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

    // 弹出层搜索刷新列表
    getDioData() {
      let dioParams = {
        page: this.dioPage,
        limit: this.dioLimit,
        ...this.dioForm
      };
      this.tableLoading = true;
      getGoods(this.$filterParams(dioParams))
        .then(res => {
          this.dioData = res.items;
          this.dioTotal = res.total;
          this.dioPage = res.page;
          this.tableLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    // 弹出层搜索数据
    onDioSearch() {
      this.page = 1;
      this.getDioData();
    },
    // 单选表格选择
    radioCurrentChange(val) {
      this.dialogData.commodity_id = val.id;
      this.goodsName = val.name;
      if (this.dialogData.commodity_id === null) {
        this.nextFlag = true;
      } else {
        this.nextFlag = false;
      }
    },
    // 表格选择
    handleSelectionChange(val) {
      // console.log(val);
      // this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    // addMetting() {
    //   this.$router.push({ path: "/activity/boutikque/addMetting" });
    // },
    // 开关改变
    onSwitchChange(record, target) {
      goodsSwitchStatus({
        theme_commodity_id: record.id,
        key: target,
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
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getData();
    },
    // 弹出层分页
    diologSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.dioLimit = val;
      getGoods({
        page: this.dioPage,
        limit: this.dioLimit
      })
        .then(res => {
          this.dioData = res.items;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      getThemeGoods({
        page: this.page,
        limit: this.limit,
        recommend: 0,
        theme_id: this.theme_id,
        // ...this.$filterParams(this.formInline)
      })
        .then(res => {
          this.tableData = res.items;
          this.total = res.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    dioCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.dioPage = val;
      getGoods({
        page: this.dioPage,
        limit: this.dioLimit
      })
        .then(res => {
          this.dioData = res.items;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 远程搜索方法
    uploadMerchantData(query) {
      if (query !== "") {
        // 获取店铺列表
        getMerchantList({ page: 1 })
          .then(res => {})
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 一级分类改变
    onOneGenerChange(val) {
      val || val === 0 ? this.getCascaderData(val * 1) : null;
      this.formInline.genre_two = "";
    },
    // 弹出层一级分类改变
    onDioOneGenerChange(val) {
      val || val === 0 ? this.getCascaderData(val * 1) : null;
      this.dioForm.genre_two = "";
    },
    // 获取下拉分类
    getCascaderData(id) {
      let params = !id && id !== 0 ? {} : { superior_id: id };
      getAuditCascaderData(params)
        .then(res => {
          if (id !== undefined) {
            this.secondClassify = res;
            this.$refs["genreTwoSelect"].focus();
          } else {
            this.firstClassify = res;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取会场列表
    getMettingList() {
      getMettingList({ page: 1, limit: 20, display: -1 })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 添加主题页面
    onAddBtn() {
      this.$router.push({ path: "/activity/addThemeList" });
    },
    // 获取店铺列表
    getMerchantList() {
      getMerchantList({ page: 1 })
        .then(res => {
          console.log(res);
          this.merchantList = res.items;
          // console.log(this.merchantList);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取商品
    getGoods() {
      getGoods({ page: 1 })
        .then(res => {
          console.log(res);
          this.dioData = res.items;
          this.dioTotal  = res.total;
          this.dioPage =  res.page;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取主题商品
    getThemeGoods() {
      getThemeGoods({
        page: 1,
        limit: 10,
        recommend: 0,
        theme_id: this.theme_id
      }).then(res => {
        debugger
        this.tableData = res.items;
        this.total = res.total;
      });
    },
    // 表单重置数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.onSearch();
    },
    // 弹出层重置数据
    dioResetForm(formName) {
      this.$refs[formName].resetFields();
      this.onDioSearch();
    },
    // 上一步按钮
    onPreBtn() {
      this.outerVisible = true;
      this.onClose();
    },
    // 清空弹出层数据
    onClose() {
      this.radio = 1;
      this.secDiologData = {
        expired_date: "",
        recommendation: ""
      };
      this.$refs.secDiologData.clearValidate();
    },
    // 弹出层下一步
    onNextStep() {
      getThemeInfo({ theme_id: this.theme_id }).then(res => {
        this.lock_recommendation = res.lock_recommendation;
      });
      this.isDisplay = true;
      this.innerVisible = true;
      setTimeout(() => {
        this.outerVisible = false;
      }, 100);
    },
    cnacleBtn() {
      this.outerVisible = this.innerVisible = false;
    },
    // 提交按钮
    onSaveClick() {
      this.outerVisible = false;
      let params = { ...this.dialogData, ...this.secDiologData };
      if (this.isDisplay === true) {
        this.$refs["secDiologData"]
          .validate()
          .then(() => {
            if(this.radio!=1){
              params.expired_date = '';
            }
            return addThemeGood(params)
          })
          .then(res => {
            this.resetForm("secDiologData");
            this.innerVisible = false;
            this.$message.success("保存成功!");
            this.getData();
          })
          .catch(err => console.log(err));
      } else {
        this.$refs["secDiologData"]
          .validate()
          .then(() =>
            editThemeGood({
              theme_commodity_id: this.dialogData.commodity_id,
              recommendation: params.recommendation,
              expired_date: this.radio==1?params.expired_date:''
            })
          )
          .then(res => {
            this.innerVisible = false;
            this.$message.success("修改成功!");
            this.getData();
          })
          .catch(err => console.log(err));
      }
    },
    // 格式化时间
    dateFormat: function(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // 拼接
      return year + "-" + month + "-" + day;
    },
    // 编辑主题商品
    onEditClick(record) {
      this.isDisplay = false;
      this.goodsName = record.name;
      this.dialogData.commodity_id = record.id;
      this.secDiologData.recommendation = record.recommendation;
      if(record.expired_date){
        this.radio = '1';
        this.secDiologData.expired_date = this.dateFormat(record.expired_date);
      }else{
        this.radio = '2';
        this.secDiologData.expired_date = '';
      }
      console.log(this.secDiologData);
      this.innerVisible = true;
    },
    // 移除主题商品
    onRemoveBtn(record) {
      this.$confirm('此操作移除该主题下的商品,是否继续?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(()=>removeThemeGood({ theme_commodity_id: record.id }))
      .then(res => {
        this.getData();
        this.$message.success("删除成功!");
      })
      .catch(err => console.log(err));
    }
    // 多选删除
    // onBoxRemove() {
    //   if (this.multipleSelection.length > 0) {
    //     let ids = this.multipleSelection.map(item => item.id);
    //     console.log(ids);
    //     console.log(ids.join(","));
    //     removeThemeGood({ theme_commodity_id: ids })
    //       .then(res => {
    //         this.getGoods();
    //         this.$message.success("删除成功!");
    //       })
    //       .catch(err => consoel.log(err));
    //   } else {
    //     this.$message.warning("请选择要删除的商品!");
    //   }
    // }
  }
};
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
.goodsProgram {
  height: 100%;
  .bk-top {
    padding: 10px;
    background-color: #fff;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
  }
  .bk-main {
    padding: 10px;
    margin-top: 10px;
    background-color: #fff;
    .el-row {
      margin-bottom: 10px;
    }
  }
  .paging {
    margin-top: 10px;
    text-align: center;
  }
  // 第二层弹出层样式
  // .el-dialog__body {
  //   .addThemeGoods {
  //     background-color: pink;
  //   }
  // }
}
</style>
