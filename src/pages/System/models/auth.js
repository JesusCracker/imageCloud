import { queryUserAuthList, saveUserAuth, getAuthorityDetail, updateAuth ,removeAuth} from '@/services/api';

export default {
  namespace: 'auth',
  state: {
    authListData: [],
    menuDetail: {},
  },

  effects: {
    * fetchAuthList({ payload }, { call, put }) {
      const response = yield call(queryUserAuthList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * addAuth({ payload }, { call, put }) {
      const response = yield call(saveUserAuth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      return response;
    },

    * getAuthorityDetail({ payload }, { call, put }) {
      const response = yield call(getAuthorityDetail, payload);
      yield put({
        type: 'saveMenuDetail',
        payload: response,
      });
      return response;
    },

    * update({ payload }, { call, put }) {
      const response = yield call(updateAuth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      return response;
    },
    * remove({ payload }, { call, put }) {
      const response = yield call(removeAuth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      return response;
    },


  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        authListData: action.payload && action.payload.data,
      };
    },
    saveMenuDetail(state, action) {
      return {
        ...state,
        menuDetail: action.payload && action.payload.data,
      };
    },
  },
};
