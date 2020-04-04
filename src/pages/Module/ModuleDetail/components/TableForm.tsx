import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Table, Form } from 'antd';
import React, { FC, useState, useEffect, useRef } from 'react';
import { FormInstance } from 'antd/lib/form';

import styles from '../style.less';

interface TableFormDateType {
  key?: string;
  version?: string;
  address?: string;
  editable?: boolean;
  isNew?: boolean;
}

interface NewVersion {
  address: string;
  version: string;
}

interface TableFormProps {
  data?: TableFormDateType[];
  onChange?: (value: TableFormDateType[]) => void;
  handleSubmit?: (data: NewVersion) => void;
}

function useForm(props: TableFormProps) {
  const { data = [], handleSubmit } = props;
  const form = useRef<FormInstance>(null);
  const [value, setValue] = useState<TableFormDateType[] | []>(data || []);
  useEffect(() => {
    const newValue = (data || []).map(item => ({
      key: item.version,
      ...item,
    }));
    setValue(newValue);
  }, [JSON.stringify(data)]);

  const handleAddClick = () => {
    const oldValue = [...value];
    oldValue.push({
      version: '',
      address: '',
      editable: true,
      isNew: true,
    });
    setValue(oldValue);
  };

  const handleClickSubmit = async () => {
    await form.current?.validateFields();
    const fieldsValue = form.current?.getFieldsValue() as NewVersion;
    // eslint-disable-next-line no-unused-expressions
    handleSubmit && handleSubmit(fieldsValue);
    const oldValue = [...value];
    oldValue.pop();
    oldValue.push(fieldsValue);
    setValue(oldValue);
  };

  const handleRemove = () => {
    const oldValue = [...value];
    oldValue.pop();
    setValue(oldValue);
  };

  return {
    form,
    value,
    handleAddClick,
    handleClickSubmit,
    handleRemove,
  };
}

const TableForm: FC<TableFormProps> = props => {
  const { form, value, handleAddClick, handleClickSubmit, handleRemove } = useForm(props);

  const columns = [
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'key',
      width: '20%',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Form.Item name="version" rules={[{ required: true }]}>
              <Input autoFocus placeholder="版本号" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'key',
      width: '40%',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Form.Item name="address" rules={[{ required: true }]}>
              <Input placeholder="模块地址" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: TableFormDateType) => {
        if (record.isNew) {
          return (
            <span>
              <a onClick={handleClickSubmit}>添加</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？">
                <a onClick={handleRemove}>删除</a>
              </Popconfirm>
            </span>
          );
        }

        return (
          <span>
            <Popconfirm title="是否要删除此行？">
              <a>测试</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <Form ref={form}>
      <Table<TableFormDateType>
        columns={columns}
        key="version"
        dataSource={value}
        pagination={false}
        rowClassName={record => (record.editable ? styles.editable : '')}
      />
      <Button
        style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
        type="dashed"
        onClick={handleAddClick}
      >
        <PlusOutlined />
        新增版本
      </Button>
    </Form>
  );
};

export default TableForm;
