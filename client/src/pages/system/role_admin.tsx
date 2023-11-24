import { useEffect, useMemo } from "react";
import { UserStore } from "@/entity/user.entity";
import { PowerCode } from "@/entity/power_code";
import { SUPER_POWER_ROLE, Status } from "@/config";
import { AdminPageUrlInfo } from "@/entity/page.entity";
import { ApiPath } from "@/entity/api_path";
import CommonAdminView from "@/components/common_admin_view";
import { MenuStore, PowerStore, RoleStore, UseMenuStore, UseUserStore, usePowerStore, useRoleStore } from "@/models";
import { Role, getRoleFormConfig, getRoleTalbeCols } from "@/entity/role.entity";
import { GetCommonTree, GetPowerTree } from "@/util/tree";
import { GetTableData } from "@/util/table";
function RoleAdmin() {
  console.log("render roleAdmin");
  const userstore = UseUserStore() as UserStore;
  // const role_store = useRoleStore() as RoleStore;
  const menu_store = UseMenuStore() as MenuStore;
  const power_store = usePowerStore() as PowerStore;
  useEffect(() => {
    menu_store.FetchAll();
    power_store.FetchAll();
  }, []);
  const menu_treeinfo = useMemo(() => {
    const res = GetCommonTree(menu_store.items.filter((x) => x.status == Status.Enable));
    return res;
  }, [menu_store.items]);
  const power_treeinfo = useMemo(() => {
    const res = GetPowerTree(power_store.items.filter((x) => x.status == Status.Enable));
    return res;
  }, [power_store.items]);
  const FieldConfigList = useMemo(() => {
    return getRoleFormConfig(menu_treeinfo, power_treeinfo);
  }, [menu_treeinfo, power_treeinfo]);
  const admin_url_list: AdminPageUrlInfo = useMemo(() => {
    let res: AdminPageUrlInfo = {};
    if (userstore.HaveRight(PowerCode.RoleAdd)) res.add = ApiPath.AddRole;
    if (userstore.HaveRight(PowerCode.RoleDel)) res.del = ApiPath.DelRole;
    if (userstore.HaveRight(PowerCode.RoleQuery)) res.getlist = ApiPath.GetRoles;
    if (userstore.HaveRight(PowerCode.RoleUp)) res.up = ApiPath.UpRole;
    return res;
  }, [userstore]);

  return (
    <CommonAdminView<Role>
      api_urls={admin_url_list}
      get_table_cols={(params) => {
        return getRoleTalbeCols(params);
      }}
      can_del={(data) => data.id != SUPER_POWER_ROLE}
      form_fields={FieldConfigList}
      form_initdata={{ status: Status.Enable, sorts: 1, desc: "" } as Role}
      get_table_list={GetTableData}
    ></CommonAdminView>
  );
}

export default RoleAdmin;
