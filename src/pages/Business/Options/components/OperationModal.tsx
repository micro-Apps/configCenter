import React, { FC, useEffect } from 'react';
import { Modal, Form, Input, Select, Cascader } from 'antd';
import { find } from 'lodash';
import { BasicListItemDataType } from '../data.d';
import styles from '../style.less';
import { StateType } from '../model';

const { Option } = Select;

interface OperationModalProps {
  visible: boolean;
  state: StateType;
  current?: Partial<BasicListItemDataType>;
  onSubmit: (values: Partial<BasicListItemDataType>) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

function getMultipleOptions(state: StateType) {
  const { roleList } = state;
  const children = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const role of roleList || []) {
    children.push(
      <Option key={role.id} value={role.id}>
        {role.name}
      </Option>,
    );
  }
  return children;
}

function getCascaderOptions(state: StateType) {
  const { moduleList } = state;
  const options = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const module of moduleList || []) {
    if (module.version && module.version.length >= 0) {
      const result = {
        value: module.id,
        label: module.name,
        children: module.version.map(version => ({
          value: version.version,
          label: version.version,
        })),
      };
      options.push(result);
    }
  }
  return options;
}

const OperationModal: FC<OperationModalProps> = props => {
  const [form] = Form.useForm();
  const { visible, current, onCancel, onSubmit } = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({});
    }
  }, [props.current]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    const {
      roleIdList,
      moduleId: [moduleId, moduleVersion],
      name,
      router,
    } = values;
    const {
      state: { roleList, moduleList },
    } = props;

    const moduleInfo = find(moduleList, { id: moduleId });
    const moduleVersionInfo = find(moduleInfo?.version, { version: moduleVersion });
    if (!moduleInfo || !moduleVersionInfo) return;
    const roleInfo = roleList?.filter(item => roleIdList.includes(item.id));

    if (onSubmit) {
      onSubmit({
        name,
        router,
        roleInfo,
        moduleInfo: {
          ...moduleInfo,
          ...moduleVersionInfo,
        },
      });
    }
  };

  const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel };

  const getModalContent = () => (
    <Form {...formLayout} form={form} onFinish={handleFinish}>
      <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入任务名称' }]}>
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item name="router" label="路由" rules={[{ required: true, message: '请输入路由' }]}>
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item
        name="roleIdList"
        label="请选择角色列表"
        rules={[{ required: true, message: '请输入路由' }]}
      >
        <Select placeholder="请选择" mode="multiple" style={{ width: '100%' }}>
          {getMultipleOptions(props.state)}
        </Select>
      </Form.Item>

      <Form.Item
        name="moduleId"
        label="选择模块"
        rules={[{ required: true, message: '请选择模块' }]}
      >
        <Cascader options={getCascaderOptions(props.state)} />
      </Form.Item>
    </Form>
  );

  return (
    <Modal
      title={`Options${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default OperationModal;
