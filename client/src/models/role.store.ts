import { ApiPath } from "@/entity/api_path";
import { Role } from "@/entity/role.entity";
import { EnumTypeItem, StoreBase } from "@/entity/other.entity";
import { createStoreBase } from "./base.store";
export interface RoleStore2 {
  getCheckBoxItems: () => EnumTypeItem[];
}
export type RoleStore = StoreBase<Role> & RoleStore2;
export const useRoleStore = createStoreBase<Role, RoleStore2>(ApiPath.GetAllRoles, (set, get) => {
  return {
    getCheckBoxItems: () => {
      var items = get().items.map((item) => {
        return { label: item.title, value: item.id };
      });
      return items;
    },
  };
});
