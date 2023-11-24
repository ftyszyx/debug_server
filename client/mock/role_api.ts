import { menus, powers, roles } from "./app_data";
import { Delete, FindById, IDSReq, Update, decode } from "./app_api";
import { AddResolve } from "./app_api";
import { AddResp, ApiResp, IdItem, ListResp, RoleReq, UpRoleMenuReq, UpRolePowerReq } from "@/entity/api";
import { Role } from "@/entity/role";
import { Net_Retcode, SUPER_POWER_ROLE } from "@/config";
import { ApiPath } from "@/entity/api_path";
// 查询角色（分页,条件筛选）
const getRoles = function (p: RoleReq): ApiResp<ListResp<Role>> {
  const map = roles.filter(function (item) {
    let yeah = true;
    const title = decode(p.title);
    const status = p.status;
    if (title && !item.title.includes(title)) {
      yeah = false;
    }
    if (status && item.status !== status) {
      yeah = false;
    }
    return yeah;
  });
  const r = map.sort(function (a, b) {
    return a.sorts - b.sorts;
  });
  const res = r.slice((p.pageNum - 1) * p.pageSize, p.pageNum * p.pageSize);
  return {
    status: Net_Retcode.SUCCESS,
    data: { list: res, total: map.length },
    message: "success",
  };
};
// 查询角色（所有）
const getAllRoles = function (): ApiResp<Role[]> {
  return { status: Net_Retcode.SUCCESS, data: roles, message: "success" };
};
// 查询角色（通过角色ID）
const getRoleById = function (p: IDSReq) {
  return FindById<Role>(roles, p, (item) => {
    if (item.id == SUPER_POWER_ROLE) {
      item.powers = powers.reduce((a: number[], b) => a.concat([b.id]), []);
      item.menus = menus.reduce((a: number[], b) => a.concat([b.id]), []);
    }
  });
};
// 修改角色
const upRole = function (p: Role) {
  return Update<Role>(roles, p);
};
// 删除角色
const delRole = function (p: IdItem) {
  return Delete<Role>(roles, p, null);
};
let id_sequence = 1000;
// 添加角色
const addRole = function (p: Role): ApiResp<AddResp> {
  p.id = ++id_sequence;
  if (!p.menus) {
    p.menus = [];
  }
  roles.push(p);
  return { status: Net_Retcode.SUCCESS, data: { id: p.id }, message: "success" };
};
function upRoleMenu(param: UpRoleMenuReq): ApiResp<null> {
  roles.forEach((item) => {
    item.menus = item.menus || [];
    const idx = item.menus.findIndex((value) => value == param.menu_id);
    if (param.role_ids.includes(item.id)) {
      if (idx == -1) item.menus.push(param.menu_id);
    } else {
      if (idx > -1) item.menus.splice(idx, 1);
    }
  });
  return { status: Net_Retcode.SUCCESS, data: null, message: "success" };
}
function upRolePower(param: UpRolePowerReq): ApiResp<null> {
  roles.forEach((item) => {
    item.powers = item.powers || [];
    const idx = item.powers.findIndex((value) => value == param.power_id);
    if (param.role_ids.includes(item.id)) {
      if (idx == -1) item.powers.push(param.power_id);
    } else {
      if (idx > -1) item.powers.splice(idx, 1);
    }
  });
  return { status: Net_Retcode.SUCCESS, data: null, message: "success" };
}
export function initRole() {
  AddResolve(ApiPath.GetRoles, getRoles);
  AddResolve(ApiPath.GetAllRoles, getAllRoles);
  AddResolve(ApiPath.GetRoleById, getRoleById);
  AddResolve(ApiPath.UpRole, upRole);
  AddResolve(ApiPath.DelRole, delRole);
  AddResolve(ApiPath.AddRole, addRole);
  AddResolve(ApiPath.UpRolePower, upRolePower);
  AddResolve(ApiPath.UpRoleMenu, upRoleMenu);
}
