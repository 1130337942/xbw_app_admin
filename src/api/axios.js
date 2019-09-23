import axios from 'axios'
import router from '../router'
import Vue from 'vue'
import { Message, MessageBox,Notification  } from 'element-ui'
import store from '../store/index'
import * as AuthAction from '@/api/auth'

// if (process.env.NODE_ENV === 'development') {
axios.defaults.baseURL = '/interface/v1/'
// axios.defaults.baseURL = 'http://app.backstage.api.xunbaowang.net/interface/v1/'
// }
// console.log(11);
// console.log(AuthAction.getToken());
const ajax = axios.create({
  timeout: 10000, // 请求超时时间
  headers: {'Access-Control-Allow-Origin': 'http://app.backstage.xunbaowang.net'}//,'Access-Control-Max-Age':1000
})

ajax.interceptors.request.use(
  config => {
    // console.log(AuthAction.getToken());
    // console.log(store.state);
    // console.log(config)
    config.headers['Authorization'] = 'Bearer access_token=' + AuthAction.getToken()
    // console.log(config.headers['Authorization'])
    config.headers['Content-Type'] = 'application/json'
    config.headers['Accept'] = 'application/json'; 
    // config.headers['access-control-allow-origin'] = '*'; 
    // console.log(config)
    // if(AuthAction.getToken()&&new Date().getTime()-AuthAction.getExpires()>=6000&&config.url!='admin/sign_in/'){
    //   axios({
    //     headers:{'Authorization':'Bearer access_token=' + AuthAction.getToken()},
    //     method:'get',
    //     url:'http://test.xunbaowang.net/interface/v1/backstage/admin/refresh_token/'
    //   }).then(res=>{
    //     if(res.data.error_code==0){
    //       let time = new Date().getTime();
    //       AuthAction.removeExpires();
    //       AuthAction.removeToken();
    //       AuthAction.setToken(res.data.token,2);
    //       AuthAction.setExpires(time);
    //     }else{
    //       AuthAction.removeExpires();
    //       AuthAction.removeToken();
    //       router.push('/login')     
    //     }
    //     return config; 
    //   })
    // }else{
      return config; 
    // }
  },
  err => {
    return Promise.reject(err)
  }
)

// function requestRefreshToken(config){
//   // console.log(33);
//   return new Promise(function(resolve, reject){
//     if(config.url!='admin/sign_in/'){
//       if(AuthAction.getToken()){
//         if(new Date().getTime()-AuthAction.getExpires()>=6000){      
//           axios({
//             headers:{'Authorization':'Bearer access_token=' + AuthAction.getToken()},
//             method:'get',
//             url:'http://test.xunbaowang.net/interface/v1/backstage/admin/refresh_token/'
//           }).then(res=> {
//             if(res.data.error_code==0){
//               let time = new Date().getTime();
//               AuthAction.removeExpires();
//               AuthAction.removeToken();
//               AuthAction.setToken(res.data.token,2);
//               AuthAction.setExpires(time);
//               resolve(1)
//             }else{
//               AuthAction.removeExpires();
//               AuthAction.removeToken();
//               resolve(0)
//             }
//           })        
//         };
//       }else{
//         resolve(1)
//       }
//     }else{
//       resolve(0)
//     }
//   })
// }
// http response 拦截器
ajax.interceptors.response.use(
  response => {
    // console.log(response);
    const res = response.data
    if (res.error_code * 1 === 0) {
      // return res.data==''?1:res.data
      return res.data;
    }
    if(res.error_code * 1 ===1001){
      Notification.error({
        title: '错误',
        message: res.message,
        duration:2000,
      });
      for(let i in res.error_fields){
        res.error_fields[i].forEach(item=>{
          console.log(`ERROR! ==> ${i}: ${item}`)
          setTimeout(() => {
            Notification.error({
              title: '错误',
              message: `${i}: ${item}`,
              duration:2500,
            });  
          }, 10);
        })
      }
      // Message({
      //   // message: res.message.field.name&&res.message.field.name.length?res.message.field.name[0]:'error', // 待优化
      //   message: res.message?res.message:'error', // 待优化
      //   type: 'error'
      // })
      return Promise.reject('reject!')
    }
    if(res.error_code * 1 === 5000){
      Notification.error({
        title: '错误',
        message: res.message,
        duration:2000,
      });
      return Promise.reject('reject!')
    }
    if(res.error_code * 1 === 4001){
      MessageBox(
        '登录超时，请重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          type: 'warning',
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false
        }
      ).then(() => {
        AuthAction.removeExpires();
        AuthAction.removeToken();
        location.reload();
      })
      return Promise.reject('reject!')
    }
    if(res.error_code * 1 === 4002){
      MessageBox(
        '登录超时，请重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          type: 'warning',
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false
        }
      ).then(() => {
        AuthAction.removeExpires();
        AuthAction.removeToken();
        location.reload();
      })
      return Promise.reject('reject!')
    }
    if(res.error_code * 1 === 4003){   
      MessageBox(
        '登录超时，请重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          type: 'warning',
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false
        }
      ).then(() => {
        AuthAction.removeExpires();
        AuthAction.removeToken();
        location.reload();
      })
      return Promise.reject('reject!')
    }
    if(res.error_code * 1 === 4020){   
      Notification.error({
        title: '错误',
        message: res.message,
        duration:2000,
      });
      return Promise.reject('reject!')
    }
    return response
  },
  error => {
    // console.log(error);
    if(error&&error.response){
      switch (error.response.status) {
        case '400':
          Message({
            message: '错误请求',
            type: 'error'
          })
          break
        case '401':
          MessageBox(
            '登录超时，请重新登录',
            '确定登出',
            {
              confirmButtonText: '重新登录',
              type: 'warning',
              showCancelButton: false,
              showClose: false,
              closeOnClickModal: false
            }
          ).then(() => {
            AuthAction.removeToken();
          })
          break
        case '403':
          Message({
            message: '拒绝访问',
            type: 'error'
          })
          break
        case '404':
          Message({
            message: '请求错误,未找到该资源',
            type: 'error'
          })
          break
        case '405':
          Message({
            message: '请求方法错误',
            type: 'error'
          })
          break
        case '408':
          Message({
            message: '请求超时',
            type: 'error'
          })
          break
        case '500':
          Message({
            message: '服务器内部错误',
            type: 'error'
          })
          break
        case '501':
          Message({
            message: '服务器出小差了',
            type: 'error'
          })
          break  
        case '502':
          Message({
            message: '网络错误',
            type: 'error'
          })
          break
        case 503:
          Message({
            message: '服务不可用',
            type: 'error'
          })
          break
        case '504':
          Message({
            message: '网络超时',
            type: 'error'
          })
          break
        case '505':
          Message({
            message: 'http版本不支持该请求',
            type: 'error'
          })
          break
        case '4008':
          Message({
            message: '刷新token失败',
            type: 'error'
          })
          break
        default:
          Message({
            message: `连接错误${error.response.status}`,
            type: 'error'
          })
      }
    }else{
      Message({
        message: '服务器出小差了',
        type: 'error'
      })
    }  
    // console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default ajax
