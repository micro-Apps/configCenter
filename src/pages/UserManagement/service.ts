import request from '@/utils/request';
import { FetchUserList } from './data.d';

export async function fetchUserList(params?: FetchUserList) {
  return request('/user/userList', {
    method: 'POST',
    data: {
      ...params,
    }
  })
}

interface FindUserBusinessRoleDto {
  userId: string;
  businessId: string;
}

export async function findBusinessUserRole(params:FindUserBusinessRoleDto) {
  return request('/user/findBusinessUserRole', {
    method: 'POST',
    data: params,
  })
}
export async function findBusinessAllRole(businessId: string) {
  return request('/business/getBusinessRole', {
    method: 'POST',
    data: {
      businessId 
    }
  })
}

interface ChangeUserBusinessRoleDto {
  userId: string;
  businessId: string;
  businessRoleIds: string[];
  status: string;
}
export async function changeUserBusinessRole(param: ChangeUserBusinessRoleDto) {
  return request('/user/changeUserBusinessRole', {
    method: 'POST',
    data: param,
  })
}
