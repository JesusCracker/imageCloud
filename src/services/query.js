import request from '@/utils/request';

//获取筛查阅片各列表总条数
export async function getListTotal() {
    return request(`/api/aibus/bdoctor/getPicuserNum`, {
        method: 'GET',
    });
}


//获取阅片管理-筛查阅片-待读图(科研阅片-全部)
export async function queryWaitReadingList(params) {
    return request(`/api/aibus/bdoctor/aisonouser`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//获取阅片管理-筛查阅片-读图中，已完成，已驳回（科研阅片-读图中，已完成）
export async function queryWaitingReadingList(params) {
    return request(`/api/aibus/bdoctor/picuser`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//已驳回里面的查看驳回原因
export async function getRejectReason(params) {
    return request(`/api/aibus/bdoctor/auditComment/${params.orId}`, {
        method: 'GET',
    });
}

//已完成里面查看报告
export async function getCheckReport(params) {
    return request(`/api/aibus/reportWarehouse/getReportDetail/${params.reportId}`, {
        method: 'GET',
    });
}

// 科研阅片操作里面全部页面的删除接口
export async function deleteAllScientific(params) {
    return request(`/api/aibus/bdoctor/deleteAibusPatientData/${params.id}`, {
        method: 'GET',
    });
}

// 科研阅片操作里面的删除接口
export async function deleteScientific(params) {
    return request(`/api/aibus/bdoctor/deletePatientData/${params.id}`, {
        method: 'GET',
    });
}

//获取筛查地址
export async function getAddressList() {
    return request(`/api/user/hisInstitution/getScreenInstitutions`, {
        method: 'GET',
    });
}

//获取阅片机构下拉
export async function queryOrganList() {
    return request(`/api/user/hisInstitution/institutionList`, {
        method: 'GET',
    });
}

//获取关联区域下拉
export async function getRelatedArea(params) {
    return request(`/api/user/hisArea/areaList`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//获取阅片机构详情
export async function getOrganDetail(params) {
    return request(`/api/user/hisInstitution/${params.id}`, {
        method: 'GET',
    });
}

//获取筛查机构详情
export async function getSelectOrganDetail(params) {
    return request(`/api/bacc/sysmanager/getInstitutionById`, {
        method: 'GET',
        params,
    });
}

//新增机构保存
export async function saveOrgan(params) {
    return request(`/api/user/hisInstitution/saveInstitution`, {
        method: 'PUT',
        body: {
            ...params,
        },
    });
}

//删除机构
export async function removeOrgan(params) {
    return request(`/api/user/hisInstitution/deleteInstitutions/${params}`, {
        method: 'DELETE',
    });
}

//筛查机构（获取全部机构）
export async function queryAllOrganList() {
    return request(`/api/bacc/sysmanager/inslist`, {
        method: 'GET',
    });
}

//筛查机构保存配置
export async function saveSetOrgan(params) {
    return request(`/api/bacc/sysmanager/addOrEdit`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//标记疑难
export async function changeDiff(params) {
    return request(`/api/aibus/bdoctor/isDifficultCase`, {
        method: 'GET',
        params,
    });
}