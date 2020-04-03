import React, { FC, useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Row, Descriptions, Tag } from 'antd';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import OperationModal from './components/OperationModal';
import { StateType } from './model';
import { BasicListItemDataType } from './data.d';
import styles from './style.less';

interface OptionsProps {
  match: {
    params: {
      businessId: string;
      subMenuId: string;
    };
  };
  dispatch: Dispatch<any>;
  businessAndOptions: StateType;
  loading: boolean;
}

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({
  data: { router, roleInfo, moduleInfo },
}: {
  data: BasicListItemDataType;
}) => (
  <div className={styles.listContent}>
    <Descriptions>
      <Descriptions.Item label="路由">{router}</Descriptions.Item>
      <Descriptions.Item label="模块">
        <a>{`${moduleInfo.name}/${moduleInfo.version}`}</a>
      </Descriptions.Item>
      <Descriptions.Item label="地址">{moduleInfo.address}</Descriptions.Item>
      <Descriptions.Item label="角色列表">
        {roleInfo?.map(role => (
          <Tag color={role.name === 'admin' ? 'red' : 'blue'}>{role.name}</Tag>
        ))}
      </Descriptions.Item>
    </Descriptions>
  </div>
);

function useModal(props: OptionsProps) {
  const {
    dispatch,
    match: {
      params: { businessId },
    },
  } = props;
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<BasicListItemDataType | undefined>();
  useEffect(() => {
    dispatch({
      type: 'businessAndOptions/fetchCommonInfo',
      payload: {
        businessId,
      },
    });
  }, []);

  const handleSubmit = (data: Partial<BasicListItemDataType>) => {
    dispatch({
      type: 'businessAndOptions/submit',
      payload: {
        ...data,
        subMenuId: props.match.params.subMenuId,
        id: current?.id,
      },
    });
    setVisible(false);
    setCurrent(undefined);
  };

  const handleClickAdd = (data?: BasicListItemDataType) => {
    setCurrent(data);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return {
    visible,
    current,
    handleSubmit,
    handleCancel,
    handleClickAdd,
  };
}
export const Options: FC<OptionsProps> = props => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    businessAndOptions: { list },
  } = props;

  useEffect(() => {
    dispatch({
      type: 'businessAndOptions/fetch',
      payload: {
        subMenuId: props.match.params.subMenuId,
      },
    });
  }, []);

  const { visible, current, handleCancel, handleClickAdd, handleSubmit } = useModal(props);

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="角色数" value="8个角色" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="子菜单" value="12个子菜单" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="选项数" value="24个选项" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="基本列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={() => handleClickAdd()}
              ref={addBtn}
            >
              <PlusOutlined />
              添加
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={e => {
                        e.preventDefault();
                        handleClickAdd(item);
                      }}
                    >
                      编辑
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    title={<a href={item.name}>{item.name}</a>}
                    description={item.router}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <OperationModal
        state={props.businessAndOptions}
        current={current}
        visible={visible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(
  ({
    businessAndOptions,
    loading,
  }: {
    businessAndOptions: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    businessAndOptions,
    loading: loading.models.businessAndOptions,
  }),
)(Options);
