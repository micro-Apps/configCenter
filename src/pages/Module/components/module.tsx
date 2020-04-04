import React, { useRef } from 'react';
import { Modal, Input, Form } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';

import { CardListItemDataType } from '../data';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface ModuleModuleProps {
  visible: boolean;
  handleSubmit: (data: CardListItemDataType) => void;
  handleCancel: () => void;
}

const ModuleModule: React.FC<ModuleModuleProps> = props => {
  const { visible, handleCancel, handleSubmit } = props;
  const formRef = useRef<FormInstance | null>(null);

  const handleOk = async () => {
    await formRef.current?.validateFields();
    const data = await formRef.current?.getFieldsValue();
    handleSubmit(data as CardListItemDataType);
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnClose
      title="添加摸块"
    >
      <Form {...layout} ref={formRef}>
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModuleModule;
