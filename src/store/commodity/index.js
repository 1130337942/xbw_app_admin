/**
 * 商品管理
 */

export default {
    namespaced:true,

    state:{
        nav:[{
            title:'商品分类',
            index:'/commodity/classis',
            componentName:'commodity_classis',
            leaf:true
        },{
            title:'待审商品',
            index:'/commodity/audited',
            componentName:'commodity_audited',
            leaf:true,
        },{
            title:'商品列表',
            index:'/commodity/list',
            componentName:'commodity_list',
            leaf:true
        }],
        rulesForm:{  //搜索条件
            name:'',
            merchant_name:'',
            application_status:1,
            boutique:false,
            genre_one:'',
            genre_two:'',
        },
        page:1,
    },

    getters:{
        newNav(state){
            return state.nav
        },
        getPage(state){
            return state.page
        },
        getRulesForm(state){
            return state.rulesForm;
        },
        //获取缓存列表
        includeArr(state){
            return state.nav.map(item=>item.componentName)
        },
    },

    mutations:{
        changePage(state,data){
            state.page = data
        },
        changeRulesForm(state,data){
            state.rulesForm = data
        },
        initRulesForm(state){
            state.rulesForm={};
            state.page=1;
        }
    },

    actions:{
        
    }
}