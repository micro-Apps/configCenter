import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { AnyAction } from 'redux';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch, routerRedux } from 'dva';
import { StateType } from './model';
import { CardListItemDataType } from './data.d';
import styles from './style.less';
import ModuleModule from './components/module';

const { Paragraph } = Typography;

interface ModuleProps {
  module: StateType;
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

function useInit(props: ModuleProps) {
  const { dispatch } = props;
  useEffect(() => {
    dispatch({
      type: 'module/fetch',
    });
  }, []);
}

function useModalModal(props: ModuleProps) {
  const { dispatch } = props;
  const [visible, setVisible] = useState(false);

  const handleSubmit = (data: CardListItemDataType) => {
    dispatch({
      type: 'module/addModule',
      payload: data,
    });
    setVisible(false);
  };

  const handleClickAdd = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return {
    visible,
    handleSubmit,
    handleClickAdd,
    handleCancel,
  };
}

const Module: React.FC<ModuleProps> = props => {
  useInit(props);

  const {
    module: { list },
    loading,
  } = props;

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，
        提供跨越设计与开发的体验解决方案。
      </p>
      <div className={styles.contentLink}>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
          快速开始
        </a>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
          产品简介
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

  const nullData: Partial<CardListItemDataType> = {};
  const { handleCancel, visible, handleClickAdd, handleSubmit } = useModalModal(props);

  return (
    <PageHeaderWrapper content={content} extraContent={extraContent}>
      <div className={styles.cardList}>
        <List<Partial<CardListItemDataType>>
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
                    actions={[<a key="option2">编辑</a>]}
                    onClick={() => props.dispatch(routerRedux.push(`/module/${item.id}`))}
                  >
                    <Card.Meta
                      title={<a>{item.name}</a>}
                      description={
                        <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                          {item.id}
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
      <ModuleModule visible={visible} handleCancel={handleCancel} handleSubmit={handleSubmit} />
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    module,
    loading,
  }: {
    module: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    module,
    loading: loading.models.module,
  }),
)(Module);
