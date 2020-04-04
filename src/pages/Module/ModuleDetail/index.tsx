import { Card, Col, Row } from 'antd';
import { AnyAction } from 'redux';

import React, { FC, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'dva';
import TableForm from './components/TableForm';
import styles from './style.less';
import { StateType } from './model';
import { addVersion } from './service';

interface ModuleDetailProps {
  match: {
    params: {
      moduleId: string;
    };
  };
  dispatch: Dispatch<AnyAction>;
  submitting: boolean;
  moduleAndModuleDetail: StateType;
}

const ModuleDetail: FC<ModuleDetailProps> = props => {
  const {
    dispatch,
    moduleAndModuleDetail,
    match: {
      params: { moduleId },
    },
  } = props;
  useEffect(() => {
    dispatch({
      type: 'moduleAndModuleDetail/fetchCurrent',
      payload: {
        moduleId,
      },
    });
  }, []);

  const onAddVersion = (data: { version: string; address: string }) => {
    addVersion({
      version: data.version,
      address: data.address,
      moduleId: props.match.params.moduleId,
    });
  };

  return (
    <PageHeaderWrapper content="模块的详细信息，可以在此处设置组件的版本">
      <Card title="模块信息" className={styles.card} bordered={false}>
        <Row gutter={16}>
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
            {moduleAndModuleDetail.current.name}
          </Col>
        </Row>
      </Card>
      <Card title="版本管理" bordered={false}>
        <TableForm data={props.moduleAndModuleDetail.current.version} handleSubmit={onAddVersion} />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    moduleAndModuleDetail,
    loading,
  }: {
    moduleAndModuleDetail: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    submitting: loading.effects['moduleAndModuleDetail/submitAdvancedForm'],
    moduleAndModuleDetail,
  }),
)(ModuleDetail);
