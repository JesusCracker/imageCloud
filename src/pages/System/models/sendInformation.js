import { viewAllRoles, sendInformation, queryInformationList, viewInformation } from '@/services/linjieApi';

function convertView(action) {
  const { data } = action.payload;
  const { type } = data;

  if (type === 1) {
    const selectTree = [];
    let treeData = [];
    const arr = data.recipientNames?.split(',');
    if (arr?.length) {
      treeData = arr.map((item, index) => {
        selectTree.push(index.toString());
        return {
          title: item,
          value: index.toString(),
          key: index.toString(),
          isLeaf: true,
        };
      });
    }
    data.selectTree = selectTree;
    data.treeData = treeData;
  } else {
    data.selectTree = ['0'];
    data.treeData = [{
      title: JSON.parse(localStorage.getItem('name')),
      value: '0',
      key: '0',
      isLeaf: true,
    }];
  }
  return action.payload.data;
}

export default {
  namespace: 'sendInformation',
  state: {
    treeData: [],
    sendData: [],
    templateData: [],
    watchData: {
      sendUserName: '',
      createDate: '',
      treeData: [],
      selectTree: [],
    },
  },
  effects: {
    * viewAllRoles(_, { call, put }) {
      const response = yield call(viewAllRoles);
      yield put({
        type: 'getRoles',
        payload: response,
      });
    },
    * sendInformation({ payload }, { call, put }) {
      const response = yield call(sendInformation, payload);
      yield put({
        type: 'send',
        payload: response,
      });
      return response;
    },
    * queryMessageTemplate({ payload }, { call, put }) {
      const response = yield call(queryInformationList, payload);
      yield put({
        type: 'getTemplate',
        payload: response,
      });
      return response;
    },
    * viewInformation({ payload }, { call, put }) {
      const response = yield call(viewInformation, payload);
      yield put({
        type: 'view',
        payload: response,
      });
    },
    * viewLocalInformation({ payload }, { put }) {
      yield put({
        type: 'view',
        payload,
      });
    },
  },
  reducers: {
    getRoles(state, action) {
      const treeData = action.payload?.data.map((item) => {
        const children = item.users.map(item2 => ({
            title: item2.name,
            value: item2.id,
            key: item2.id,
            isLeaf: true,
          }
        ));
        return {
          title: item.name,
          value: item.id,
          key: item.id,
          isLeaf: false,
          children,
        };
      });
      return {
        ...state,
        treeData,
      };
    },
    send(state, action) {
      return {
        ...state,
        sendData: action.payload.data,
      };
    },
    getTemplate(state, action) {
      return {
        ...state,
        templateData: action.payload.data,
      };
    },
    view(state, action) {
      const watchData = convertView(action);
      return {
        ...state,
        watchData,
      };
    },
  },
};
