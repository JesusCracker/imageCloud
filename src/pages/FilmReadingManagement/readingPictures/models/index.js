import { queryHisExam } from '@/services/xApi'

export default {
  namespace: 'index',

  state: {
    data: {
      num: '100009',
      name: '李晓明',
      sex: '女',
      age: 35,
      national: '汉',
      phone: '182 0828 8888',
      address: 'xxxxxx',
      checkDate: '2020-11-08 11:59:30',
      startDate: '2020-11-08 11:59:30',
      finDate: '2020-11-08 11:59:30',
      level: '1',
      doctor: '李晓明'
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHisExam, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  }
}
