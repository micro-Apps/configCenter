export { VersionType } from '../data';

export interface ModuleItemInfo {
  id: string;
  name: string;
  version?: VersionType[];
}
