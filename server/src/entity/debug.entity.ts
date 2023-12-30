export interface ClientReq {
  cmd: string;
  param: string;
}

export interface WebClientReq extends ClientReq {
  client_guid: string;
  from_user_id: number;
}

export interface WebClientResp {
  from_guid: string;
  to_user_id: number;
  text: string;
}

export enum ClientCmdType {
  RESP = 'resp',
  SET = 'set',
}
