<template>
  <div class="ad-box">
      
    <div class="top">
      <img @click="onBackClick" class="image" src="../../assets/images/back.png">
      <el-form
        :model="ruleForm"
        :inline="true"
        ref="ruleForm"
        label-width="75px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-form-item label="新闻标题:">
            <el-input @input="clearInput" @clear="onSearchBtn" clearable v-model="ruleForm.title" placeholder="请输入新闻标题"></el-input>
          </el-form-item>
          <!-- <el-col :span="12">
            <el-form-item label="新闻标题:">
              <el-input @input="clearInput" @clear="onSearchBtn" clearable v-model="ruleForm.title"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="6">
            <el-form-item label="是否置顶:">
              <el-switch active-value="1" inactive-value="0" v-model="ruleForm.top"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否推荐:">
              <el-switch active-value="1" inactive-value="0" v-model="ruleForm.top"></el-switch>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-form-item style="margin-top: 10px;">
          <el-button style="margin-left: 75px;" type="primary" @click="onSearchBtn">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="table-box">
      <el-button @click="onDelBtn" plain type="danger">删除</el-button>
      <el-button @click="onAddBtn" plain type="primary">添加</el-button>
      <el-table
        size="medium"
        :height="tableHeight.height"
        :data="tableData.items"
        @selection-change="onCheckTableSelect"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="新闻编号" min-width="120" :formatter="newIdformat"></el-table-column>
        <el-table-column prop="title" label="新闻标题" min-width="120" :formatter="newTitleformat"></el-table-column>
        <el-table-column prop="seo_title" label="副标题" min-width="180" :formatter="newSeoTitleformat"></el-table-column>
        <el-table-column label="是否置顶" min-width="100">
          <template slot-scope="scope">
            <el-switch @change="onSwitchChange(scope.row,'top')" v-model="scope.row.top" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否推荐" min-width="100">
          <template slot-scope="scope">
            <el-switch @change="onSwitchChange(scope.row,'recommend')" v-model="scope.row.recommend" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" min-width="100">
          <template slot-scope="scope">
            <el-switch @change="onSwitchChange(scope.row,'release')" v-model="scope.row.release" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="180">
          <template slot-scope="scope">
            <!-- <el-input v-model="scope.row.sort" @focus="sortOld=scope.row.sort;" @blur="(sortOld*1)==(scope.row.sort*1)?null:onSwitchChange(scope.row,'sort');"></el-input> -->
            <el-input-number v-model="scope.row.sort" controls-position="right" :min="1"  @change="onSwitchChange(scope.row,'sort');"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="阅读量" min-width="140px">
          <template slot-scope="scope">
              <el-input-number v-model="scope.row.reading_volume" controls-position="right" @change="onSwitchChange(scope.row,'reading_volume')" :min="0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="180"></el-table-column>
        <el-table-column label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="danger" icon="el-icon-delete" @click="onTableDelBtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textCenter">
        <el-pagination
          style="margin-top:5px;"
          @current-change="onCurrentChange"
          :current-page.sync="page"
          layout="total, prev, pager, next, jumper"
          :total="tableData.total"
        ></el-pagination>
      </div>

    </div>
    <el-dialog
      title="添加新闻" 
      :visible.sync="dialogFormVisible"
      @open="onAddWindowOpen"
      width="80%"
    >
      <add-column-news ref="addNewsWindow" :columnId="column_id" @uploadTable="getData" @closeWindow="dialogFormVisible=false"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onWindowSave">确 定</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog
      title="修改新闻排名" 
      :visible.sync="sortWindow"
      width="30%"
    >
      <el-input v-model="sort"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button @click="sortWindow = false">取 消</el-button>
        <el-button type="primary" @click="onSortWindowSave">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { getColumnNewsData , addNewsListData , delColumnNews , editNewsListData} from '@/api/newCenter';
