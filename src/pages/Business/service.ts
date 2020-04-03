import request from '@/utils/request';
import { BusinessItemType } from './data';

export async function queryFakeList(params: { count: number }) {
  return request('/api/fake_list', {
    params,
  });
}

export async function queryBusinessList() {
  return request('/api/business/list');
}
export async function addBusiness(params: BusinessItemType) {
  return request('/api/business/create', {
    method: 'POST',
    data: params,
  });
}
