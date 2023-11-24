import { useEffect, useMemo, useState } from "react";
import { UseUserStore } from "@/models/user.store";
import { User, getUserFormConfig, UserStore, getUserTableCols } from "@/entity/user.entity";
import { PowerCode } from "@/entity/power_code";
import { Status } from "@/config";
import { AdminPageUrlInfo } from "@/entity/page.entity";
import { ApiPath } from "@/entity/api_path";
import { RoleStore, useRoleStore } from "@/models/role.store";
import CommonAdminView from "@/components/common_admin_view";
import { GetTableData } from "@/util/table";

function UserAdmin() {
  // console.log("render useradmin");
  const userstore = UseUserStore() as UserStore;
  const role_store = useRoleStore() as RoleStore;
  useEffect(() => {
    role_store.FetchAll();
  }, []);
  const FieldConfigList = useMemo(() => {
    return getUserFormConfig(role_store.items);
  }, [role_store.items]);
  const admin_url_list: AdminPageUrlInfo = useMemo(() => {
    let res: AdminPageUrlInfo = {};
    if (userstore.HaveRight(PowerCode.UserAdd)) res.add = ApiPath.AddUser;
    if (userstore.HaveRight(PowerCode.UserDel)) res.del = ApiPath.DelUser;
    if (userstore.HaveRight(PowerCode.UserQuery)) res.getlist = ApiPath.GetUserList;
    if (userstore.HaveRight(PowerCode.UserUp)) res.up = ApiPath.UpUser;
    // console.log("urls", res, userstore.user_base, userstore.powers, userstore.powersCode);
    return res;
  }, [userstore]);

  return (
    <CommonAdminView<User>
      show_search
      api_urls={admin_url_list}
      get_table_cols={(params) => {
        return getUserTableCols(params);
      }}
      can_del={(data) => data.id != userstore.user_base?.id}
      form_fields={FieldConfigList}
      form_initdata={{ status: Status.Enable, email: "", phone: "", desc: "" } as User}
      get_table_list={GetTableData}
    ></CommonAdminView>
  );
}

export default UserAdmin;
