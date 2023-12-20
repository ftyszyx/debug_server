import { FieldInfo } from "./form.entity";
import { Input, TableColumnsType } from "antd";
import { OperateCode_View, TableColsParams } from "./page.entity";

export interface MyLog {
  id: number; // ID,添加时可以不传id
  log_type: string;
  user_id: number;
  info: string;
  log_time: string;
}

export const getLogFormConfig = (): FieldInfo[] => {
  return [
    {
      field_Element: Input,
      field_name: "id",
      field_operate: OperateCode_View,
      label: "id",
    },
    {
      field_Element: Input,
      field_name: "log_type",
      field_operate: OperateCode_View,
      label: "类别",
    },
    {
      field_Element: Input,
      field_name: "user_id",
      field_operate: OperateCode_View,
      label: "userid",
    },
    {
      field_name: "info",
      field_Element: Input,
      label: "详情",
      field_operate: OperateCode_View,
    },
    {
      field_name: "log_time",
      field_Element: Input,
      label: "时间",
      field_operate: OperateCode_View,
    },
  ];
};

export function getLogTalbeCols(_parmas: TableColsParams<MyLog>): TableColumnsType<MyLog> {
  return [
    { title: "编号", dataIndex: "id", key: "id" },
    { title: "类型", dataIndex: "logtype", key: "log_type" },
    { title: "操作者", dataIndex: "user_id", key: "user_id" },
    { title: "详情", dataIndex: "info", key: "info" },
    { title: "时间", dataIndex: "log_time", key: "log_time" },
  ];
}
