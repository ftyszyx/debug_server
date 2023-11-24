import { users } from "./app_data";
import { Md5 } from "md5-typescript";
import { LoginReq, LoginResp, ApiResp, UserListReq, ListResp, AddResp } from "@/entity/api";
import { User } from "@/entity/user";
import { AddResolve, decode, UserTokenDef } from "./app_api";
import { Net_Retcode, MOCK_TOKEN } from "@/config";
import { ApiPath } from "@/entity/api_path";
let id_sequence = 1000;
// 登录
const onLogin = function (req: LoginReq): ApiResp<LoginResp | null> {
  const u = users.find(function (item) {
    return item.username === req.username;
  });
  if (!u) {
    return { status: Net_Retcode.LOGINERR, data: null, message: "该用户不存在" };
  } else if (Md5.init(u.password) !== req.password) {
    return { status: Net_Retcode.LOGINERR, data: null, message: "密码错误" };
  }
  const userdata = { id: u.id, token: MOCK_TOKEN };
  const user_token = JSON.stringify(userdata);
  return {
    status: Net_Retcode.SUCCESS,
    data: { ...u, token: user_token },
    message: "登录成功",
  };
};
const getUserInfo = function (token: string): ApiResp<User | null> {
  const usertoken = JSON.parse(token) as UserTokenDef;
  const u = users.find(function (item) {
    return item.id == usertoken.id;
  });
  if (!u) {
    return { status: Net_Retcode.NEEDLOGIN, data: null, message: "请先登陆" };
  }
  return {
    status: Net_Retcode.SUCCESS,
    data: { ...u },
    message: "登录成功",
  };
};
// 条件分页查询用户列表
const getUserList = function (p: UserListReq): ApiResp<ListResp<User>> {
  const map = users.filter(function (item) {
    let yeah = true;
    const username = decode(p.username);
    const status = p.status;
    if (username && !item.username.includes(username)) {
      yeah = false;
    }
    if (status && item.status != status) {
      yeah = false;
    }
    return yeah;
  });
  const pageNum = p.pageNum; // 从第1页开始
  const pageSize = p.pageSize;
  const res = map.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  return {
    status: 200,
    data: { list: res, total: map.length },
    message: "success",
  };
};
// 添加用户
const addUser = function (p: User): ApiResp<AddResp> {
  p.id = ++id_sequence;
  users.push(p);
  return { status: 200, data: { id: id_sequence }, message: "success" };
};
// 修改用户
const upUser = function (p: User): ApiResp<null> {
  const oldIndex = users.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    const news = Object.assign({}, users[oldIndex], p);
    users.splice(oldIndex, 1, news);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 删除用户
const delUser = function (p: Pick<User, "id">): ApiResp<null> {
  const oldIndex = users.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    users.splice(oldIndex, 1);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
export const initUser = () => {
  AddResolve(ApiPath.Login, onLogin);
  AddResolve(ApiPath.GetUserInfo, getUserInfo);
  AddResolve(ApiPath.GetUserList, getUserList);
  AddResolve(ApiPath.AddUser, addUser);
  AddResolve(ApiPath.UpUser, upUser);
  AddResolve(ApiPath.DelUser, delUser);
};
