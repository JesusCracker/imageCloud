import { queryAgentList } from '@/services/api';
import { getApprovalManagementList, getApprovalNum, postApprovalOpinion, getReportDetail, getInstitutionInfo } from '@/services/approval';

export default {
  namespace: 'approval',

  state: {
    listData: [],
    institutionList: [],
    count: {
      noApprovalNum: 0,
      passedNum: 0,
      rejectedNum: 0
    },
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
    *getApprovalManagementList({ payload }, { call, put }) {
      const response = yield call(getApprovalManagementList, payload);
      yield put({
        type: 'getListData',
        payload: response,
      });
    },
    // 获取各个Tab上显示的数量
    *getApprovalNum(_, { call, put }) {
      const response = yield call(getApprovalNum);
      yield put({
        type: 'saveCount',
        payload: response
      })
      return response;
    },
    // 提交审批意见
    *postOpinion({ payload }, { call }) {
      return yield call(postApprovalOpinion, payload);
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
        listData: typeof payload.data === 'string' ? {data: []} : payload,
      };
    },
    saveCount(state, { payload }) {
      return {
        ...state,
        count: payload.data
      }
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
        institutionLogo: payload.data.logoUrl
      }
    }
  }
}
