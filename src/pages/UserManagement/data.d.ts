export enum RoleType {
  USER = 'USER', // 普通用户权限，没有被管理员分配权限，接口限制
  ADMIN = 'ADMIN', // 超级管理员
  DEVELOPMENT = 'DEVELOPMENT', // 开发模块的同学
  OPERATION = 'OPERATION', // 运营人员
  BUSINESS = 'BUSINESS', // 业务方运营同学
}

export interface TableListItem {
  key: number;
  id: string;
  disabled?: boolean;
  username: string;
  role: RoleType;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}

export interface FetchUserList {
  current?: number;
  pageSize?: number;
  username?: string;
  businessId?: number;
}
