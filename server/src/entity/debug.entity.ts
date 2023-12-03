import { ApiResp } from './api.entity';

export interface ClientReq {
  cmd: string;
  param: string;
}

export interface WebClientReq extends ClientReq {
  client_id: number;
  from_user_id: number;
}

export interface WebClientResp extends ApiResp<string> {}
