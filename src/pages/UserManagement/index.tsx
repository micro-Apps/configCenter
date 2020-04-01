import { DownOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu } from 'antd';
import React, { useRef, Dispatch, useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { connect } from 'dva';
import { find } from 'lodash';
import { AnyAction } from 'redux';
import { ConnectState } from '@/models/connect';
import { BusinessRole } from '@/models/userManage';
import { TableListItem } from './data.d';
import {
  fetchUserList,
  findBusinessAllRole,
  findBusinessUserRole,
  changeUserBusinessRole,
} from './service';
import ChangeUserRole, { ChangeUserRoleProps } from './components/ChangeUserRole';
import ChangeUserBusinessAndBusinessRole, {
  BusinessAndBusinessRoleProps,
} from './components/ChangeUserBusinessAndBusinessRole';

const mapStateToProps = ({ userManage, loading }: ConnectState) => ({
  roleList: userManage.roleList,
  allBusinessList: userManage.allBusinessList,
  currentUserBusinessList: userManage.currentBusinessList,
  loadingRoleList: loading.effects['userMange/fetchRoleList'],
  loadingChangeRole: loading.effects['userManage/changeUserRole'],
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  fetchRoleList: () => {
    dispatch({
      type: 'userManage/fetchRoleList',
    });
  },
  changeUserRole: (data: { userId: string; roleId: string }) => {
    dispatch({
      type: 'userManage/changeUserRole',
      payload: data,
    });
  },
  fetchAllBusiness() {
    dispatch({
      type: 'userManage/fetchAllBusiness',
    });
  },
  fetchCurrentUserBusinessList(userId: string) {
    dispatch({
      type: 'userManage/queryCurrentUserBusiness',
      payload: {
        userId,
      },
    });
  },
  userAddBusiness(data: { userId: string; businessId: string }) {
    dispatch({
      type: 'userManage/addBusinessUser',
      payload: data,
    });
  },
});

type TableListProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface UseChangeUserRole extends ChangeUserRoleProps {
  onClickChangeUserRole: (record: TableListItem) => void;
}

function useChangeUserRole(props: TableListProps): UseChangeUserRole {
  useEffect(() => {
    props.fetchRoleList();
  }, []);
  const [visible, changeVisible] = useState(false);
  const [roleInfo, setRoleInfo] = useState<{ id: string; record: TableListItem }>();

  const onClickChangeUserRole = (record: TableListItem) => {
    const { role } = record;
    const id = find(props.roleList, { name: role })?.id || '';
    setRoleInfo({
      id,
      record,
    });
    changeVisible(true);
  };

  const handleCancel = () => {
    changeVisible(false);
  };

  const handleSubmit = async () => {
    if (!roleInfo) {
      changeVisible(false);
      return;
    }
    const { record, id } = roleInfo;
    props.changeUserRole({
      userId: record.id,
      roleId: id,
    });
    changeVisible(false);
  };

  const handleChangeRoleId = (id: string) => {
    setRoleInfo({
      id,
      record: roleInfo?.record as TableListItem,
    });
  };

  return {
    visible,
    roleId: roleInfo?.id || '',
    roleList: props.roleList,
    handleCancel,
    handleSubmit,
    handleChangeRoleId,
    onClickChangeUserRole,
    loading: !!props.loadingRoleList,
  };
}

interface UserChangeUserBusinessRole extends BusinessAndBusinessRoleProps {
  visible: boolean;
  handleClickUser(record: TableListItem): void;
}

function useChangeUserBusinessRole(props: TableListProps): UserChangeUserBusinessRole {
  const [visible, setVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<TableListItem>();
  useEffect(() => {
    props.fetchAllBusiness();
  }, []);

  const handleClickUser = (record: TableListItem) => {
    setCurrentUser(record);
    props.fetchCurrentUserBusinessList(record.id);
    setVisible(true);
  };
  const handleCancel = () => setVisible(false);

  const getUserBusinessRole = async (businessId: string): Promise<BusinessRole[]> => {
    const { id = '' } = currentUser || {};
    const response = await findBusinessUserRole({ userId: id, businessId });
    return response.data.data;
  };

  const getBusinessAllRole = async (businessId: string): Promise<BusinessRole[]> => {
    const response = await findBusinessAllRole(businessId);
    return response.data;
  };

  const addBusiness = (businessId: string) => {
    const { id = '' } = currentUser || {};
    props.userAddBusiness({ userId: id, businessId });
  };

  const addBusinessRole = ({
    businessId,
    businessRoleId,
  }: {
    businessId: string;
    businessRoleId: string;
  }) => {
    const { id = '' } = currentUser || {};
    changeUserBusinessRole({
      userId: id,
      businessId,
      businessRoleIds: [businessRoleId],
      status: 'add',
    });
  };

  return {
    visible,
    allBusinessList: props.allBusinessList,
    currentUserBusinessList: props.currentUserBusinessList || [],
    getUserBusinessRole,
    getBusinessAllRole,
    addBusiness,
    addBusinessRole,
    handleCancel,
    handleClickUser,
  };
}

const TableList: React.FC<TableListProps> = props => {
  const actionRef = useRef<ActionType>();
  const {
    visible,
    roleId,
    roleList,
    handleCancel,
    handleSubmit,
    onClickChangeUserRole,
    handleChangeRoleId,
    loading,
  } = useChangeUserRole(props);

  const {
    visible: changeUserBusinessAndBusinessRoleVisible,
    allBusinessList,
    currentUserBusinessList,
    getUserBusinessRole,
    addBusiness,
    addBusinessRole,
    handleCancel: handleChangeBusinessRoleCancel,
    handleClickUser,
    getBusinessAllRole,
  } = useChangeUserBusinessRole(props);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名称',
      dataIndex: 'username',
    },
    {
      title: '系统角色',
      dataIndex: 'role',
      hideInSearch: true,
      sorter: true,
      renderText: (val: string) => `${val}`,
    },
    {
      title: '操作',
      dataIndex: 'option',
      hideInSearch: true,
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => onClickChangeUserRole(record)}>修改系统角色</a>
          <Divider type="vertical" />
          <a onClick={() => handleClickUser(record)}>设置业务角色</a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="key"
        toolBarRender={(action, { selectedRows }) => [
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu selectedKeys={[]}>
                  <Menu.Item key="remove">批量分配业务</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作
                <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        request={params => fetchUserList(params)}
        columns={columns}
      />
      <ChangeUserRole
        visible={visible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        roleId={roleId}
        handleChangeRoleId={handleChangeRoleId}
        roleList={roleList}
        loading={loading}
      />
      {currentUserBusinessList &&
      currentUserBusinessList.length &&
      changeUserBusinessAndBusinessRoleVisible ? (
        <ChangeUserBusinessAndBusinessRole
          allBusinessList={allBusinessList}
          currentUserBusinessList={currentUserBusinessList}
          getUserBusinessRole={getUserBusinessRole}
          addBusiness={addBusiness}
          addBusinessRole={addBusinessRole}
          handleCancel={handleChangeBusinessRoleCancel}
          getBusinessAllRole={getBusinessAllRole}
        />
      ) : (
        ''
      )}
    </PageHeaderWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TableList);
