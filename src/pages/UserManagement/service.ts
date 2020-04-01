import request from '@/utils/request';
import { FetchUserList } from './data.d';

export async function fetchUserList(params?: FetchUserList) {
  const result = await request('/api/user/userList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
  result.data.data = result.data.data.map((item: any) => ({
    key: item.id,
    ...item,
  }));
  return result.data;
}

interface FindUserBusinessRoleDto {
  userId: string;
  businessId: string;
}

export async function findBusinessUserRole(params: FindUserBusinessRoleDto) {
  return request('/api/user/findBusinessUserRole', {
    method: 'POST',
    data: params,
  });
}
export async function findBusinessAllRole(businessId: string) {
  return request(`/api/business/getBusinessRole/${businessId}`);
}

interface ChangeUserBusinessRoleDto {
  userId: string;
  businessId: string;
  businessRoleIds: string[];
  status: string;
}
export async function changeUserBusinessRole(param: ChangeUserBusinessRoleDto) {
  return request('/api/user/changeUserBusinessRole', {
    method: 'POST',
    data: param,
  });
}
