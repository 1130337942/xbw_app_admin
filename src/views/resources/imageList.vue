<template>
    <div class="panelBox">
        <div class="top">
            <el-form 
                :model="rulesForm" 
                :inline="true"
                label-width="75px"
                ref="rulesForm"
                class="demo-ruleForm"
                label-position="left"
                @submit.native.prevent
            >
                <el-form-item prop="keyword" label="文件名称">
                    <el-input v-model="rulesForm.keyword" clearable @clear="onSearchClick"></el-input>
                </el-form-item>
                <el-form-item prop="folder" label="文件夹名称" label-width="90px">
                    <el-autocomplete
                        v-model="rulesForm.folder"
                        valueKey="file_name"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        clearable
                        @clear="onFolderClear"
                        @select="onFolderSelect"
                    ></el-autocomplete>
                </el-form-item>
                <el-button native-type="submit" @click="onSearchClick" type="primary"  icon="el-icon-search">搜索</el-button>
                <el-button type="success" @click="onAddFolderClick" icon="el-icon-circle-plus-outline">新增文件夹</el-button>
            </el-form>
        </div>
        <div class="table-box">
            <div class="heightCalc">
                <el-scrollbar style="height:100%;width:100%" >
                    <transition-group class="resourceBox" tag="div" name="el-fade-in-linear">
                        <div class="r_plus" :key="'plus'" @click="onAddClick"><i class="el-icon-plus avatar-uploader-icon"></i></div>
                        <div 
                            class="r_item" 
                            v-for="item in resources.items"
                            :key="item.id"
                        >
                            <div style="width:100%;height:100%;line-height: 220px;" @contextmenu.prevent="onOpenMenuClick($event)">
                                <img 
                                     v-lazy="domain+'/'+item.folder_path+item.file_name+'?x-oss-process=image/resize,m_fill,h_200,w_200'"
                                />
                            </div>
                            <div class="mask">
                                <i class="el-icon-view" @click="onViewClick(item)"></i>
                                <i class="el-icon-delete" @click="onDeleteClick(item)"></i>
                            </div>
                        </div>
                    </transition-group>
                </el-scrollbar>
            </div>
            <div class="textCenter">
                <el-pagination
                    style="margin-top:5px;"
                    @size-change="onSizeChange"
                    @current-change="getData"
                    :current-page.sync="page"
                    :page-size="limit"
                    :page-sizes="[10, 20, 30, 50]"
                    layout="total, sizes, prev, pager, next, jumper"                   
                    :total="resources.total"
                ></el-pagination>    
            </div>
        </div>


        <el-dialog 
            title="预览"
            :visible.sync="viewVisible"
            width="80%"
        >
            <el-row>
                <el-col :span="10">
                    <div class="dialogVideo" v-if="viewVisible">
                        <img  v-lazy="viewSrc" :style="'max-width:36vw;'+maxHeight" />
                    </div>
                </el-col>
                <el-col :span="10" :push="2">
                    <el-form :model="resourceInfo" ref="resourceInfo" >
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="resourceInfo.title" :maxlength="225"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="description">
                            <el-input v-model="resourceInfo.description" type="textarea" :maxlength="225"></el-input>
                        </el-form-item> 
                        <el-form-item label="资源链接:">
                            <div style="color:black;font-size:">{{viewSrc}}</div>
                        </el-form-item> 
                        <el-form-item>
                            <el-input v-model="resourceInfo.source_id" v-show="false"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div class="footer-dialog" slot="footer">
                <el-button @click="viewVisible=false">取消</el-button>
                <el-button type="primary" @click="onEditResourceClick">确定</el-button>
            </div>
        </el-dialog>

        <uploadDialog ref="uploadDialog" fileType="image" :folderPath="folderOldPath" @onUploadOver="onSearchClick" />

        <el-dialog title="新增文件夹(一旦创建,不可修改/删除!)" :visible.sync="addFolderVisible" @close="folder_creat={name:''}">
            <el-form :model="folder_creat">
                <el-form-item label="文件名称">
                    <el-input v-model="folder_creat.name"></el-input>
                </el-form-item>
            </el-form>
            <div class="footer-dialog" slot="footer">
                <el-button @click="addFolderVisible=false">取消</el-button>
                <el-button type="primary" @click="onAddFolderBtn">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getResourcesData , delRecourse , uploadOssToken , getOssToken , setOssToken ,addFolder ,editResourceInfo }  from '@/api/resources';
