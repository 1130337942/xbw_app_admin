/**
 * 鉴宝管理
 */
import { getAppraisalType } from '@/api/appraisal';
export default {
    namespaced:true,

    state:{
        nav:[{
            title:'百科栏目',
            index:'/encyclopedias/column',
            componentName:'encyclopedias_column',
            leaf:true
        }/*,{
            title:'百科',
            index:'/encyclopedias/list',
            componentName:'encyclopedias_list',
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