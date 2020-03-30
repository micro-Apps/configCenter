import request from '@/utils/request';

export async function fetchRoleList(): Promise<any> {
  return request('/role/list');
}

interface changeUserRoleDto {
  userId: string;
  roleId: string;
}
export async function changeUserRole(data: changeUserRoleDto): Promise<any> {
  return request('/user/changeUserRole', {
    method: 'POST',
    data,
  });
}