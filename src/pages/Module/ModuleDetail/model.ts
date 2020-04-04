import { Effect } from 'dva';
import { Reducer } from 'redux';
import { find } from 'lodash';

import { ModuleItemInfo } from './data';
import { queryModuleList } from '../service';

export interface StateType {
  current: ModuleItemInfo;
}

export interface ModelType {
  namespace: string;
  state: {
    current: ModuleItemInfo;
  };
  effects: {
    fetchCurrent: Effect;
    addVersion: Effect;
  };
  reducers: {
    saveCurrent: Reducer<StateType>;
    changeVersion: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'moduleAndModuleDetail',

  state: {
    current: {} as ModuleItemInfo,
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryModuleList);
      const moduleList: ModuleItemInfo[] = response.data;
      const currentModule = find(moduleList, { id: payload.moduleId });
      yield put({
        type: 'saveCurrent',
        payload: currentModule,
      });
    },
    *addVersion({ payload }, { call, put }) {
      yield call(queryModuleList, payload);
      yield put({
        type: 'changeVersion',
        payload: {
          version: payload.version,
          address: payload.address,
        },
      });
    },
  },
  reducers: {
    saveCurrent(state, action) {
      return {
        ...state,
        current: action.payload,
      };
    },
    changeVersion(state, action) {
      return {
        ...state,
        version: [...(state?.current.version || []), action.version],
      };
    },
  },
};

export default Model;
