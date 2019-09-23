<template>
    <div class="img-box">
        <el-scrollbar style="height:100%;width:100%">
            <div class="img-list">
                <el-upload
                    :on-remove="onDel"
                    :before-remove="onBeforeDel"
                    :on-preview="handlePictureCardPreview"
                    name="file"
                    list-type="picture-card"
                    :http-request="Upload"
                    class="avatar-uploader"
                    :file-list="imgList.items"
                    action="">
                    <i  class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="bott">
                    <el-pagination
                        class="pagination"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="10"
                        layout="prev, pager, next, jumper"
                        :total="imgList.total">
                    </el-pagination>
                </div>
            </div>         
        </el-scrollbar>
        <el-dialog :visible.sync="dialogVisible" @closed="diaClose">
            <el-image v-show="imageUrl" style="height:100%" :src="imageUrl" fit="scale-down"></el-image>
            <video ref='video' controls  v-show="!imageUrl" ></video>
        </el-dialog>
    </div>
</template>

<script>
import * as AuthAction from '@/api/auth'
import { debug } from 'util';
export default {
  data () {
    return {
      imgList: '',
      uploadModal: false,
      imageUrl: '',
      currentPage: 1,
      dialogImageUrl: '',
      dialogVisible: false,
      changeImg:0,
      dialogVisibleUrl:''
    }
  },
    computed:{
        domain(){
            return this.$domainUrl();
        }
    },
  created () {
    this.getData();
  },
  methods: {
      getData(){
        // this.axios.get(`source/list/`,{params:{page:this.currentPage}}).then(res=>{  
        //     for(const item of res.items){
        //         item.url = `https://img.xunbaowang.net/${item.folder}/${item.file_name}`;
        //     }
        //     this.imgList = res;
        //     var d1 = document.getElementsByClassName('avatar-uploader');
        //     var d2 = document.getElementsByClassName('el-upload--picture-card');
        //     var d3 = document.getElementsByClassName('el-upload-list--picture-card');
        //     d1[0].insertBefore(d2[0],d3[0])
        // })
    //   getData(){
        AuthAction.getSourceList({file_genre:'video',page:this.currentPage}).then(res=>{ 
            for(let i = res.items.length-1;i>=0;i--){
                res.items[i].url = `${this.domain}/${res.items[i].folder_path}${res.items[i].file_name}`;
                // res.items[i].url = `https://app-img.xunbaowang.net/${res.items[i].folder}${res.items[i].file_name}`;
                if(res.items[i].file_genre=='video'){
                    res.items[i].videoUrl = res.items[i].url;
                    res.items[i].url = res.items[i].url+'?x-oss-process=video/snapshot,t_10000,m_fast'
                }
            }
            this.imgList = res;
            var d1 = document.getElementsByClassName('avatar-uploader');
            var d2 = document.getElementsByClassName('el-upload--picture-card');
            var d3 = document.getElementsByClassName('el-upload-list--picture-card');
            d1[0].insertBefore(d2[0],d3[0])
        })
    },
    handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
    },
    Upload(file){
        if(AuthAction.getOssToken()){
            let Expiration = JSON.parse(AuthAction.getOssToken()).Expiration;
            if(new Date().getTime()<new Date(Expiration).getTime()){
                let client = new this.OSS({
                    region: "oss-cn-hangzhou",
                    accessKeyId: JSON.parse(AuthAction.getOssToken()).AccessKeyId,
                    accessKeySecret: JSON.parse(AuthAction.getOssToken()).AccessKeySecret,
                    stsToken: JSON.parse(AuthAction.getOssToken()).SecurityToken,
                    bucket: "xbw-app"
                })         
                let random_name = this.random_string(32) + '_' + new Date().getTime()+'.'+file.file.name.split('.')[1];
                let last_name = `website/public/${random_name}`;
                // if(file.file.type.indexOf('video')!=-1){
                //     console.log(1);
                //     let url = `https://app-img.xunbaowang.net/${last_name}?x-oss-process=video/snapshot,t_10000,m_fast`;
                //      console.log(url)
                // }
                client.put(last_name,file.file).then(res=>{
                    console.log(res)
                    this.$message.success('上传成功');
                })
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
            let client = new this.OSS({
                region: "oss-cn-hangzhou",
                accessKeyId: res.Credentials.AccessKeyId,
                accessKeySecret: res.Credentials.AccessKeySecret,
                stsToken: res.Credentials.SecurityToken,
                bucket: "xbw-app"
            })         
            let random_name = this.random_string(32) + '_' + new Date().getTime()+'.'+file.file.name.split('.')[1];
            let last_name = `website/public/${random_name}`;
            client.put(last_name,file.file).then(res=>{
                    console.log(res)
                this.$message.success('上传成功');  
            })
        })
    },
    removeImage(file){

        console.log(file.folder+file.file_name);
        AuthAction.delRecourse({source_id:file.id}).then(res => {
            this.$message.success('删除成功!');
            this.getData();
        }).catch(err=>console.log(err))
        // this.axios.get(`source/get_token/`).then(res=>{
        //     // let OSS = require('ali-oss');
        //     let client = new this.OSS({
        //         region: "oss-cn-hangzhou",
        //         accessKeyId: res.Credentials.AccessKeyId,
        //         accessKeySecret: res.Credentials.AccessKeySecret,
        //         stsToken: res.Credentials.SecurityToken,
        //         bucket: "xbw-app"
        //     })
        //     client.delete(file.file_name).then(res=>{
        //         this.$message.success('删除成功');
        //         this.getData();
        //     })
        // })
    },
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
    handlePictureCardPreview (file) {
        this.dialogVisible = true;
        if(file.file_genre=='image'){
            this.imageUrl = file.url;
        }else{
            this.$nextTick(()=>{
                this.$refs.video.src = file.videoUrl;
            })
        }
        
    },
    diaClose(){
        this.imageUrl = '';
        this.$refs.video.src = '';
    },
    onDel(file){
        // + '_' + file.file.name
    },
    onBeforeDel(file){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if(AuthAction.getOssToken()){
                let Expiration = JSON.parse(AuthAction.getOssToken()).Expiration;
                if(new Date().getTime()<new Date(Expiration).getTime()){
                    let client = new this.OSS({
                        region: "oss-cn-hangzhou",
                        accessKeyId: JSON.parse(AuthAction.getOssToken()).AccessKeyId,
                        accessKeySecret: JSON.parse(AuthAction.getOssToken()).AccessKeySecret,
                        stsToken: JSON.parse(AuthAction.getOssToken()).SecurityToken,
                        bucket: "xbw-app"
                    })      
                    console.log(file,file.file_name)
                    // return   
                    client.delete(file.folder+file.file_name).then(res=>{
                        this.$message.success('删除成功');
                        console.log(res)
                        this.getData();
                    })
                }else{
                    AuthAction.removeOssToken();
                    this.removeImage(file);
                }
            }else{
                AuthAction.removeOssToken();
                this.removeImage(file);
            }
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
        });
        return false;      
    }
