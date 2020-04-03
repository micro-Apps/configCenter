import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { BusinessItemType } from './data.d';
import { queryBusinessList, addBusiness } from './service';

export interface StateType {
  list: BusinessItemType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    addOrUpdateBusiness: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    addOrUpdateBusinessList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'business',

  state: {
    list: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryBusinessList);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *addOrUpdateBusiness({ payload }, { call, put }) {
      const response = yield call(addBusiness, payload);
      const newBusiness = response.data;
      yield put({
        type: 'addOrUpdateBusinessList',
        payload: newBusiness,
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
    addOrUpdateBusinessList(state, action) {
      const newBusiness = action.payload;
      const result = state?.list.map(item => {
        if (item.id === newBusiness.id) {
          return newBusiness;
        }
        return item;
      });
      return {
        ...state,
        list: result || [],
      };
    },
  },
};

export default Model;
