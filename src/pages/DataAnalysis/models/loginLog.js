import { queryLoginLogList } from '@/services/linjieApi';

export default {
  namespace: 'loginLog',
  state: {
    data:{

    }
  },
  effects: {

    *loginLog({ payload }, { call, put }) {
      const response = yield call(queryLoginLogList, payload);
      yield put({
        type: 'fetchLoginLog',
        payload: response,
      });
    },

  },

  reducers: {
    fetchLoginLog(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
