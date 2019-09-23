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
        <el-form-item label="服务名称" prop="name">
          <el-input
            v-model="rulesForm.name"
            clearable
            @clear="onSearchClick"
            placeholder="请输入服务名称"
          ></el-input>
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
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="onDeleteClick"
        plain
        :disabled="selectArr.length<1"
      >删除</el-button>
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
        <el-table-column label="服务名称" prop="name" min-width="100px"></el-table-column>
        <el-table-column label="服务类别" prop="genre_name" min-width="100px"></el-table-column>
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
        <!-- <el-table-column label="时间" prop min-width="120px"></el-table-column> -->
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
    <el-dialog title="机构服务" :visible.sync="dialogVisit" @close="onDialogClose">
      <el-form
        :model="dialogForm"
        :rules="rules"
        ref="dialogForm"
        :inline="false"
        label-width="80px"
        class="tableDialogForm"
      >
        <el-form-item label="服务图标" prop="icon">
          <div class="imageCon" @click="onCheckImgClick" v-if="dialogForm.icon">
            <img
              v-lazy="domain+dialogForm.icon+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
              class="imageCon_icon"
            />
          </div>
          <div class="imageCon" @click="onCheckImgClick" v-else>
            <div class="imageCon_icon">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="dialogForm.name" :maxlength="16" style="width:300px">
            <span slot="suffix">{{dialogForm.name.length||0}}/16</span>@select="handleSelect"
          </el-input>
        </el-form-item>
        <el-form-item label="服务类别" prop="serves_genre">
          <el-select v-model="dialogForm.serves_genre">
            <el-option
              v-for="item in apparisalType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisit=false">取消</el-button>
        <el-button @click="onSaveClick" type="primary">确定</el-button>
      </div>

      <el-dialog title="图片资源" :visible.sync="dialogVisible" @close="onClose" :append-to-body="true">
        <resources ref="resources" :checkLength="1" />
        <div class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button @click="onCheckChange" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import {
  getServiceList,
  editServiceStatus,
  saveServiceData,
  delServiceData
} from "@/api/appraisal";
import { mapActions } from "vuex";
import resources from "@/components/resources";
export default {
  components: {
    resources
  },
  name: "appraisal_service",
  data() {
    return {
      rulesForm: {
        name: "",
      },
      tableData: {
        items: [],
        total: 0
      },
      page: 1,
      limit: 10,
      tableHeight: 0,
      tableLoading: false,
      selectArr: [],

      dialogVisit: false,
      dialogVisible: false,
      dialogForm: {
        icon: "",
        name: "",
        serves_genre: ""
      },
      rules: {
        icon: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        name: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        serves_genre: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    domain() {
      return this.$domainUrl();
    },
    apparisalType() {
      return this.$store.state.appraisal.expertType;
    }
  },
  activated() {
    this.getData();
  },
  created() {
    this.tableHeight = window.innerHeight - 330 + "px";
    this.changeExpertTypeData();
  },
  methods: {
    getData() {
      let params = {
        page: this.page,
        limit: this.limit,
        ...this.rulesForm
      };
      this.tableLoading = true;
      getServiceList(this.$filterParams(params)).then(res => {
        this.tableData = {
          items: res.items,
          total: res.total
        };
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
    onEditClick(record) {
      this.dialogForm = {
        serves_id: record.id,
        icon: record.icon,
        name: record.name,
        serves_genre: record.serves_genre
      };
      this.dialogVisit = true;
    },
    onAddClick(record) {
      this.dialogVisit = true;
    },
    onDeleteClick() {
      delServiceData({
        serves_ids: this.selectArr.map(item => item.id).join(",")
      }).then(res => {
        this.$message.success("删除成功!");
        this.getData();
      });
    },

    onSaveClick(record) {
      let params = { ...this.dialogForm };
      this.$refs["dialogForm"]
        .validate()
        .then(() =>
          saveServiceData(params, params.serves_id || params.serves_id === 0)
        )
        .then(res => {
          this.$message.success("保存成功!");
          this.getData();
          this.dialogVisit = false;
        })
        .catch(err => console.log(err));
    },
    onDialogClose() {
      this.dialogForm = {
        icon: "",
        name: "",
        serves_genre: ""
      };
      this.$refs["dialogForm"].clearValidate();
    },
    onClose() {
      this.$refs["resources"].api_clearCheck();
    },

    
    onCheckImgClick(type) {
      this.dialogVisible = true;
    },
    onCheckChange() {
      let data = this.$refs["resources"].api_getcheckItem();
      this.dialogForm.icon = this.$replaceUrl(data[0].url);
      this.dialogVisible = false;
    },
    onSwitchChange(record, target) {
      console.log(record)
      editServiceStatus({
        serves_id: record.id,
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
    ...mapActions("appraisal", ["changeExpertTypeData"])
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
.imageCon {
  width: 120px;
  height: 120px;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  .imageCon_icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.tableDialogForm {
  width: 80%;
  min-width: 450px;
  margin: 0 auto;
}
</style>
