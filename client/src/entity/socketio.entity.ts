export enum SocketIoMessageType {
  Debug_cmd_req = "debug_cmd_req",
  Debug_cmd_rep = "debug_cmd_resp",

  Join_room = "join",
  Join_room_resp = "join_resp",
  leave_room = "leave",

  Socket_err = "socket_err",
}

export interface chatLogErr {
  msg: string;
  code: number;
}
export interface JoinRoomReq {
  guid: string;
  nick: string;
}

export interface JoinRoomResp {
  room_id: number;
}
export interface ClientReq {
  cmd: string;
  param: string;
}
export interface WebClientReq extends ClientReq {
  client_guid: string;
  room_id: number;
}

export interface WebClientResp {
  from_guid: string;
  text: string;
  room_id: number;
}
