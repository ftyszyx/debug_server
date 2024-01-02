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

export enum ClientCmdType {
  RESP = 'resp',
  SET = 'set',
}
