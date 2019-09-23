
import axios from './axios'

export function getDownloadData(params){
    return axios({
        method:'get',
        url:'download/info/',
        params
    })
}
export function saveDownloadData(params){
    return axios({
        method:'post',
        url:'download/edit/',
        data:params
    })
}


export function getActivityData(params){
    return axios({
        method:'get',
        url:'activity/list/',
        params
    })
}
export function editActivityStatus(params){
    return axios({
        method:'post',
        url:'activity/status/edit/',
        data:params
    })
}
export function saveActivityData(params,isEdit){
    return axios({
        method:'post',
        url:`activity/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function getActivityInfo(params){
    return axios({
        method:'get',
        url:'activity/info/',
        params
    })
}
export function delActivityData(params){
    return axios({
        method:'delete',
        url:'activity/delete/',
        params
    })
}