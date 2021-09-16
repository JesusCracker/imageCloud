// 获取个人中心消息列表
import request from '@/utils/request';

export async function getMessageList(params) {
  return request(`/api/user/hisMessage/getMessageList`, {
    method: 'POST',
    body: {
      ...params
    }
  });
}

// 获取所有消息
export async function getUnreadNotices(params) {
  return request(`/api/user/hisMessage/getAllMessage?userId=${params}`, {
    method: 'GET'
  })
}

// 删除消息
export async function deleteMessages(params) {
  return request(`/api/user/hisMessage/deleteMessage`, {
    method: 'POST',
    body: params
  })
}
// 查看消息详情
export async function getMessageInfo(params) {
  return request(`/api/user/hisMessage/${params}`, {
    method: 'GET'
  })
}

// 获取邮箱验证码
export async function getEmailVerify(params) {
  return request(`/api/user/sysUser/mailVeriCode?mailCode=${params}`, {
    method: 'GET'
  })
}
// 获取电话验证码
export async function getPhoneVerify(params) {
  return request(`/api/user/sysUser/phoneVeriCode?tel=${params}`, {
    method: 'GET'
  })
}

// 修改个人信息
export async function postMessage(params) {
  return request(`/api/user/sysUser/updateUserDetail`, {
    method: 'PUT',
    body: { ...params }
  })
}

export async function changePwd(params) {
  return request(`/api/user/sysUser/updatePassword?userId=${params.userId}&oldPassword=${params.oldPassword}&newPassword=${params.newPassword}`, {
    method: 'POST'
  })
}

export async function changeMessageStatus(params) {
  return request('/api/user/hisMessage/saveInstitution',{
    method: 'PUT',
    body: {
      id: params,
      // status 1已读 2未读
      status: 1
    }
  })
}
