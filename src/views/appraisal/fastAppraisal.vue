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
        <el-form-item label="鉴宝类别" prop="genre">
          <el-select
            v-model="rulesForm.genre"
            @change="onSearchClick"
            clearable
            @clear="onSearchClick"
          >
            <el-option
              v-for="item in apparisalType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="onSearchClick"
          native-type="submit"
        >搜索</el-button>
      </el-form>
    </div>
    <div class="table-box">
      <el-button plain type="danger" icon="el-icon-delete" @click="onDeleteClick" :disabled="selectArr.length<1">删除</el-button>
      <el-button plain type="primary" icon="el-icon-circle-plus-outline" @click="onAddClick">添加</el-button>
      <el-table
        size="medium"
        :data="tableData.items"
        :height="tableHeight"
        v-loading="tableLoading"
        style="width: 100%;margin-top:10px;"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" min-width="40px"></el-table-column>
        <el-table-column label="鉴宝类型" prop="genre_name" min-width="100px"></el-table-column>
        <el-table-column label="排序" min-width="140px">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.sort"
              controls-position="right" 
              @change="onSwitchChange(scope.row,'sort')"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="鉴宝价格" prop="fee" min-width="100px"></el-table-column>
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

    <el-dialog title="添加极速鉴宝" :visible.sync="dialogVisit" width="40%" @close="onDialogClose">
      <el-form
        :model="dialogForm"
        :inline="true"
        :rules="rules"
        label-width="90px"
        label-position="left"
        ref="dialogForm"
        size="medium"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="鉴定类型:" prop="genre">
              <el-select v-model="dialogForm.genre">
                <el-option
                  v-for="item in apparisalType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="isDisabled(item.id)"
                ></el-option>
              </el-select>
              <!-- {{disableApparisalType.indexOf(item.id)}}
              {{dialogForm.genre}}-->
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="鉴定价格:" prop="fee">
              <el-input type="number" v-model="dialogForm.fee" :maxlength="9"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisit = false">取 消</el-button>
        <el-button type="primary" @click="onSaveClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getFastAppraisalList,
  editFastAppraisalStatus,
  getAppraisalType,
  saveFastAppraisalData,
  delFastAppraisalData
} from "@/api/appraisal";
export default {
  name: "appraisal_fastAppraisal",
  data() {
    let positiveInteger = this.$positiveInteger;
    return {
      rulesForm: {
        genre: ""
      },
      selectArr: [],

      dialogVisit: false,
      isEdit: false,
      dialogForm: {
        genre: "",
        fee: "",
        sort: 0,
        release: 0
      },
      rules: {
        genre: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        fee: [{ required: true, message: "该项为必填项", trigger: "blur" },/*{validator:positiveInteger}*/],
        sort: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        release: [{ required: true, message: "该项为必填项", trigger: "blur" }]
      },

      tableData: {
        items: [],
        total: 0
      },
      apparisalType: [],
      disableApparisalType: [], //重复的鉴宝类型
      page: 1,
      limit: 10,
      tableHeight: 0,
      tableLoading: false
    };
  },
  activated() {
    this.getData();
    getAppraisalType().then(res => {
      this.apparisalType = res;
    });
  },
  created() {
    this.tableHeight = window.innerHeight - 330 + "px";
  },
  methods: {
    getData() {
      let params = {
        page: this.page,
        limit: this.limit,
        ...this.rulesForm
      };
      this.tableLoading = true;
      getFastAppraisalList(this.$filterParams(params))
        .then(res => {
          this.tableData = {
            items: res.items,
            total: res.total
          };
          this.disableApparisalType = res.items.map(item => {
            //获取已生成的鉴宝类型
            return item.genre;
          });
          this.tableLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    onSearchClick() {
      this.page = 1;
      this.getData();
    },
    onPageChange(val) {
      this.getData();
    },
    onSwitchChange(record, target) {
      editFastAppraisalStatus({
        direct_id: record.id,
        key: target,
        value: record[target]
      }).then(res => {
        this.$message.success("修改成功!");
        // this.getData();
      }).catch(err=>{this.getData();console.log(err)})
    },
    onSelectChange(selects) {
      this.selectArr = selects;
    },
    onAddClick() {
      this.isEdit = false;
      this.dialogVisit = true;
    },
    onEditClick(record) {
      this.isEdit = record.id;
      this.dialogVisit = true;
      this.dialogForm = {
        genre: record.genre,
        fee: record.fee
      };
    },
    onDeleteClick() {
      let delArr = this.selectArr.map(item => {
        return item.id;
      });
      delFastAppraisalData({ direct_ids: delArr.join(",") }).then(res => {
        this.$message.success("删除成功!");
        this.getData();
      });
    },
    onSaveClick() {
      let params = {
        ...this.dialogForm
      };
      this.isEdit===false?null:(params.direct_id=this.isEdit);
      this.$refs["dialogForm"]
        .validate()
        .then(() => saveFastAppraisalData(params, this.isEdit !== false))
        .then(res => {
          this.$message.success("保存成功!");
          this.getData();
          this.dialogVisit = false;
        })
        .catch(err => console.log(err));
    },
    onDialogClose(){
      this.dialogForm = {
        genre:'',
        fee:'',
      }
      this.$refs["dialogForm"].clearValidate();
    },
    onLimitChange(val){
        this.limit = val
        this.getData();
    },

    isDisabled(genre) {
      return this.disableApparisalType.indexOf(genre) !== -1;
    },
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
</style>
