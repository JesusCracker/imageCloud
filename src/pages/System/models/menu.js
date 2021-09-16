import { queryParentsList,queryAgentList,queryRoleList,fetchUserDetail} from '@/services/api';

export default {
  namespace: 'menu',
  state: {
    parentsMenuData: [],
    agentList:[],
    roleList:[],
    userDetail:{}
  },

  effects: {
    *fetchParentsList({ payload }, { call, put }) {
      const response = yield call(queryParentsList,payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // 获取机构列表
    *fetchAgentList( _ , { call, put }) {
      const response = yield call(queryAgentList);
      yield put({
        type: 'saveAgentList',
        payload: response,
      });
    },
    //获取角色列表
    *fetchRoleList({ payload },{call,put}){
      const response = yield call(queryRoleList,payload);
      yield put({
        type: 'saveRoleList',
        payload: response.data,
      });
    },
    //获取用户详情
    *fetchUserDetail({ payload },{call,put}){
      const response = yield call(fetchUserDetail,payload);
      yield put({
        type: 'saveUser',
        payload: response,
      });
      return response;
    }

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        parentsMenuData: action.payload.data,
      };
    },
    saveAgentList(state, action) {
      return {
        ...state,
        agentList: action.payload.data,
      };
    },
    saveRoleList(state, action) {
      return {
        ...state,
        roleList: action.payload,
      };
    },

    saveUser(state, action) {
      return {
        ...state,
        userDetail: action.payload.data,
      };
    },
  },
};
