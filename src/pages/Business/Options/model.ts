import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { findIndex } from 'lodash';
import {
  queryOptions,
  addOrChangeOptions,
  fetchBusinessRoleList,
  fetchModuleList,
} from './service';

import { BasicListItemDataType, BusinessRoleType, ModuleEntity } from './data.d';

export interface StateType {
  list?: BasicListItemDataType[];
  roleList?: BusinessRoleType[];
  moduleList?: ModuleEntity[];
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
    fetchCommonInfo: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
    updateList: Reducer<StateType>;
    saveCommonInfo: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'businessAndOptions',

  state: {
    list: [],
    roleList: [],
    moduleList: [],
  },

  effects: {
    *fetchCommonInfo({ payload }, { call, put }) {
      const businessRoleList = yield call(fetchBusinessRoleList, payload.businessId);
      const moduleList = yield call(fetchModuleList);
      yield put({
        type: 'saveCommonInfo',
        payload: {
          roleList: businessRoleList.data,
          moduleList: moduleList.data,
        },
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryOptions, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryOptions, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(addOrChangeOptions, payload);
      yield put({
        type: 'updateList',
        payload: response.data,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload as BasicListItemDataType[],
      };
    },
    appendList(state, action) {
      if (!state) return {};
      return {
        ...state,
        list: state?.list?.concat(action.payload),
      };
    },
    updateList(state, action) {
      const option = action.payload;
      const newList = state?.list;
      const index = findIndex(newList, { id: option.id });
      if (index >= 0) {
        (newList as BasicListItemDataType[])[index] = option;
      } else {
        (newList as BasicListItemDataType[]).unshift(option);
      }
      return {
        ...state,
        list: newList,
      };
    },
    saveCommonInfo(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