import uploadDialog from './upload'
export default {
    components:{
        uploadDialog
    },
    data(){
        return {
            rulesForm:{},
            resources:{
                items:[],
                total:0,
            },
            limit:30,
            page:1,

            viewVisible:false,
            viewSrc:'',
            visite:false,

            folderArr:[],
            folderOldVal:'',
            folderOldPath:'',

            addFolderVisible:false,
            folder_creat:{name:''},

            resourceInfo:{
                title:'',
                description:'',
                source_id:''
            },
            viewHeight:0,
        }
    },
    computed:{
        domain(){
            return this.$domainUrl();
        },
        maxHeight(){
            return `max-height:${this.viewHeight}px;`
        }
    },  
    created(){
        this.getData()
        this.viewHeight = window.innerHeight*0.5 ;
        getResourcesData({page:1,limit:50,file_genre:'folder'}).then(res=>{
            this.folderArr = res.items;
        })
    },
    methods:{
        onSearchClick(){
            this.page=1;
            // this.folderOldPath = this.rulesForm.folder;
            this.getData()
        },
        onSizeChange(val){
            this.limit = val
            this.getData()
        },
        onViewClick(file){
            this.viewVisible = true
            this.viewSrc = this.domain+'/' + file.folder_path + file.file_name;
            this.resourceInfo = {
                source_id:file.id,
                title : file.title,
                description : file.description,
            }
        },
        onDeleteClick(file){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                return delRecourse({source_id:file.id})
            }).then(res => {
                this.$message.success('删除成功!');
                this.getData();
            }).catch(err=>console.log(err))
        },
        onAddClick(){
            this.$refs['uploadDialog'].api_open();
        },
        onEditResourceClick(){
            editResourceInfo(this.resourceInfo).then(res=>{
                this.$message.success('编辑成功!');
                this.getData();
                this.viewVisible = false;
            }).catch(err=>console.log(err))
        },
        onAddFolderClick(){
            this.addFolderVisible = true;
        },
        onAddFolderBtn(){
            addFolder(this.folder_creat).then(res=>{
                this.$message.success('添加成功!');
            }).catch(err=>console.log(err))
            this.addFolderVisible=false;
        },
        querySearchAsync(text,callback){
            let param = {page:1,limit:50,file_genre:'folder',keyword:text}
            let folderArr  = this.folderArr;
            let f = folderArr.filter((item=>{
                return (item.file_name.toLowerCase().indexOf(text)>-1)
            }))
            if(this.folderOldVal === text){
                callback(this.folderArr);
            // }else if(f.length>0){
            //     callback(f)
            }else{
                getResourcesData(this.$filterParams(param)).then(res=>{
                    callback(res.items);
                    this.folderArr = res.items
                    if(!text){
                        this.folderOldPath='upload/';
                    }
                })
            }
            this.folderOldVal = text;
        },
        onFolderSelect(item){
            this.folderOldVal = item.file_name;
            this.folderOldPath = item.folder_path;
            this.getData();
        },
        onFolderClear(){
            this.onSearchClick();
            this.folderOldPath = 'upload/'
        },
        getData(){
            let params = this.$filterParams( 
                this.rulesForm,
                {page:this.page,limit:this.limit,file_genre:'image'} 
            )
            getResourcesData(params).then(res=>{
                console.log(res)
                this.resources = {
                    items:res.items,
                    total:res.total
                }
            })
        },
        onOpenMenuClick(){
            console.log('右键  click')
            return
        },
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/css/searchAndTabel.less');
.panelBox {height: calc(100% - 15px) !important;}
.table-box { height: calc(100% - 100px);}
.heightCalc { height: calc(100% - 40px); }
.resourceBox {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: calc(100% - 100px);
    .r_plus {
        width: 148px;
        height: 148px;
        border: 1px dashed #d9d9d9;
        margin-right: 20px;
        margin-bottom: 10px;
        cursor: pointer;
    }
    .r_item {
        width: 148px;
        height: 148px;
        border: border-box;
        border: 1px solid #ebeef5;
        border-radius: 5px;
        margin-right: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.3);
        position: relative;
        overflow: hidden;
        .mask {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            top:0;
            left: 0;
            line-height: 148px;
            background: rgba(0, 0, 0, 0.6);
            font-size: 18px;
            color: #fff;
            text-align: center;
            letter-spacing: 15px;
            i {cursor: pointer;}
        }
    }
    .r_item:hover {
        .mask { display: block; }
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 148px;
        height: 148px;
        line-height: 148px;
        text-align: center;
    }
}
</style>
