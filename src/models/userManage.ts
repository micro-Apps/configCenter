import { Effect } from "dva";
import { fetchRoleList, changeUserRole } from "@/services/userMange";
import { Reducer } from "redux";

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
  businessId: string;
}

export interface UserManageModelState {
  roleList: Role[],
  allBusinessList: Business[],
  currentBusinessList: Business[],
}

export interface UserManageModelType {
  namespace: 'userManage';
  state: UserManageModelState;
  effects: {
    fetchRoleList: Effect;
    changeUserRole: Effect;
  };
  reducers: {
    saveRoleList: Reducer<UserManageModelState>;
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
        type: 'saveRoleList',
        payload: allRoleList.data.data,
      })
    },
    *changeUserRole({ payload }, { call }) {
      yield call(changeUserRole, payload);
    }
  },

  reducers: {
    saveRoleList(state, action) {
      return {
        ...state,
        roleList: action.payload,
      }
    },
  },
};
export default UserManage;
