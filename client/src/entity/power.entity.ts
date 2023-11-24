import { Status } from "@/config";
import { Input, Select, TableColumnsType } from "antd";
import { OperateCode_All, OperateCode_View, OperateCode_edit, OperateType, TableColsParams } from "./page.entity";
import { FieldInfo } from "./form.entity";
import TextArea from "antd/es/input/TextArea";
import { RenderEnumOps, RenderStatusOps, rednerEnumTable, renderStatusTable } from "@/util/render";
import { ModuleList, ModuleType } from "./power_code";
// 权限添加修改时的参数类型
export interface Power {
  id: number; // ID, 添加时可以没有id
  title: string; // 标题
  module: ModuleType;
  code: string; // CODE
  desc: string; // 描述
  sorts: number; // 排序
  status: Status; // 状态 1启用，0禁用
}

export const getPowerFormList = (): FieldInfo[] => {
  return [
    {
      field_Element: Input,
      field_name: "id",
      field_operate: OperateCode_View,
      label: "id",
    },
    {
      field_Element: Select,
      field_name: "module",
      field_operate: OperateCode_edit,
      label: "所属模块",
      edit_rules: [{ required: true, whitespace: true, message: "必填" }],
      edit_props: {
        placeholder: "请选择所属系统模块",
      },
      SelectOpsRender() {
        return RenderEnumOps(ModuleList);
      },
    },
    {
      field_Element: Input,
      field_name: "title",
      field_operate: OperateCode_All,
      label: "标题",
      edit_rules: [
        { required: true, whitespace: true, message: "必填" },
        { max: 12, message: "最多输入12位字符" },
      ],
      edit_props: {
        placeholder: "请输入标题",
      },
    },
    {
      field_Element: Input,
      field_name: "code",
      field_operate: OperateCode_edit,
      label: "权限编码",
      edit_rules: [{ required: true }],
      edit_props: {
        placeholder: "",
      },
    },
    {
      field_Element: Input,
      field_name: "sorts",
      field_operate: OperateCode_edit,
      label: "排序编号",
    },
    {
      field_name: "status",
      field_Element: Select,
      label: "状态",
      field_operate: OperateCode_All,
      SelectOpsRender: RenderStatusOps,
    },
    {
      field_name: "desc",
      field_Element: TextArea,
      label: "描述",
      field_operate: OperateCode_All,
      edit_props: {
        rows: 4,
        autoSize: { minRows: 2, maxRows: 6 },
      },
    },
  ];
};

export function getPowerTableCols(parmas: TableColsParams<Power>): TableColumnsType<Power> {
  return [
    {
      title: "模块",
      dataIndex: "module",
      key: "module",
      render: (value) => {
        return rednerEnumTable(value, ModuleList);
      },
    },
    { title: "权限名", dataIndex: "title", key: "title" },
    { title: "描述", dataIndex: "desc", key: "desc" },
    { title: "代码", dataIndex: "code", key: "code" },
    { title: "状态", dataIndex: "status", key: "status", render: renderStatusTable },
    { title: "操作", key: "control", width: 200, render: parmas.operate_render },
  ];
}
