// 审批管理相关的接口
import request from '@/utils/request';

// 审批管理列表
export async function getApprovalManagementList(params) {
  return request(`/api/aibus/reportWarehouse/list`, {
    method: 'POST',
    body: params
  })
}

// 获取tabs上显示的数量
export async function getApprovalNum() {
  return request(`/api/aibus/reportWarehouse/getCountNum`, {
    method: 'GET',
  })
}

// 提交审批意见
export async function postApprovalOpinion(params) {
  return request(`/api/aibus/reportWarehouse/auditReport`, {
    method: 'POST',
    body: params
  })
}

// 获取报告详情
export async function getReportDetail(params) {
  return request(`/api/aibus/reportWarehouse/getReportDetail/${params}`, {
    method: 'GET'
  })
}

// 获取阅片机构详情
export async function getInstitutionInfo(params) {
  return request('/api/bacc/sysmanager/getInstitutionById', {
    method: 'GET',
    params: {
      id: params
    }
  })
}
