import { DatePicker, Input, Select, TableColumnsType } from "antd";
import { LoginResp } from "./api.entity";
import { FieldInfo, Search_equalOps, Search_numberOps, Search_stringOps, Search_timeOps } from "./form.entity";
import { Menu } from "./menu.entity";
import { Power } from "./power.entity";
import { PowerCode } from "./power_code";
import { Role } from "./role.entity";
import { Status } from "@/config";
import { OperateCode_All, OperateCode_View, TableColsParams } from "./page.entity";
import { checkPhone } from "@/util/valid";
import { RenderCommonOps, RenderStatusOps } from "@/util/render";
import TextArea from "antd/es/input/TextArea";
import { PasswordRules } from "@/util/validate_rule";
import { renderStatusTable } from "@/util/render";
// 用户的基本信息
export interface User {
  id: number; // ID
  user_name: string; // 用户名
  create_time: string;
  password: string; // 密码
  phone: string; // 手机
  email: string; // 邮箱
  desc: string; // 描述
  status: Status; // 状态 1启用，0禁用
  roles: number[]; // 拥有的所有角色ID
  token?: string;
}

//user store
export type SetUserInfoDef = Pick<UserStore, "user_base" | "roles" | "powers" | "menus">;
export interface UserStore {
  user_base: User | null;
  menus: Menu[]; // 拥有的所有菜单对象
  roles: Role[]; // 拥有的所有角色对象
  powers: Power[]; // 拥有的所有权限对象
  powersCode: string[];
  SetData: (params: SetUserInfoDef) => void;
  LoginOut: () => void;
  isAdmin: () => boolean;
  HaveLogin: () => boolean;
  Login: (token: LoginResp) => void;
  HaveRight: (code: PowerCode) => boolean;
  FetchUserDetail: () => Promise<SetUserInfoDef>;
  // getPageOperList: (model_type: ModuleType) => OperateType[];
}

//user form config
export const getUserFormConfig = (roles: Role[]): FieldInfo[] => {
  return [
    {
      field_Element: Input,
      field_name: "id",
      field_operate: OperateCode_View,
      label: "用户id",
      search_Ops: Search_numberOps,
    },
    {
      field_Element: Input,
      field_name: "user_name",
      field_operate: OperateCode_All,
      label: "用户名",
      search_Ops: Search_stringOps,
      edit_rules: [
        { required: true, whitespace: true, message: "必填" },
        { max: 12, message: "最多输入12位字符" },
      ],
      edit_props: {
        placeholder: "请输入用户名",
      },
    },
    {
      field_Element: Input.Password,
      field_operate: 0,
      field_name: "password",
      label: "密码",
      edit_rules: PasswordRules,
      edit_props: {
        placeholder: "请输入密码",
      },
    },
    {
      field_Element: Input,
      search_Element: DatePicker.RangePicker,
      field_name: "create_time",
      field_operate: OperateCode_View,
      label: "创建时间",
      search_Ops: Search_timeOps,
      search_props: {
        showTime: { format: "HH:mm" },
        format: "YYYY-MM-DD HH:mm",
      },
    },
    {
      field_Element: Input,
      field_name: "phone",
      label: "手机号",
      field_operate: OperateCode_All,
      search_Ops: Search_stringOps,
      edit_rules: [
        () => ({
          validator: (_, value) => {
            const v = value;
            if (v) {
              if (!checkPhone(v)) {
                return Promise.reject("请输入有效的手机号码");
              }
            }
            return Promise.resolve();
          },
        }),
      ],
      edit_props: {
        placeholder: "请输入手机号",
        maxLength: 11,
      },
    },
    {
      field_name: "email",
      field_Element: Input,
      label: "邮箱",
      field_operate: OperateCode_All,
      search_Ops: Search_stringOps,
      edit_rules: [{ type: "email" }],
      edit_props: {
        placeholder: "请输入邮箱地址",
      },
    },
    {
      field_name: "status",
      field_Element: Select,
      label: "状态",
      field_operate: OperateCode_All,
      search_Ops: Search_equalOps,
      SelectOpsRender: RenderStatusOps,
    },
    {
      field_name: "roles",
      field_Element: Select,
      label: "角色",
      field_operate: OperateCode_All,
      search_Ops: Search_equalOps,
      SelectOpsRender: () => {
        return RenderCommonOps(roles);
      },
      edit_rules: [{ required: true }],
      edit_props: {
        mode: "multiple",
      },
    },
    {
      field_name: "desc",
      search_Element: Input,
      field_Element: TextArea,
      label: "描述",
      field_operate: OperateCode_All,
      search_Ops: Search_stringOps,
      edit_props: {
        rows: 4,
        autoSize: { minRows: 2, maxRows: 6 },
      },
    },
  ];
};
//table列表
export function getUserTableCols(parmas: TableColsParams<User>): TableColumnsType<User> {
  return [
    { title: "编号", dataIndex: "id", key: "id" },
    { title: "用户名", dataIndex: "user_name", key: "user_name" },
    { title: "电话", dataIndex: "phone", key: "phone" },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      sorter: true,
      render: (value: string) => {
        const time = Date.parse(value);
        var date_time = new Date(time);
        return <span>{date_time.toLocaleString()}</span>;
      },
    },
    { title: "邮箱", dataIndex: "email", key: "email" },
    { title: "描述", dataIndex: "desc", key: "desc" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: renderStatusTable,
    },
    {
      title: "操作",
      key: "control",
      width: 200,
      render: parmas.operate_render,
    },
  ];
}
