import { powers } from "./app_data";
import { Net_Retcode } from "@/config";
import { AddResolve, Delete, FindById, IDSReq, Update } from "./app_api";
import { Power } from "@/entity/power";
import { AddResp, ApiResp, IdItem } from "@/entity/api";
import { ApiPath } from "@/entity/api_path";

const getPowers = function (): ApiResp<Power[]> {
  return { status: Net_Retcode.SUCCESS, data: powers, message: "success" };
};
// 根据权限ID查询对应的权限
const getPowerById = function (p: IDSReq) {
  return FindById<Power>(powers, p, null);
};
let id_sequence = 1000;
// 添加权限
const addPower = function (p: Power): ApiResp<AddResp> {
  p.id = ++id_sequence;
  powers.push(p);
  return { status: Net_Retcode.SUCCESS, data: { id: p.id }, message: "success" };
};
// 修改权限
const upPower = function (p: Power) {
  return Update<Power>(powers, p);
};
// 删除权限
const delPower = function (p: IdItem) {
  return Delete<Power>(powers, p, null);
};
export const initPower = () => {
  AddResolve(ApiPath.GetPowerById, getPowerById);
  AddResolve(ApiPath.AddPower, addPower);
  AddResolve(ApiPath.UpPower, upPower);
  AddResolve(ApiPath.DelPower, delPower);
  AddResolve(ApiPath.GetPowers, getPowers);
};
