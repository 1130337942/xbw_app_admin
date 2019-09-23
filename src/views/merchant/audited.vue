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
          <el-input
            v-model="rulesForm.name"
            clearable
            @clear="onSearchClick"
            placeholder="店铺名/申请人姓名/企业名/企业法人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号:" label-width="60px">
          <el-input v-model="rulesForm.phone" clearable @clear="onSearchClick"></el-input>
        </el-form-item>
        <el-form-item label="商户分类:" prop="merchant_type">
          <el-select
            v-model="rulesForm.merchant_type"
            @clear="onSearchClick"
            @change="onSearchClick"
            clearable
          >
            <el-option label="优店" :value="1"></el-option>
            <el-option label="古玩商城" :value="2"></el-option>
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
        <el-table-column label="商家名称" prop="merchant_name" min-width="200px" align="center"></el-table-column>
        <el-table-column label="手机号码" prop="phone" min-width="200px" align="center"></el-table-column>
        <el-table-column label="缴费类型" min-width="200px" align="center" :formatter="paymentType"></el-table-column>
        <el-table-column label="申请人" prop="applicant" min-width="200px" align="center"></el-table-column>
        <el-table-column
          label="申请状态"
          min-width="200px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="appliStatus[scope.row.application_status].tag">{{appliStatus[scope.row.application_status].name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="店铺类型"
          prop="genre"
          min-width="200px"
          align="center"
          :formatter="genreFormatter"
        ></el-table-column>
        <el-table-column label="操作" min-width="100px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit-outline"
              type="warning"
              plain
              @click="onAuditClick(scope.row)"
            >审核</el-button>
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
import { getAuditData } from "@/api/merchant";
import { getAuditCascaderData } from "@/api/commodity";
export default {
  name: "merchant_audited",
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
      appliStatus:{  //审核状态
        '-1':{name:'未审核',tag:'info'},
        0:{name:'未通过',tag:'danger'},
        1:{name:'已通过',tag:'success'},
      },

      rulesForm: {
        name: "",
        merchant_id: "",
        application_status: "",
        boutique: "",
        merchant_type: "",
        genre_one: "",
        genre_two: ""
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
  computed: {
    towGenerDisabled() {
      return this.rulesForm.genre_one || this.rulesForm.genre_one === 0
        ? false
        : true;
    }
  },
  created() {
    this.tableHeight.height = window.innerHeight - 330 + "px";
    getAuditData({ limit: this.limit, page: this.page })
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

    onAuditClick(record) {
      this.$router.push({
        path: `/merchant/audited/info/${record.id}`
      });
    },
    onLimitChange(val) {
      this.limit = val;
      this.getData();
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
            ...this.rulesForm
          };
          this.tableLoading = true;
          return getAuditData(this.$filterParams(params));
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
    },
    genreFormatter(row, col) {
      return row.genre == "1" ? "个人商家" : "企业商家";
    },
    appliStatusFormat(row, col) {
      let ret = "";
      switch (row.application_status) {
        case -1:
          ret = "未审核";
          break;
        case 0:
          ret = "未通过";
          break;
        case 1:
          ret = "已通过";
          break;
      }
      return ret;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
// .el-col { min-width: 330px}
</style>
