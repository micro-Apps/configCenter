export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface RoleInfoDto {
  id: string;
  name: string;
}

export interface BasicListItemDataType {
  id?: string;
  name: string;
  router: string;
  subMenuId: string;
  moduleInfo: {
    id: string;
    name: string;
    version: string;
    address: string;
  };
  roleInfo?: RoleInfoDto[];
}

export interface BusinessRoleType {
  id: string;
  name: string;
}

export interface ModuleVersionItem {
  address: string;
  version: string;
}

export interface ModuleEntity {
  id: string;
  name: string;
  developmentId: string;
  version: ModuleVersionItem[];
}
