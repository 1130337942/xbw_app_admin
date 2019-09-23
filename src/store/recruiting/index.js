/**
 * 招贤纳士
 */
export default {
    namespaced:true,

    state:{
        nav:[{
            title:'职位分类',
            index:'/recruiting/positionClassification',
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