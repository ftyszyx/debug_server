import { Net_Retcode } from "../config";
import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";
import { GetToken } from "./tools.js";
import { PagePath } from "@/entity/api_path.js";
// import Mock from "better-mock";
// //@ifdef dev
// import mock from "../../mock/app_api";
// if (import.meta.env.DEV) {
//   Mock.mock(/\/api.*/, (options: any) => {
//     const res = mock(options);
//     return res;
//   });
// }
// //@endif
const api_url: string = import.meta.env.API_URL;
export const MyFetch = axios.create({
  baseURL: api_url,
  timeout: 0,
  withCredentials: false, //请求是否带上cookie
});

export const MyFetchGet = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return MyFetch.get(url, config);
};
export const MyFetchPost = <T, DataT>(url: string, data?: DataT, config?: AxiosRequestConfig): Promise<T> => {
  return MyFetch.post(url, data, config);
};

// 请求是否带上cookie
MyFetch.interceptors.request.use(
  (req) => {
    console.log("fetch req ", req.method, req.url, req.data);
    req.headers["Content-Type"] = "application/json";
    req.headers["Authorization"] = `Bearer ${GetToken()}`;
    //加载中
    return req;
  },
  (error) => {
    console.trace(error);
    Promise.reject(error);
  }
);
// 对返回的结果做处理
MyFetch.interceptors.response.use(
  (response) => {
    console.log("fetch res:", response.config.url, response.data, window.location.href, window.location.pathname);
    const pathname = window.location.pathname;
    const res_data = response.data;
    const code = res_data?.code;
    // 没有权限，登录超时，登出，跳转登录
    if (code === Net_Retcode.NEEDLOGIN || code === Net_Retcode.Unauthorized) {
      if (pathname != PagePath.Login) {
        message.error("登录超时，请重新登录");
        setTimeout(() => {
          console.log("path to login");
          window.location.href = PagePath.Login;
        }, 1500);
      }
    } else if (code == Net_Retcode.SUCCESS) {
      // console.log("success");
      return response.data.data;
    } else if (code == Net_Retcode.NO_POWER) {
      message.error("没有权限");
    } else {
      message.error(res_data?.message);
    }
    return Promise.reject(new Error(res_data?.message));
  },
  (error) => {
    console.trace("reponse err:", error);
    return Promise.reject(error);
  }
);

// export default MyFetch;
