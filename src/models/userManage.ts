import { Effect } from "dva";
import { fetchRoleList, changeUserRole, fetchAllBusinessList, queryCurrentUserBusiness,userAddBusiness } from "@/services/userMange";
import { Reducer } from 'redux';
import { find } from 'lodash';


export interface Role {
  name: string;
  id: string;
}

export interface Business {
  id: string;
  name: string;
  logo: string;
}

export interface BusinessRole {
  id: string;
  name: string;
}

export interface UserManageModelState {
  roleList?: Role[],
  allBusinessList?: Business[],
  currentBusinessList?: Business[],
}

export interface UserManageModelType {
  namespace: 'userManage';
  state: UserManageModelState;
  effects: {
    fetchRoleList: Effect;
    changeUserRole: Effect;
    fetchAllBusiness: Effect;
    queryCurrentUserBusiness: Effect,
    addBusinessUser: Effect,
  };
  reducers: {
    saveOptions: Reducer<UserManageModelState>;
    addCurrentBusinessById: Reducer<UserManageModelState>;
  };
}

const UserManage: UserManageModelType = {
  namespace: 'userManage',

  state: {
    roleList: [],
    allBusinessList: [],
    currentBusinessList: [],
  },

  effects: {
    *fetchRoleList(_, { call, put }) {
      const allRoleList = yield call(fetchRoleList);
      yield put({
        type: 'saveOptions',
        payload: {
          roleList: allRoleList.data.data
        },
      })
    },

    *changeUserRole({ payload }, { call }) {
      yield call(changeUserRole, payload);
    },

    *fetchAllBusiness(_, { call, put }) {
      const allBusiness = yield call(fetchAllBusinessList);
      yield put({
        type: 'saveOptions',
        payload: {
          allBusinessList: allBusiness.data.data,
        }
      })
    },

    *queryCurrentUserBusiness({ payload }, { call, put }) {
      const userBusiness = yield call(queryCurrentUserBusiness, payload.userId);
      yield put({
        type: 'saveOptions',
        payload: {
          currentBusinessList: userBusiness.data.data
        }
      })
    },

    *addBusinessUser({ payload }, { call, put }) {
      yield call(userAddBusiness, payload);
      yield put({
        type: 'addCurrentBusinessById',
        payload: {
          businessId: payload.businessId,
        }
      })
    }
  },

  reducers: {
    saveOptions(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    addCurrentBusinessById(state, action) {
      const { businessId } = action.payload;
      const business = find(state?.allBusinessList, { id: businessId }) as Business;
      const newCurrentBusinessList = [...(state?.currentBusinessList || []), business];
      return {
        ...state,
        currentBusinessList: newCurrentBusinessList,
      }
    }
  },
};
export default UserManage;
