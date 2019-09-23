<template>
  <div class="panelBox">
    <div class="searchBox">
      <el-form
        :model="rulesForm"
        :inline="true"
        label-width="75px"
        ref="ruleForm"
        class="demo-ruleForm"
        label-position="left"
        @submit.native.prevent
      >
        <el-form-item label="鉴定方式" prop="appraisal_way">
          <el-select v-model="rulesForm.appraisal_way" @change="onSearchClick" clearable @clear="onSearchClick">
            <el-option 
              v-for="item in genreArr"
              :key = item.value
              :label="item.label" 
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务方式" prop="server_way">
          <el-input v-model="rulesForm.server_way" clearable @clear="onSearchClick" placeholder="请输入服务方式"></el-input>
        </el-form-item>
        <el-form-item label="鉴宝类别" prop="genre">
          <el-select v-model="rulesForm.genre" @change="onSearchClick" clearable @clear="onSearchClick">
            <el-option 
              v-for="item in apparisalType"
              :key="item.id"
              :label="item.name" 
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专家/机构" prop="expert_or_org">
          <el-input v-model="rulesForm.expert_or_org" clearable @clear="onSearchClick" placeholder="请输入专家、机构的名称"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="appraisal_status">
          <el-select v-model="rulesForm.appraisal_status" @change="onSearchClick" clearable @clear="onSearchClick">
            <el-option label="待支付" :value="'-3'"></el-option>
            <el-option label="未鉴定" :value="'-2'"></el-option>
            <el-option label="已拒绝" :value="'-1'"></el-option>
            <el-option label="退款中" :value="0"></el-option>
            <el-option label="已鉴定" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="onSearchClick"
          native-type="submit"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          type="info"
          @click="onResetClick"
        >重置</el-button>
      </el-form>
    </div>
    <div class="table-box">
      <el-table
        size="medium"
        :data="tableData.items"
        :height="tableHeight"
        v-loading="tableLoading"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column type="select" min-width="40px"></el-table-column>
        <!-- <el-table-column label="订单编号" prop="order_id" min-width="100px"></el-table-column> -->
        <el-table-column label="鉴宝方式" min-width="100px" :formatter="genreFormatter"></el-table-column>
        <el-table-column label="鉴宝类别" min-width="100px" >
          <template slot-scope="scope">
            {{scope.row.appraisal_info.genre}}
          </template>
        </el-table-column>
        <el-table-column label="服务方式" prop="server_way" min-width="100px"></el-table-column>
        <el-table-column label="专家/机构" prop="expert_or_org" min-width="100px"></el-table-column>
        <el-table-column label="订单金额" prop="appraisal_fee" min-width="100px"></el-table-column>
        <el-table-column label="订单状态" prop="appraisal_status" min-width="100px">
          <template slot-scope="scope">
            <el-tag
              size="medium"
              :type="orderStatus[scope.row.appraisal_status].type"
              close-transition
            >{{orderStatus[scope.row.appraisal_status].label}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="create_time" min-width="100px"></el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain @click="onEditClick(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textCenter">
        <el-pagination
          style="margin-top:5px;"
          @size-change="onLimitChange"
          @current-change="onPageChange"
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
import { getAppraisalList , apparisalType } from "@/api/appraisal";
import { mapActions } from 'vuex';
import { type } from 'os';
export default {
  name: "appraisal_list",
  data() {
    return {
      rulesForm: {
        appraisal_way:'',
        server_way:'',
        genre:'',
        expert_or_org:'',
        appraisal_status:'',
      },
      tableData: {
        items: [],
        total: 0
      },
      genreArr:[  //鉴定方式
        {label:"极速鉴定",value:1},
        {label:"专家鉴定",value:2},
        {label:"机构鉴定",value:3}
      ],
      orderStatus:{
        '-3':{label:'待支付',type:''},
        '-2':{label:'未鉴定',type:'warning'},
        '-1':{label:'已拒绝',type:'danger'},
        0:{label:'退款中',type:'info'},
        1:{label:'已鉴定',type:'success'},
      },
      page: 1,
      limit: 10,
      tableHeight: 0,
      tableLoading: false
    };
  },
  computed:{
    apparisalType(){
      return this.$store.state.appraisal.expertType;
    }
  },
  activated() {
    this.getData();
  },
  created() {
    this.tableHeight = window.innerHeight - 300 + "px";
    this.changeExpertTypeData();
  },
  methods: {
    getData() {
      let params = {
        page:this.page,
        limit:this.limit,
        ...this.rulesForm
      }
      getAppraisalList(this.$filterParams(params)).then(res => {
        this.tableData = {
            items:res.items,
            total:res.total
        }
      });
    },
    onSearchClick() {
      this.page = 1;
      this.getData();
    },
    onResetClick(){
      this.$refs['ruleForm'].resetFields();
      this.limit = 10
      this.onSearchClick()
    },
    onPageChange(val) {
      this.getData();
    },
    onEditClick(record) {
      this.$router.push({
        path:`/appraisal/list/info/${record.id}`,
        query:{
          order_id:record.order_id
        }
      })
    },
    onLimitChange(val){
        this.limit = val
        this.getData();
    },
    appraisalStatus(row,col){
      let ret = '';
      switch (row.appraisal_status) {
        case 1:
          ret='待支付';
          break;
        case 2:
          ret='未鉴定';
          break;
        case 3:
          ret='已鉴定';
          break;
        case 4:
          ret='已拒绝';
          break;
      }
      return ret
    },

    genreFormatter(row,col){
      return this.genreArr.filter(item=>{
        return item.value == row.genre;
      })[0].label
    },
    ...mapActions('appraisal',['changeExpertTypeData'])
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
</style>
