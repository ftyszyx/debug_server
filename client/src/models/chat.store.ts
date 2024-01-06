import { ChatLogMoreReq, ChatLogMoreResp } from "@/entity/api.entity";
import { ApiPath } from "@/entity/api_path";
import { ChatLog } from "@/entity/chat_log.entity";
import { MyFetchPost } from "@/util/fetch";
import { create } from "kl_state";

export interface ChatConverSationType {
  room_id: number;
  logs: ChatLog[];
  logsDic: Map<number, ChatLog>;
  total: number;
}
export interface ChatLogStoreType {
  conversations: ChatConverSationType[];
  conversation_map: Map<number, ChatConverSationType>;
  getMore: (roomid: number, new_or_old: boolean) => Promise<void>;
  getLogsByRoomid: (roomid: number) => ChatConverSationType;
}

export const useChatStore = create<ChatLogStoreType>((set, get) => {
  function addLog(roomInfo: ChatConverSationType, logitem: ChatLog) {
    if (roomInfo.logsDic.has(logitem.id)) return;
    roomInfo.logs.push(logitem);
    roomInfo.logsDic.set(logitem.id, logitem);
  }
  let ret: ChatLogStoreType = {
    conversation_map: new Map<number, ChatConverSationType>(),
    conversations: [],
    getLogsByRoomid(room_id: number) {
      if (this.conversation_map.has(room_id) == false) {
        const info: ChatConverSationType = {
          room_id,
          logs: [],
          logsDic: new Map<number, ChatLog>(),
          total: 0,
        };
        let items = get().conversations;
        let item_map = get().conversation_map;
        item_map.set(room_id, info);
        items.push(info);
      }
      return get().conversation_map.get(room_id)!;
    },

    async getMore(room_id: number, new_or_old: boolean) {
      console.log("get more", room_id, new_or_old);
      const info = get().getLogsByRoomid(room_id);
      const req_data: ChatLogMoreReq = {
        limit_num: 10,
        room_id,
        target_id: 0,
        new_or_old,
      };
      if (info.logs.length > 0) {
        if (new_or_old) {
          req_data.target_id = info.logs[info.logs.length - 1].id;
        } else {
          req_data.target_id = info.logs[0].id;
        }
      }
      const res = await MyFetchPost<ChatLogMoreResp, ChatLogMoreReq>(ApiPath.getChatLogMore, req_data);
      res.logs.forEach((item) => {
        addLog(info, item);
      });
      info.total = res.total;
      info.logs.sort((a, b) => {
        return a.id - b.id;
      });
      console.log("chat logs", info.logs);
      set((state) => {
        return { ...state };
      });
    },
  };

  return ret;
});
