import React, { useRef } from 'react';
import { Modal, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { BusinessItemType } from '../data';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export interface BusinessModuleProps {
  data?: Partial<BusinessItemType>;
  visible: boolean;
  onOk: (data: BusinessItemType) => void;
  onCancel: () => void;
}

const BusinessModule: React.FC<BusinessModuleProps> = props => {
  const { visible, onCancel, onOk, data: FormInitValue } = props;

  const formRef = useRef<FormInstance>(null);
  const handleOk = async () => {
    await formRef.current?.validateFields();
    const data = await formRef.current?.getFieldsValue();
    onOk(data as BusinessItemType);
  };

  return (
    <Modal visible={visible} onOk={handleOk} title="添加业务" onCancel={onCancel} destroyOnClose>
      <Form {...layout} ref={formRef} initialValues={FormInitValue}>
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="logo" label="品logo" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="describe" label="描述" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="domain" label="标识符" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default BusinessModule;
