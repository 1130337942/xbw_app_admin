import axios from './axios'
import Cookies from 'js-cookie'

export function getResourcesData(params){
    return axios({
        method:'get',
        url:'source/list/',
        params
    })
}
export function delRecourse (params) {
  return axios({
    method:'delete',
    url:'source/delete/',
    params
  })
}
export function getBase64Token (params){
  return axios({
    method:'post',
    url:'oss_callback_encode',
    data:params
  })
}
export function uploadOssToken (params={}){
  return axios({
    method:'get',
    url:'source/get_token/',
    params
  })
}
export function addFolder (params){
  return axios({
    method:'post',
    url:'source/folder/add/',
    data:params
  })
}
export function editResourceInfo (params){
  return axios({
    method:'post',
    url:'source/info/edit/',
    data:params
  })
}
  

// 设置token
export function getToken () {
  return Cookies.get('xunToken')
}
 
export function setToken (token,expires) {
  return Cookies.set('xunToken', token , {expires: expires})
}

export function removeToken () {
  return Cookies.remove('xunToken')
}

// 设置token过期时间
export function getExpires () {
  return Cookies.get('expires')
}
 
export function setExpires (expires) {
  return Cookies.set('expires', expires )
}

export function removeExpires () {
  return Cookies.remove('expires')
}

// 设置oss的token
export function getOssToken () {
  return Cookies.get('ossToken')
}

export function setOssToken (token,expiration) {
  return Cookies.set('ossToken', token)
}

export function removeOssToken () {
  return Cookies.remove('ossToken')
}


