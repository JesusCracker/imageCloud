//只遍历两次获取两层菜单
function fetchTwoAuthorityNodes(authority) {
  if (Array.isArray(authority)) {
    return authority.map(item => ({
      icon: item.icon,
      id: item.id,
      name: item.name,
      orderBy: item.orderBy,
      parentId: item.parentId,
      path: item.path,
      routes: item.routes.length === 0 ? [] : item.routes.map(secondItem=>({
        icon: secondItem.icon,
        id: secondItem.id,
        name: secondItem.name,
        orderBy: secondItem.orderBy,
        parentId: secondItem.parentId,
        path: secondItem.path,
        routes: [],
      })),
    }));
  }
  return [];
}

//获取第三层

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return fetchTwoAuthorityNodes(authority);
}


export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('authority', JSON.stringify(proAuthority));
}
