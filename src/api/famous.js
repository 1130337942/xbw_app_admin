import axios from './axios';

export function getMessageList (params){
    return axios({
        method:'get',
        url:'celebrity/list/',
        params
    })
}
export function getMessageInfo (params){
    return axios({
        method:'get',
        url:'celebrity/info/',
        params
    })
}


export function editMessageStatus (params){
    return axios({
        method:'post',
        url:'celebrity/status/edit/',
        data:params
    })
}
export function saveMessageData (params,isEdit){
    return axios({
        method:'post',
        url:`celebrity/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function delTags (params){
    return axios({
        method:'delete',
        url:'celebrity/tag/release/',
        params
    })
}
export function delMessageData (params){
    return axios({
        method:'delete',
        url:'celebrity/delete/',
        params
    })
}

export function getCollectionData (params){
    return axios({
        method:'get',
        url:'celebrity/collection/list/',
        params
    })
}
export function getCollectionInfo (params){
    return axios({
        method:'get',
        url:'celebrity/collection/info/',
        params
    })
}
export function editCollectionStatus (params){
    return axios({
        method:'post',
        url:'celebrity/collection/status/edit/',
        data:params
    })
}
export function delCollectionData (params){
    return axios({
        method:'delete',
        url:'celebrity/collection/delete/',
        params
    })
}

export function saveCollectionData (params,isEdit){
    return axios({
        method:'post',
        url:`celebrity/collection/${isEdit?'edit':'add'}/`,
        data:params
    })
}


export function getCommodityData (params){
    return axios({
        method:'get',
        url:'celebrity/commodity/list/',
        params
    })
}
export function editCommodityStatus (params){
    return axios({
        method:'post',
        url: `celebrity/commodity/status/edit/`,
        data:params
    })
}
export function addCommodityData (params){
    return axios({
        method:'post',
        url: `celebrity/commodity/add/`,
        data:params
    })
}
export function delCommodityData (params){
    return axios({
        method:'delete',
        url:'celebrity/commodity/delete/',
        params
    })
}