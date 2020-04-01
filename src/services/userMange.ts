import request from '@/utils/request';

export async function fetchRoleList(): Promise<any> {
  return request('/api/role/list');
}

interface changeUserRoleDto {
  userId: string;
  roleId: string;
}
export async function changeUserRole(data: changeUserRoleDto): Promise<any> {
  return request('/api/user/changeUserRole', {
    method: 'POST',
    data,
  });
}

export async function fetchAllBusinessList() {
  return request('/api/business/list');
}

export async function queryCurrentUserBusiness(userId: string) {
  return request('/api/user/findUserBusiness', {
    method: 'POST',
    data: {
      userId,
    },
  });
}

interface UserAddBusinessDto {
  userId: string;
  businessId: string;
}
export async function userAddBusiness(data: UserAddBusinessDto) {
  return request('/api/user/businessAddUser', {
    method: 'POST',
    data,
  });
}
