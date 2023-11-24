import { SetStateFunc, create } from "kl_state";
import { MyFetchGet } from "@/util/fetch";
import { StoreBase } from "@/entity/other.entity";
export function createStoreBase<T, M>(
  api_allpath: string,
  methods?: (set: SetStateFunc<StoreBase<T> & M>, get: () => StoreBase<T> & M) => M
) {
  return create<StoreBase<T> & M>((set, get) => {
    let ret = {
      items: [],
      FetchAll: async (force: boolean = false) => {
        if (get().items.length > 0 && force == false) return;
        let datas = await MyFetchGet<T[]>(api_allpath);
        get().setItems(datas);
      },
      setItems: (items: T[]) => {
        set((state) => {
          return { ...state, items };
        });
      },
    };
    if (methods) {
      Object.assign(ret, methods(set, get));
    }
    return ret as StoreBase<T> & M;
  });
}
