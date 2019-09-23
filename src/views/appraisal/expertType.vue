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
        <el-form-item label="专家类型" prop="genre">
          <el-select v-model="rulesForm.genre" @change="onSearchClick" clearable @clear="onSearchClick">
              <el-option
                  v-for="item in apparisalType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专家等级" prop="level">
          <el-input v-model="rulesForm.level" clearable @clear="onSearchClick" placeholder="请输入专家等级" maxlength="10"></el-input>
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
        <el-table-column label="专家类型" prop="genre_name" min-width="100px"></el-table-column>
        <el-table-column label="专家等级" prop="level" min-width="100px"></el-table-column>
        <el-table-column label="图文鉴定" prop="graphic" min-width="100px"></el-table-column>
        <el-table-column label="实物鉴定" prop="physical" min-width="100px"></el-table-column>
        <el-table-column label="上门服务" prop="on_site" min-width="100px"></el-table-column>
        <el-table-column label="排序" min-width="140px">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.sort"
              controls-position="right"
              @change="onSwitchChange(scope.row,'sort')"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" min-width="80px">
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.release"
                    :active-value="1"
                    :inactive-value="0"
                    @change="onSwitchChange(scope.row,'release')"
                ></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain @click="onEditClick(scope.row)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" plain @click="onDeleteClick(scope.row)">删除</el-button>
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
import { getExpertType , editExpertStatus , delExpertType , getAppraisalType } from "@/api/appraisal";
export default {
  name: "appraisal_expertType",
  data() {
    return {
      rulesForm: {
        genre:'',
        level:'',
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
      apparisalType:[]
    };
  },
  activated() {
    this.getData();
    this.getGenreData();
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
      getExpertType(this.$filterParams(params)).then(res => {
        console.log(res);
        this.tableData = {
            items:res.items,
            total:res.total
        }
        this.tableLoading = false;
      }).catch(err=>{console.log(err);this.tableLoading = false;});
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
      console.log(record);
      this.$router.push({
        path:`/appraisal/expertType/info/${record.id}`
      })
    },
    onAddClick() {
      this.$router.push({
        path:`/appraisal/expertType/info/-1`
      })
    },
    onDeleteClick() {
      let delArr = this.selectArr.map(item => {
        return item.id;
      });
      delExpertType({ genre_ids: delArr.join(",") }).then(res => {
        this.$message.success("删除成功!");
        this.getData();
      });
    },
    onSwitchChange(record,target){
      editExpertStatus({
          genre_id: record.id,
          key: target,
          value: record[target]
        }).then(res => {
          this.$message.success("修改成功!");
          // this.getData();
        }).catch(err=>{this.getData();console.log(err)})
    },
    getGenreData(){
        getAppraisalType().then(res=>{
            this.apparisalType = res
        })
    },
    
    onSelectionChange(selects){
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
