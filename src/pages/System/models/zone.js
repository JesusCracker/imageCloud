import { queryZoneTree, fetchZoneDetail, fetchZoneAgency, deleteZone, saveZone } from '@/services/zone';

export default {
  namespace: 'zone',
  state: {
    zoneTree: [],
  },

  effects: {
    * fetchZoneTree({ payload }, { call, put }) {
      const response = yield call(queryZoneTree, payload);
      yield put({
        type: 'saveZoneList',
        payload: response,
      });
      return response;
    },

    * fetchZoneDetail({ payload }, { call, put }) {
      const response= yield call(fetchZoneDetail, payload);
      yield put({
        type: 'saveZoneList',
        payload: response,
      });
    },

    * fetchZoneAgency({ payload }, { call, put }) {
      return yield call(fetchZoneAgency, payload);
    },

    * saveZoneInfo({ payload }, { call, put }) {
      return yield call(saveZone, payload);
    },

    * deleteZoneById({ payload }, { call, put }) {
      return yield call(deleteZone, payload);
    },


  },

  reducers: {
    saveZoneList(state, action) {
      return {
        ...state,
        zoneTree: action.payload.data,
      };
    },
  },
};
