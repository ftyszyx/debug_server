import { FieldInfo } from "./form.entity";
import { Input, TableColumnsType } from "antd";
import { OperateCode_All, OperateCode_View, TableColsParams } from "./page.entity";

export interface DebugClient {
  id: number; // ID,添加时可以不传id
  name: string; //名字
  guid: string; // guid
  desc: string;
  system_type: string;
  adress: string;
}

export const getDebugClientsFormConfig = (): FieldInfo[] => {
  return [
    {
      field_Element: Input,
      field_name: "id",
      field_operate: OperateCode_View,
      label: "id",
    },
    {
      field_Element: Input,
      field_name: "name",
      field_operate: OperateCode_All,
      label: "别名",
      edit_rules: [{ max: 12, message: "最多输入12位字符" }],
      edit_props: {
        placeholder: "请输入别名",
      },
    },
    {
      field_Element: Input,
      field_name: "system_type",
      field_operate: OperateCode_View,
      label: "系统",
    },
    {
      field_Element: Input,
      field_name: "guid",
      field_operate: OperateCode_View,
      label: "guid",
    },
    {
      field_name: "address",
      field_Element: Input,
      label: "地址",
      field_operate: OperateCode_View,
    },
  ];
};

export function getDebugClientsTalbeCols(parmas: TableColsParams<DebugClient>): TableColumnsType<DebugClient> {
  return [
    { title: "编号", dataIndex: "id", key: "id" },
    { title: "别名", dataIndex: "name", key: "name" },
    { title: "描述", dataIndex: "desc", key: "desc" },
    { title: "guid", dataIndex: "guid", key: "guid" },
    { title: "系统", dataIndex: "system_type", key: "system_type" },
    { title: "ip", dataIndex: "address", key: "address" },
    {
      title: "操作",
      key: "control",
      width: 200,
      render: parmas.operate_render,
    },
  ];
}
