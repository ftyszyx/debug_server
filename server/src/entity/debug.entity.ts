import { ApiResp } from './api.entity';

export interface ClientReq {
  cmd: string;
  param: string;
}

export interface WebClientReq extends ClientReq {
  client_guid: string;
  from_user_id: number;
}

export interface WebClientResp extends ApiResp<string> {}

export enum ClientCmdType {
  RESP = 'resp',
  SET = 'set',
}
