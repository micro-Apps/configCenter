import { Effect } from 'dva';
import { Reducer } from 'redux';
import { CardListItemDataType } from './data.d';
import { queryModuleList, addModule } from './service';

export interface StateType {
  list: CardListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    addModule: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    updateModule: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'module',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryModuleList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *addModule({ payload }, { call, put }) {
      const newModule = yield call(addModule, payload);
      yield put({
        type: 'updateModule',
        payload: newModule.data,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    updateModule(state, action) {
      return {
        ...state,
        list: [...(state?.list || []), action.payload],
      };
    },
  },
};

export default Model;
