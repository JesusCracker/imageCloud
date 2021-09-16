import { queryAllOrganList,saveSetOrgan,getSelectOrganDetail } from '@/services/query';

export default {
    namespace: 'organAll',
    state: {
        organAllListData: [],
        menuDetail:{}
    },

    effects: {
        //获取全部机构列表
        * fetchOrganAllList({ _ }, { call, put }) {
            const response = yield call(queryAllOrganList, _);
            yield put({
                type: 'save',
                payload: response,
            });
        },

        //配置保存
        * addSet({ payload }, { call, put }) {
            const response = yield call(saveSetOrgan, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            return response;
        },

        //获取机构详情
        * querySelectOrganDetail({ payload }, { call, put }) {
            const response = yield call(getSelectOrganDetail, payload);
            yield put({
                type: 'saveDetail',
                payload: response,
            });
            return response;
        },

    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                organAllListData: action.payload && action.payload.data,
            };
        },
        saveDetail(state, action) {
            return {
                ...state,
                menuDetail: action.payload && action.payload.data,
            };
        },
    },
};
