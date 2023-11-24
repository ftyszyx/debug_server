/* 401 没有权限 */

import { Button } from "antd";
import { useHistory } from "kl_router";

import "./index.less";
import Img from "@/assets/error.gif";

export default function NoPower(): JSX.Element {
  console.log("nopower");
  const history = useHistory();
  const gotoHome = (): void => {
    history.replace("/");
  };

  return (
    <div className="page-error">
      <div>
        <div className="title">401</div>
        <div className="info">你没有访问该页面的权限</div>
        <div className="info">请联系你的管理员</div>
        <Button className="backBtn" type="primary" ghost onClick={gotoHome}>
          返回首页
        </Button>
      </div>
      <img src={Img + `?${Date.now()}`} />
    </div>
  );
}
