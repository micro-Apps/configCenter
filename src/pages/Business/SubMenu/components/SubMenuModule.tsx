import React, { useRef } from 'react';
import { Modal, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { TableListItem } from '../data';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export interface SubMenuModuleProps {
  data?: Partial<TableListItem>;
  visible: boolean;
  onOk: (data: Partial<TableListItem>) => void;
  onCancel: () => void;
}

const SubMenuModule: React.FC<SubMenuModuleProps> = props => {
  const { visible, onCancel, onOk, data: FormInitValue } = props;

  const formRef = useRef<FormInstance>(null);
  const handleOk = async () => {
    await formRef.current?.validateFields();
    const data = await formRef.current?.getFieldsValue();
    onOk(data as TableListItem);
  };

  return (
    <Modal visible={visible} onOk={handleOk} title="添加菜单" onCancel={onCancel} destroyOnClose>
      <Form {...layout} ref={formRef} initialValues={FormInitValue}>
        <Form.Item name="title" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="key" label="键值" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubMenuModule;