import addColumnNews from '@/views/newsCenter/addColumnNews'
export default {
  components:{
    addColumnNews
  },
  data() {
    return {
      plateStore:[],
      ruleForm:{
        // keyword:'',
      },
      column_id:'',

      page: 1,
      tableData: {
          total:0,
          items:[],
      },
      tableLoading:false,
      
      tableHeight: { height: "" },
      selectionTab: [],
      
      dialogFormVisible:false,
      editForm:{
        name:'',
        superior_id:'',
        introduction:''
      },
      isEdit:false,
      editRules:{
        name:[{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        superior_id:[{ required: true, message: '请选择所属板块', trigger: 'change' }],
      },

      sort:'',
      sortOld:'',
      sortWindow:false,
      sortRecord:{},
    };
  },
  computed: {
    getDataParams(){
      return {
        column_id:this.column_id,
        page:this.page,
        ...this.ruleForm,
      }
    }
  },
  created() {
    this.tableHeight.height = window.innerHeight - 330 + "px";
    this.column_id = this.$route.params.id;
    this.getData();
  },
  methods: {
    onSearchBtn() {
      this.getData();
    },
    clearInput() {
      if (this.ruleForm.title == "") {
        this.getData();
      }
    },
    onCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    getData() {
      getColumnNewsData(this.getDataParams).then(res => {
        this.tableData = {
          items:res.items,
          total:res.total
        }
      }).catch(()=>{console.log('promise.warn!!')})
    },
    onDelBtn(){
      if (this.selectionTab.length > 0) {
        let seleteId = [];
        for (const item of this.selectionTab) {
          seleteId.push(item.id);
        }
        delColumnNews({ news_ids: seleteId.join(",")})
          .then(res => {
            this.$message.success("删除成功");
            this.getData();
            this.selectionTab = [];
          }).catch((err)=>{console.log('promise.warn!!',err)});
      } else {
        this.$message.error("请先选择需要删除的新闻");
      }
    },
    onAddBtn() {
      this.dialogFormVisible = true;
    },
    onTableDelBtn(row) {
      delColumnNews({news_ids:row.id})
        .then(res => {
          this.$message.success("删除成功");
          this.getData();
        }).catch((err)=>{console.log('promise.warn!!',err)})
    },
    onCheckTableSelect(selection) {
      this.selectionTab = selection;
    },

    onAddWindowOpen(){  //初始化
      const addNewsWindow = this.$refs['addNewsWindow'];
      if(addNewsWindow){
        addNewsWindow.init();
      }
    },
    onWindowSave(){  //保存
      this.$refs['addNewsWindow'].getSelectData()
    },

    onSwitchChange(record,type,sort){
      let params = {
          news_id : record.id,
          column_id : this.column_id *1,
          value : sort||record[type],
          key : type,
      };
      // return
      editNewsListData(params).then(res => {
          this.$message.success('修改成功')
      }).catch((err)=>{console.log(err);this.getData();})
    },
    onBackClick(){
      this.$router.back();
    },
    newIdformat(record){
      return record.news_info.id
    },
    newTitleformat(record){
      return record.news_info.title
    },
    newSeoTitleformat(record){
      return record.news_info.seo_title
    }
    // onSortChange(){

    // },
    // onSortWindowSave(){
    //   this.onSwitchChange(this.sortRecord,'sort',this.sort)
    // },
  }
};
</script>

<style lang="scss" scoped>
.ad-box {
  height: 100%;
  .top {
    padding-left: 20px;
    background-color: #fff;
    height: 100px;
    display: flex;
    align-items: center;
    position: relative;
    .image {
      position: absolute;
      top: 0;
      right: 0;
      width: 44px;
      height: 44px;
      cursor: pointer;
      z-index: 1000;
    }
    .demo-ruleForm {
      width: 100%;
      .el-input {
        width: 250px;
      }
    }
    .el-form-item {
      margin-bottom: 0px !important;
    }
  }
  .table-box {
    margin-top: 10px;
    background-color: #fff;
    padding: 20px;
  }
  .el-image {
    border: solid 1px #eee;
    padding: 5px 0;
  }
  // .img-box{
  //     border: solid 1px #eee;
  //     padding: 5px 0;
  // }
}
</style>

