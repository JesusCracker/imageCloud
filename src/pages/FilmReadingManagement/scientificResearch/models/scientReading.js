import {
  queryWaitReadingList, getListTotal, getCheckReport, queryWaitingReadingList,
  deleteScientific, getAddressList, changeDiff, deleteAllScientific,getInstitutionInfo
} from '@/services/query';

export default {
  namespace: 'scientReading',
  state: {
    scienList: [],
    addressList: [],
    listToatl: {},
    reportData: {},
    institutionLogo:'',
  },

  effects: {
    //获取各列表总条数
    *fetchListTotal(_, { call, put }) {
      const response = yield call(getListTotal);
      yield put({
        type: 'saveTotal',
        payload: response,
      });
    },
    *fetchWaitReadingList({ payload }, { call, put }) {
      const response = yield call(queryWaitReadingList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchWaitingReadingList({ payload }, { call, put }) {
      const response = yield call(queryWaitingReadingList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *remove({ payload }, { call }) {
      return yield call(deleteScientific, payload);
    },

    *removeAll({ payload }, { call }) {
      return yield call(deleteAllScientific, payload);
    },

    //获取筛查机构
    *fetchAddressList(_, { call, put }) {
      const response = yield call(getAddressList);
      yield put({
        type: 'saveAddress',
        payload: response,
      });
    },
    //标记疑难
    *changeIcon({ payload }, { call }) {
      return yield call(changeDiff, payload);;
    },
    //查看报告
    *checkReport({ payload }, { call, put }) {
      const response = yield call(getCheckReport, payload);
      yield put({
        type: 'saveReport',
        payload: response,
      });
    },

    //获取机构LOGO
    *getInstitutionLogo({ payload }, { call, put }) {
      const response = yield call(getInstitutionInfo, payload);
      yield put({
        type: 'saveLogo',
        payload: response
      })
      return response
    }

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        scienList: action.payload.data && typeof action.payload.data !== 'string' ? action.payload : [{ data: [], dataTotal: 0 }],
      };
    },
    saveAddress(state, action) {
      return {
        ...state,
        addressList: action.payload.data && typeof action.payload.data !== 'string' ? action.payload.data : {},
      };
    },
    saveTotal(state, action) {
      return {
        ...state,
        listToatl: action.payload && action.payload.data
      };
    },
    saveReport(state, action) {
      return {
        ...state,
        reportData: action.payload.data && typeof action.payload.data !== 'string' ? action.payload : {},
      };
    },
    saveLogo(state, { payload }) {
      return {
        ...state,
        institutionLogo: payload && payload.data.logoUrl
      }
    },
  },
};
