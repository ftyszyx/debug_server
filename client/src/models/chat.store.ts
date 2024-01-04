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
  old_time: string;
  new_time: string;
}
export interface ChatLogStoreType {
  conversations: ChatConverSationType[];
  conversation_map: Map<number, ChatConverSationType>;
  getMore: (roomid: number, forece_new?: boolean) => Promise<void>;
  getLogsByGuid: (roomid: number) => ChatConverSationType;
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
    getLogsByGuid(room_id: number) {
      if (this.conversation_map.has(room_id) == false) {
        const info: ChatConverSationType = {
          room_id,
          logs: [],
          logsDic: new Map<number, ChatLog>(),
          old_time: "",
          new_time: "",
          total: 0,
        };
        let items = get().conversations;
        let item_map = get().conversation_map;
        item_map.set(room_id, info);
        items.push(info);
      }
      return get().conversation_map.get(room_id)!;
    },

    async getMore(room_id: number, forece_new = false) {
      console.log("get more", room_id, forece_new);
      const info = get().getLogsByGuid(room_id);
      const req_data: ChatLogMoreReq = {
        end_time: info.old_time,
        start_time: "",
        num: 10,
        room_id,
      };
      if (forece_new) {
        req_data.end_time = "";
        req_data.start_time = info.new_time;
      }
      const res = await MyFetchPost<ChatLogMoreResp, ChatLogMoreReq>(ApiPath.getChatLogMore, req_data);
      console.log("get more res", res);
      res.logs.forEach((item) => {
        addLog(info, item);
      });
      console.log("get more logs", info.logs);
      info.total = res.total;
      info.logs.sort((a, b) => {
        // const timea = Date.parse(a.create_time);
        // const timeb = Date.parse(b.create_time);
        // return timea - timeb;
        return a.id - b.id;
      });
      if (info.logs.length > 0) {
        info.old_time = info.logs[info.logs.length - 1].create_time;
        info.new_time = info.logs[0].create_time;
      }
      set((state) => {
        return { ...state };
      });
    },
  };

  return ret;
});
