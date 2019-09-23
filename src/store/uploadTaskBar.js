/**
 * 下载任务栏
 */

import { Message, MessageBox,Notification  } from 'element-ui';
import { getBase64Token , uploadOssToken , getOssToken , setOssToken } from '@/api/resources';
import * as AuthAction from '@/api/resources';
import { Vue } from "vue";

// let getClient = function(authAction){  //oss上传对象
//     return new Vue.OSS({
//         region: "oss-cn-hangzhou",
//         accessKeyId: authAction.AccessKeyId,
//         accessKeySecret: authAction.AccessKeySecret,
//         stsToken: authAction.SecurityToken,
//         bucket: "xbw-app",
//     })  
// };

// let getImgOssToken = function(){ //获取token
//     let token = getOssToken();
//     return new Promise((resolve,reject)=>{
//         if(token){
//             if(new Date().getTime()<new Date(token.Expiration).getTime()){
//                 resolve(token)
//             }else{
//                uploadOssToken().then(res=>{
//                     setOssToken(res.Credentials);
//                     resolve(res)
//                 })
//             }
//         }else{
//            uploadOssToken().then(res=>{
//                 setOssToken(res.Credentials);
//                 resolve(res)
//             })
//         }
//     })
// }



// this.getImgOssToken()
export default {
    namespaced:true,
    state:{
        taskArr:[/*{
            title:'QQ短视频201808241153434.mp4',
            description:'description',
            folder_path:'folder_path',
            progressNum:35,
        },{
            title:'title',
            description:'description',
            folder_path:'folder_path',
            progressNum:75,
        }*/],
        successArr:[{
            title:'QQ短视频201808241153434.mp4',
            description:'description',
            folder_path:'folder_path',
            progressNum:100,
            file:'',
            baseText:'',
        },{
            title:'title',
            description:'description',
            folder_path:'folder_path',
            progressNum:100,
            file:'',
            baseText:'',
        }],

    },

    getters:{
        getTaskArr(state){
            return state.taskArr.concat(state.successArr);
        },
        getTaskFirst(state){
            return state.taskArr[0]
        },
        getTaskArrLength(state){
            return state.taskArr.length;
        }
    },

    mutations:{
        changeProgress(state,num){
            state.taskArr[0].percentage = num
        },
        finshTask(state,task){
            state.taskArr.splice(0,1);
            state.successArr.push(task);
        },
        pushTask(state,task){
            state.taskArr.push(task);
        }
    },

    actions:{
        
        handlerTask({commit,state,dispatch},{client}){   //处理任务
            let { title , file , baseText } = state.taskArr[0];
            debugger
            // getImgOssToken()
            // .then(token=>{
                // let client =  client;
                // console.log(fileName,baseText)
                // return dispatch('multipartUpload',{
                    console.log(client,
                        title,
                        file,
                        baseText)
            return
            dispatch('multipartUpload',{
                    client,
                    fileName:title,
                    file,
                    baseText
                // })
            })//.then(res=>{
            //     Message.success('上传成功');
            //     commit('finshTask',state.taskArr[0])
            //     Notification.success({
            //         title: '提醒',
            //         message: `完成上传: ${title}`,
            //         duration:2500,
            //     });
            //     dispatch('toUplod')
            // }).catch(err=>{console.log(err)})


            Message({
              message: '该上传任务以添加至任栏,请勿关闭和刷新页面,避免上传失败!',
              type: 'warning'
            })
        },
        toUplod({state,commit,dispatch}){  //执行上传
            if(state.taskArr.length>0){
                dispatch('handlerTask',{
                    folder_path : state.taskArr[0].folder_path,
                    file : state.taskArr[0].file,
                    baseText : state.taskArr[0].baseText
                })
            }
        },
        addTask({commit,dispatch,state},{client,task}){
            debugger
            if(state.taskArr.length===0){
                commit('pushTask',task);
                dispatch('handlerTask',{ client,task:{
                    folder_path : state.taskArr[0].folder_path,
                    file : state.taskArr[0].file,
                    baseText : state.taskArr[0].baseText
                }});
            }else{
                commit('pushTask',task);
            }
        },
        
        multipartUpload({commit,state},option){  //发起上传
            let {client,fileName,file,baseText} = option;
            return client.multipartUpload(
                fileName,
                file,
                {
                    parallel:2,
                    partSize:102400,
                    progress(percentage,checkpoint,res){
                        commit('changeProgress',Math.round(percentage)*100)
                        console.log(Math.round(percentage*100),checkpoint)
                    }
                },
                {headers: { 'x-oss-callback-var': window.btoa(JSON.stringify({"x:a":baseText.base64_value}))} }
            )
        }
        
    }
}