import axios from './axios';

export function getAntiqueColumn (params){
    return axios({
        method:'get',
        url:'antique/column/list/',
        params
    })
}
export function savaAntiqueColumn (params,isEdit){
    return axios({
        method:'post',
        url:`antique/column/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function delAntiqueColumn (params){
    return axios({
        method:'delete',
        url:'antique/column/delete/',
        params
    })
}

export function getAntiqueList (params){
    return axios({
        method:'get',
        url:'antique/list/',
        params
    })
}
export function getAntiqueInfo (params){
    return axios({
        method:'get',
        url:'antique/info/',
        params
    })
}
export function saveAntiqueData (params,isEdit){
    return axios({
        method:'post',
        url:`antique/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function editAntiqueStatus (params){
    return axios({
        method:'post',
        url:'antique/status/edit/',
        data:params
    })
}
export function delAntiqueData (params){
    return axios({
        method:'delete',
        url:'antique/delete/',
        params
    })
}