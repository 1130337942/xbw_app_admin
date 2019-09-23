/**
 * 会场
 */
export default {
    namespaced: true,

    state: {
        nav: [{
            title: '会场列表',
            index: '/activity/boutikque',
            componentName: 'activity_boutikque',
            leaf: true
        },
        {
            title: '主题列表',
            index: '/activity/themeList',
            componentName: 'activity_themeList',
            leaf: true
        },/*{
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
        },*/]
    },

    getters: {
        navData(state) {
            return state.nav
        },
        //获取缓存列表
        includeArr(state) {
            return state.nav.map(item => item.componentName)
        },
    },

    mutations: {

    },

    actions: {

    }
}