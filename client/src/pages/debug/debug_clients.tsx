import { useEffect, useMemo } from "react";
import { UseUserStore } from "@/models/user.store";
import { UserStore } from "@/entity/user.entity";
import { PowerCode } from "@/entity/power_code";
import { AdminPageUrlInfo } from "@/entity/page.entity";
import { ApiPath } from "@/entity/api_path";
import CommonAdminView from "@/components/common_admin_view";
import { GetTableData } from "@/util/table";
import { DebugClient, getDebugClientsFormConfig, getDebugClientsTalbeCols } from "@/entity/debug_client.entity";
export default function DebugClients() {
  const userStore = UseUserStore() as UserStore;
  useEffect(() => {}, []);
  const FieldConfigList = useMemo(() => {
    return getDebugClientsFormConfig();
  }, []);
  const admin_url_list: AdminPageUrlInfo = useMemo(() => {
    let res: AdminPageUrlInfo = {};
    if (userStore.HaveRight(PowerCode.DebugClientQuery)) res.getlist = ApiPath.getClientLists;
    if (userStore.HaveRight(PowerCode.DebugClientUp)) res.up = ApiPath.upDebugClient;
    return res;
  }, [userStore]);
  return (
    <CommonAdminView<DebugClient>
      show_search
      api_urls={admin_url_list}
      get_table_cols={(params) => {
        return getDebugClientsTalbeCols(params);
      }}
      can_del={(_data) => false}
      form_fields={FieldConfigList}
      get_table_list={GetTableData}
    ></CommonAdminView>
  );
}
