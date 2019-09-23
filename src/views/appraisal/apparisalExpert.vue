<template>
  <div class="panelBox">
    <div class="searchBox">
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
        <el-form-item label="专家姓名" prop="name">
          <el-input v-model="rulesForm.name" clearable @clear="onSearchClick" placeholder="请输入专家姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="rulesForm.phone" clearable @clear="onSearchClick" placeholder="请输入电话号码"></el-input>
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
        <el-table-column label="专家姓名" prop="name" min-width="100px"></el-table-column>
        <el-table-column label="手机电话" prop="phone" min-width="100px"></el-table-column>
        <el-table-column label="排序" min-width="140px">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.sort"
              controls-position="right"
              @change="onSwitchChange(scope.row,'sort')"
            ></el-input-number>
          </template>
        </el-table-column>
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
        <el-table-column label="精选专家" min-width="60px">
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.featured"
                    :active-value="1"
                    :inactive-value="0"
                    @change="onFeaturedChange(scope.row)"
                ></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="推荐专家" min-width="60px">
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

    <el-dialog title="请选择推荐该专家的类型" :visible.sync="dialogVisit" @close="onClose" width="40%">
      <el-form ref="dialogForm" :model="dialogForm" label-position="top">
        <el-form-item label="专家类型:" prop="genre">
          <el-select v-model="dialogForm.genre" @change="onDialogSelectChange" :loading="featureLoading">
            <el-option
              v-for="item in featureArr"
              :key="item.genre_info.id"
              :label="item.genre_info.genre_name"
              :value="item.genre_info.genre"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型级别:">
          <span style="margin-left:10px;font-size:18px;">{{dialogForm.level}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dialogVisit=false">取消</el-button>
        <el-button type="primary" @click="onSaveDialogClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getExpertData , uploadExpertStatus , getExpertGenreData , delExpertData , uploadFeatureStatus } from "@/api/appraisal";
export default {
  name: "appraisal_apparisalExpert",
  data() {
    return {
      rulesForm: {
        name:'',
        phone:'',
      },
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
      dialogVisit:false,
      dialogForm:{
        genre:'',
        level:'',
        expert_id:''
      },
      featureArr:[],
      featureLoading:false,
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
      getExpertData(this.$filterParams(params)).then(res => {
        this.tableData={
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
        path:`/appraisal/apparisalExpert/info/${record.id}`
      })
    },
    onAddClick() {
      this.$router.push({
        path:`/appraisal/apparisalExpert/info/-1`
      })
    },
    onDeleteClick() {
      let delArr = this.selectArr.map(item => {
        return item.id;
      });
      delExpertData({ expert_ids: delArr.join(",") }).then(res => {
        this.$message.success("删除成功!");
        this.getData();
      });
    },
    onSelectionChange(selects){
        this.selectArr = selects;
    },
    onSwitchChange(record,target){
      uploadExpertStatus({
          expert_id: record.id,
          key: target,
          value: record[target]
        }).then(res => {
          this.$message.success("修改成功!");
          // this.getData();
        }).catch(err=>{this.getData();console.log(err)})
    },
    onFeaturedChange(record){
      if(record.featured===1){
        this.featureLoading = true;
        getExpertGenreData({expert_id:record.id})
        .then(res=>{
          if(res.length>0){
            this.featureArr = res;
            this.dialogForm.expert_id = record.id;
            this.featureLoading = false;
          }else{
            this.$alert('该专家没有可选分类,故无法标记为精选专家', '提示', {
              confirmButtonText: '知道了',
            });
            this.getData();
          }
        })
        .catch(err=>{
          console.log(err);
          this.featureLoading = false;
        });
        this.dialogVisit = true;
      }else{
        this.onSwitchChange(record,'featured')
      }
    },
    onDialogSelectChange(val){
      let level = this.featureArr.filter(item=>item.genre_info.genre===val)[0].genre_info.level
      this.dialogForm.level = level;
    },
    onSaveDialogClick(){
      this.$refs.dialogForm.validate()
      .then(()=>uploadFeatureStatus({...this.dialogForm}))
      .then(res=>{
        this.$message.success('修改成功');
        this.dialogVisit = false;
      })
      .catch(err=>{console.log(err);this.dialogVisit = false;})
    },
    onClose(){
      this.$refs.dialogForm.resetFields();
      this.getData();
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
