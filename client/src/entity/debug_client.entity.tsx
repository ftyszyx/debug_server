import { FieldInfo } from "./form.entity";
import { Button, Input, TableColumnsType } from "antd";
import { OperateCode_All, OperateCode_View, TableColsParams } from "./page.entity";
import TextArea from "antd/es/input/TextArea";
import { PagePath } from "./api_path";

export interface DebugClient {
  id: number; // ID,添加时可以不传id
  name: string; //名字
  guid: string; // guid
  desc: string;
  os_name: string;
  address: string;
  connected: boolean;
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
      field_Element: TextArea,
      field_name: "desc",
      field_operate: OperateCode_All,
      label: "描述",
      edit_rules: [{ max: 12, message: "最多输入12位字符" }],
      edit_props: {
        placeholder: "请输入别名",
      },
    },
    {
      field_Element: Input,
      field_name: "os_name",
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
    { title: "guid唯一编码", dataIndex: "guid", key: "guid" },
    { title: "系统类型", dataIndex: "os_name", key: "os_name" },
    { title: "ip地址", dataIndex: "address", key: "address" },
    {
      title: "在线",
      dataIndex: "connected",
      key: "connected",
      render: (value: boolean) => {
        return value ? <span className=" text-blue-600">在线</span> : <span className=" text-gray-500">失联</span>;
      },
    },
    { title: "描述", dataIndex: "desc", key: "desc" },
    {
      title: "操作",
      key: "control",
      width: 200,
      render: (value: DebugClient) => {
        return parmas.operate_render(value, (controls, location) => {
          if (value.connected) {
            controls.push(
              <Button
                key="10"
                type="primary"
                onClick={() => {
                  const new_url = `${PagePath.DebugTerminal}/${value.id}`;
                  console.log("new url", new_url);
                  location.push(new_url);
                }}
              >
                CMD
              </Button>
            );
          }
        });
      },
    },
  ];
}
