/** 权限管理页 **/
import { useState, useMemo, useEffect } from "react";
import { UseUserStore } from "@/models/user.store";
import { UserStore } from "@/entity/user.entity";
import { AdminPageUrlInfo, OperateCode } from "@/entity/page.entity";
import { RoleStore, useRoleStore } from "@/models/role.store";
import { Power, getPowerFormList, getPowerTableCols } from "@/entity/power.entity";
import { PowerCode } from "@/entity/power_code";
import { ApiPath } from "@/entity/api_path";
import { Status } from "@/config";
import { PowerStore, usePowerStore } from "@/models/power.store";
import CommonAdminView from "@/components/common_admin_view";
import { Checkbox, Form, message } from "antd";
import { GetPowerTree, TreeNodeType } from "@/util/tree";
import { MyFetchPost } from "@/util/fetch";
import { UpRolePowerReq } from "@/entity/api.entity";
function PowerAdmin() {
  const userstore = UseUserStore() as UserStore;
  const power_store = usePowerStore() as PowerStore;
  const role_store = useRoleStore() as RoleStore;
  const [selectRoles, SetSelectRoles] = useState<number[]>([]);
  useEffect(() => {
    role_store.FetchAll();
    power_store.FetchAll();
  }, []);
  const initselectRoles = (data: Power) => {
    // console.log("initselec", data, role_store.items);
    const role_ids = role_store.items.reduce((res: number[], item) => {
      if (item.powers?.includes(data!.id)) {
        res.push(item.id);
      }
      return res;
    }, []);
    // console.log("selectids", role_ids);
    SetSelectRoles(role_ids);
  };

  const role_selectlist = useMemo(() => {
    return role_store.getCheckBoxItems();
  }, [role_store]);
  const FieldConfigList = useMemo(() => {
    return getPowerFormList();
  }, []);
  const admin_url_list: AdminPageUrlInfo = useMemo(() => {
    let res: AdminPageUrlInfo = {};
    if (userstore.HaveRight(PowerCode.PowerAdd)) res.add = ApiPath.AddPower;
    if (userstore.HaveRight(PowerCode.PowerDel)) res.del = ApiPath.DelPower;
    if (userstore.HaveRight(PowerCode.PowerQuery)) res.all = ApiPath.getAllPowers;
    if (userstore.HaveRight(PowerCode.PowerUp)) res.up = ApiPath.UpPower;
    return res;
  }, [userstore]);
  return (
    <CommonAdminView<Power>
      api_urls={admin_url_list}
      get_table_cols={(params) => {
        return getPowerTableCols(params);
      }}
      form_fields={FieldConfigList}
      form_initdata={{ status: Status.Enable, desc: "", sorts: 1 } as Power}
      can_del={(_data) => {
        let _data2 = _data as TreeNodeType<Power>;
        if (_data2.fake && _data2.fake) return false;
        return userstore.HaveRight(PowerCode.PowerDel);
      }}
      can_edit={(_data) => {
        let _data2 = _data as TreeNodeType<Power>;
        if (_data2.fake && _data2.fake) return false;
        return true;
      }}
      hooks={{
        async after_getdata(datalist) {
          await power_store.setItems(datalist);
        },
        before_editpanel_show(op_type, data) {
          if (op_type == OperateCode.Add) {
            SetSelectRoles([]);
          } else {
            initselectRoles(data!);
          }
        },
        async after_editpanel_operate(op_type, data) {
          console.log("after_edit", op_type, data);
          if (op_type == OperateCode.Add || op_type == OperateCode.Up) {
            await MyFetchPost<any, UpRolePowerReq>(ApiPath.UpRolePower, { power_id: data.id, role_ids: selectRoles }).catch(
              (err) => {
                message.error(err);
              }
            );
            role_store.FetchAll(true);
          }
        },
      }}
      get_table_list={(datas) => {
        const treeinfo = GetPowerTree(datas);
        const res = treeinfo.trees;
        return res as Power[];
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
export default PowerAdmin;
