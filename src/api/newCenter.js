
import axios from './axios'

export function getPlateData (params) {
    return axios({
        method:'get',
        url:'news/plate/list/',
        params
    })
}
export function savePlateData (params,isEdit) {
    return axios({
        method:'post',
        url:isEdit?'news/plate/edit/':'news/plate/add/',
        data:params
    })
}
export function delPlateData (params) {
    return axios({
        method:'delete',
        url:'news/plate/delete/',
        params
    })
}

export function getColumnData (params) {
    return axios({
        method:'get',
        url:'news/column/list/',
        params
    })
}
export function saveColumnData (params,isEdit) {
    return axios({
        method:'post',
        url:isEdit?'news/column/edit/':'news/column/add/',
        data:params
    })
}


export function addNewsListData (params){   //栏目新闻 添加
    return axios({
        method:'post',
        url:'news/column/news/add/',
        data:params
    }) 
}
export function editNewsListData (params){   //栏目新闻  编辑
    return axios({
        method:'post',
        url:'news/column/news/status/edit/',
        data:params
    }) 
}
export function getNewsListData (params){   //栏目新闻  待选列表
    return axios({
        method:'get',
        url:'news/column/news/add/news_list/',
        params
    }) 
}
export function getColumnNewsData (params){
    return axios({
        method:'get',
        url:'news/column/news/list/',
        params
    }) 
}
export function delColumnNews (params) {
    return axios({
        method:'delete',
        url:'news/column/news/delete/',
        params
    })
}

export function getNewsData (params) {
    return axios({
        method:'get',
        url:'news/list/',
        params
    })
}
export function delNew (params) {
    return axios({
        method:'delete',
        url:'news/delete/',
        params
    })
}

export function getNewsInfo (params) {
    return axios({
        method:'get',
        url:'news/info/',
        params
    })
}
export function saveNew (params,isEdit) {
    return axios({
        method:'post',
        url:isEdit?'news/edit/':'news/add/',
        data:params
    })
}
export function deltagData (params) {
    return axios({
        method:'delete',
        url:'news/tag/release/',
        params
    })
}