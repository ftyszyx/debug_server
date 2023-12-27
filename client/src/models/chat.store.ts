import { ChatLogMoreReq, ChatLogMoreResp } from "@/entity/api.entity";
import { ApiPath } from "@/entity/api_path";
import { ChatLog } from "@/entity/chat_log.entity";
import { MyFetchPost } from "@/util/fetch";
import { create } from "kl_state";

export interface ChatConverSationType {
  guid: string;
  logs: ChatLog[];
  total: number;
  old_time: string;
  new_time: string;
}
export interface ChatLogStoreType {
  conversations: ChatConverSationType[];
  conversation_map: Map<string, ChatConverSationType>;
  getMore: (guid: string, forece_new?: boolean) => Promise<void>;
  getLogsByGuid: (guid: string) => ChatConverSationType;
  addMessage: (guid: string, log: ChatLog) => void;
}

export const useChatStore = create<ChatLogStoreType>((set, get) => {
  let ret: ChatLogStoreType = {
    conversation_map: new Map<string, ChatConverSationType>(),
    conversations: [],
    getLogsByGuid(guid: string) {
      if (this.conversation_map.has(guid) == false) {
        const info: ChatConverSationType = {
          guid,
          logs: [],
          old_time: "",
          new_time: "",
          total: 0,
        };
        let items = get().conversations;
        let item_map = get().conversation_map;
        item_map.set(guid, info);
        items.push(info);
        // set((state) => {
        //   return { ...state, conversation_map: item_map, conversations: items };
        // });
      }
      return get().conversation_map.get(guid)!;
    },

    async getMore(guid: string, forece_new = false) {
      const info = get().getLogsByGuid(guid);
      const req_data: ChatLogMoreReq = {
        end_time: info.old_time,
        start_time: "",
        num: 20,
        guid: guid,
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
      info.old_time = info.logs[info.logs.length - 1].create_time;
      info.new_time = info.logs[0].create_time;
      set((state) => {
        return { ...state };
      });
    },

    addMessage(guid, log) {
      const info = get().getLogsByGuid(guid);
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
