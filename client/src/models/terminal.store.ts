import { ChatRoom } from "@/entity/chat_room.entity";
import { create } from "kl_state";

export interface TerminalInfo {
  room: ChatRoom;
}

export interface TerminalStoreType {
  items: TerminalInfo[];
  addItem: (info: TerminalInfo) => void;
  removeItem: (info: TerminalInfo) => void;
}

export const useTerminalStore = create<TerminalStoreType>((set, get) => {
  let ret: TerminalStoreType = {
    items: [],
    addItem(info) {
      let allitems = get().items;
      if (allitems.findIndex((x) => x.room.id == info.room.id) >= 0) return;
      set((state) => {
        state.items.push(info);
        return { ...state };
      });
    },
    removeItem(info) {
      set((state) => {
        const findindx = state.items.findIndex((value) => value.room.id == info.room.id);
        if (findindx >= 0) return { ...state, items: state.items.splice(findindx, 1) };
        return state;
      });
    },
  };
  return ret;
});
