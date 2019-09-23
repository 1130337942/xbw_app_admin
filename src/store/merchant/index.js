/**
 * 商品管理
 */

export default {
    namespaced:true,

    state:{
        nav:[{
            title:'待审商户',
            index:'/merchant/audited',
            componentName:'merchant_audited',
            leaf:true
        },{
            title:'商户列表',
            index:'/merchant/list',
            componentName:'merchant_list',
            leaf:true,
        }],

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