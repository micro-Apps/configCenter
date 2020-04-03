import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function querySubMenu(data: TableListParams) {
  const response = await request('/api/business/getSubMenu', {
    method: 'POST',
    data: {
      ...data,
      current: data.currentPage,
    },
  });
  return response.data;
}

interface AddOrChangeSubMenuProps {
  id?: string;
  businessId?: string;
  title?: string;
  key?: string;
}

export async function addOrChangeSubMenu(params: AddOrChangeSubMenuProps) {
  return request('/api/business/addOrChangeSubMenu', {
    method: 'POST',
    data: params,
  });
}
