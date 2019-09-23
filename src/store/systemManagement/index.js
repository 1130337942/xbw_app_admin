/**
 * 系统管理
 */
export default {
    namespaced:true,

    state:{
        nav:[{
            title:'下载页设置',
            index:'/systemManagement/downloadApp',
            // icon:'el-icon-folder-opened',
            leaf:true
        },{
            title:'活动设置',
            index:'/systemManagement/activity',
            componentName:'systemManagement_activity',
            // icon:'el-icon-folder-opened',
            leaf:true
        }]
    },

    getters:{
        navData(state){
            return state.nav
        },
        //获取缓存列表
        includeArr(state) {
            return state.nav.map(item => item.componentName)
        },
    },

    mutations:{

    },

    actions:{

    }
}