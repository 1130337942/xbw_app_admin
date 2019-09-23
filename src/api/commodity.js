import axios from './axios';

export function getClassisData(params){
    return axios({
        method:'get',
        url:'commodity/genre/tree/',
        params
    })
}
export function saveClassisData(params,isEdit){
    return axios({
        method:'post',
        url:isEdit?'commodity/genre/edit/':'commodity/genre/add/',
        data:params
    })
}
export function delClassisData(params){
    return axios({
        method:'delete',
        url:'commodity/genre/delete/',
        params
    })
}

export function getAuditData(params){
    return axios({
        method:'get',
        url:'commodity/review/list/',
        params
    })
}
export function getAuditCascaderData(params){
    return axios({
        method:'get',
        url:'commodity/genre/list/',
        params
    })
}
export function reviewAudit(params){
    return axios({
        method:'post',
        url:'commodity/review/',
        data:params
    })
}

export function getCommoditylist(params){
    return axios({
        method:'get',
        url:'commodity/list/',
        params
    })
}
export function addCommoditylist(params,isEdit){
    return axios({
        method:'post',
        url:isEdit?'commodity/edit/':'commodity/add/',
        data:params
    })
}
export function getCommodityInfot(params){
    return axios({
        method:'get',
        url:'commodity/info/',
        params
    })
}
export function editCommodityStatus(params){
    return axios({
        method:'post',
        url:'commodity/status/edit/',
        data:params
    })
}

