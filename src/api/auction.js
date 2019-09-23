import axios from './axios';

export function getOriginList(params){
    return axios({
        method:'get',
        url:'auction/organization/list/',
        params
    })
}
export function editOriginStatus(params){
    return axios({
        method:'post',
        url:'auction/organization/status/edit/',
        data:params
    })
}
export function saveOriginData(params,isEdit){
    return axios({
        method:'post',
        url:`auction/organization/${isEdit?'edit':'add'}/`,
        data:params
    })
}

export function getActivityList(params){
    return axios({
        method:'get',
        url:'auction/auctions/list/',
        params
    })
}
export function editActivityStatus(params){
    return axios({
        method:'post',
        url:'auction/auctions/status/edit/',
        data:params
    })
}
export function saveActivityData(params,isEdit){
    return axios({
        method:'post',
        url:`auction/auctions/${isEdit?'edit':'add'}/`,
        data:params
    })
}

export function getAuctionGoodsList(params){
    return axios({
        method:'get',
        url:'auction/goods/list/',
        params
    })
}
export function getAuctionGoodsInfo(params){
    return axios({
        method:'get',
        url:'auction/goods/info/',
        params
    })
}
export function editAuctionGoodsStatus(params){
    return axios({
        method:'post',
        url:'auction/goods/status/edit/',
        data:params
    })
}
export function saveAuctionGoodsData(params,isEdit){
    return axios({
        method:'post',
        url:`auction/goods/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function delAuctionGoodsData(params){
    return axios({
        method:'delete',
        url:'auction/goods/delete/',
        params
    })
}
export function delCharacterData(params){
    return axios({
        method:'post',
        url:'auction/goods/feature/remove/',
        data:params
    })
}
export function addCharacterData(params){
    return axios({
        method:'post',
        url:'auction/goods/feature/add/',
        data:params
    })
}
export function saveGoodsFeatureData(params){
    return axios({
        method:'post',
        url:'auction/goods/feature/add/',
        data:params
    })
}

export function getFeatureList(params){
    return axios({
        method:'get',
        url:'auction/feature/list/',
        params
    })
}
export function saveFeatureData (params,isEdit){
    return axios({
        method:'post',
        url:`auction/feature/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function delFeatureData (params){
    return axios({
        method:'DELETE',
        url:'auction/feature/delete/',
        params
    })
}