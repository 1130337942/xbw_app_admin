import axios from './axios';

export function getAppraisalType(params={}){
    return axios({
        method:'get',
        url:'appraisal/genres/list/',
        params
    })
}
export function submitAppraisal(params){
    return axios({
        method:'post',
        url:'appraisal/order/result/edit/',
        data:params
    })
}
export function cancelAppraisal(params){
    return axios({
        method:'post',
        url:'appraisal/order/reject/',
        data:params
    })
}

export function getAppraisalList(params){
    return axios({
        method:'get',
        url:'appraisal/order/list/',
        params
    })
}
export function getAppraisalInfo(params){
    return axios({
        method:'get',
        url:'appraisal/order/info/',
        params
    })
}

export function getFastAppraisalList(params){
    return axios({
        method:'get',
        url:'/appraisal/direct/list/',
        params
    })
}
export function editFastAppraisalStatus(params){
    return axios({
        method:'post',
        url:'appraisal/direct/status/edit/',
        data:params
    })
}
export function delFastAppraisalData(params){
    return axios({
        method:'delete',
        url:'appraisal/direct/delete/',
        params
    })
}
export function saveFastAppraisalData(params,isEdit){
    return axios({
        method:'post',
        url:`appraisal/direct/${isEdit?'edit':'add'}/`,
        data:params
    })
}

export function getExpertType(params){
    return axios({
        method:'get',
        url:'appraisal/genre/list/',
        params
    })
}

export function getExpertTypeInfo(params){
    console.log(params)
    return axios({
        method:'get',
        url:'appraisal/genre/info/',
        params
    })
}
export function editExpertStatus(params){
    return axios({
        method:'post',
        url:'appraisal/genre/status/edit/',
        data:params
    })
}
export function saveExpertType(params,isEdit){
    return axios({
        method:'post',
        url:`appraisal/genre/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function delExpertType (params){
    return axios({
        method:'delete',
        url:'appraisal/genre/delete/',
        params
    })
}


export function getExpertData(params){
    return axios({
        method:'get',
        url:'appraisal/expert/list/',
        params
    })
}
export function getExpertGenreData(params){
    return axios({
        method:'get',
        url:'appraisal/expert/genre/list/',
        params
    })
}
export function saveExpertData(params,isEdit){
    return axios({
        method:'post',
        url:`appraisal/expert/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function uploadExpertStatus(params){
    return axios({
        method:'post',
        url:'appraisal/expert/status/edit/',
        data:params
    })
}
export function uploadFeatureStatus(params){
    return axios({
        method:'post',
        url:'appraisal/expert/featured/type/edit/',
        data:params
    })
}
export function getExpertInfo(params){
    return axios({
        method:'get',
        url:'appraisal/expert/info/',
        params
    })
}
export function delExpertData (params){
    return axios({
        method:'delete',
        url:'appraisal/expert/delete/',
        params
    })
}
export function saveExpertTypeData(params,isEdit){
    return axios({
        method:'post',
        url:`appraisal/expert/genre/${isEdit?'edit':'add'}/`,
        data:params
    })
}

export function delExpertTypeData (params){
    return axios({
        method:'delete',
        url:'appraisal/expert/genre/delete/',
        params
    })
}



export function getServiceList (params){
    return axios({
        method:'get',
        url:'appraisal/serves/list/',
        params
    })
}
export function editServiceStatus(params){
    return axios({
        method:'post',
        url:'appraisal/serves/status/edit/',
        data:params
    })
}
export function saveServiceData(params,isEdit){
    return axios({
        method:'post',
        url:`appraisal/serves/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function delServiceData (params){
    return axios({
        method:'delete',
        url:'appraisal/serves/delete/',
        params
    })
}


export function getExpertOrgList (params){
    return axios({
        method:'get',
        url:'appraisal/org/list/',
        params
    })
}
export function delExperOrgData (params){
    return axios({
        method:'delete',
        url:'appraisal/org/delete/',
        params
    })
}
export function getExpertOrgInfo (params){
    return axios({
        method:'get',
        url:'appraisal/org/info/',
        params
    })
}
export function getExpertOrgService (params){
    return axios({
        method:'get',
        url:'appraisal/org/serves/list/',
        params
    })
}
export function saveExperOrgService (params,isEdit){
    return axios({
        method:'post',
        url:`appraisal/org/serves/${isEdit?'edit':'add'}/`,
        data:params
    })
}
export function delExpertOrgService (params){
    return axios({
        method:'delete',
        url:'appraisal/org/serves/delete/',
        params
    })
}
export function editExpertOrgStatus(params){
    return axios({
        method:'post',
        url:'appraisal/org/status/edit/',
        data:params
    })
}

export function saveExperOrgData(params,isEdit){
    return axios({
        method:'post',
        url:`appraisal/org/${isEdit?'edit':'add'}/`,
        data:params
    })
}