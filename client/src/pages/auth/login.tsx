import { useState } from "react";
import { Form, Input, message, Button } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { useHistory } from "kl_router";
import LogoImg from "@/assets/logo.png";
import { UseUserStore } from "@/models/user.store";
import { MyFetchPost } from "@/util/fetch";
import { Guest_password, Guest_username, SystemName } from "@/config";
import { UserStore } from "@/entity/user.entity";
import { ApiPath } from "@/entity/api_path";
import { LoginReq, LoginResp } from "@/entity/api.entity";

function Login() {
  const history = useHistory();
  console.log("render login", history);
  const userstore = UseUserStore() as UserStore;
  const [login_form] = Form.useForm<LoginReq>();
  const [loading, setLoading] = useState(false); // 是否正在登录中

  const LoginIn = async (user_name: string, password: string) => {
    const res = await MyFetchPost<LoginResp, LoginReq>(ApiPath.Login, {
      user_name,
      password,
    });
    userstore.Login(res);
    return await userstore.FetchUserDetail();
  };

  const onSubmit = async (): Promise<void> => {
    const values = await login_form.validateFields();
    await doLogin({ ...values });
  };

  async function doLogin(params: LoginReq) {
    try {
      const { user_name, password } = params;
      setLoading(true);
      const res = await LoginIn(user_name, password);
      message.success("登录成功");
      userstore.SetData(res);
      history.replace("/"); // 跳转到主页
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white">
          <img className="w-8 h-8 mr-2" src={LogoImg} alt="logo" />
          {SystemName}
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">登陆</h1> */}
            <Form form={login_form}>
              <div>
                <Form.Item
                  name="user_name"
                  rules={[
                    { max: 12, message: "最大长度为12位字符" },
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入用户名",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined style={{ fontSize: 13 }} />}
                    size="large"
                    id="username" // 为了获取焦点
                    placeholder="请输入用户名"
                    onPressEnter={onSubmit}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "请输入密码" },
                    { max: 18, message: "最大长度18个字符" },
                  ]}
                >
                  <Input
                    prefix={<KeyOutlined style={{ fontSize: 13 }} />}
                    size="large"
                    type="password"
                    placeholder=""
                    onPressEnter={onSubmit}
                  />
                </Form.Item>
                <div className="leading-10">
                  <Button className="w-full" size="large" type="primary" loading={loading} onClick={onSubmit}>
                    {loading ? "请稍后" : "登录"}
                  </Button>
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  没有账号？
                  <Button
                    type="link"
                    onClick={async () => {
                      await doLogin({ user_name: Guest_username, password: Guest_password });
                    }}
                  >
                    直接进入
                  </Button>
                  {/* <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500"></a> */}
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
