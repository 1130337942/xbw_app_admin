import axios from "./axios.js";

/**
 * 商户管理
 */

 export function getMerchantData(params){
    return axios({
        method:'get',
        url:'merchant/list/',
        params
    })
 }
 export function editStatusData(params){
    return axios({
        method:'post',
        url:'merchant/status/edit/',
        data:params
    })
 }
 export function getInfoData(params){
    return axios({
        method:'get',
        url:'merchant/info/',
        params
    })
 }
 export function editInfoData(params){
    return axios({
        method:'post',
        url:'merchant/edit/',
        data:params
    })
 }

 export function getAuditData(params){
    return axios({
        method:'get',
        url:'merchant/application/await_list/',
        params
    })
 }
 export function getAuditInfoData(params){
    return axios({
        method:'get',
        url:'merchant/application/info/',
        params
    })
 }
 export function auditMerchant(params){
    return axios({
        method:'post',
        url:'merchant/application/process/',
        data:params
    })
 }