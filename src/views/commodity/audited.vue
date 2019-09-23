<template>
  <div class="panelBox">
    <div class="top">
      <el-form
        :model="rulesForm"
        :inline="true"
        label-width="75px"
        ref="ruleForm"
        class="demo-ruleForm"
        label-position="left"
        @submit.native.prevent
      >
        <el-form-item prop="name" label="商品名称:">
          <el-input v-model="rulesForm.name" clearable @clear="onSearchClick"></el-input>
        </el-form-item>
        <el-form-item prop="merchant_id" label="所属商铺:">
          <el-select
            v-model="rulesForm.merchant_id"
            :filterable="true"
            :remote="true"
            :clearable="true"
            @remote-method="uploadMerchantData"
            @clear="onSearchClick"
            @change="onSearchClick"
          >
            <el-option
              v-for="(item,index) in merchantData"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="application_status" label="审核状态:" label-width="90px">
          <el-radio-group v-model="rulesForm.application_status" @change="onSearchClick">
            <el-radio-button :label="-1">待审核</el-radio-button>
            <el-radio-button :label="1">通过</el-radio-button>
            <el-radio-button :label="0">失败</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="boutique" label="是否为精品:" label-width="90px">
                    <el-radio-group v-model="rulesForm.boutique" @change="onSearchClick">
                        <el-radio-button :label="1">是</el-radio-button>
                        <el-radio-button :label="0">否</el-radio-button>
                        <el-radio-button :label="false">全部</el-radio-button>
                    </el-radio-group>
        </el-form-item>-->
        <el-form-item label="一级分类:" prop="genre_one">
          <el-select
            v-model="rulesForm.genre_one"
            @clear="onSearchClick"
            @change="onOneGenerChange"
            clearable
          >
            <el-option
              v-for="(item,index) in classisOneData"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="genre_two" label="二级分类:">
          <el-select
            v-model="rulesForm.genre_two"
            @clear="onSearchClick"
            @change="onSearchClick"
            :disabled="towGenerDisabled"
            clearable
            ref="genreTwoSelect"
          >
            <el-option
              v-for="(item,index) in classisTwoData"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
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
        <el-table-column label="商品编号" prop="id" min-width="200px" align="center"></el-table-column>
        <el-table-column label="商品名称" min-width="200px" align="center" :formatter="nameFormmter"></el-table-column>
        <el-table-column
          label="所属店铺"
          min-width="200px"
          align="center"
          :formatter="merchantFormmter"
        ></el-table-column>
        <el-table-column
          label="一级类别"
          min-width="200px"
          align="center"
          :formatter="generOneFormmter"
        ></el-table-column>
        <el-table-column
          label="二级类别"
          min-width="200px"
          align="center"
          :formatter="generTwoFormmter"
        ></el-table-column>
        <el-table-column label="价格" min-width="200px" align="center" :formatter="priceFormmter"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" min-width="200px" align="center"></el-table-column>
        <el-table-column label="操作" min-width="100px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.application_status!='-1'"
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
import { getMerchantData } from "@/api/merchant";
import { getAuditData, getAuditCascaderData } from "@/api/commodity";
export default {
  name: "commodity_audited",
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
        application_status: -1,
        boutique: false,
        genre_one: "",
        genre_two: ""
      },
      statusData: [],
      merchantData: [],
      classisOneData: [],
      classisTwoData: [],
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
    getMerchantData({ limit: 20, page: 1 }).then(res => {
      this.merchantData = res.items;
    });
    this.getCascaderData();
  },
  activated() {
    this.getData()
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
        path: "/commodity/audited/info",
        query: {
          formData: record,
          review_id: record.id,
          reply: record.message
        }
      });
    },
    onOneGenerChange(val) {
      val || val === 0 ? this.getCascaderData(val * 1) : null;
      this.rulesForm.genre_two = "";
    },
    uploadMerchantData(query) {
      if (query !== "") {
        getMerchantData({ name: query, limit: 50, page: 1 }).then(res => {
          this.merchantData = res.items;
        });
      }
    },
    nameFormmter(record, column, cellValue) {
      return record.snapshot.name;
    },
    priceFormmter(record, column, cellValue) {
      return record.snapshot.price;
    },
    merchantFormmter(record, column, cellValue) {
      return record.merchant_info.name;
    },
    generOneFormmter(record, column, cellValue) {
      return record.snapshot.genre_one || "";
    },
    generTwoFormmter(record, column, cellValue) {
      return record.snapshot.genre_two || "";
    },
    getData() {
      let params = {
        page: this.page,
        limit: this.limit,
        ...this.rulesForm
      };
      this.tableLoading = true;
      getAuditData(this.$filterParams(params))
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
    getCascaderData(id) {
      let params = !id && id !== 0 ? {} : { superior_id: id };
      getAuditCascaderData(params).then(res => {
        if (id !== undefined) {
          this.classisTwoData = res;
          this.$refs["genreTwoSelect"].focus();
        } else {
          this.classisOneData = res;
        }
      });
    },
    onLimitChange(val) {
      this.limit = val;
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
// .el-col { min-width: 330px}
</style>
