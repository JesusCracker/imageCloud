import { queryRoleList, saveRole, deleteRole, fetchRoleDetail, fetchRoleList,saveRoleAuth } from '@/services/role';
import { queryUserAuthList} from '@/services/api';

export default {
  namespace: 'roles',
  state: {
    roleList: [],
    roleDetail:{},
    authListData:[],
  },

  effects: {
    * fetchAuthList({ payload }, { call, put }) {
      const response = yield call(queryUserAuthList, payload);
      yield put({
        type: 'saveUserAuthList',
        payload: response,
      });
    },

    * fetchRoleList({ payload }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      yield put({
        type: 'saveRoleList',
        payload: response,
      });
    },
    * fetchRoleDetail({ payload }, { call,put }) {
      const response= yield call(fetchRoleDetail, payload);
      yield put({
        type: 'saveRoleDetail',
        payload: response,
      });
    },

    * saveRoleInfo({ payload }, { call }) {
      return yield call(saveRole, payload);
    },

    * saveRoleAuth({ payload }, { call }) {
      return yield call(saveRoleAuth, payload);
    },

    * deleteRoleById({ payload }, { call }) {
      return yield call(deleteRole, payload);
    },


  },

  reducers: {
    saveUserAuthList(state, action) {
      return {
        ...state,
        authListData: action.payload && action.payload.data,
      };
    },
    saveRoleList(state, action) {
      return {
        ...state,
        roleList: action.payload,
      };
    },
    saveRoleDetail(state,action){
      return {
        ...state,
        roleDetail: action.payload.data,
      };
    }
  },
};
