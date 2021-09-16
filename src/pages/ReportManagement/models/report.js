import { queryAgentList } from '@/services/api';
import { getApprovalManagementList, getReportDetail, getInstitutionInfo } from '@/services/approval';
import { pushReport, sendReportMessage } from '@/services/reportManagement';

export default {
  namespace: 'report',

  state: {
    listData: {
      data: [],
      dataTotal: 0
    },
    institutionList: [],
    reportInfo: {},
    institutionLogo: ''
  },

  effects: {
    // 获取机构信息
    *getInstitutionList(_, {call, put}) {
      const response = yield call(queryAgentList);
      yield put({
        type: 'institutionList',
        payload: response
      })
    },
    // 获取列表数据
    *getReportManagementList({ payload }, { call, put }) {
      const response = yield call(getApprovalManagementList, payload);
      yield put({
        type: 'getListData',
        payload: response,
      });
    },
    // 推送报告
    *pushReport({ payload }, { call }) {
      return yield call(pushReport, payload);
    },
    // 获取报告详情
    *getReportInfo({ payload }, { call, put }) {
      const response = yield call(getReportDetail, payload);
      yield put({
        type: 'saveReportInfo',
        payload: response
      });
      return response
    },
    // 获取机构logo
    *getInstitutionLogo({ payload }, { call, put }) {
      const response = yield call(getInstitutionInfo, payload);
      yield put({
        type: 'saveLogo',
        payload: response
      })
      return response
    },
    // 发送短信
    *sendReportMessage({ payload }, { call }) {
      return yield call(sendReportMessage, payload);
    }
  },

  reducers: {
    institutionList(state, { payload }) {
      return {
        ...state,
        institutionList: payload.data
      }
    },
    getListData(state, { payload }) {
      return {
        ...state,
        listData: typeof payload.data === 'string' ? {data: []} : payload
      };
    },
    saveReportInfo(state, { payload }) {
      return {
        ...state,
        reportInfo: Object.prototype.toString.call(payload.data) === '[object Null]' ? {} : payload.data
      }
    },
    saveLogo(state, { payload }) {
      return {
        ...state,
        institutionLogo: payload.logoUrl
      }
    }
  }
}
