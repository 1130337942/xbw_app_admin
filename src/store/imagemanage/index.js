/**
 * 图片管理
 */
export default {
    namespaced:true,

    state:{
        nav:[/*{
            title:'图片列表',
            index:'/imagemanage/imageLists',
            // icon:'el-icon-folder-opened',
            leaf:true
        },{
            title:'视频列表',
            index:'/imagemanage/videoLists',
            // icon:'el-icon-folder-opened',
            leaf:true
        },*/{
            title:'图片列表',
            index:'/resources/imageList',
            // icon:'el-icon-folder-opened',
            leaf:true
        },{
            title:'视频列表',
            index:'/resources/videoList',
            // icon:'el-icon-folder-opened',
            leaf:true
        }],
        // tokenTime:''
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