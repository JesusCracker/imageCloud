import { queryInformationList, deleteInformationList, viewAllRoles, } from '@/services/linjieApi';

export default {
  namespace: 'information',
  state: {
    data:[],
    dataTotal: 0,
    btnLoading: false
  },
  effects: {

    *informationList({ payload }, { call, put }) {
      const response = yield call(queryInformationList, payload);
      yield put({
        type: 'fetch',
        payload: response,
      });
    },
    *deleteInformationList({ payload }, { call, put }) {
      const response = yield call(deleteInformationList, payload);
      yield put({
        type: 'delete',
        payload: response,
      });
      return response
    },
    *viewAllRoles(_, { call, put }) {
      const response = yield call(viewAllRoles);
      yield put({
        type: 'getRoles',
        payload: response,
      });
    },
  },

  reducers: {
    fetch(state, action) {
      return {
        ...state,
        data: action.payload?.data,
        dataTotal: action.payload?.dataTotal,
      };
    },
    delete(state) {
      return {
        ...state,
      };
    },
    getRoles(state, action) {
      return {
        ...state,
        rolesData: action.payload?.data,
      };
    },
  },
};
