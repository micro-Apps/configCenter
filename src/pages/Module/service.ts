import request from '@/utils/request';
import { CardListItemDataType } from './data';

export async function queryModuleList() {
  return request('/api/module/list', {
    method: 'POST',
  });
}

export async function addModule(data: CardListItemDataType) {
  return request('/api/module/addOrChange', {
    method: 'POST',
    data,
  });
}
