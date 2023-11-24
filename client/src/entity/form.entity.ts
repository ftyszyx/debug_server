import { Rule } from "antd/es/form";
import React from "react";

export enum FieldType {
  Input_type = "input",
  Tree_type = "tree",
  Select_type = "select",
  TextArea_type = "textarea",
  Input_number = "input_number",
}
export interface prop_field {
  [k: string]: any;
  placeholder?: string;
}

export class FieldInfo {
  field_name: string = "";
  field_Element: any = null;
  label: string = "";
  //这个字段可以进行的操作
  field_operate: number = 0;
  SelectOpsRender?: () => React.ReactNode;
  //search bar
  search_Element?: any = null;
  search_rules?: Rule[] = [];
  search_Ops?: SearchOpKey[] = Search_string2Ops;
  search_props?: prop_field = {};

  //edit 相关
  edit_rules?: Rule[] = [];
  edit_props?: prop_field = {};
}

export function getFileElementName(field?: FieldInfo) {
  if (!field) return "";
  return (field.search_Element || field.field_Element).displayName;
}

export type SearchOpKey =
  | "starts_with"
  | "ends_with"
  | "is"
  | "not"
  | "in"
  | "not_in"
  | "lt"
  | "gt"
  | "lte"
  | "gte"
  | "contains"
  | "not_contains"
  | "not_starts_with"
  | "not_ends_with"
  | "between"
  | "between_not_include";
export interface SearchOpInfo {
  name: SearchOpKey;
  title: string;
}

export const SearchOps: SearchOpInfo[] = [
  { name: "starts_with", title: "starts_with" },
  { name: "ends_with", title: "ends_with" },
  { name: "is", title: "==" },
  { name: "not", title: "!=" },
  { name: "in", title: "in" },
  { name: "not_in", title: "not_in" },
  { name: "lt", title: "<" },
  { name: "gt", title: ">" },
  { name: "lte", title: "<=" },
  { name: "gte", title: ">=" },
  { name: "contains", title: "like" },
  { name: "not_contains", title: "not_like" },
  { name: "not_starts_with", title: "not_starts_with" },
  { name: "not_ends_with", title: "not_ends_with" },
  { name: "between", title: "between" },
  { name: "between_not_include", title: "between(不包含)" },
];
export const Search_equalOps: SearchOpKey[] = ["is", "not"];
export const Search_betweenOps: SearchOpKey[] = ["between", "between_not_include"];
export const Search_rangeOps: SearchOpKey[] = ["gte", "gt", "lt", "lte"];
const Search_string2Ops: SearchOpKey[] = [
  "starts_with",
  "ends_with",
  "contains",
  "not_contains",
  "not_starts_with",
  "not_ends_with",
];
export const Search_arrayOps: SearchOpKey[] = ["in", "not_in"];
export const Search_numberOps: SearchOpKey[] = Search_arrayOps.concat(Search_rangeOps, Search_equalOps);
export const Search_stringOps: SearchOpKey[] = Search_string2Ops.concat(Search_equalOps);
export const Search_timeOps: SearchOpKey[] = Search_betweenOps;
export enum SearchAndOr {
  and = "and",
  or = "or",
}
export class SearchFieldOptions {
  starts_with?: string;
  ends_with?: string;
  is?: string | number;
  not?: string | number;
  in?: string;
  not_in?: string;
  lt?: number;
  gt?: number;
  lte?: number;
  gte?: number;
  contains?: string;
  not_contains?: string;
  not_starts_with?: string;
  not_ends_with?: string;
}

export type SearchField = {
  [P: string]: SearchFieldOptions;
};

export class SearchFormDef {
  or?: SearchField[];
  and?: SearchField[];
}
export type orderByOp = "DESC" | "ASC";
export type OrderByList = {
  [p: string]: orderByOp;
};
export class OrderByReq {
  orderBy?: OrderByList;
}
