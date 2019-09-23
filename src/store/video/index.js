/**
 * 新闻中心
 */
export default {
    namespaced:true,

    state:{
        nav:[
            {           
                title:'视频版块',
                index:'/videoManagement/videoSection',
                componentName:'videoManage_section',
                leaf:true
            },
            {
                title:'视频栏目',
                index:'/videoManagement/videoProgram',
                componentName:'videoManage_program',
                leaf:true,
            },
            {
                title:'视频列表',
                index:'/videoManagement/videoList',
                componentName:'videoManage_list',
                leaf:true
            }
        ]
    },

    getters:{
        newNav(state){
            return state.nav
        },
        //获取缓存列表
        includeArr(state){
            return state.nav.map(item=>item.componentName)
        },
    },

    mutations:{

    },

    actions:{

    }
}