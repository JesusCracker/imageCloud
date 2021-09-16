import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

// 获取审批管理列表
export async function getApprovalManagementList(params) {
  return request(`${params}`, {
    method: 'GET'
  })
}

// 获取用户列表
export async function queryUserList(params) {
  return request(`/api/user/sysUser/query`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//获取权限列表
export async function queryUserAuthList(params) {
  return request(`/api/user/sysAuthority/list/${params.type}`, {
    method: 'GET',
  });
}

//权限获取父级菜单
export async function queryParentsList(params) {
  return request(`/api/user/sysAuthority/listForChoose/${params.type}`, {
    method: 'GET',
  });
}

//获取机构下拉菜单
export async function queryAgentList() {
  return request(`/api/user/hisInstitution/institutionList/`, {
    method: 'GET',
  });
}

//获取角色下拉菜单
export async function queryRoleList(params) {
  return request(`/api/user/sysRole/list/${params.type}`, {
    method: 'GET',
  });
}

//新建权限
export async function saveUserAuth(params) {
  return request(`/api/user/sysAuthority/save`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//获取id权限详情
export async function getAuthorityDetail(params) {
  return request(`/api/user/sysAuthority/${params.id}`, {
    method: 'GET',
  });
}

//编辑权限菜单
export async function updateAuth(params) {
  return request('/api/user/sysAuthority/save', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//删除权限
export async function removeAuth(params) {
  return request(`/api/user/sysAuthority/${params}`, {
    method: 'DELETE',
  });
}

//获取用户详情
export async function fetchUserDetail(params) {
  return request(`/api/user/sysUser/${params.id}`, {
    method: 'GET',
  });
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

//登录
export async function accountLogin(params) {
  return request('/api/user/sysUser/login', {
    method: 'POST',
    body: params,
  });
}

//退出
export async function accountLogout() {
  return request(`/api/user/sysUser/logout`, {
    method: 'GET',
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function userRegister(params) {
  return request('/api/user/sysUser/save', {
    method: 'PUT',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
