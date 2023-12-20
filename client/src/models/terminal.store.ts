import { DebugClient } from "@/entity/debug_client.entity";
import { create } from "kl_state";

export interface TerminalInfo {
  client: DebugClient;
  create_time: string;
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
      set((state) => {
        state.items.push(info);
        return { ...state };
      });
    },
    removeItem(info) {
      set((state) => {
        const findindx = state.items.findIndex((value) => value.client.guid == info.client.guid);
        if (findindx >= 0) return { ...state, items: state.items.splice(findindx, 1) };
        return state;
      });
    },
  };
  return ret;
});
