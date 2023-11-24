import { useState, useCallback } from "react";
import { Link } from "kl_router";
import { Modal, Input, Layout, Tooltip, Dropdown, Form, message } from "antd";
import { MenuFoldOutlined, FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import { ChromeOutlined, LogoutOutlined, SmileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
const { Header } = Layout;
import { User } from "@/entity/user.entity";
import { AUTHOR, AUTHOR_WEB } from "@/config";
import { ModalType } from "@/entity/page.entity";
import { ChangePassReq } from "@/entity/api.entity";
import { PasswordRules } from "@/util/validate_rule";
import { MyFetchPost } from "@/util/fetch";
import { getValidErrMsg } from "@/util/valid";
import { ApiPath } from "@/entity/api_path";
import Icon from "./icon";

interface Element {
  webkitRequestFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  mozCancelFullScreen?: () => void;
  msRequestFullscreen?: () => void;
  msExitFullscreen?: () => void;
}

interface Props {
  collapsed: boolean; // 菜单的状态
  userinfo: User | null; // 用户信息
  onToggle: () => void; // 菜单收起与展开状态切换
  onLogout: () => void; // 退出登录
}

export default function HeaderCom(props: Props): JSX.Element {
  const [fullScreen, setFullScreen] = useState(false); // 当前是否是全屏状态
  const [change_pass_form] = Form.useForm();
  const [passPanelState, setPassPanelState] = useState<ModalType<ChangePassReq>>({ modalShow: false });
  // 进入全屏
  const requestFullScreen = useCallback(() => {
    const element: HTMLElement & Element = document.documentElement;
    // 判断各种浏览器，找到正确的方法
    const requestMethod =
      element.requestFullscreen || // W3C
      element.webkitRequestFullscreen || // Chrome等
      element.mozRequestFullScreen || // FireFox
      element.msRequestFullscreen; // IE11
    if (requestMethod) {
      requestMethod.call(element);
    }
    setFullScreen(true);
  }, []);

  // 退出全屏
  const exitFullScreen = useCallback(() => {
    // 判断各种浏览器，找到正确的方法
    const element: Document & Element = document;
    const exitMethod =
      element.exitFullscreen || // W3C
      element.mozCancelFullScreen || // firefox
      element.webkitExitFullscreen || // Chrome等
      element.msExitFullscreen; // IE11

    if (exitMethod) {
      exitMethod.call(document);
    }
    setFullScreen(false);
  }, []);

  // 退出登录
  const onMenuClick: MenuProps["onClick"] = (e) => {
    // 退出按钮被点击
    if (e.key === "logout") {
      props.onLogout();
    } else if (e.key === "change_pass") {
      console.log("change panel");
      change_pass_form.resetFields();
      setPassPanelState({ modalShow: true });
    }
  };

  const u = props.userinfo;
  const toggle_style = "py-1 px-1 text-2xl cursor-pointer transition-all";
  return (
    <div>
      <Header className="bg-white p-0 shadow overflow-hidden flex items-center">
        <MenuFoldOutlined
          className={props.collapsed ? toggle_style : toggle_style + " rotate-180"}
          onClick={() => props.onToggle()}
        />
        <div className="flex justify-end items-center flex-auto">
          <Tooltip placement="bottom" title={fullScreen ? "退出全屏" : "全屏"}>
            <div className=" cursor-pointer transition-all text-xl mr-4">
              {fullScreen ? (
                <FullscreenExitOutlined onClick={exitFullScreen} />
              ) : (
                <FullscreenOutlined onClick={requestFullScreen} />
              )}
            </div>
          </Tooltip>
          {u ? (
            <Dropdown
              menu={{
                className: "menu",
                onClick: onMenuClick,
                items: [
                  {
                    key: "change_pass",
                    label: (
                      <>
                        <Icon type="icon-change-password"></Icon>
                        修改密码{" "}
                      </>
                    ),
                  },
                  {
                    key: "logout",
                    label: (
                      <>
                        <LogoutOutlined />
                        退出登录
                      </>
                    ),
                  },
                ],
              }}
              placement="bottomRight"
            >
              <div className="mr-4 cursor-pointer text-xl">
                <SmileOutlined />
                <span className="ml-4">{u.user_name}</span>
              </div>
            </Dropdown>
          ) : (
            <Tooltip placement="bottom" title="点击登录">
              <div className="full all_center">
                <Link to="/user/login">未登录</Link>
              </div>
            </Tooltip>
          )}
        </div>
      </Header>
      {passPanelState.modalShow && (
        <Modal
          open={passPanelState.modalShow}
          title="修改密码"
          onOk={async () => {
            const values = await change_pass_form.validateFields().catch((err) => {
              message.error(getValidErrMsg(err));
            });
            if (values) {
              try {
                await MyFetchPost(ApiPath.ChangeMyPass, { ...values });
                message.success("修改成功");
              } finally {
                setPassPanelState({ modalShow: false, modalLoading: true });
              }
            }
          }}
          onCancel={() => {
            setPassPanelState({ modalShow: false });
          }}
        >
          <Form form={change_pass_form} initialValues={{ new_pass: "" }}>
            <Form.Item name="new_pass" label="新密码" rules={PasswordRules}>
              <Input.Password placeholder="请输入新密码"></Input.Password>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
