import { getMessageList, deleteMessages, getMessageInfo, getEmailVerify, getPhoneVerify, postMessage, changePwd} from '@/services/account';
import { queryCurrent } from '@/services/user';

export default {
  namespace: 'info',

  state: {
    userInfo: {},
    messageList: [],
    messageContent: {},
    messageListTotal: 0
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *queryList({ payload }, { call, put }) {
      const response = yield call(getMessageList, payload);
      yield put({
        type: 'saveMessage',
        payload: response,
      });
    },
    *deleteMessages({ payload } , { call }) {
      const response = yield call(deleteMessages, payload);
      return response
    },
    *getMessageInfo({ payload }, { call, put }) {
      const response = yield call(getMessageInfo, payload);
      yield put({
        type: 'saveMessageInfo',
        payload: response
      })
    },
    *getEmailVerify({ payload }, {call}) {
      const response = yield call(getEmailVerify, payload);
      return response
    },
    *getPhoneVerify({ payload }, {call}) {
      const response = yield call(getPhoneVerify, payload);
      return response
    },
    *postMessage({ payload }, {call}) {
      const response = yield call(postMessage, payload);
      return response
    },
    *changePwd({ payload }, {call}) {
      const response = yield call(changePwd, payload);
      return response
    }
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        userInfo: payload.data
      }
    },
    saveMessage(state, { payload }) {
      return {
        ...state,
        messageList: payload.data,
        messageListTotal: payload.dataTotal
      }
    },
    showStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      }
    },
    saveMessageInfo(state, { payload }) {
      return {
        ...state,
        messageContent: payload.data
      }
    },
  },
};
