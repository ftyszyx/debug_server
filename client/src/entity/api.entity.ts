import { Status } from "@/config";
import { OrderByReq, SearchFormDef } from "./form.entity";

export interface IdItem {
  id: number;
  key?: number;
}

// 接口的返回值类型
export interface ApiResp<T> {
  status: number; // 状态，200成功
  data?: T; // 返回的数据
  message?: string; // 返回的消息
}
export type ListReq = PageReq & SearchFormDef & OrderByReq;
export interface ListResp<T> {
  list: T[];
  total: number;
}

export interface PageReq {
  pageNum: number;
  pageSize: number;
}
export interface LoginReq {
  user_name: string;
  password: string;
}
export interface LoginResp {
  access_token: string;
}

export interface ChangePassReq {
  new_pass: string;
}
export interface IdsReq {
  ids: number[];
}
export interface UserListReq extends PageReq {
  username: string;
  status: number;
}
export interface RoleReq extends PageReq {
  title: string;
  status: Status;
}
export interface AddResp {
  id: number;
}

export enum AddOrDelType {
  Add = 1,
  Del = 0,
}
export class UpRolePowerReq {
  role_ids: number[] = [];
  power_id: number = 0;
}

export class UpRoleMenuReq {
  role_ids: number[] = [];
  menu_id: number = 0;
}
export interface UpReq<T> {
  id: number;
  data: T;
}
