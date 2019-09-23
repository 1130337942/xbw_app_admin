/**
 * 拍卖管理
 */
export default {
    namespaced:true,
    state:{
        nav:[{
            title:'拍卖机构',
            index:'/auction/originList',
            componentName:'auction_originList',
            leaf:true
        },{
            title:'特性列表',
            index:'/auction/featureList',
            componentName:'auction_featureList',
            leaf:true
        }],
        timeFrame:{ //当前拍卖会的起始时间
            start_time:'',
            end_time:''
        }
    },

    getters:{
        navData(state){
            return state.nav
        },
        //获取缓存列表
        includeArr(state){
            return state.nav.map(item=>item.componentName)
        },
        getTimeFrame(state){
            return state.timeFrame;
        }
    },

    mutations:{
        changeTimeFrame(state,times){
            state.timeFrame.start_time = times[0];
            state.timeFrame.end_time = times[1];
        }
    },

    actions:{
    }
}