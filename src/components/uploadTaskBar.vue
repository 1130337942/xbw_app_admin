<template>
    <div class="task_container" :class="container_status" v-show="isShow">

        <div class="min" v-if="(status==='min')" >
            <el-progress :percentage="getTaskArr[0].progressNum*1" :status="getTaskArr[0].progressNum=='100'?'success':''"></el-progress>    
            <div class="min_title" @click="onMaxClick">{{getTaskArr[0].title}}</div>
        </div>

        <div class="max" v-else>
            <div class="max_tool">
                <div class="max_tool_title">上传任务栏</div>
                <div class="max_tool_btn">
                    <div class="tool_btn_item">
                        <i class="el-icon-caret-bottom cursor_point" @click="onSmartClick"></i>
                        <i class="el-icon-close cursor_point" @click="onCloseClick"></i>
                    </div>
                </div>
            </div>
            <div class="max_task_item" 
                v-for="(item,index) in getTaskArr"
                :key="index"
                :style="item.progressNum=='100'?'background-color:#f0f9eb;':''"
            >
                <div class="max_title">{{item.title}}</div>
                <div class="max_progress">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="item.progressNum" :status="item.progressNum=='100'?'success':''"></el-progress>
                </div>
            </div>
        </div>
    </div>    
</template>
<script>
import * as AuthAction from '@/api/resources';
import { mapGetters , mapActions } from 'vuex';
export default {
    name:'uploadTaskBar',
    data(){
        return {
            isShow:true,
            status:'min', //min  //任务栏当前状态

            min_percentage:20, //当前上传任务进度
            min_title:'QQ短视频201808241153434.mp4',//当前上传任务的标题


            // taskArr:[],
            // successArr:[{   //有完成的任务
            //     title:'QQ短视频201808241153434.mp4',
            //     description:'description',
            //     folder_path:'folder_path',
            //     progressNum:100,
            //     baseText:'',
            // },{
            //     title:'title',
            //     description:'description',
            //     folder_path:'folder_path',
            //     progressNum:100,
            //     baseText:'',
            // }],
        }
    },
    computed:{
        container_status(){
            return this.status==='max'?'task_container_max':'task_container_min'
        },
        ...mapGetters('uploadTaskBar',['getTaskArr','getTaskFirst','getTaskArrLength'])
    },
    created(){
        console.log(this.getTaskFirst)
    },
    methods:{
        onSmartClick(){
            this.status = 'min';
        },
        onMaxClick(){
            this.status = 'max';
        },
        onCloseClick(){
            this.isShow = false;
        },
        // upload({ title , folder_path , file , baseText }){
        //     let  me = this;
        //     this.getImgOssToken()
        //     .then(token=>{
        //         // debugger
        //         let client = me.getClient(token.Credentials),
        //             fileNameDefault = file.file.name.split('.'),
        //             random_name = me.random_string(32) + '_' + new Date().getTime()+'.'+fileNameDefault[fileNameDefault.length-1],
        //             last_name = `${folder_path}${random_name}`;
        //         console.log(last_name,params)
        //         debugger
        //         return me.multipartUpload({
        //             client,
        //             fileName:last_name,
        //             file:file.file,
        //             baseText
        //         })
        //     }).then(res=>{
        //         me.$message.success('上传成功');
        //         me.successArr.push(me.taskArr[0])
        //         me.taskArr.splice(0,1);
        //         Notification.success({
        //             title: '提醒',
        //             message: `上传完成: ${title}`,
        //             duration:2500,
        //         });
        //         debugger
        //         me.continueUplod()
        //         // this.$emit('onUploadOver');
        //         // this.dialogVisite = false;
        //     }).catch(err=>console.log(err))
        // },
        // multipartUpload({client,fileName,file,baseText}){
        //     let me = this;
        //     // return new Promise((res,rej)=>{
        //         return client.multipartUpload(
        //             fileName,
        //             file,
        //             {
        //                 parallel:2,
        //                 partSize:102400,
        //                 progress(percentage,checkpoint,res){
        //                     me.percentage =  Math.round(percentage)*100;
        //                     console.log(Math.round(percentage*100),checkpoint)
        //                 }
        //             },
        //             {headers: { 'x-oss-callback-var': window.btoa(JSON.stringify({"x:a":baseText.base64_value}))} }
        //         )
        //     // })
        // },
        // toUplod(){
        //     debugger
        //     if(this.taskArr.length>0){
        //         this.upload({
        //             folder_path : taskArr[0].folder_path,
        //             file : taskArr[0].file,
        //             baseText : taskArr[0].baseText
        //         })
        //     }else{
        //         // Notification.success({
        //         //     title: '提醒',
        //         //     message: '',
        //         //     duration:2500,
        //         // });
        //     }
        // },

        /**
         * 显示任务栏
         */
        api_openUploadTask(){
            this.isShow = true;
        },

        /**
         * @method 添加任务
         * @param {Object} 任务详情 
         */
        api_addTask(task){
            if(this.taskArr.length===0){
                this.taskArr.push(task);
                this.toUplod();
            }else{
                this.taskArr.push(task);
            }
        },

        ...mapActions('uploadTaskBar',['addTask']),
        ...AuthAction
    }
}
</script>
<style lang="less" scoped>

    .task_container {
        border-radius: 3px;
        display: block;
        position: fixed;
        bottom: 0px;
        right: 0px;
        z-index: 10000;
        transition: all .2s ease;
        text-align: center;        
        .min {
            display: inline-block;
            width: 90%;
            margin-top: 7px;
            cursor: pointer;
        }
        .min_title{ font-size:16px; }
        .max {
            .max_tool {
                width: 100%;
                height: 45px;
                background-color: #C0C4CC;
                color: #ffffff;
                .max_tool_title {
                    width: 88px;
                    float: left;
                    margin-left: 18px;
                    line-height: 45px;
                    text-align: center;
                    font-size: 16px;
                    font-family: 'PingFang SC';
                }
                .max_tool_btn {
                    width: 90px;
                    float: right;
                    line-height: 45px;
                    text-align: right;
                    font-size: 20px;
                    letter-spacing: 12px;
                }
            }
            .max_task_item {
                width: 100%;
                height: 60px;
                display: block;
                box-sizing: border-box;
                border-bottom: 1px solid #E4E7ED;
                padding: 0 10px;
                background-color: #ecf5ff;
                .max_title {
                    font-size: 16px;
                    text-align: left;
                    line-height: 34px;
                }
                .max_progress {
                    box-sizing: border-box;
                    padding-right: 20px;
                }
            }
        }
    }

    .task_container_max {
        width: calc(50% - 60px);
        height: 350px;
        background-color:#ffffff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
    }
    .task_container_min {
        width: calc(50% - 60px);
        height: 24px;
    }
    .task_container_min:hover {
        height: 45px;
        background-color:#ffffff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
    }
    .cursor_point {
        cursor: pointer;
    }
</style>
