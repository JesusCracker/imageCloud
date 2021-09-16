/**
 *
 * ░░░░░░░█▐▓▓░████▄▄▄█▀▄▓▓▓▌█
 * ░░░░░▄█▌▀▄▓▓▄▄▄▄▀▀▀▄▓▓▓▓▓▌█
 * ░░░▄█▀▀▄▓█▓▓▓▓▓▓▓▓▓▓▓▓▀░▓▌█
 * ░░█▀▄▓▓▓███▓▓▓███▓▓▓▄░░▄▓▐█▌
 * ░█▌▓▓▓▀▀▓▓▓▓███▓▓▓▓▓▓▓▄▀▓▓▐█
 * ▐█▐██▐░▄▓▓▓▓▓▀▄░▀▓▓▓▓▓▓▓▓▓▌█▌
 * █▌███▓▓▓▓▓▓▓▓▐░░▄▓▓███▓▓▓▄▀▐█
 * █▐█▓▀░░▀▓▓▓▓▓▓▓▓▓██████▓▓▓▓▐█
 * ▌▓▄▌▀░▀░▐▀█▄▓▓██████████▓▓▓▌█▌
 * ▌▓▓▓▄▄▀▀▓▓▓▀▓▓▓▓▓▓▓▓█▓█▓█▓▓▌█▌
 * █▐▓▓▓▓▓▓▄▄▄▓▓▓▓▓▓█▓█▓█▓█▓▓▓▐█
 */

import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin, accountLogout, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { notification } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    * login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 1 && response.message === '成功') {
        reloadAuthorized();
        const id = JSON.stringify(response.data.id);
        const name = JSON.stringify(response.data.name);
        localStorage.setItem('id', id);
        localStorage.setItem('name', name);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        notification.error({
          message: response.code,
          description: response.message,
        });
      }
    },

    * getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    * logout(_, { call, put }) {
      const response = yield call(accountLogout);
      if (response.status === 1 && response.message === '成功') {
        const allowed = ['autoLogin', 'loginUserInfo'];
        if (typeof localStorage !== 'undefined') {
          const storage = window.localStorage;
          const filtered = Object.keys(storage)
            .filter(key => allowed.includes(key))
            .reduce((obj, key) => {
              obj[key] = storage[key];
              return obj;
            }, {});
          localStorage.clear();
          Object.keys(filtered).forEach(key => {
            localStorage.setItem(key, filtered[key]);
          });
        }

        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }else{
        notification.error({
          message: response.message,
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {

      setAuthority(payload.data.authForUser);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