//     onPage (e) {
//       this.pageParams.page = e
//       this.fetchList()
//     },
//     onUpload () {
//       this.uploadModal = true
//     },
//     handleAvatarSuccess (res, file) {
//       // console.log(res,file);
//       this.imageUrl = URL.createObjectURL(file.raw)
//       this.fetchList()
//       // this.imageUrl = ''
//       // console.log(this.imageUrl)
//     },
//     beforeAvatarUpload (file) {
//       // let fd = new Formdata()
//       // fd.append('key', file, 'fileName')

//       // // 自己上传文件 想加什么都可以
//       // this.axios.post(['/oss/upload/'], fd, {

//       //     // 加这里
//       //     headers: {
//       //         Authorization:this.token
//       //     }
//       // }).then(res=>{

//       // })
//       // return false // 返回false不会自动上传
//       const isJPG = file.type === 'image/jpeg'
//       const isLt2M = file.size / 1024 / 1024 < 2
//       if (!isJPG) {
//         this.$message.error('上传头像图片只能是 JPG 格式!')
//       }
//       if (!isLt2M) {
//         this.$message.error('上传头像图片大小不能超过 2MB!')
//       }
//       return isJPG && isLt2M
//     },
//     beforeDel: function (file, fileList) {
//       console.log(file)
//       const id = file.id;
//       this.$confirm('确认删除该图片？', '提示', {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         closeOnClickModal: false,
//         showClose: false,
//         type: 'warning'
//       }).then(() => {
//         this.list = [];
//         this.imgList = [];
//         UploadAction.destory({ source_id: id }).then(() => {
//           this.fetchList()
//           this.$message.success('图片删除成功')
//         }).catch(err => this.$message.error(err))
//       }).catch(() => {

//       })
//       return false
//     },
//     onDel (file) {
//       console.log("onDel")
//     },
//     okUpload () {
//       this.uploadModal = false
//       this.fetchList()
//       this.imageUrl = ''
//     },
//     fetchList () {
//       this.axios.get(`source/list/`, { params: { page: this.pageParams.page } }).then(res => {
//         this.list = res;
//         this.imgList = res.items;
//         this.imageUrl = '';
//         var d1 = document.getElementsByClassName('img-uploader');
//         var d2 = document.getElementsByClassName('el-upload--picture-card');
//         var d3 = document.getElementsByClassName('el-upload-list--picture-card');
//         d1[0].insertBefore(d2[0],d3[0])
//       })
//     }
  }
}
</script>

<style lang="less" scoped>
.img-box {
    background: #fff;
    padding: 0px 0px 0 20px;
    height: 100%;
    position: relative;  
    .img-list{
        display: flex;
        flex-wrap: wrap;
    }
    .avatar-uploader{
        margin-top:20px; 
        padding-bottom:40px; 
    }
    .bott{
        position: absolute;
        bottom: 0px;
        left: 0;
        right: 0;
        background-color: #fff;
        padding-bottom: 10px;
    }
    // .pagination{
    //     position: absolute;
    //     bottom: 10px;
    //     left: 0;
    // }
}
/deep/ .el-upload--picture-card{
    margin: 0 8px 8px 0;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail{
    object-fit:scale-down;
    width: 146px;
    height: 146px;
}
/deep/ .el-dialog__body{
    text-align: center;
}
/deep/ .el-upload-list__item.is-success .el-upload-list__item-status-label{
    display: none;
}
.avatar {
    width: 150px;
    height: 150px;
    display: block;
    margin: 0 8px 8px 0;
}
</style>
