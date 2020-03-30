import React from 'react';
import { Modal, Tag } from 'antd';


export interface ChangeUserRoleProps {
  visible: boolean;
  roleList: {name: string, id: string}[];
  roleId: string;
  handleSubmit: () => void;
  handleCancel: () => void;
  handleChangeRoleId: (roleId: string) => void;
  loading: boolean;
}

interface RoleItemProps {
  name: string;
  id: string;
  checked:  boolean;
  onClick: (id: string) => void;
}
const RoleItem: React.FC<RoleItemProps> = (props) => {
  const { name, id, checked, onClick } = props;
  const onOk = () => onClick(id);
  return (
    <Tag color={checked ? 'red' : ''} onClick={onOk}>{name}</Tag>
  )
}

const ChangeUserRole: React.FC<ChangeUserRoleProps> = props => {
  const {
    visible,
    roleList,
    roleId,
    handleSubmit,
    handleCancel,
    handleChangeRoleId,
    loading,
  } = props;

  return (
    <Modal
      title="修改用户角色"
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      {
        roleList.map(currentRole => (
          <RoleItem
            key={currentRole.id}
            name={currentRole.name}
            id={currentRole.id}
            onClick={handleChangeRoleId}
            checked={roleId === currentRole.id}
          />
        ))
      }
    </Modal>
  )
}
export default ChangeUserRole;
