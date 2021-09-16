// import { stringify } from 'qs';
import request from '@/utils/request';

// 医生开始阅片时调用（确认是否被其他医生抢单）
export async function queryHisExam(params) {
  return request(`/api/aibus/bdoctor/doctorWorkStartOnAibus/${params.id}`);
}

// 获取检查详情
export async function getExamDetail(params) {
  return request(`/api/aibus/bdoctor/getExamDetail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

// 获取当前阅片病人历史ai信息
export async function hisExam(params) {
  return request(`/api/aibus/bdoctor/hisExam`, {
    method: 'POST',
    params
  });
}

// 获取视频帧JSON信息和深度
export async function getExamImgDetail(params) {
  return request(`/api/aibus/bdoctor/getExamImgDetail`, {
    method: 'POST',
    params
  });
}

//  查询阅片未完成时数据
export async function findDataImg(params) {
  return request(`/api/aibus/reportImg/findDataImg`, {
    params
  });
}

//  保存该阅片数据图片
export async function saveReportImg(params) {
  return request(`/api/aibus/reportImg/saveReportImg`, {
    method: 'PUT',
    body: {
      ...params
    }
  });
}

//  删除该阅片数据的图片
export async function deleteReportImg(params) {
  return request(`/api/aibus/reportImg/deleteReportImg`, {
    method: 'POST',
    params
  });
}

//  获取历史报告
export async function getReportHistory(params) {
  return request(`/api/aibus/reportWarehouse/getReportHistory/${params}`);
}

//  获取报告详情
export async function getReportDetail(params) {
  return request(`/api/aibus/reportWarehouse/getReportDetail/${params.id}`);
}

//  获取机构详情（不带二维码)
export async function getInstitutionById(params) {
  return request(`/api/bacc/sysmanager/getInstitutionById`, {params});
}
