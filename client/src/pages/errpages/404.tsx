/* 404 NotFound */

import { useHistory } from "kl_router";
import { Button } from "antd";
import Img from "@/assets/error.gif";

import "./index.less";

export default function NotFound() {
  console.log("nofound");
  const navigate = useHistory();
  const gotoHome = (): void => {
    navigate.replace("/");
  };
  return (
    <div className="page-error">
      <div>
        <div className="title">404</div>
        <div className="info">Oh dear</div>
        <div className="info">这里什么也没有</div>
        <Button className="backBtn" type="primary" ghost onClick={gotoHome}>
          返回首页
        </Button>
      </div>
      <img src={Img + `?${Date.now()}`} />
    </div>
  );
}
