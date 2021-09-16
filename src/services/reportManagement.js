// 报告管理相关接口
import request from '@/utils/request';

export async function pushReport(params) {
  return request('/api/aibus/reportWarehouse/pushReport', {
    method: 'POST',
    body: params
  })
}

export async function sendReportMessage(params) {
  return request('/api/aibus/reportWarehouse/sendMessageReport', {
    method: 'POST',
    body: params
  })
}
