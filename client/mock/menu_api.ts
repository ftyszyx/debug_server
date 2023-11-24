import { menus } from "./app_data";
import { AddResolve, IDSReq as IdsReq, FindById, Update, Delete } from "./app_api";
import { AddResp, ApiResp } from "@/entity/api";
import { Menu } from "@/entity/menu";
import { Net_Retcode } from "@/config";
import { ApiPath } from "@/entity/api_path";

// 获取所有菜单
const getMenus = function (): ApiResp<Menu[]> {
  return { status: Net_Retcode.SUCCESS, data: menus, message: "success" };
};

// 获取菜单（根据ID）
const getMenusById = function (p: IdsReq) {
  return FindById<Menu>(menus, p, null);
};

let id_sequence = 1000;
// 添加新菜单
const addMenu = function (p: Menu): ApiResp<AddResp> {
  p.id = ++id_sequence;
  menus.push(p);
  return { status: Net_Retcode.SUCCESS, data: { id: id_sequence }, message: "添加成功" };
};
// 修改菜单
const upMenu = function (p: Menu) {
  return Update<Menu>(menus, p);
};
// 删除菜单
const delMenu = function (p: Pick<Menu, "id">): ApiResp<Menu[] | null> {
  return Delete<Menu>(menus, p, (delitem) => {
    const haveChild = menus.findIndex(function (item) {
      return item.parent === delitem.id;
    });
    if (haveChild != -1) {
      return { ok: false, msg: "该菜单下有子菜单，无法删除" };
    }
    return { ok: true };
  });
};
export const initMenu = () => {
  AddResolve(ApiPath.GetMenus, getMenus);
  AddResolve(ApiPath.GetMenuById, getMenusById);
  AddResolve(ApiPath.AddMenu, addMenu);
  AddResolve(ApiPath.UpMenu, upMenu);
  AddResolve(ApiPath.DelMenu, delMenu);
};
