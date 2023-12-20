import { ApiPath } from "@/entity/api_path";
import { StoreBase } from "@/entity/other.entity";
import { createStoreBase } from "./base.store";
import { DebugClient } from "@/entity/debug_client.entity";
export type ClientStore = StoreBase<DebugClient>;
export const useDebugClientStore = createStoreBase<DebugClient, undefined>(ApiPath.getClientAllValid);
