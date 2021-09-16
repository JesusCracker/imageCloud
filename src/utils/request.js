import { extend, RequestOptionsInit } from 'umi-request';
import { notification, message } from 'antd';
import router from 'umi/router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};


/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });

    if (status === 401) {
      notification.error({
        message: '未登录或登录已过期，请重新登录。',
      });
      // @HACK
      /* eslint-disable no-underscore-dangle */
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
      return;
    }
    // environment should not be used
    if (status === 403) {
      router.push('/exception/403');
      return;
    }
    if (status <= 504 && status >= 500) {
      router.push('/exception/500');
      return;
    }
    if (status >= 404 && status < 422) {
      router.push('/exception/404');
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
};

/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  // timeout: 60000, // 请求超时
});
// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  const newOptions = options;
  const authorization = localStorage.getItem('authorization');

  newOptions.body = JSON.stringify(options.body);
  if (authorization) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      authorization,
    };

    return (
      {
        url,
        options: { ...newOptions, headers },
      }
    );
  }
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  return (
    {
      url,
      options: { ...newOptions, headers },
    }
  );

});

// response拦截器, 处理response
request.interceptors.response.use(async (response, options) => {
  const authorization = response.headers.get('authorization');
  const data = await response.clone().json();
  if (authorization) {
    localStorage.setItem('authorization', authorization);
  }
  if (data.status !==1) {
    if(data.message&&(data.status===1004||data.status===401)){
      router.push('/user/login');
      return false;
    }
    notification.error({
      message: `请求错误 `,
      description: `接口${response.url} ${data.message}`,
    });
    return response;
  }

  return response;
});


export default request;
