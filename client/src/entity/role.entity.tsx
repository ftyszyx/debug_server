import { Status } from "@/config";
import { FieldInfo } from "./form.entity";
import { Input, Select, TableColumnsType } from "antd";
import { OperateCode_All, OperateCode_View, TableColsParams } from "./page.entity";
import TextArea from "antd/es/input/TextArea";
import IdTreeSelect from "@/components/id_tree_select";
import { MyTreeInfo } from "@/util/tree";
import { Menu } from "./menu.entity";
import { Power } from "./power.entity";
import { renderStatusTable, RenderStatusOps } from "@/util/render";

export interface Role {
  id: number; // ID,添加时可以不传id
  title: string; // 角色名
  desc: string; // 描述
  sorts: number; // 排序编号
  status: Status; // 状态，1启用，0禁用
  menus: number[]; // 添加时可以不传菜单和权限
  powers: number[]; // 添加时可以不传菜单和权限
}

export const getRoleFormConfig = (menu_treeinfo: MyTreeInfo<Menu>, power_treeinfo: MyTreeInfo<Power>): FieldInfo[] => {
  return [
    {
      field_Element: Input,
      field_name: "id",
      field_operate: OperateCode_View,
      label: "id",
    },
    {
      field_Element: Input,
      field_name: "title",
      field_operate: OperateCode_All,
      label: "角色名",
      edit_rules: [
        { required: true, whitespace: true, message: "必填" },
        { max: 12, message: "最多输入12位字符" },
      ],
      edit_props: {
        placeholder: "请输入用户名",
      },
    },
    {
      field_Element: Input,
      field_name: "sorts",
      field_operate: OperateCode_All,
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
    {
      field_name: "menus",
      field_Element: IdTreeSelect,
      label: "菜单列表",
      field_operate: OperateCode_All,
      edit_props: {
        treeInfo: menu_treeinfo,
      },
    },
    {
      field_name: "powers",
      field_Element: IdTreeSelect,
      label: "权限列表",
      field_operate: OperateCode_All,
      edit_props: {
        treeInfo: power_treeinfo,
      },
    },
  ];
};

export function getRoleTalbeCols(parmas: TableColsParams<Role>): TableColumnsType<Role> {
  return [
    // { title: "编号", dataIndex: "id", key: "id" },
    { title: "角色名", dataIndex: "title", key: "title" },
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
