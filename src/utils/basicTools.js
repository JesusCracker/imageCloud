/**
 * @Description: base64加/解密
 * @author wuzhuorui
 * @date 2020/12/15
*/
export const encodeBase64 = str => window.btoa(encodeURIComponent(str));

export const decodeBase64 = encodeStr => decodeURIComponent(window.atob(encodeStr));

/**
 * @Description: 按钮权限控制
 * @author wuzhuorui
 * @date 2020/12/18
*/


