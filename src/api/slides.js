
import axios from './axios'

export function getSlidesData(params){
    return axios({
        method:'get',
        url:'advertising/column/tree/',
        params
    })
}
export function saveSlidesData(params,isEdit){
    return axios({
        method:'post',
        url:isEdit?'advertising/column/edit/':'advertising/column/add/',
        data:params
    })
}
export function delSlidesData(params){
    return axios({
        method:'DELETE',
        url:'advertising/column/delete/',
        params
    })
}

export function getSlidesList(params){
    return axios({
        method:'get',
        url:'advertising/carousel/list/',
        params
    })
}
export function getSlidesInfo(params){
    return axios({
        method:'get',
        url:'advertising/carousel/info/',
        params
    })
}
export function addSlides(params){
    return axios({
        method:'post',
        url:'advertising/carousel/add/',
        data:params
    })
}
export function editSlides(params){
    return axios({
        method:'post',
        url:'advertising/carousel/edit/',
        data:params
    })
}
export function delSlides(params){
    return axios({
        method:'delete',
        url:'advertising/carousel/delete/',
        params
    })
}
export function editSlidesStatus(params){
    return axios({
        method:'post',
        url:'advertising/carousel/status/edit/',
        data:params
    })
}