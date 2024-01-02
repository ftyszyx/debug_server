export interface ChatLog {
  id: number;
  create_time: string;
  from_user: string;
  to_users: string[];
  text: string;
}

export interface ChatLogMoreResp {
  logs: ChatLog[];
  total: number;
}
