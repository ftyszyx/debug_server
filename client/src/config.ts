// export const baseURL = "http://127.0.0.1:3000";
export const baseURL = "";
export enum Net_Retcode {
  SUCCESS = 200,
  NEEDLOGIN = 23,
  Unauthorized = 401,
  LOGINERR = 204,
  ERR = 205,
  NO_POWER = 403,
}
export enum Status {
  Enable = 1,
  Disable = 0,
}

export const MenuParamNull = "null";
export const Debug = false;
export const MOCK_TOKEN = "dddddddssff";
export const TOKEN_KEY = "Authorizaion";
export const SUPER_POWER_ROLE = 1;
export const AUTHOR = "zyx";
export const AUTHOR_WEB = "www.baidu.com";
export const SystemName = "系统";
export const Guest_username = "guest";
export const Guest_password = "123456";

export const SOCKETIO_DEBUGCMD_REQ = "debug_cmd_req";
export const SOCKETIO_DEBUGCMD_RESP = "debug_cmd_resp";

export const SOCKET_IO_URL = import.meta.env.VITE_SOCKET_URL;
export const API_URL = import.meta.env.VITE_API_URL;
