import { getListTotal,queryWaitReadingList, queryWaitingReadingList, getAddressList, getRejectReason, getCheckReport } from '@/services/query';
import { getInstitutionInfo } from '@/services/approval'

export default {
  namespace: 'waitReading',
  state: {
    screenList: [],
    addressList: [],
    reasonData: {},
    reportData: {},
    institutionLogo:'',
    listToatl:{}
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
    //筛查阅片-待读图列表
    *fetchWaitReadingList({ payload }, { call, put }) {
      const response = yield call(queryWaitReadingList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //筛查阅片-已完成，已驳回，已关闭列表
    *fetchWaitingReadingList({ payload }, { call, put }) {
      const response = yield call(queryWaitingReadingList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //获取筛查机构
    *fetchAddressList(_, { call, put }) {
      const response = yield call(getAddressList);
      yield put({
        type: 'saveAddress',
        payload: response,
      });
    },
    //获取驳回原因
    *reason({ payload }, { call, put }) {
      const response = yield call(getRejectReason, payload);
      yield put({
        type: 'saveReason',
        payload: response,
      });
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
        screenList: action.payload.data && typeof action.payload.data !== 'string' ? action.payload : [{ data: [], dataTotal: 0 }],
      };
    },
    saveAddress(state, action) {
      return {
        ...state,
        addressList: action.payload.data && typeof action.payload.data !== 'string' ? action.payload.data : {},
      };
    },
    saveReason(state, action) {
      return {
        ...state,
        reasonData: action.payload.data && typeof action.payload.data !== 'string' ? action.payload : {},
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
    saveTotal(state, action) {
      return {
        ...state,
        listToatl: action.payload && action.payload.data
      };
    },
  },
};
