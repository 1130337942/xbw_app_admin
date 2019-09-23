import axios from './axios'
// 获取会场列表
export function getMettingList(params) {
    return axios({
        method: 'get',
        url: 'commodity/venue/list/',
        params
    })
}
// 获取主题列表
export function getThemeList(params) {
    return axios({
        method: 'get',
        url: 'commodity/theme/list/',
        params
    })
}
// 主题列表switch开关状态
export function themeSwitchStatus(params) {
    return axios({
        method: 'post',
        url: 'commodity/theme/status/edit/',
        data: params
    })
}
// 主题商品switch开关状态
export function goodsSwitchStatus(params) {
    return axios({
        method: 'post',
        url: 'commodity/theme/commodity/status/edit/',
        data: params
    })
}
// 新增主题
export function addTheme(params) {
    return axios({
        method: 'post',
        url: 'commodity/theme/add/',
        data: params
    })
}
// 主题详情
export function getThemeInfo(params) {
    return axios({
        method: 'get',
        url: 'commodity/theme/info/',
        params
    })
}
// 新增,修改的提交按钮
export function saveThemesData(params, isEdit) {
    return axios({
        method: 'post',
        url: `commodity/theme/${isEdit ? 'edit' : 'add'}/`,
        data: params
    })
}
// 商家店铺列表
export function getMerchantList(params) {
    return axios({
        method: 'get',
        url: 'merchant/list/',
        params
    })
}
// 商品列表
export function getGoods(params) {
    return axios({
        method: 'get',
        url: 'commodity/list/',
        params
    })
}
// 主题商品列表
export function getThemeGoods(params) {
    return axios({
        method: 'get',
        url: 'commodity/theme/commodity/list/',
        params
    })
}
// 下拉分类
export function getAuditCascaderData(params) {
    return axios({
        method: 'get',
        url: 'commodity/genre/list/',
        params
    })
}
// 添加主题商品
export function addThemeGood(params) {
    return axios({
        method: 'post',
        url: 'commodity/theme/commodity/add/',
        data: params
    })
}
// 移除主题商品
export function removeThemeGood(params) {
    return axios({
        method: 'post',
        url: 'commodity/theme/commodity/remove/',
        data: params
    })
}
// 编辑主题商品
export function editThemeGood(params) {
    return axios({
        method: 'post',
        url: 'commodity/theme/commodity/edit/',
        data: params
    })
}
