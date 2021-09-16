import { query as queryUsers, queryCurrent } from '@/services/user';
import { changeMessageStatus } from '@/services/account'

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *changeMessageStatus({ payload }, { call }) {
      return yield call(changeMessageStatus, payload);
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload ? {...state.currentUser, ...action.payload.data} : {}
      };
    },
    changeNotifyCount(state, { payload }) {
      const temp = payload&&payload.data.filter(item => item.status === 2);
      const unreadNoticeCount = temp.length;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: unreadNoticeCount,
        },
      };
    },
  },
};
