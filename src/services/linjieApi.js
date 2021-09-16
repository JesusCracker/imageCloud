import { stringify } from 'qs';
import request from '@/utils/request';

// 获取用户列表
export async function queryLoginLogList(params) {
  return request(`/api/user/sysUser/query`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 系统消息 - 获取消息列表
export async function queryInformationList(params) {
  return request(`/api/user/hisMessage/getMessageList`,{
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 系统消息 - 删除消息列表
export async function deleteInformationList(params) {
  return request(`/api/user/hisMessage/deleteMessage`,{
    method: 'POST',
    body: params,
  });
}

// 系统消息 - 查看所有角色及其所有用户
export async function viewAllRoles() {
  return request(`/api/user/sysRole/roleWithUser/2`,{
    method: 'GET',
  });
}

// 系统消息 - 发送消息
export async function sendInformation(params) {
  return request(`/api/user/hisMessage/saveInstitution`,{
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

// 系统消息 - 查看消息
export async function viewInformation(params) {
  return request(`/api/user/hisMessage/${params}`,{
    method: 'GET',
  });
}

// 帮助中心 - 用户产品建议
export async function productSuggestion(params) {
  return request(`/api/aibus/productAdvise/save`,{
    method: 'PUT',
    body: params
  });
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}
