import { ChatLogMoreReq, ChatLogMoreResp } from "@/entity/api.entity";
import { ApiPath } from "@/entity/api_path";
import { ChatLog } from "@/entity/chat_log.entity";
import { MyFetchPost } from "@/util/fetch";
import { create } from "kl_state";

export interface ChatConverSationType {
  room_id: number;
  logs: ChatLog[];
  total: number;
  old_time: string;
  new_time: string;
}
export interface ChatLogStoreType {
  conversations: ChatConverSationType[];
  conversation_map: Map<number, ChatConverSationType>;
  getMore: (roomid: number, forece_new?: boolean) => Promise<void>;
  getLogsByGuid: (roomid: number) => ChatConverSationType;
  addMessage: (roomid: number, log: ChatLog) => void;
}

export const useChatStore = create<ChatLogStoreType>((set, get) => {
  let ret: ChatLogStoreType = {
    conversation_map: new Map<number, ChatConverSationType>(),
    conversations: [],
    getLogsByGuid(room_id: number) {
      if (this.conversation_map.has(room_id) == false) {
        const info: ChatConverSationType = {
          room_id,
          logs: [],
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
      const info = get().getLogsByGuid(room_id);
      const req_data: ChatLogMoreReq = {
        end_time: info.old_time,
        start_time: "",
        num: 20,
        room_id,
      };
      if (forece_new) {
        req_data.end_time = "";
        req_data.start_time = info.new_time;
      }
      const res = await MyFetchPost<ChatLogMoreResp, ChatLogMoreReq>(ApiPath.getChatLogMore, req_data);
      res.logs.forEach((item) => {
        info.logs.push(item);
      });
      info.total = res.total;
      info.logs.sort((a, b) => {
        const timea = Date.parse(a.create_time);
        const timeb = Date.parse(b.create_time);
        return timeb - timea;
      });
      if (info.logs.length > 0) {
        info.old_time = info.logs[info.logs.length - 1].create_time;
        info.new_time = info.logs[0].create_time;
      }
      set((state) => {
        return { ...state };
      });
    },

    addMessage(room_id, log) {
      const info = get().getLogsByGuid(room_id);
      if (info.new_time == "") {
        info.logs.push(log);
      } else {
        const time_new = Date.parse(info.new_time);
        const add_tiem = Date.parse(log.create_time);
        if (add_tiem < time_new) return;
        info.logs.push(log);
      }
      set((state) => {
        return { ...state };
      });
    },
  };

  return ret;
});
