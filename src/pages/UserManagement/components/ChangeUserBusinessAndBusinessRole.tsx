import React, { useState } from 'react';
import { BusinessRole, Business } from '@/models/userManage';
import { Row, Col, Modal, Tag, Card, message } from 'antd';
import { find } from 'lodash';

interface TagContainerProps {
  title: string;
  data?: { name: string; id: string; checked?: boolean }[];
  onClick: (id: string) => void;
  onAdd: () => void;
}
const TagContainer: React.FC<TagContainerProps> = props => {
  const { data, onClick, onAdd, title } = props;
  const tagList: React.ReactNode[] = (data || []).map(tag => {
    const handleClick = () => !tag.checked && onClick(tag.id);
    return (
      <Tag onClick={handleClick} key={tag.id}>
        {tag.name}
      </Tag>
    );
  });
  tagList.push(
    <Tag onClick={onAdd} key="add">
      新增
    </Tag>,
  );
  return (
    <React.Fragment>
      <Card title={title}>{tagList}</Card>
    </React.Fragment>
  );
};

interface OperationModalModalProps {
  visible: boolean;
  data: { name: string; id: string; checked?: boolean }[];
  handleCancel: () => void;
  onClick: (id: string) => void;
}

const OperationModal: React.FC<OperationModalModalProps> = props => {
  const { handleCancel, data, onClick, visible } = props;

  return (
    <Modal title="选择业务" onCancel={handleCancel} onOk={handleCancel} visible={visible}>
      {data.map(item => {
        const { id, name, checked } = item;
        const handleClick = () => !checked && onClick(id);
        return (
          <Tag key={id} onClick={handleClick} color={checked ? 'red' : undefined}>
            {name}
          </Tag>
        );
      })}
    </Modal>
  );
};

export interface BusinessAndBusinessRoleProps {
  allBusinessList?: Business[];
  currentUserBusinessList: Business[];
  getUserBusinessRole: (businessId: string) => Promise<BusinessRole[]>; // 获取用户在此业务的角色
  getBusinessAllRole: (businessId: string) => Promise<BusinessRole[]>;
  addBusiness: (businessId: string) => void;
  addBusinessRole: ({
    businessId,
    businessRoleId,
  }: {
    businessId: string;
    businessRoleId: string;
  }) => void;
  handleCancel: () => void;
}

enum ModalType {
  normal,
  business,
  businessRole,
}

function useModal() {
  const [type, setType] = useState<ModalType>(ModalType.normal);
  const clickBusinessModal = () => setType(ModalType.business);
  const clickBusinessRoleModal = () => setType(ModalType.businessRole);
  const clickNormalModal = () => setType(ModalType.normal);
  return { modalType: type, clickBusinessModal, clickBusinessRoleModal, clickNormalModal };
}

function useOperationModal(props: BusinessAndBusinessRoleProps) {
  const { modalType, clickBusinessModal, clickBusinessRoleModal, clickNormalModal } = useModal();

  const {
    getUserBusinessRole,
    currentUserBusinessList,
    allBusinessList,
    getBusinessAllRole,
    addBusiness,
    addBusinessRole,
  } = props;
  const [currentUserBusinessRoleList, setCurrentBusinessRole] = useState<BusinessRole[]>();
  const [currentBusinessId, setCurrentBusinessId] = useState<string>();
  const [operationData, setOperationData] = useState<
    { name: string; id: string; checked?: boolean }[]
  >();

  const handleClickBusiness = async (id: string) => {
    const businessRole = await getUserBusinessRole(id);
    setCurrentBusinessRole(businessRole);
    console.log(businessRole);
    setCurrentBusinessId(id);
  };

  const handleAddBusiness = () => {
    clickBusinessModal();
    const allCheckedBusinessId = currentUserBusinessList.map(business => business.id);
    setOperationData(
      (allBusinessList || []).map(business => ({
        ...business,
        checked: allCheckedBusinessId.includes(business.id),
      })),
    );
  };

  const handleAddBusinessRole = async () => {
    const result = await getBusinessAllRole(currentBusinessId as string);

    const allCheckedBusinessRoleId = currentUserBusinessRoleList?.map(item => item.id);
    setOperationData(
      result.map(businessRole => ({
        ...businessRole,
        checked: allCheckedBusinessRoleId?.includes(businessRole.id),
      })),
    );
    clickBusinessRoleModal();
  };

  const handleClickOperationItem = (id: string) => {
    switch (modalType) {
      case ModalType.business: {
        addBusiness(id);
        break;
      }
      case ModalType.businessRole: {
        addBusinessRole({ businessId: currentBusinessId as string, businessRoleId: id });
        const newBusinessRole = find(operationData, { id }) as BusinessRole;
        setCurrentBusinessRole(all => [...(all || []), newBusinessRole]);
        break;
      }
      default:
        break;
    }
    setOperationData(
      (operationData || []).map(operation => ({
        ...operation,
        checked: operation.id === id || operation.checked,
      })),
    );
    message.success('添加成功');
  };

  const handleClickOperationCancel = () => {
    setOperationData(undefined); // 清空
    clickNormalModal();
  };

  return {
    modalType,
    currentUserBusinessList,
    currentUserBusinessRoleList,
    operationData,
    handleClickBusiness,
    handleAddBusiness,
    handleAddBusinessRole,
    handleClickOperationItem,
    handleClickOperationCancel,
  };
}

const BusinessAndBusinessRole: React.FC<BusinessAndBusinessRoleProps> = props => {
  const { handleCancel } = props;

  const {
    modalType,
    currentUserBusinessRoleList,
    currentUserBusinessList,
    handleClickBusiness,
    handleAddBusiness,
    handleAddBusinessRole,
    operationData,
    handleClickOperationCancel,
    handleClickOperationItem,
  } = useOperationModal(props);

  return (
    <React.Fragment>
      <Modal
        title="修改业务角色"
        onCancel={handleCancel}
        onOk={handleCancel}
        visible={modalType === ModalType.normal}
        destroyOnClose
      >
        <Row>
          <Col span={currentUserBusinessRoleList ? 12 : 24}>
            <TagContainer
              title="业务"
              data={currentUserBusinessList}
              onClick={handleClickBusiness}
              onAdd={handleAddBusiness}
            />
          </Col>
          {currentUserBusinessRoleList && (
            <Col span={12}>
              <TagContainer
                title="业务角色"
                data={currentUserBusinessRoleList}
                onClick={() => {}}
                onAdd={handleAddBusinessRole}
              />
            </Col>
          )}
        </Row>
      </Modal>
      {operationData && (
        <OperationModal
          visible={modalType !== ModalType.normal}
          onClick={handleClickOperationItem}
          data={operationData}
          handleCancel={handleClickOperationCancel}
        />
      )}
    </React.Fragment>
  );
};

export default BusinessAndBusinessRole;
