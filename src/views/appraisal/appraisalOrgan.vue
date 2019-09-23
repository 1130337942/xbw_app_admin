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
        <el-form-item label="服务方式" prop="name">
          <el-input v-model="rulesForm.name" clearable @clear="onSearchClick" placeholder="请输入服务方式"></el-input>
        </el-form-item>
        <el-form-item label-width="0px" prop="release">
          <el-radio-group v-model="rulesForm.release" @change="onSearchClick">
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="1">显示</el-radio-button>
              <el-radio-button :label="0">不显示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="onSearchClick"
          native-type="submit"
        >搜索</el-button>
        <el-button
          type="info"
          @click="onResetClick"
          icon="el-icon-refresh"
        >重置</el-button>
      </el-form>
    </div>
    <div class="table-box">
        <el-button type="danger" icon="el-icon-delete" @click="onDeleteClick" plain :disabled="selectArr.length<1">删除</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onAddClick" plain>添加</el-button>
      <el-table
        size="medium"
        :data="tableData.items"
        :height="tableHeight"
        v-loading="tableLoading"
        style="width: 100%;margin-top:10px;"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" min-width="40px"></el-table-column>
        <el-table-column label="排序" prop="sort" min-width="140px">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.sort"
              controls-position="right"
              @change="onSwitchChange(scope.row,'sort')"
            ></el-input-number>
          </template>
        </el-table-column>
        <!-- <el-table-column label="服务图标" prop="" min-width="100px"></el-table-column> -->
        <el-table-column label="服务名称" prop="name" min-width="100px"></el-table-column>
        <el-table-column label="是否显示" min-width="60px">
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.release"
                    :active-value="1"
                    :inactive-value="0"
                    @change="onSwitchChange(scope.row,'release')"
                ></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="是否推荐" min-width="60px">
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.recommend"
                    :active-value="1"
                    :inactive-value="0"
                   @change="onSwitchChange(scope.row,'recommend')"
                ></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="时间" prop="create_time" min-width="110px"></el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain @click="onEditClick(scope.row)">修改</el-button>
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
import { getExpertOrgList , editExpertOrgStatus , delExperOrgData } from "@/api/appraisal";
export default {
  name: "appraisal_appraisalOrgan",
  data() {
    return {
      rulesForm: {
        name:'',
        release:false,
      },
      tableData: {
        items: [],
        total: 0
      },
      page: 1,
      limit: 10,
      tableHeight: 0,
      tableLoading: false,

      selectArr:[],
    };
  },
  activated() {
    this.getData();
  },
  created() {
    this.tableHeight = window.innerHeight - 330 + "px";
  },
  methods: {
    getData() {
      let params = {
        page:this.page,
        limit:this.limit,
        ...this.rulesForm
      }
      this.tableLoading = true;
      getExpertOrgList(this.$filterParams(params)).then(res => {
        this.tableData = {
          items:res.items,
          total:res.total
        }
        this.tableLoading = false
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
        path:`/appraisal/appraisalOrgan/info/${record.id}`,
      })
    },
    onAddClick() {
      this.$router.push({
        path:`/appraisal/appraisalOrgan/info/-1`,
      })
    },
    onDeleteClick() {
      let orgIds = this.selectArr.map(item=>item.id);
      delExperOrgData({org_ids:orgIds.join(',')}).then(res=>{
        this.$message.success('删除成功!');
        this.getData();
      })
    },

    
    onSwitchChange(record, target) {
      editExpertOrgStatus({
        org_id: record.id,
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
    onSelectionChange(selects) {
      this.selectArr = selects;
    },
    onLimitChange(val){
        this.limit = val
        this.getData();
    },
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
</style>
