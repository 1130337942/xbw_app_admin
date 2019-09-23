<template>
  <div class="panelBox">
    <div class="top">
      <el-form
        :model="rulesForm"
        :inline="true"
        :rules="rules"
        label-width="75px"
        ref="ruleForm"
        class="demo-ruleForm"
        label-position="left"
        @submit.native.prevent
      >
        <el-form-item prop="name" label="商家名称:">
          <el-input v-model="rulesForm.name" clearable @clear="onSearchClick" placeholder="请输入商家名称"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号:" label-width="60px">
          <el-input v-model="rulesForm.phone" clearable @clear="onSearchClick" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="商户分类:" prop="merchant_type">
          <el-select
            v-model="rulesForm.merchant_type"
            clearable
            @clear="onSearchClick"
            @change="onSearchClick"
          >
            <el-option label="优店" :value="1"></el-option>
            <el-option label="古玩" :value="2"></el-option>
            <el-option label="画廊" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-button
          native-type="submit"
          @click="onSearchClick"
          type="primary"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          type="info"
          @click="onResetClick"
          icon="el-icon-refresh"
        >重置</el-button>
      </el-form>
    </div>
    <div class="table-box">
      <el-table
        size="medium"
        :data="tableData.items"
        :height="tableHeight.height"
        v-loading="tableLoading"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column label="商家名称" prop="name" min-width="200px" align="center" fixed="left"></el-table-column>
        <el-table-column label="是否营业" prop min-width="80px" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.do_business"
              :active-value="1"
              :inactive-value="0"
              :disabled="false"
              @change="onSwitchChange(scope.row,'do_business')"
            />
          </template>
        </el-table-column>
        <el-table-column label="首页置顶" min-width="80px" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="onSwitchChange(scope.row,'home_top')"
              v-model="scope.row.home_top"
              :active-value="1"
              :inactive-value="0"
              :disabled="tableLoading"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="首页排序" prop="home_sort" min-width="140px" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.home_sort"
              controls-position="right"
              :min="0"
              @change="onSwitchChange(scope.row,'home_sort')"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="栏目置顶" min-width="80px" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="onSwitchChange(scope.row,'column_top')"
              v-model="scope.row.column_top"
              :active-value="1"
              :inactive-value="0"
              :disabled="tableLoading"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="栏目排序" prop="column_sort" min-width="140px" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.column_sort"
              controls-position="right"
              :min="0"
              @change="onSwitchChange(scope.row,'column_sort')"
              :disabled="tableLoading"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="350px" align="center">
          <template slot-scope="scope">
            <el-badge
              :value="scope.row.commodity_count"
              class="item"
              style="margin:10px 26px 10px 0px;"
            >
              <el-button
                icon="el-icon-goods"
                type="success"
                plain
                @click="onGoCommodityClick(scope.row)"
              >前往店铺</el-button>
            </el-badge>
            <el-button icon="el-icon-tickets" type="info" plain @click="onInfoClick(scope.row)">详情</el-button>
            <el-button
              icon="el-icon-edit"
              type="danger"
              plain
              @click="onEditClick(scope.row)"
            >详情完善( 临时 )</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textCenter">
        <el-pagination
          style="margin-top:5px;"
          @size-change="onLimitChange"
          @current-change="getData"
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
import { getMerchantData, editStatusData } from "@/api/merchant";
import { mkdir } from "fs";
export default {
  name: "merchant_list",
  data() {
    return {
      tableData: {
        items: [],
        total: 0
      },
      tableHeight: {
        height: "0px"
      },
      tableLoading: false,
      page: 1,
      limit: 10,

      rulesForm: {
        name: "",
        merchant_id: "",
        application_status: "",
        boutique: "",
        merchant_type: ""
      },
      statusData: [],

      rules: {
        phone: [
          {
            validator: (rule, value, callback) => {
              this.$phoneRule(value) || !value
                ? callback()
                : callback(new Error("请输入正确的电话号码"));
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  activated() {
    this.getData();
  },
  created() {
    this.tableHeight.height = window.innerHeight - 300 + "px";
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
    onLimitChange(val) {
      this.limit = val;
      this.getData();
    },

    onGoCommodityClick(record) {
      this.$router.push({
        path: `/commodity/list`,
        query: { key: record.name }
      });
    },
    onInfoClick(record) {
      this.$router.push({
        path: `/merchant/list/info/${record.id}`
      });
    },
    onEditClick(record) {
      this.$router.push({
        path: `/merchant/list/add/${record.id}/${record.genre}`
      });
    },
    onSwitchChange(record, name) {
      editStatusData({
        merchant_id: record.id,
        key: name,
        value: record[name]
      })
        .then(res => {
          // this.getData();
          this.$message.success("修改成功");
        })
        .catch(err => {
          console.log(err);
          this.getData();
        });
    },
    paymentType(record, column, cellValue) {
      return record.paymentType === 1 ? "入驻费" : "保证金";
    },
    getData() {
      this.$refs["ruleForm"]
        .validate()
        .then(() => {
          let params = {
            page: this.page,
            limit: this.limit,
            commodity_count: 1,
            ...this.rulesForm
          };
          this.tableLoading = true;
          return getMerchantData(this.$filterParams(params));
        })
        .then(res => {
          this.tableData = {
            items: res.items,
            total: res.total
          };
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
// .el-col { min-width: 330px}
</style>
