/**
 * 公司简介
 */
export default {
    namespaced:true,

    state:{
        nav:[{
            title:'公司简介',
            index:'/companyProfile/aboutUs',
            // icon:'el-icon-folder-opened',
            leaf:true
        },{
            title:'特邀专家',
            index:'/companyProfile/invitedExperts',
            // icon:'el-icon-folder-opened',
            leaf:true
        }]
    },

    getters:{
        navData(state){
            return state.nav
        }
    },

    mutations:{

    },

    actions:{

    }
}