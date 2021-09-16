import { getExamDetail, hisExam, getExamImgDetail, findDataImg, saveReportImg, deleteReportImg, getReportHistory, getReportDetail, getInstitutionById } from '@/services/xApi'

export default {
  namespace: 'readingPictures',

  state: {
    id: '',
    videoSrc: '',
    aiPicture: '',
    frame: 0,
    strip: '',
    location: 'R',
    resultPic: {
      left: {
        '囊肿信息': {},
        '肿块信息': {}
      },
      right: {
        '囊肿信息': {},
        '肿块信息': {}
      }
    },
    historyList: [],
    historyDetail: {}
  },

  effects: {
    * getExamDetail({ payload }, { call, put }) {
      const response = yield call(getExamDetail, payload);
      yield put({
        type: 'examDetailSave',
        payload: response,
      });
      return response
    },
    * hisExam ({ payload }, { call, put}) {
      const response = yield call(hisExam, payload);
      yield put({
        type: 'hisExamSave',
        payload: response,
      });
    },
    * getExamImgDetail ({ payload }, { call }) {
      return yield call(getExamImgDetail, payload);
    },
    * findDataImg ({ payload }, { call, put}) {
      const response = yield call(findDataImg, payload);
      yield put({
        type: 'findDataImgSave',
        payload: response,
      });
    },
    * saveReportImg ({ payload }, { call }) {
      return yield call(saveReportImg, payload);
    },
    * deleteReportImg ({ payload }, { call }) {
      return yield call(deleteReportImg, payload);
    },
    * getReportHistory ({ payload }, { call, put }) {
      const response = yield call(getReportHistory, payload);
      yield put({
        type: 'historyListSave',
        payload: response
      })
    },
    * getReportDetail ({ payload }, { call, put }) {
      const response =  yield call(getReportDetail, payload);
      yield put({
        type: 'historyDetailSave',
        payload: response
      })
    },
    * getInstitutionById ({ payload }, { call, put }) {
      const response =  yield call(getInstitutionById, payload);
      yield put({
        type: 'insSave',
        payload: response
      })
    }
  },

  reducers: {
    saveState(state, action){
      return {
        ...state,
        ...action.payload,
      };
    },
    examDetailSave(state, action) {
      return {
        ...state,
        examDetailData: action.payload.data,
        aiPicture: JSON.parse(action.payload.data.aiPicture)
      };
    },
    hisExamSave(state, action) {
      return {
        ...state,
        hisExamData: action.payload.data,
      };
    },
    findDataImgSave(state, action) {
      return {
        ...state,
        findDataImgData: action.payload.data,
      };
    },
    historyListSave(state, action) {
      return {
        ...state,
        historyList: action.payload.data,
      };
    },
    insSave(state, action) {
      return {
        ...state,
        insData: action.payload.data
      };
    },
    historyDetailSave(state, action) {
      return {
        ...state,
        historyDetail: action.payload.data
      };
    }
  }
}
