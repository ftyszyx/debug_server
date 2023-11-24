import { useState, useEffect } from "react";
import { useHistory } from "kl_router";
import { Layout, message } from "antd";
import Header from "@/components/admin_header";
import MenuCom from "@/components/admin_menu";
import Footer from "@/components/admin_footer";
import Bread from "@/components/admin_bread";
import { UseUserStore } from "../models/user.store";
import { ChildProps } from "@/entity/other.entity";
import { UserStore } from "@/entity/user.entity";
import { GetToken } from "@/util/tools";
import { PagePath } from "@/entity/api_path";
const { Content } = Layout;
// ==================
// 本组件
// ==================
function BasicLayout(props: ChildProps): JSX.Element {
  // console.log("render basic layout");
  const userstore = UseUserStore() as UserStore;
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false); // 菜单栏是否收起
  useEffect(() => {
    async function fetchdata() {
      const token_value = GetToken();
      // console.log("get token", token_value);
      if (token_value) {
        const logindata = await FetchUserInfo();
        userstore.SetData(logindata);
      } else {
        console.log("path push to login");
        window.location.href = PagePath.Login;
        // history.push(PagePath.Login);
      }
    }
    fetchdata().catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const FetchUserInfo = async () => {
    return await userstore.FetchUserDetail();
  };
  // 退出登录
  const onLogout = () => {
    // console.log("onloginout");
    userstore.LoginOut();
    message.success("退出成功");
    // console.log("path push to login");
    history.push(PagePath.Login);
  };

  return (
    <Layout className="w-full min-h-screen" hasSider>
      <MenuCom data={userstore.menus} collapsed={collapsed} />
      <Layout>
        <Header
          collapsed={collapsed}
          userinfo={userstore.user_base}
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={onLogout}
        />
        <Bread menus={userstore.menus} />
        <Content className="mx-1 my-0 mr-0 p-0 bg-white h-full min-h-[280px]">{props.children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
