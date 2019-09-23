<template>
    <div class="upload-box">
        <div class="image-box">
            <ul v-if="imgList">
            <el-upload
                name="file"
                :http-request="Upload"
                class="avatar-uploader"
                :show-file-list="false"
                action="">
                <i  class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <li v-for="item in imgList.items" :key="item.id">
                <div class="checked" v-show="item.check==true">
                  <img class="icon-select" src="../assets/images/select.png">
                </div>
                <div  @click="checkImage(item)" >
                  <!-- <el-image class="icon-select" src="../assets/images/select.png" fit="scale-down"></el-image> -->
                    <el-image style="height:120px;width:120px;cursor:pointer;" :src="item.url" fit="scale-down"></el-image>
                </div>
            </li>
            </ul>
        </div>
        <el-pagination
            v-if="imgList"
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="imgList.total">
        </el-pagination>
        
  </div>
</template>

<script>
import * as AuthAction from '@/api/auth'
export default {
    data () {
      return {
        imgList: '',
        uploadModal: false,
        imageUrl: '',
        currentPage: 1,
        dialogVisible:false,
        dialogImageUrl:'',
        imageUrl: '',
        beyond:false,  // 超过9张
        videoList:[]
      }
    },
    props:{
      images:{
        type: null,
      },
      propType: {
        type: Number,
        default: 1
      },
      genre:{
        type: null,
      },
      type:{
        // 0是头像 1是富文本
        type: Number,
        default: 0
      },
      video:{
        type: Number,
        default: 0
      },
    },
  // props: ['images'],
    watch: {
      propType (n,o) {
        if(n!=o){
          this.getData();
        }
      },
      images(n,o){
        if(this.genre=='jobs'){
          if(n.length>=9){
            this.beyond = true;       
          }else{
            this.beyond = false;   
          }
        }
        this.imgList.items.map(r=>{
          r.check = false;
        })
        for(const item of this.images){
          for(const upItem of this.imgList.items){
            if(item==upItem.url){
              upItem.check = true;
            }
          }
        }
      }
    },
    created(){
      this.getData();
    },
    methods: {
        getData(){
          let params = {page:this.currentPage};
          if(this.genre==='video'){
            params.file_genre  ='video';
          }else if(this.genre==='image'){
            params.file_genre  ='image';
          }
          this.axios.get(`source/list/`,{params:params}).then(res=>{           
            for(let i = res.items.length-1;i>=0;i--){
                res.items[i].url = `https://app-img.xunbaowang.net/${res.items[i].folder_path}${res.items[i].file_name}`;
                if(res.items[i].file_genre=='video'){
                    res.items[i].videoUrl = res.items[i].url;
                    res.items[i].url = res.items[i].url+'?x-oss-process=video/snapshot,t_10000,m_fast'
                }
            }
            this.imgList = res;          
          })
        },
        handleCurrentChange(val) {
          this.videoList = [];
          this.currentPage = val;
          this.getData();
        },
        Upload(file){  //上传 
          if(AuthAction.getOssToken()){
              let Expiration = JSON.parse(AuthAction.getOssToken()).Expiration;
              if(new Date().getTime()<new Date(Expiration).getTime()){
                  // let OSS = require('ali-oss');
                  let client = new this.OSS({
                      region: "oss-cn-hangzhou",
                      accessKeyId: JSON.parse(AuthAction.getOssToken()).AccessKeyId,
                      accessKeySecret: JSON.parse(AuthAction.getOssToken()).AccessKeySecret,
                      stsToken: JSON.parse(AuthAction.getOssToken()).SecurityToken,
                      bucket: "xbw-app"
                  })         
                  let random_name = this.random_string(32) + '_' + new Date().getTime()+'.'+file.file.name.split('.')[1];
                  let last_name = `website/public/${random_name}`
                  console.log(last_name,file.file)
                  // return
                  client.put(last_name,file.file).then(res=>{
                    // if(file.file.type.indexOf('video')!=-1){
                    //     this.videoList.push({
                    //         url:`https://app-img.xunbaowang.net/video/${last_name}`
                    //     })
                    // }
                    if(res.res.status===200){
                      setTimeout(() => {   //  ##需优化上传机制
                        this.$message.success('上传成功');
                        this.getData();
                      }, 1500);
                    }
                  }).catch(err=> console.log(err))
              }else{
                AuthAction.removeOssToken();
                this.getImgOssToken(file);
              }         
          }else{
            AuthAction.removeOssToken();
            this.getImgOssToken(file);
          }    
        },
        getImgOssToken(file){
          this.axios.get(`source/get_token/`).then(res=>{
              AuthAction.setOssToken(res.Credentials);
              let OSS = require('ali-oss');
              let client = new OSS({
                  region: "oss-cn-hangzhou",
                  accessKeyId: res.Credentials.AccessKeyId,
                  accessKeySecret: res.Credentials.AccessKeySecret,
                  stsToken: res.Credentials.SecurityToken,
                  bucket: "xbw-app"
              })         
              let random_name = this.random_string(32) + '_' + new Date().getTime()+'.'+file.file.name.split('.')[1];
              let last_name = `website/public/${random_name}`
              client.put(last_name,file.file).then(res=>{
                if(file.file.type.indexOf('video')!=-1){
                  this.videoList.push({
                      url:`https://app-img.xunbaowang.net/video/${last_name}`
                  })
                }
                this.$message.success('上传成功');
              })
          })
        },
        // Upload(file){
        //   this.axios.get(`source/get_token/`).then(res=>{
        //     let OSS = require('ali-oss');
        //     let client = new OSS({
        //       region: "oss-cn-hangzhou",
        //       accessKeyId: res.Credentials.AccessKeyId,
        //       accessKeySecret: res.Credentials.AccessKeySecret,
        //       stsToken: res.Credentials.SecurityToken,
        //       bucket: "xbw-app"
        //     })
        //     let random_name = this.random_string(32) + '_' + new Date().getTime() + '.' + file.file.name;
        //     let last_name = `website/${this.genre}/${random_name}`
        //     client.put(last_name,file.file).then(res=>{
        //       this.$message.success('上传成功');
        //       this.getData();
        //     })
        //   })
        // },
        // 随机命名
        random_string(len) { 
            len = len || 32;
            var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = chars.length;
            var pwd = '';
            for (let i = 0; i < len; i++) { 
              pwd += chars.charAt(Math.floor(Math.random() * maxPos));
            } 
            return pwd;
        },
        checkImage(item){
          if(this.video==1){
            if(item.file_genre!='video'){
              this.$message.warning('请选择视频');
              return
            } else{
              item.check = !item.check;                       
              item.check==true?this.$message.success('选择成功'):this.$message.success('取消选择');
              if(this.propType>=2){
                this.$emit('upload', item);
              }
            }         
          }else{
            if(item.file_genre=='video'){
              this.$message.warning('请选择图片');
              return
            }else{
              item.check = !item.check;      
              item.type = this.type;
              if(this.beyond){
                this.$emit('upload', item);
                this.$message.warning('超过9张');
                return;
              }                    
              item.check==true?this.$message.success('选择成功'):this.$message.success('取消选择');
              if(this.propType>=2){
                this.$emit('upload', item);
              }
            }
            
          }
          
        }
        // upload () {
        //     this.thumbnail = this.imageUrl
        //     this.$emit('upload', this.thumbnail)
        //     this.uploadModal = false
        // }
  }
}
</script>

<style lang="less" scoped>
.upload-box{
  width: 100%;
  height: 100%;
  display: inline-block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
}
.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  margin-right: 10px;
  .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  margin: 0 8px 8px 0;
}
.image-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  ul {
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    li {
      margin-right: 10px;
      margin-bottom: 10px;
      position: relative;
      .checked {
        z-index: 5000;
        position: absolute;
        right: 0;
        top: 0;
        .icon-select {
          width: 30px;
          height: 30px;
        }
      }
      img {
        width: 120px;
        cursor: pointer;
      }
    }
  }
}
</style>
