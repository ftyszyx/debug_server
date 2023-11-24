import { Net_Retcode, Debug, MOCK_TOKEN, TOKEN_KEY } from "@/config";
import { ApiResp, IdItem } from "@/entity/api";
import { initMenu } from "./menu_api";
import { initRole } from "./role_api";
import { initUser } from "./user_api";
import { initPower } from "./power_api";
const NoAuthPath = ["/api/login"];
type ResolveCallback = (req: any) => ApiResp<any>;
const ResolveSet = new Map<String, ResolveCallback>();
export function AddResolve(path: String, callback: ResolveCallback) {
  ResolveSet.set(path, callback);
}
export enum RequestType {
  POST = "POST",
  GET = "GET",
}
export interface RequestInfo {
  url: string;
  type: RequestType;
  body: any;
  headers: Record<string, string>;
}
export interface UserTokenDef {
  id: number;
  token: string;
}

export const decode = function (str: string) {
  if (!str) {
    return str;
  }
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
};
export const checkLogin = function (token: string) {
  if (!token) {
    return false;
  }
  const tokeninfo = JSON.parse(token) as UserTokenDef;
  if (tokeninfo.token == MOCK_TOKEN) return true;
  return false;
};

export type IDSReq = { id: number[] | number };
export type hookBefore<T> = (item: T) => { ok: boolean; msg?: string };
export type hookBefore2<T> = (item: T) => void;
// 获取菜单（根据ID）
export const FindById = function <T extends IdItem>(values: T[], p: IDSReq, hook: hookBefore2<T> | null): ApiResp<T[]> {
  let res: T[] = [];
  if (p.id instanceof Array) {
    const ids = p.id as number[];
    res = values.filter(function (item) {
      return ids.includes(item.id!);
    });
  } else {
    const t = values.find(function (item) {
      return item.id === p.id;
    });
    if (t != null) res.push(t);
  }
  if (hook != null) {
    res.map((item) => hook(item));
  }
  return { status: Net_Retcode.SUCCESS, data: res, message: "success" };
};

export const Update = function <T extends IdItem>(values: T[], p: T): ApiResp<null> {
  const oldIndex = values.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    const news = Object.assign({}, values[oldIndex], p);
    values.splice(oldIndex, 1, news);
    return { status: Net_Retcode.SUCCESS, data: null, message: "success" };
  } else {
    return { status: Net_Retcode.ERR, data: null, message: "未找到该条数据" };
  }
};

export const Delete = function <T extends IdItem>(values: T[], p: IdItem, hook: hookBefore<T> | null): ApiResp<null> {
  const oldIndex = values.findIndex(function (item) {
    return item.id === p.id;
  });

  if (oldIndex !== -1) {
    if (hook != null) {
      const res = hook(values[oldIndex]);
      if (res.ok == false) {
        return { status: Net_Retcode.ERR, data: null, message: res.msg };
      }
    }
    values.splice(oldIndex, 1);
    return { status: Net_Retcode.SUCCESS, data: null, message: "success" };
  } else {
    return { status: Net_Retcode.ERR, data: null, message: "未找到该条数据" };
  }
};
export default function (obj: RequestInfo) {
  if (ResolveSet.size == 0) {
    initMenu();
    initUser();
    initPower();
    initRole();
  }
  const url = obj.url;
  const body = obj.body;
  const headers = obj.headers;
  let params = typeof body === "string" ? JSON.parse(body) : body;
  let path = url;
  // 是get请求 解析参数
  if (url.includes("?")) {
    path = url.split("?")[0];
    const s = url.split("?")[1].split("&"); // ['a=1','b=2']
    params = {};
    for (let i = 0; i < s.length; i++) {
      if (s[i]) {
        const ss = s[i].split("=");
        params[ss[0]] = ss[1];
      }
    }
  }
  if (path.includes("http")) {
    path = path.replace(globalThis.location.protocol + "//" + globalThis.location.hostname, "");
  }
  const token = headers[TOKEN_KEY];
  if (Debug) console.info("请求接口：", path, params, headers);
  if (NoAuthPath.includes(path) == false) {
    if (checkLogin(token) == false) {
      return {
        status: Net_Retcode.NEEDLOGIN,
        data: null,
        message: "need login",
      };
    }
  }
  const resolveFunc = ResolveSet.get(path);
  if (resolveFunc) {
    if (path == "/api/getUserInfo") {
      return resolveFunc(token);
    }
    return resolveFunc(params);
  }
  return { status: 404, data: null, message: "无效请求" };
}
