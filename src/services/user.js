import request from '@/utils/request';

// 通过ID获取用户详情
export async function queryCurrent() {
  const id=localStorage.getItem('id');
  if(id){
    return request(`/api/user/sysUser/${id}`);
  }
  return false;
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

//保存用户信息
export async function saveUser(params) {
  return request(`/api/user/sysUser/save`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

//删除用户
export async function deleteUser(params) {
  return request(`/api/user/sysUser/${params}`, {
    method: 'DELETE',
  });
}
