export interface VersionType {
  version: string;
  address: string;
}

export interface CardListItemDataType {
  id?: string;
  name: string;
  version?: VersionType[];
}
