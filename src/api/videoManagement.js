import axios from './axios'
// 视频列表
export function getListData (params) {
    return axios({
        method:'get',
        url:'video/list/',
        params
    })
}
export function saveVideo (params,isEdit) {
    return axios({
        method:'post',
        url:isEdit?'video/edit/':'video/add/',
        data:params
    })
}
export function getListideoInfo (params) {
    return axios({
        method:'get',
        url:'video/info/',
        params
    })
}
// 视频版块
export function getSectionListData (params) {
    return axios({
        method:'get',
        url:'video/plate/list/',
        params
    })
}
export function saveSectionVideo (params,isEdit) {
    return axios({
        method:'post',
        url:isEdit?'video/plate/edit/':'video/plate/add/',
        data:params
    })
}
export function getSectionVideoInfo (params) {
    return axios({
        method:'get',
        url:'video/plate/info/',
        params
    })
}
// 视频栏目
export function getProgramList(params){
    return axios({
        method:'get',
        url:'video/column/list/',
        params
    })
}
export function savePlateVideo (params,isEdit) {
    return axios({
        method:'post',
        url:isEdit?'video/column/edit/':'video/column/add/',
        data:params
    })
}
export function getNewsList(params){  //待选列表
    return axios({
        method:'get',
        url:'video/column/video/add/video_list/',
        params
    })
}
// 栏目视频
export function getColumnList(params){
    return axios({
        method:'get',
        url:'video/column/video/list/',
        params
    })
}
