import React, { useRef, useEffect, useState } from 'react';
import { connect, Dispatch, routerRedux } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Descriptions, Avatar } from 'antd';
import { AnyAction } from 'redux';
import { find } from 'lodash';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { querySubMenu, addOrChangeSubMenu } from './service';
import { StateType } from '../model';
import { BusinessItemType } from '../data';
import SubMenuModule from './components/SubMenuModule';

interface TableListProps {
  match: {
    params: {
      businessId: string;
    };
  };
  businessList: BusinessItemType[];
  dispatch: Dispatch<AnyAction>;
}

function useCurrentBusiness(props: TableListProps) {
  const { businessId } = props.match.params;
  const { businessList } = props;
  useEffect(() => {
    props.dispatch({
      type: 'business/fetch',
    });
  }, []);
  return find(businessList, { id: businessId });
}

function useSubMenu(props: TableListProps) {
  const { businessId } = props.match.params;
  const [visible, setVisible] = useState(false);
  const [tableItem, setTableItem] = useState<TableListItem | undefined>();

  const handleClickAdd = (record?: TableListItem) => {
    setTableItem(record);
    setVisible(true);
  };

  const handleSubmit = (data: Partial<TableListItem>) => {
    addOrChangeSubMenu({
      ...data,
      id: tableItem?.id,
      businessId,
    });
    setVisible(false);
    setTableItem(undefined);
  };

  const handleCancel = () => setVisible(false);

  return {
    visible,
    data: tableItem,
    handleClickAdd,
    handleCancel,
    handleSubmit,
  };
}

function useGoOptions(props: TableListProps) {
  const { businessId } = props.match.params;
  const goOptions = (subMenuId: string) => {
    props.dispatch(routerRedux.push(`/business/${businessId}/${subMenuId}`));
  };
  return goOptions;
}

const TableList: React.FC<TableListProps> = props => {
  const actionRef = useRef<ActionType>();
  const tableRequest = (data: any) =>
    querySubMenu({
      ...data,
      currentPage: data.currentPage || 1,
      businessId: props.match.params.businessId,
    });
  const currentBusiness = useCurrentBusiness(props);
  const { visible, data, handleCancel, handleSubmit, handleClickAdd } = useSubMenu(props);
  const goOptions = useGoOptions(props);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'title',
    },
    {
      title: '菜单键值',
      dataIndex: 'key',
    },
    {
      title: '业务id',
      dataIndex: 'businessId',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => handleClickAdd(record)}>修改</a>
          <a onClick={() => goOptions(record.id)}>配置</a>
        </>
      ),
    },
  ];

  const extra = [
    <Button key="3" type="primary" onClick={() => handleClickAdd()}>
      新增
    </Button>,
  ];

  const content = (
    <Descriptions size="small" column={3}>
      <Descriptions.Item label="品牌logo">
        <Avatar src={currentBusiness?.logo} />
      </Descriptions.Item>
      <Descriptions.Item label="业务Id">{currentBusiness?.id}</Descriptions.Item>
      <Descriptions.Item label="名称">{currentBusiness?.name}</Descriptions.Item>
      <Descriptions.Item label="标识符">{currentBusiness?.domain}</Descriptions.Item>
      <Descriptions.Item label="描述">{currentBusiness?.describe}</Descriptions.Item>
    </Descriptions>
  );

  return (
    <PageHeaderWrapper extra={extra} content={content}>
      <SubMenuModule visible={visible} data={data} onOk={handleSubmit} onCancel={handleCancel} />
      <ProTable<TableListItem>
        headerTitle="子菜单列表"
        search={false}
        actionRef={actionRef}
        rowKey="id"
        request={params => tableRequest(params)}
        columns={columns}
        rowSelection={{}}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ business }: { business: StateType }) => ({
  businessList: business.list,
}))(TableList);
