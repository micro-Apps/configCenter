// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { TableListItem, RoleType, FetchUserList } from './data.d';

// mock tableListDataSource
const tableListDataSource: TableListItem[] = [];


for (let i = 0; i < 10; i += 1) {
  tableListDataSource.push({
    id: '234234',
    key: i,
    username: `TradeCode ${i}`,
    role: RoleType.ADMIN,
  });
}

function fetchUserList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as FetchUserList;

  let dataSource = tableListDataSource;

  if (params.username) {
    dataSource = dataSource.filter(data => data.username.includes(params.username || ''));
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    data: dataSource,
    total: dataSource.length*10,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };

  return res.json(result);
}

function fetchRoleList(req: Request, res: Response) {
  return res.json({
    "code": "101",
    "message": "请求成功",
    "data": {
      "count": 4,
      "data": [
        {
          "id": "5e69fccd5c059de53b2f79e3",
          "name": "USER"
        },
        {
          "id": "5e69fcf75c059de53b2f79fe",
          "name": "ADMIN"
        },
        {
          "id": "5e69fd0c5c059de53b2f7a16",
          "name": "DEVELOPMENT"
        },
        {
          "id": "5e69fd1a5c059de53b2f7a1d",
          "name": "OPERATION"
        }
      ]
    }
  })
}

function changeUserRole(req: Request, res: Response) {
  return res.json({
    code: '101',
  })
};

function fetchBusinessList(req: Request, res: Response) {
  return res.json({
    "code": "101",
    "message": "请求成功",
    "data": {
      "count": 4,
      "data": [
        {
          id: Math.random(),
          name: '测试业务'
        },
        {
          "id": "5e69fccd5c059de53b2f79e3",
          "name": "ceshi",
          "logo": "ceshi",
        },
        {
          "id": "5e69fcf75c059de53b2f79fe",
          "name": "ceshi",
          "logo": "ceshi",
        },
        {
          "id": "5e69fd0c5c059de53b2f7a16",
          "name": "ceshi",
          "logo": "ceshi",
        },
        {
          "id": "5e69fd1a5c059de53b2f7a1d",
          "name": "ceshi",
          "logo": "ceshi",
        }
      ]
    }
  })
}

function fetchBusinessRoleList(req: Request, res: Response) {
  return res.json({
    "code": "101",
    "message": "请求成功",
    "data": {
      "count": 4,
      "data": [
        {
          "id": "5e69fccd5c059de53b2f79e3",
          "name": "ceshi",
        },
        {
          "id": "5e69fcf75c059de53b2f79fe",
          "name": "ceshi",
        },
        {
          "id": "5e69fd0c5c059de53b2f7a16",
          "name": "ceshi",
        },
        {
          "id": "5e69fd1a5c059de53b2f7a1d",
          "name": "ceshi",
        }
      ]
    }
  })
}

export default {
  'POST /user/userList': fetchUserList,
  'GET /role/list': fetchRoleList,
  'POST /user/changeUserRole': changeUserRole,
  'GET /business/list': fetchBusinessList,
  'POST /user/findUserBusiness': fetchBusinessList,
  'POST /user/businessAddUser': changeUserRole,
  'POST /business/getBusinessRole': fetchBusinessRoleList,
  'POST /user/changeUserBusinessRole': fetchBusinessRoleList,
  'POST /user/findBusinessUserRole': fetchBusinessRoleList,
};
