<template>
  <div class="ad-box">
    <div class="table-box">
        <el-button @click="onDelBtn(1)" plain type="danger" icon="el-icon-delete">删除</el-button>
        <el-button @click="onAddBtn(2)" plain type="primary" icon="el-icon-circle-plus-outline">添加轮播图</el-button>
        <el-table
            row-key="id"
            :height="tableHeight.height"
            :data="tableData"
            :loading="loading"
            @selection-change="onTableSelect"
            size="medium"
            style="width: 100%;margin-top:10px;">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column prop="sort" label="排序" min-width="180">
            </el-table-column>
            <el-table-column prop="name" label="轮播名称" min-width="180">
            </el-table-column>
            <el-table-column label="排序" min-width="180">
                <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.sort"
                      controls-position="right"
                      :min="0"
                      @change="onStatusChange(scope.row,'sort')"
                      :disabled="loading"
                    ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="是否显示" min-width="180">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.release" :active-value="1" :inactive-value="0" @change="onStatusChange(scope.row,'release')" :disabled="loading"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="interval" label="轮播时长(s)" min-width="180">
            </el-table-column>
            <el-table-column prop="images" :formatter="tableImages" label="跳转目标" min-width="180">
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="180">
            </el-table-column>
            <el-table-column label="操作"  min-width="180px" fixed="right">
                <template slot-scope="scope">
                  <el-button plain  type="primary" icon="el-icon-view" @click="onLookBtn(scope.row)">查看</el-button>
                  <el-button plain  type="success" icon="el-icon-edit" @click="onEditBtn(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="图片列表" :visible.sync="dialogTableVisible" @closed="diaClose">
          <el-carousel :interval="carouselsec" type="card" height="200px" class="carousel-index">
            <el-carousel-item v-for="(item,index) in carouselList" :key="index">
              <el-image style="height: 200px" @click.native="imgClick(item)" :src="item.url" fit="scale-down"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { getSlidesList , delSlides , editSlidesStatus } from '@/api/slides';
export default {
  data () {
    return {
        tableHeight: { height: '' },
        tableData: [],
        selectionTab:[],
        dialogTableVisible:false,
        carouselList:[],
        carouselsec:0,
        loading:false
    }
  },
  created () {
    this.tableHeight.height = window.innerHeight - 230 + 'px';
    this.getData();
  },
    methods: {
      tableImages(record,column){
        return record.images[1];
      },
      getData(){
        this.loading = true
        getSlidesList({column_id:this.$route.params.id}).then(res=>{
          console.log(res)
          this.loading = false
          this.tableData = res;
        }).catch(()=>{this.loading = false})
      },
      onDelBtn(){
        let ids = this.selectionTab.map(function(item){
          return item.id
        })
        if(ids.length){
          delSlides({carousel_ids:ids.join(',')}).then(res => {
            this.getData()
            this.$message.success('删除成功!')
          }).catch(()=>{})
        }else{
          this.$message.warning('请选择需要删除的数据!')
        }
        
      },
      onAddBtn(){
        this.$router.push({
          path: `/slideshow/slideshowList/addOrEdit/-1`,
          query:{column_id:this.$route.params.id}
        })
      },
      onLookBtn(row){
        this.$router.push({
          path:`/slideshow/slideshowList/lookOrEdit/${row.id}`
        })
      },
      onEditBtn(row,i){
          if(i==1){
            if(row.images.length>0){
              for(let i = 0;i<row.images.length;i++){
                this.carouselList.push({
                  url:row.images[i][0],
                  link:row.images[i][1]
                })
              }
              this.carouselsec = row.interval*1000;
              this.dialogTableVisible = true;
            }else{
              this.$message.error('没有图片哟');
            }
          }else{
            this.$router.push({
              path: `/slideshow/slideshowList/addOrEdit/${row.id}`,
            })
          }
      },
      onTableSelect(selection){
        this.selectionTab = selection;
      },
      onStatusChange(record,target){
        editSlidesStatus({carousel_id:record.id,key:target,value:record[target]}).then(res => {
          this.$message.success('修改成功');
        }).catch(()=>{})
      },
      imgClick(item){
        if(item.link){
          window.open(item.link)
        }
      },
      diaClose(){
        this.carouselList = [];
      }
    }
}
</script>

<style lang="scss" scoped>

</style>

