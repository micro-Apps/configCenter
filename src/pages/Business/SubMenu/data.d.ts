export interface TableListItem {
  id: string;
  title: string;
  businessId: string;
  key: string;
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
  businessId?: string;
  pageSize?: number;
  currentPage?: number;
}
