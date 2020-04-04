import request from '@/utils/request';

export async function fakeSubmitForm(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

interface AddVersionDto {
  version: string;
  address: string;
  moduleId: string;
}
export async function addVersion(data: AddVersionDto) {
  return request('/api/module/addVersion', {
    method: 'POST',
    data,
  });
}
