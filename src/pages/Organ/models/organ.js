import { queryOrganList, saveOrgan, getOrganDetail, removeOrgan, getRelatedArea, queryAllOrganList } from '@/services/query';

export default {
    namespace: 'organ',
    state: {
        organListData: [],
        menuDetail: {},
        parentsOrganData: [],
        areaData: [],
        allOrganData: []
    },

    effects: {
        //获取列表
        * fetchOrganList({ _ }, { call, put }) {
            const response = yield call(queryOrganList, _);
            yield put({
                type: 'save',
                payload: response,
            });
        },

        //新增保存
        * addOrgan({ payload }, { call, put }) {
            const response = yield call(saveOrgan, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            return response;
        },

        //获取详情
        * getOrganorityDetail({ payload }, { call, put }) {
            const response = yield call(getOrganDetail, payload);
            yield put({
                type: 'saveMenuDetail',
                payload: response,
            });
            return response;
        },

        //编辑保存
        * update({ payload }, { call, put }) {
            const response = yield call(saveOrgan, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            return response;
        },

        //删除
        * remove({ payload }, { call, put }) {
            const response = yield call(removeOrgan, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            return response;
        },

        // 获取机构下拉列表
        * fetchOrganListData({ _ }, { call, put }) {
            const response = yield call(queryOrganList, _);
            yield put({
                type: 'saveOrganList',
                payload: response,
            });
            return response;
        },

        //获取配置阅片开放下拉列表
        * fetchOrganAllList({ _ }, { call, put }) {
            const response = yield call(queryAllOrganList, _);
            yield put({
                type: 'saveOpenList',
                payload: response,
            });
            return response;
        },

        //获取关联区域下拉列表
        * fetchRelatedArea({ payload }, { call, put }) {
            const response = yield call(getRelatedArea, payload);
            yield put({
                type: 'saveArea',
                payload: response,
            });
            return response;
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                organListData: action.payload && action.payload.data,
            };
        },
        saveMenuDetail(state, action) {
            return {
                ...state,
                menuDetail: action.payload && action.payload.data,
            };
        },
        saveArea(state, action) {
            return {
                ...state,
                areaData: action.payload && action.payload.data,
            };
        },
        saveOrganList(state, action) {
            return {
                ...state,
                parentsOrganData: action.payload && action.payload.data,
            };
        },
        saveOpenList(state, action) {
            return {
                ...state,
                allOrganData: action.payload && action.payload.data,
            };
        },

    },
};
