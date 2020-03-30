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

export async function fetchAllBusinessList() {
  return request('/business/list')
}

export async function queryCurrentUserBusiness(userId: string) {
  return request('/user/findUserBusiness', {
    method: "POST",
    data: {
      userId,
    }
  })
}

interface UserAddBusinessDto {
  userId: string;
  businessId: string;
}
export async function userAddBusiness(data: UserAddBusinessDto) {
  return request('/user/businessAddUser', {
    method: 'POST',
    data,
  })
}