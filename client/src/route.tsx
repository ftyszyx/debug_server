import React from "react";
import BasicLayout from "@/layouts/BasicLayout";
import Loading from "@/components/loading";
import { BrowerRouter, Route } from "kl_router";
import NotFound from "@/pages/errpages/404";
import NoPower from "@/pages/errpages/401";
import { ChildProps } from "@/entity/other.entity";
import { PagePath } from "@/entity/api_path";

const [Home, Login, MenuAdmin, PowerAdmin, RoleAdmin, UserAdmin] = [
  () => import("@/pages/system/home"),
  () => import("@/pages/auth/login"),
  () => import("@/pages/system/menu_admin"),
  () => import("@/pages/system/power_admin"),
  () => import("@/pages/system/role_admin"),
  () => import("@/pages/system/user_admin"),
].map((item: any) => {
  const TmpLoad = React.lazy(item);
  return (
    <React.Suspense fallback={<Loading />}>
      <TmpLoad />
    </React.Suspense>
  );
});
const RootLayout = (props: ChildProps) => {
  return <BasicLayout>{props.children}</BasicLayout>;
};
const RootRouter = () => {
  return (
    <BrowerRouter debug={false}>
      <Route>
        <Route path={PagePath.Login} element={Login} match={{ end: true }}></Route>
        <Route path="/" element={RootLayout} errorElement={NotFound}>
          <Route path="/" redirect={PagePath.AdminHome} match={{ end: true }} />
          <Route path={PagePath.AdminHome} element={Home} />
          <Route path={PagePath.AdminMenu} element={MenuAdmin} />
          <Route path={PagePath.AdminPower} element={PowerAdmin} />
          <Route path={PagePath.AdminRole} element={RoleAdmin} />
          <Route path={PagePath.AdminUser} element={UserAdmin} />
          <Route path={PagePath.Err404} element={NoPower} />
          <Route path={PagePath.Err401} element={NotFound} />
        </Route>
      </Route>
    </BrowerRouter>
  );
};
export default RootRouter;
