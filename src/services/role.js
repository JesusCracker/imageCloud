import request from '@/utils/request';

//获取角色详情
export async function fetchRoleDetail(params) {
  return request(`/api/user/sysRole/${params.id}`, {
    method: 'GET',
  });
}
//查看所有角色
export async function fetchRoleList() {
  return request(`/api/user/sysRole/list`, {
    method: 'GET',
  });
}

// 获取角色列表
export async function queryRoleList(params) {
  return request(`/api/user/sysRole/query`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//保存角色权限
export async function saveRoleAuth(params) {
  return request(`/api/user/sysRole/updateRoleAuth`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//保存角色信息
export async function saveRole(params) {
  return request(`/api/user/sysRole/save`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//删除角色
export async function deleteRole(params) {
  return request(`/api/user/sysRole/${params}`, {
    method: 'DELETE',
  });
}
