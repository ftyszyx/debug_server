export const TOKEN_KEY = 'Authorization';

export enum Net_Retcode {
  SUCCESS = 200,
  NEEDLOGIN = 23,
  LOGINERR = 204,
  ERR = 205,
}
export enum Status {
  Enable = 1,
  Disable = 0,
}
export enum RoleType {
  Guest = 4,
  User = 3,
  Admin = 2,
  SuperAdmin = 1,
}
export enum ModuleType {
  User = 'user',
  Role = 'role',
  Power = 'power',
  Menu = 'menu',
  Debug_client = 'debug_client',
  Log = 'log',
  ChatLog = 'chat_log',
}

export enum PowerCodeType {
  Add = 'add',
  Up = 'up',
  See = 'see',
  Del = 'del',
}

export enum EventNameType {
  //chat server
  ChatCmdEvnet = 'chat.debug_cmd',

  //debug server
  DebugServerClientConnect = 'debugserver.clientconnect',
  DebugServerClientResp = 'debugserver.clientMsgResp',
}

export enum SocketIoMessageType {
  Debug_cmd_req = 'debug_cmd',
}
