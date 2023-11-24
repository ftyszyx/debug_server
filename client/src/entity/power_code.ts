import { EnumTypeItem } from "./other.entity";
import { OperateType } from "./page.entity";
import { Power } from "./power.entity";

export const ModuleList: EnumTypeItem[] = [
  { value: "user", label: "用户管理" },
  { value: "role", label: "角色管理" },
  { value: "menu", label: "菜单管理" },
  { value: "power", label: "权限管理" },
];

export enum ModuleType {
  User = "user",
  Role = "role",
  Power = "power",
  Menu = "menu",
}
export enum PowerCode {
  UserAdd = `${ModuleType.User}:${OperateType.Add}`,
  UserUp = `${ModuleType.User}:${OperateType.Up}`,
  UserQuery = `${ModuleType.User}:${OperateType.See}`,
  UserDel = `${ModuleType.User}:${OperateType.Del}`,

  RoleDel = `${ModuleType.Role}:${OperateType.Del}`,
  RoleAdd = `${ModuleType.Role}:${OperateType.Add}`,
  RoleUp = `${ModuleType.Role}:${OperateType.Up}`,
  RoleQuery = `${ModuleType.Role}:${OperateType.See}`,

  PowerDel = `${ModuleType.Power}:${OperateType.Del}`,
  PowerAdd = `${ModuleType.Power}:${OperateType.Add}`,
  PowerUp = `${ModuleType.Power}:${OperateType.Up}`,
  PowerQuery = `${ModuleType.Power}:${OperateType.See}`,

  MenuDel = `${ModuleType.Menu}:${OperateType.Del}`,
  MenuAdd = `${ModuleType.Menu}:${OperateType.Add}`,
  MenuUp = `${ModuleType.Menu}:${OperateType.Up}`,
  MenuQuery = `${ModuleType.Menu}:${OperateType.See}`,
}

export function getPowerCode(model_name: ModuleType, operate: OperateType | string) {
  // if (operate == OperateType.Search) operate = OperateType.See;
  return `${model_name}:${operate}` as PowerCode;
}

export function getPowerCodeByPower(info: Power) {
  return getPowerCode(info.module, info.code);
}

export function getMoudleLabel(module: string) {
  return ModuleList.find((x) => x.value == module)?.label || "";
}
