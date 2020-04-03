import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, routerRedux } from 'dva';
import { StateType } from './model';
import { BusinessItemType } from './data.d';
import styles from './style.less';
import BusinessModule from './components/BusinessModal';

const { Paragraph } = Typography;

interface BusinessProps {
  business: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

function useInit(props: BusinessProps) {
  const { dispatch } = props;
  useEffect(() => {
    dispatch({
      type: 'business/fetch',
      payload: {
        count: 8,
      },
    });
  }, []);
}

function useBusinessModule(props: BusinessProps) {
  const { dispatch } = props;
  const [visible, setVisible] = useState(false);
  const [currentBusiness, setBusiness] = useState<BusinessItemType | undefined>();

  const handleClickSubmit = (data: BusinessItemType) => {
    dispatch({
      type: 'business/addOrUpdateBusiness',
      payload: {
        id: currentBusiness?.id,
        ...data,
      },
    });
    message.success('添加成功');
    setVisible(false);
    setBusiness(undefined);
  };

  const handleClickCancel = () => {
    setVisible(false);
    setBusiness(undefined);
  };

  const handleClickAdd = () => {
    setVisible(true);
    setBusiness(undefined);
  };

  const handleClickBusinessItem = (data: BusinessItemType) => {
    setBusiness(data);
    setVisible(true);
  };

  return {
    visible,
    currentBusiness,
    handleClickAdd,
    handleClickBusinessItem,
    handleClickSubmit,
    handleClickCancel,
  };
}
const Business: React.FC<BusinessProps> = props => {
  useInit(props);
  const {
    business: { list },
    loading,
  } = props;

  const handleCardClick = (id: string) => {
    props.dispatch(routerRedux.push(`/business/${id}`));
  };

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>展示业务列表</p>
      <div className={styles.contentLink}>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
          快速开始
        </a>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
          操作流程
        </a>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
          产品文档
        </a>
      </div>
    </div>
  );

  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="这是一个标题"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );
  const nullData: BusinessItemType = {} as BusinessItemType;

  const {
    visible,
    currentBusiness,
    handleClickAdd,
    handleClickSubmit,
    handleClickCancel,
    handleClickBusinessItem,
  } = useBusinessModule(props);

  return (
    <PageHeaderWrapper content={content} extraContent={extraContent}>
      <div className={styles.cardList}>
        <List<BusinessItemType>
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={[nullData, ...list]}
          renderItem={item => {
            if (item && item.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    onClick={() => handleCardClick(item.id)}
                    actions={[
                      <a key="option1">删除</a>,
                      <a key="option2" onClick={() => handleClickBusinessItem(item)}>
                        修改
                      </a>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.logo} />}
                      title={<a>{item.name}</a>}
                      description={
                        <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                          {item.describe}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }
            return (
              <List.Item>
                <Button type="dashed" className={styles.newButton} onClick={handleClickAdd}>
                  <PlusOutlined /> 新增产品
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
      <BusinessModule
        visible={visible}
        onOk={handleClickSubmit}
        onCancel={handleClickCancel}
        data={currentBusiness}
      />
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    business,
    loading,
  }: {
    business: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    business,
    loading: loading.models.business,
  }),
)(Business);
