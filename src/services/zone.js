import request from '@/utils/request';

// 获取区域树
export async function queryZoneTree(params) {
  return request(`/api/user/hisArea/areaList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


//获取区域数据
export async function fetchZoneDetail(params) {
  return request(`/api/user/hisArea/areaCode/${params.id}`, {
    method: 'GET',
  });
}


// 获取管辖机构所属地区
export async function fetchZoneAgency(params) {
  return request(`/api/user/hisArea/getAreaByIns/${params.id}`, {
    method: 'GET',
  });
}

// 删除区域信息
export async function deleteZone(params) {
  return request(`/api/user/hisArea/deleteArea`, {
    method: 'POST',
    body: {
      id: params,
    },
  });
}

//保存区域信息
export async function saveZone(params) {
  return request(`/api/user/sysRole/save`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

