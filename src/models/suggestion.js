import { productSuggestion } from '@/services/linjieApi';

export default {
  namespace: 'suggestion',
  state: {
    sendData: [],
  },
  effects: {
    *productSuggestion({ payload }, { call, put }) {
      const response = yield call(productSuggestion, payload);
      yield put({
        type: 'send',
        payload: response,
      });
      return response;
    },
  },
  reducers: {
    send(state, action) {
      return {
        ...state,
        sendData: action.payload?.data,
      };
    },
  },
};
