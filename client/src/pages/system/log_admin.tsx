import { useEffect, useMemo } from "react";
import { UseUserStore } from "@/models/user.store";
import { UserStore } from "@/entity/user.entity";
import { PowerCode } from "@/entity/power_code";
import { AdminPageUrlInfo } from "@/entity/page.entity";
import { ApiPath } from "@/entity/api_path";
import CommonAdminView from "@/components/common_admin_view";
import { GetTableData } from "@/util/table";
import { MyLog, getLogFormConfig, getLogTalbeCols } from "@/entity/log.entity";
export default function LogAdmin() {
  const userStore = UseUserStore() as UserStore;
  useEffect(() => {}, []);
  const FieldConfigList = useMemo(() => {
    return getLogFormConfig();
  }, []);
  const admin_url_list: AdminPageUrlInfo = useMemo(() => {
    let res: AdminPageUrlInfo = {};
    if (userStore.HaveRight(PowerCode.LogQuery)) res.getlist = ApiPath.getLogList;
    return res;
  }, [userStore]);
  return (
    <CommonAdminView<MyLog>
      show_search
      api_urls={admin_url_list}
      get_table_cols={(params) => {
        return getLogTalbeCols(params);
      }}
      can_del={(_data) => false}
      form_fields={FieldConfigList}
      get_table_list={GetTableData}
    ></CommonAdminView>
  );
}
