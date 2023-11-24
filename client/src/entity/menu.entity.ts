import { Status } from "@/config";
import { Input, Select, TableColumnsType, TreeSelect } from "antd";
import { OperateCode_All, OperateCode_View, TableColsParams } from "./page.entity";
import { FieldInfo } from "./form.entity";
import TextArea from "antd/es/input/TextArea";
import { RenderStatusOps, renderStatusTable } from "@/util/render";
import { MyTreeInfo } from "@/util/tree";
// 菜单添加，修改时的参数类型
export interface Menu {
  id: number; // ID,添加时可以没有id
  title: string; // 标题
  icon_style_type: string; // 图标
  url: string; // 链接路径
  parent: number; // 父级ID
  desc: string; // 描述
  sorts: number; // 排序编号
  status: Status; // 状态，1启用，0禁用
  children?: number[]; // 子菜单
}

export const getMenuFormList = (menu_treeinfo: MyTreeInfo<Menu>): FieldInfo[] => {
  // console.log("tree", menu_treeinfo.trees);
  return [
    {
      field_Element: Input,
      field_name: "id",
      field_operate: OperateCode_View,
      label: "id",
    },
    {
      field_Element: Input,
      field_name: "sorts",
      field_operate: OperateCode_View,
      label: "排序编号",
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
      field_name: "parent",
      field_Element: TreeSelect,
      label: "父节点",
      field_operate: OperateCode_All,
      edit_props: {
        placeholder: "请选择",
        allowClear: true,
        dropdownStyle: { maxHeight: 400, overflow: "auto" },
        treeDefaultExpandAll: true,
        treeData: menu_treeinfo.trees,
      },
      edit_rules: [{ required: true }],
    },
  ];
};

export function getMenuTableCols(parmas: TableColsParams<Menu>): TableColumnsType<Menu> {
  return [
    { title: "标题", dataIndex: "title", key: "title" },
    { title: "描述", dataIndex: "desc", key: "desc" },
    { title: "状态", dataIndex: "status", key: "status", render: renderStatusTable },
    { title: "操作", key: "control", width: 200, render: parmas.operate_render },
  ];
}
