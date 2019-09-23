/**
 * 广告管理
 */
export default {
    namespaced:true,

    state:{
        nav:[{
            title:'广告分类',
            index:'/advertising/classificationAdvertising',
            // icon:'el-icon-folder-opened',
            leaf:true
        },{
            title:'广告列表',
            index:'/advertising/advertisingList',
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