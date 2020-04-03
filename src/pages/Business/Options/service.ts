import request from '@/utils/request';
import { BasicListItemDataType } from './data';

export function queryOptions({ subMenuId }: { subMenuId: string }) {
  return request('/api/business/getOptions', {
    method: 'POST',
    data: {
      subMenuId,
    },
  });
}

export function addOrChangeOptions(data: BasicListItemDataType) {
  return request('/api/business/addOrChangeOptions', {
    method: 'POST',
    data,
  });
}

export function fetchBusinessRoleList(businessId: string) {
  return request('/api/business/roleList', {
    method: 'POST',
    data: { businessId },
  });
}

export function fetchModuleList() {
  return request('/api/business/moduleList', {
    method: 'POST',
  });
}
