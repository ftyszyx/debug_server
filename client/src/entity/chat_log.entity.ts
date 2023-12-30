export interface ChatLog {
  id: number;
  create_time: string;
  from_user: string;
  to_users: string[];
  text: string;
}

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
