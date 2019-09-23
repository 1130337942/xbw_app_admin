/**
 * 鉴宝管理
 */
import { getAppraisalType } from '@/api/appraisal';
export default {
    namespaced:true,

    state:{
        nav:[{
            title:'鉴宝订单管理',
            index:'/appraisal/list',
            componentName:'appraisal_list',
            leaf:true
        },{
            title:'极速鉴宝管理',
            index:'/appraisal/fastAppraisal',
            componentName:'appraisal_fastAppraisal',
            leaf:true
        },{
            title:'专家类型管理',
            index:'/appraisal/expertType',
            componentName:'appraisal_expertType',
            leaf:true
        },{
            title:'鉴宝专家管理',
            index:'/appraisal/apparisalExpert',
            componentName:'appraisal_apparisalExpert',
            leaf:true
        },{
            title:'机构服务管理',
            index:'/appraisal/service',
            componentName:'appraisal_service',
            leaf:true
        },{
            title:'鉴宝机构管理',
            index:'/appraisal/appraisalOrgan',
            componentName:'appraisal_appraisalOrgan',
            leaf:true
        },],

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