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
  ChatRoom = 'chat_room',
}

export enum PowerCodeType {
  Add = 'add',
  Up = 'up',
  See = 'see',
  Del = 'del',
}

export enum EventNameType {
  //chat server
  WebCmdReqEvent = 'chat.debug_cmd_req',

  //debug server
  DebugServerClientConnect = 'debugserver.clientconnect',
  DebugServerClientResp = 'debugserver.clientMsgResp',
}

export enum SocketIoMessageType {
  Debug_cmd_req = 'debug_cmd_req',
  Debug_cmd_rep = 'debug_cmd_resp',

  Join_room = 'join',
  Join_room_resp = 'join_resp',

  leave_room = 'leave',

  Socket_err = 'socket_err',
}
