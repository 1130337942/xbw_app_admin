/**
 * 轮播图
 */
export default {
    namespaced:true,

    state:{
        nav:[{
            title:'轮播图管理',
            index:'/slideshow/slides',
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