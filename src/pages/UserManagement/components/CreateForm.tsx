import React from 'react';
import { Form, Input, Modal } from 'antd';
import { RegisterUser } from '../index';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: RegisterUser) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const [form] = Form.useForm();

  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd(fieldsValue as RegisterUser);
  };
  return (
    <Modal
      destroyOnClose
      title="新增用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入登录用户名' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入不少于五个字符的密码', min: 5 }]}
        >
          <Input.Password placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="再次输入密码"
          name="repeatPassword"
          rules={[{ required: true, message: '请输入不少于五个字符的密码', min: 5 }]}
        >
          <Input.Password placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
