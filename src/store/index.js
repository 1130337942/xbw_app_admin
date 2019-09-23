import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/api/axios';

import news from './news';
import video from './video';
import recruiting from './recruiting';
import slideshow from './slideshow';
import companyProfile from './companyProfile';
import advertising from './advertising';
import imagemanage from './imagemanage';
import systemManagement from './systemManagement';
import commodity from './commodity';
import merchant from './merchant';
import uploadTaskBar from './uploadTaskBar.js';
import appraisal from './appraisal.js';
import activity from './activity.js';
import encyclopedias from './encyclopedias.js';
import famous from './famous.js';
import auction from './auction.js';

import { getAuditCascaderData } from '@/api/commodity';

Vue.use(Vuex)

export default new Vuex.Store({

  modules:{
    "news":news, //新闻中心
    "video":video,//视频管理
    "recruiting":recruiting,//招贤纳士
    "slideshow":slideshow,//轮播图
    "companyProfile":companyProfile,//公司简介
    "advertising":advertising,//广告管理
    "imagemanage":imagemanage,//图片管理
    "systemManagement":systemManagement,//系统管理
    "commodity":commodity,//商品管理
    "merchant":merchant,//商户管理
    "appraisal":appraisal,//鉴宝管理
    "activity":activity,//会场
    "encyclopedias":encyclopedias,//百科
    "famous":famous,//名家
    "auction":auction,//名家

    "uploadTaskBar":uploadTaskBar,//上传任务栏
  },

  state: {
    mainLoading:false, //页面是否正在加载

    genreClassis:[],//商品 藏品 鉴宝服务 分类

    address_province_city:[],//省 市 联级
  },
  getters:{
    getAddress_province_city(state){
      return state.address_province_city
    }
  },
  mutations: {

    showLoading(state){
      state.mainLoading = true;
    },
    hideLoading(state){
      state.mainLoading = false;
    },

    /**
     * 更新 地区 省级
     * @param {String} target 目标
     * @param {Object} data 数据
     */
    changeAddress_province(state,{target,data}){
    state[target] = data;
    },
    /**
     * 更新 地区 市级
     * @param {String} target 目标
     * @param {Object} data 数据
     */
    changeAddress_city(state,{target,proIndex,data}){
      state[target][proIndex].children = data;
    },
    

    /**
     * 更新商品分类 一级
     * @param {Array} data 数据 
     */
    changeGenreClassis(state,data){
      state.genreClassis = data;
    },
    /**
     * 更新商品分类 次级
     * @param {Array} data 数据 
     * @param {Number} index 所属一级分类索引 
     */
    changeGenreClassis_two(state,{data,index}){
      state.genreClassis[index].children = data;
    }

  },
  actions: {

    /**
     *  省 市联级 更新省数据
     * @param { Function } callback //回调
     */
    uploadProvince_two({commit},callback=()=>{}){
      axios({
        method:'get',
        url:'area/',
        params:{level:1}
      })
      .then(res=>{
        const data = [...res];
        data.forEach(item=>{
          item.children=[];
        })
        commit('changeAddress_province',{target:'address_province_city',data})
        callback();
      })
    },


    /** 省 市联级 更新市数据
     * @param { Number,String } provinceId //省id
     * @param { Function } callback //回调
     */
    uploadCtiy_two({commit,state} , {provinceId,callback=()=>{}} ){
      let proIndex ;
      const identical = state.address_province_city.filter((item,index)=>{
        item.id===provinceId?proIndex = index:null;
        return item.id===provinceId;
      })[0];
      if(identical.children.length===0){
        let params = {
          level :2,
          parent_id:identical.id,
        }
        axios({
          method:'get',
          url:'area/',
          params
        })
        .then(res=>{
          commit('changeAddress_city',{target:'address_province_city',proIndex,data:res})
          callback?callback(res):null;
        })
        .catch(err=>console.log(err))
      }
    },

    /**
     * 分类更新分类列表
     */
    uploadGenreClassis({commit}){
      getAuditCascaderData()
      .then(res=>{
        commit('changeGenreClassis',res)
      })
      .catch(err=>{console.log(err)})
    },
    /**
     * 更新商品分类次级
     * @param {Object} date 传入参数 
     */
    uploadGenreClassis_two({commit,state},data){
      let genreId, index;
      const identical = state.genreClassis.filter((item,key)=>{
        item.id===data?index = key:null;
        return item.id === data
      })
      if(identical[0].children.length===0){
          getAuditCascaderData({superior_id:data,page:1})
          .then(res=>{
            commit('changeGenreClassis_two',{data:res,index})
          })
          .catch(err=>{console.log(err)})
      }
    }
  }
})
