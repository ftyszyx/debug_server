import { IdItem, ListReq, ListResp, PageReq, UpReq } from "@/entity/api.entity";
import { FieldInfo, OrderByList, SearchFormDef } from "@/entity/form.entity";
import { AdminPageUrlInfo, ModalType, OperateCode, OperateType, OperateTypeList, TableColsParams } from "@/entity/page.entity";
import { MyFetchGet, MyFetchPost } from "@/util/fetch";
import { Button, TableColumnsType, message, Table, Tooltip, Popconfirm, Divider } from "antd";
import { useEffect, useMemo, useState } from "react";
import { DeleteOutlined, EyeOutlined, PlusCircleOutlined, ToolOutlined } from "@ant-design/icons";
import SearchBar from "./search_bar";
import { SorterResult } from "antd/es/table/interface";
import CommonEditPanel, { EditPanelChildProps } from "./common_edit_panel";

interface AdminViewhookInfo<EntityT> {
  after_getdata?: (datalist: EntityT[]) => Promise<void>;
  after_editpanel_operate?: (op_type: OperateCode, data: EntityT) => Promise<void>;
  before_editpanel_show?: (op_type: OperateCode, data: EntityT | undefined) => void;
}
interface CommonAdminViewProps<EntityT> {
  show_search?: boolean;
  api_urls: AdminPageUrlInfo;
  get_table_cols: (params: TableColsParams<EntityT>) => TableColumnsType<EntityT>;
  get_table_list: (datas: EntityT[]) => EntityT[];
  form_fields: FieldInfo[];
  can_del?: (data: EntityT) => boolean;
  can_edit?: (data: EntityT) => boolean;
  hooks?: AdminViewhookInfo<EntityT>;
  form_initdata: EntityT;
  form_panel_child_render?: (params: EditPanelChildProps) => JSX.Element;
}
export default function CommonAdminView<EntityT extends IdItem>(props: CommonAdminViewProps<EntityT>) {
  // console.log("render commonadminview", props.api_urls);
  const [dataList, setDataList] = useState<EntityT[]>([]);
  const [loading, setLoading] = useState(false); // 数据是否正在加载中
  const [sortinfo, setSortinfo] = useState<OrderByList>({});
  const [PageInfo, setPageInfo] = useState<PageReq>({
    pageNum: 1,
    pageSize: 10,
  });
  const [SearchInfo, SetSearchInfo] = useState<SearchFormDef>({});
  const [total, setTotal] = useState(0);
  // 模态框相关参数
  const [edit_panel_state, set_edit_panel_state] = useState<ModalType<EntityT>>({ modalShow: false });
  const showall = !!props.api_urls.all;
  useEffect(() => {
    GetData();
  }, [SearchInfo, PageInfo, sortinfo]);

  const onTablePageChange = (pageNum: number, pageSize: number | undefined) => {
    setPageInfo({ pageNum, pageSize: pageSize || PageInfo.pageSize });
  };

  async function getAllData(): Promise<void> {
    try {
      const res = await MyFetchGet<EntityT[]>(props.api_urls.all!);
      setDataList(res);
      await props.hooks?.after_getdata?.(res);
      setTotal(res.length);
    } finally {
      setLoading(false);
    }
    return;
  }
  async function getListData() {
    // console.log("getlistData", PageInfo, SearchInfo, sortinfo);
    if (!props.api_urls.getlist) {
      return;
    }
    setLoading(true);
    try {
      const data: ListReq = Object.assign({}, PageInfo, SearchInfo);
      const sortitems = Object.entries(sortinfo);
      if (sortitems.length > 0) data.orderBy = sortinfo;
      const res = await MyFetchPost<ListResp<EntityT>, ListReq>(props.api_urls.getlist, data);
      await props.hooks?.after_getdata?.(res.list);
      setDataList(res.list as EntityT[]);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }
  // 函数 - 查询当前页面所需列表数据
  async function GetData(): Promise<void> {
    // console.log("get all data",showall)
    if (showall) {
      await getAllData();
    } else {
      await getListData();
    }
  }
  const ShowEditPanel = (data: EntityT | undefined, type: OperateType): void => {
    const operateinfo = OperateTypeList[type];
    props.hooks?.before_editpanel_show?.(operateinfo.op_code, data);
    set_edit_panel_state({
      modalShow: true,
      data: data,
      operateType: operateinfo,
    });
  };

  const onEditOk = async (data: EntityT): Promise<void> => {
    const opcode = edit_panel_state.operateType?.op_code!;
    let edit_res: EntityT;
    try {
      if (opcode !== OperateCode.See) {
        set_edit_panel_state({ modalLoading: true, modalShow: false });
        if (opcode === OperateCode.Add) {
          // 新增
          edit_res = await MyFetchPost<EntityT, EntityT>(props.api_urls.add!, data);
          message.success("添加成功");
        } else {
          // 修改
          edit_res = await MyFetchPost<EntityT, UpReq<EntityT>>(props.api_urls.up!, { id: edit_panel_state.data!.id, data });
          message.success("修改成功");
        }
      }
      await props.hooks?.after_editpanel_operate?.(opcode, edit_res!);
      GetData();
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      set_edit_panel_state({ modalLoading: false, modalShow: false });
    }
  };

  const onDel = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      MyFetchPost(props.api_urls.del!, { id });
      message.success("删除成功");
      GetData();
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    set_edit_panel_state({
      modalShow: false,
    });
  };

  const tableData = useMemo(() => {
    return props.get_table_list(dataList);
  }, [dataList]);

  const talble_cols = useMemo(() => {
    return props.get_table_cols({
      operate_render: (data) => {
        const controls = [];
        if (props.api_urls.getlist) {
          controls.push(
            <span key="0" className="control-btn green" onClick={() => ShowEditPanel(data, OperateType.See)}>
              <Tooltip placement="top" title="查看">
                <EyeOutlined />
              </Tooltip>
            </span>
          );
        }
        if (props.api_urls.up && (props.can_edit ? props.can_edit(data) : true))
          controls.push(
            <span key="1" className="control-btn blue" onClick={() => ShowEditPanel(data, OperateType.Up)}>
              <Tooltip placement="top" title="修改">
                <ToolOutlined />
              </Tooltip>
            </span>
          );
        if (props.api_urls.del && (props.can_del ? props.can_del(data) : true))
          controls.push(
            <Popconfirm key="3" title="确定删除吗?" onConfirm={() => onDel(data.id!)} okText="确定" cancelText="取消">
              <span className="control-btn red">
                <Tooltip placement="top" title="删除">
                  <DeleteOutlined />
                </Tooltip>
              </span>
            </Popconfirm>
          );

        const result: JSX.Element[] = [];
        controls.forEach((item, index) => {
          if (index) {
            result.push(<Divider key={`line${index}`} type="vertical" />);
          }
          result.push(item);
        });
        return result;
      },
    });
  }, [props]);
  return (
    <div>
      {/*operate type*/}
      <div className="flex flex-col   my-1">
        <ul className="flex">
          <li>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={!props.api_urls.add}
              onClick={() => ShowEditPanel(undefined, OperateType.Add)}
            >
              添加
            </Button>
          </li>
        </ul>
        {/* <Divider type="vertical" /> */}
        {props.show_search && (
          <SearchBar
            fileds={props.form_fields}
            onSure={(info) => {
              SetSearchInfo(info);
            }}
          />
        )}
      </div>
      {/*table*/}
      <div className="diy-table">
        <Table
          columns={talble_cols}
          loading={loading}
          dataSource={tableData}
          onChange={(_pagination, _filters, sorter, _extra) => {
            if (sorter) {
              let { field, order } = sorter as SorterResult<EntityT>;
              let new_order = order as string;
              if (order) new_order = order == "descend" ? "Desc" : "Asc";
              const res = Object.assign({}, sortinfo, { [field as string]: new_order });
              setSortinfo(res);
            }
          }}
          pagination={{
            total: total,
            current: PageInfo.pageNum,
            pageSize: PageInfo.pageSize,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条数据`,
            onChange: (page, pageSize) => onTablePageChange(page, pageSize),
          }}
        />
      </div>
      {/* 新增&修改&查看 模态框 */}
      {edit_panel_state.modalShow && (
        <CommonEditPanel<EntityT>
          title={edit_panel_state.operateType!.title}
          onOk={(info) => {
            return onEditOk(info);
          }}
          onCancel={onClose}
          loading={edit_panel_state.modalLoading}
          show={edit_panel_state.modalShow}
          fieldlist={props.form_fields}
          initalvalues={edit_panel_state.data || props.form_initdata}
          show_type={edit_panel_state.operateType!}
          children_render={props.form_panel_child_render}
        ></CommonEditPanel>
      )}
    </div>
  );
}
