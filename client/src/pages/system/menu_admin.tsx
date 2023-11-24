/** 权限管理页 **/
import { useState, useMemo, useEffect } from "react";
import { Form, message, Checkbox } from "antd";
import { UseUserStore } from "@/models/user.store";
import { MyFetchPost } from "@/util/fetch";
import { UserStore } from "@/entity/user.entity";
import { AdminPageUrlInfo, OperateCode } from "@/entity/page.entity";
import { RoleStore, useRoleStore } from "@/models/role.store";
import { PowerCode } from "@/entity/power_code";
import { ApiPath } from "@/entity/api_path";
import { Status } from "@/config";
import { UpRoleMenuReq } from "@/entity/api.entity";
import { MenuStore, UseMenuStore } from "@/models/menu.store";
import { Menu, getMenuFormList, getMenuTableCols } from "@/entity/menu.entity";
import CommonAdminView from "@/components/common_admin_view";
import { GetCommonTree, TreeNodeType } from "@/util/tree";
type MenuTreeData = TreeNodeType<Menu> & { value: number };
function MenuAdmin() {
  const userstore = UseUserStore() as UserStore;
  const role_store = useRoleStore() as RoleStore;
  const menu_store = UseMenuStore() as MenuStore;
  const [selectRoles, SetSelectRoles] = useState<number[]>([]);
  useEffect(() => {
    role_store.FetchAll();
    menu_store.FetchAll();
  }, []);

  const menu_treeinfo = useMemo(() => {
    const res = GetCommonTree(menu_store.items.filter((x) => x.status == Status.Enable));
    return res;
  }, [menu_store.items]);

  const role_selectlist = useMemo(() => {
    return role_store.getCheckBoxItems();
  }, [role_store]);

  const initselectRoles = (data: Menu) => {
    // console.log("roles", role_store.items, data.id);
    const role_ids = role_store.items.reduce((res: number[], item) => {
      if (item.menus?.includes(data!.id)) {
        res.push(item.id);
      }
      return res;
    }, []);
    // console.log("select roles", role_ids);
    SetSelectRoles(role_ids);
  };
  const FieldConfigList = useMemo(() => {
    let treelist = menu_treeinfo.datalist as MenuTreeData[];
    treelist.forEach((item) => {
      item.value = item.id;
    });
    // console.log("menutree", treelist);
    return getMenuFormList(menu_treeinfo);
  }, [menu_treeinfo]);
  const admin_url_list: AdminPageUrlInfo = useMemo(() => {
    let res: AdminPageUrlInfo = {};
    if (userstore.HaveRight(PowerCode.MenuAdd)) res.add = ApiPath.AddMenu;
    if (userstore.HaveRight(PowerCode.MenuDel)) res.del = ApiPath.DelMenu;
    if (userstore.HaveRight(PowerCode.MenuQuery)) res.all = ApiPath.GetAllMenus;
    if (userstore.HaveRight(PowerCode.MenuUp)) res.up = ApiPath.UpMenu;
    return res;
  }, [userstore]);
  return (
    <CommonAdminView<Menu>
      api_urls={admin_url_list}
      get_table_cols={(params) => {
        return getMenuTableCols(params);
      }}
      form_fields={FieldConfigList}
      form_initdata={{ status: Status.Enable } as Menu}
      hooks={{
        async after_getdata(datalist) {
          await menu_store.setItems(datalist);
        },
        before_editpanel_show(op_type, data) {
          if (op_type == OperateCode.Add) {
            SetSelectRoles([]);
          } else {
            initselectRoles(data!);
          }
        },
        async after_editpanel_operate(op_type, data) {
          if (op_type == OperateCode.Add || op_type == OperateCode.Up) {
            await MyFetchPost<any, UpRoleMenuReq>(ApiPath.UpRoleMenu, { menu_id: data.id, role_ids: selectRoles }).catch(
              (err) => {
                message.error(err);
              }
            );
            role_store.FetchAll(true);
          }
        },
      }}
      get_table_list={(datas) => {
        const treeinfo = GetCommonTree(datas);
        const res = treeinfo.trees;
        return res;
      }}
      form_panel_child_render={(parmas) => {
        return (
          <Form.Item label="赋予">
            <Checkbox.Group
              disabled={parmas.disabled}
              options={role_selectlist}
              value={selectRoles}
              onChange={(v) => {
                SetSelectRoles(v as number[]);
              }}
            ></Checkbox.Group>
          </Form.Item>
        );
      }}
    ></CommonAdminView>
  );
}
export default MenuAdmin;
