export interface ChatRoom {
  id: number;
  name: string;
  nick: string;
  users: string[];
  create_time: string;
}

export interface GetChatRoomReq {
  room_id: number;
}
