/**
 * 新闻中心
 */
export default {
    namespaced:true,

    state:{
        nav:[{
                title:'板块管理',
                index:'/main/newsCenter/plate',
                componentName:'newsCenter_plate',
                leaf:true
            },
            {
                title:'栏目管理',
                index:'/main/newsCenter/column',
                componentName:'newsCenter_column',
                leaf:true,
            },
            {
                title:'新闻管理',
                index:'/main/newsCenter/news',
                componentName:'newsCenter_news',
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