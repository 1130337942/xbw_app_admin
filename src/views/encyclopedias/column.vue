<template>
  <div class="panelBox">
    <div class="table-box">
      <el-button
        type="danger"
        plain
        icon="el-icon-delete"
        :disabled="selectArr.length<1"
        @click="onDeleteClick"
      >删除</el-button>
      <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="onAddClick">新增</el-button>
      <el-table
        :data="tableData.items"
        :height="tableHeight"
        size="medium"
        v-loading="tableLoading"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" min-width="80px"></el-table-column>
        <el-table-column prop="id" label="栏目ID" min-width="100px"></el-table-column>
        <el-table-column label="栏目图片" min-width="200px">
          <template slot-scope="scope">
            <div class="tableImg">
              <img v-lazy="domain+scope.row.icon+'?x-oss-process=image/resize,m_fill,h_80,w_80'"  />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="栏目名称" min-width="200px"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="200px"></el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" @click="onEditClick(scope.row)">编辑</el-button>
            <el-button type="info" plain icon="el-icon-document" @click="onToInfoClick(scope.row)">相关百科</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textCenter">
        <el-pagination
          style="margin-top:5px;"
          @size-change="getData"
          @current-change="onPageChange"
          :current-page.sync="page"
          :page-size="limit"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
        ></el-pagination>
      </div>
    </div>

    <el-dialog title="百科栏目" :visible.sync="dialogVisit" @close="onCloseClick">
        <el-form class="tableDialogForm" ref="dialogForm" :model="dialogForm" label-width="80px" :rules="rules">
            <el-form-item label="栏目图标" prop="icon">
                <div class="imageCon" v-if="dialogForm.icon" @click="dialogVisible=true">
                    <img v-lazy="domain + dialogForm.icon + '?x-oss-process=image/resize,m_fill,h_120,w_120'">
                </div>
                <div class="imageCon" v-else @click="dialogVisible=true">
                    <i class="el-icon-plus imageCon_icon"></i>
                </div>
            </el-form-item>
            <el-form-item label="栏目名称" prop="name">
                <el-input v-model="dialogForm.name" :maxlength="20">
                  <span slot="suffix">{{dialogForm.name.length}}/20</span>
                </el-input>
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
import { getAntiqueColumn , savaAntiqueColumn ,  delAntiqueColumn } from "@/api/encylopedias";
import resources from "@/components/resources";
export default {
    components:{resources},
  data() {
    return {
      selectArr: [],
      tableData: {
        items: [],
        total: 0
      },
      page: 1,
      limit: 10,
      tableHeight: "0px",
      tableLoading: false,

      dialogVisit:false,
      dialogForm:{
        icon:'',
        name:'',
      },
      rules:{
        icon:[{required:true,message:'该项为必填项',trigger:'change'}],
        name:[{required:true,message:'该项为必填项',trigger:'blur'}],
      },
      dialogVisible:false,
    };
  },
  computed: {
    domain() {
      return this.$domainUrl();
    }
  },
  created() {
    this.tableHeight = window.innerHeight - 220 + "px";
    this.getData();
  },
  methods: {
    onAddClick() {
        this.dialogVisit = true;
    },
    onEditClick(record) {
        this.dialogForm = {
            column_id:record.id,
            name:record.name,
            icon:record.icon
        }
        this.dialogVisit = true;
    },
    onToInfoClick(record){
      this.$router.push({
        path:`/encyclopedias/list/${record.id}`
      })
    },
    onDeleteClick() {
        let ids = this.selectArr.map(item=>item.id);
        this.$confirm('直接删除栏目,将删除该栏目下的所有百科,是否继续?','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
        })
        .then(()=>delAntiqueColumn({column_ids:ids.join(',')}))
        .then(res=>{
            this.$message.success('删除成功');
            this.getData();
        })
        .catch(err=>console.log(err))
    },
    onPageChange(val) {
      this.getData();
    },
    onSelectChange(selects){
        this.selectArr = selects
    },
    onCheckChange(){
        let data = this.$refs['resources'].api_getcheckItem()[0];
        this.dialogForm.icon = '/' + data.folder_path + data.file_name;
        this.dialogVisible = false;
    },
    onSaveClick(){
        let params = {
            ...this.dialogForm
        };
        this.$refs['dialogForm'].validate()
        .then(()=>savaAntiqueColumn(params,params.column_id||params.column_id===0))
        .then(res=>{
            this.$message.success('保存成功');
            this.getData();
            this.dialogVisit = false;
        }).catch(err=>console.log(err))
    },
    onCloseClick(){
        this.dialogForm = {
            name:'',
            icon:''
        }
        this.$refs['dialogForm'].clearValidate();
    },

    getData() {
      let params = {
        page: this.page,
        limit: this.limit
      };
      this.tableLoading = true;
      getAntiqueColumn(params)
        .then(res => {
          this.tableData = {
            items: res.items,
            total: res.total
          };
          this.tableLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    onClose(){
        this.$refs['resources'].api_clearCheck();
    },
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
.tableImg img {
    width: 80px;
    height: 80px;
}
</style>