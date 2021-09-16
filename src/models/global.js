import { getMessageList, getUnreadNotices } from '@/services/account';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    // 获取系统消息
    *fetchNotices(_, { call, put }) {
      const data = yield call(getMessageList, {
        recipientId: localStorage.getItem('id'),
        page: 1,
        limit: 10
      });
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },
    // 获取系统所有消息
    *fetchAllNotices(_, { call, put}) {
      const data = yield call(getUnreadNotices, localStorage.getItem('id'))
      yield put({
        type: 'user/changeNotifyCount',
        payload: data,
      });
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload.data,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
