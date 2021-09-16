import { deleteUser, queryUserList, saveUser } from '@/services/user';

export default {
  namespace: 'users',
  state: {
    userList: [],
  },

  effects: {
    * fetchUserList({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'saveUserList',
        payload: response,
      });
    },
    * saveUserInfo({ payload }, { call, put }) {
      return yield call(saveUser, payload);
    },

    * deleteUserById({ payload }, { call, put }) {
      return yield call(deleteUser, payload);
    },


  },

  reducers: {
    saveUserList(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
  },
};
