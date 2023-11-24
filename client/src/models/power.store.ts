import { ApiPath } from "@/entity/api_path";
import { Power } from "@/entity/power.entity";
import { StoreBase } from "@/entity/other.entity";
import { createStoreBase } from "./base.store";
export type PowerStore = StoreBase<Power>;
export const usePowerStore = createStoreBase<Power, undefined>(ApiPath.getAllPowers);
