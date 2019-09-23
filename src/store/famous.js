/**
 * 名家管理
 */
import { getAppraisalType } from '@/api/appraisal';
export default {
    namespaced:true,

    state:{
        nav:[{
            title:'名家信息',
            index:'/famous/message',
            componentName:'famous_message',
            leaf:true
        }/*,{
            title:'名家藏品',
            index:'/famous/collection',
            componentName:'famous_collection',
            leaf:true
        }*/],

        expertType:[],
    },

    getters:{
        navData(state){
            return state.nav
        },
        //获取缓存列表
        includeArr(state){
            return state.nav.map(item=>item.componentName)
        },
    },

    mutations:{
        changExpertType(state,data){
            state.expertType = data;
        }
    },

    actions:{
        changeExpertTypeData({commit}){
            getAppraisalType().then(res=>{
                commit('changExpertType',res)
            })
        }
    }
}