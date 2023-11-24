import { Menu } from "@/entity/menu.entity";
import { ApiPath } from "@/entity/api_path";
import { StoreBase } from "@/entity/other.entity";
import { createStoreBase } from "./base.store";
export type MenuStore = StoreBase<Menu>;
export const UseMenuStore = createStoreBase<Menu, undefined>(ApiPath.GetAllMenus);
