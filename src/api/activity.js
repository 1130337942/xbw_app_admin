import axios from './axios'
// 获取会场列表
export function getMettingList(params) {
    return axios({
        method: 'get',
        url: 'commodity/venue/list/',
        params
    })
}
// 会场详情
export function getMettingInfo(params) {
    return axios({
        method: 'get',
        url: 'commodity/venue/info/',
        params
    })
}
// 会场列表switch开关状态
export function editSwitchStatus(params) {
    return axios({
        method: 'post',
        url: 'commodity/venue/status/edit/',
        data: params
    })
}
// 新增,修改的提交按钮
export function saveMeetingsData(params, isEdit) {
    return axios({
        method: 'post',
        url: `commodity/venue/${isEdit ? 'edit' : 'add'}/`,
        data: params
    })
}