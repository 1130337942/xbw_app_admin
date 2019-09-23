<template>
    <div class="ad-box">
      
        <div class="top">
        <el-form
            :model="ruleForm"
            :inline="true"
            ref="ruleForm"
            label-width="75px"
            class="demo-ruleForm"
            @submit.native.prevent
        >
            <!-- <el-row> -->
          <el-form-item label="新闻标题:" style="margin:10px;">
              <el-input @clear="onSearchClick" clearable v-model="ruleForm.title" placeholder="请输入新闻标题"></el-input>
          </el-form-item>
          <el-form-item style="margin:10px;">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="ruleForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"                      
                end-placeholder="结束日期"
                clearable
                @change="onSearchClick"
              >
              </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-top: 10px;">
            <el-button icon="el-icon-search" native-type="submit" type="primary" @click="onSearchClick">搜索</el-button>
            <el-button icon="el-icon-refresh"  type="info" @click="onResetClick">重置</el-button>
          </el-form-item>
        </el-form>
        </div>

        <div class="table-box">
          <el-button @click="onDelBtn" plain type="danger" icon="el-icon-delete">删除</el-button>
          <el-button @click="onAddBtn" plain type="primary" icon="el-icon-circle-plus-outline">添加</el-button>
          <el-table 
            size="medium"
            :data="tableData.items" 
            @selection-change="onSelectionChange" 
            v-loading="tableLoading"
            :height="tableHeight.height"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="新闻编号" min-width="100px"></el-table-column>
            <el-table-column prop="title" label="新闻标题" min-width="100px"></el-table-column>
            <el-table-column prop="seo_title" label="副标题" min-width="100px">
              <template slot-scope="scope">
                  <div class="moreText">{{scope.row.seo_title}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="100px"></el-table-column>
            <el-table-column label="操作" min-width="80" fixed="right">
              <template slot-scope="scope">
                <el-button plain type="primary" icon="el-icon-edit" @click="onEditBtn(scope.row)">修改</el-button>
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
    </div>    
</template>

<script>
import { getNewsData , delNew } from '@/api/newCenter';
export default {
  name:'newsCenter_news',
    data(){
        return {
            ruleForm:{
                title:'',
                time:[]
            },

            page:1,
            tableData:{
                items:[],
                total:0
            },
            tableLoading:false,

            tableSelect:[],
            tableHeight: { height: "" },

        }
    },
    computed :{
        getRuleForm(){
          let data = {
              title: this.ruleForm.title,
              page: this.page,
              column_id:this.columnId,
          }  
          this.ruleForm.time&&this.ruleForm.time[0]?data.start_time=this.ruleForm.time[0]:null;
          this.ruleForm.time&&this.ruleForm.time[1]?data.end_time=this.ruleForm.time[1]:null;
          return  data
        }
    },
    activated(){
      this.getData();
    },
    created(){
      this.tableHeight.height = window.innerHeight - 330 + "px";
    },
    methods: {
        getData(){
            this.tableLoading = true 
            getNewsData(this.getRuleForm).then(res => {
                this.tableLoading = false
                this.tableData = {
                  items:res.items,
                  total:res.total
                }
            }).catch(()=>{console.log('promise.warn!!')})
        },

        onSearchClick(){
          this.page = 1;
          this.getData();
        },
        onResetClick(){
          this.ruleForm = {title:'',time:[]}
          this.limit = 10
          this.onSearchClick()
        },
        onCurrentChange(page){
            this.page = page;
            this.getData();
        },

        onSelectionChange(select){
          this.tableSelect = select;
        },
        onDelBtn(){
          const newsId = this.tableSelect.map(function(item,index){
            return item.id
          })
          if(newsId.length>0){
            this.$confirm('直接删除新闻源将删除相关栏目的新闻记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              var i ;
              delNew({news_ids:newsId.join(',')}).then(res => {
                this.getData();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }).catch(()=>{console.log('promise.warn!!')})
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          }else{
            this.$message.warning('请选择需要删除的新闻!')
          }

        },
        onAddBtn(){
          this.$router.push(
            { path:'/main/newsCenter/news/add'  }
          )
        },
        onEditBtn(record){
          this.$router.push(
            { path:`/main/newsCenter/news/edit/${record.id}`  }
          )
        }
    }
}
</script>

<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
  // .ad-box {
  //   height: 100%;
  //   .top {
  //     padding-left: 20px;
  //     background-color: #fff;
  //     height: 100px;
  //     display: flex;
  //     align-items: center;
  //     .demo-ruleForm {
  //       width: 100%;
  //       .el-input {
  //         width: 250px;
  //       }
  //     }
  //     .el-form-item {
  //       margin-bottom: 0px !important;
  //     }
  //   }
  //   .table-box {
  //     margin-top: 10px;
  //     background-color: #fff;
  //     padding: 20px;
  //     .moreText {
  //       max-height: 70px;
  //       overflow: hidden;
  //       text-overflow: ellipsis;
  //       display: -webkit-box;
  //       -webkit-line-clamp: 3;
  //       -webkit-box-orient: vertical;
  //       }
  //   }
  //   .el-image {
  //     border: solid 1px #eee;
  //     padding: 5px 0;
  //   }
  //   // .img-box{
  //   //     border: solid 1px #eee;
  //   //     padding: 5px 0;
  //   // }
  // }
</style>
