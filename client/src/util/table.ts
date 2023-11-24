import { IdItem } from "@/entity/api.entity";

export function GetTableData<EntityT extends IdItem>(datas: EntityT[]): EntityT[] {
  return datas.map((item) => {
    item.key = item.id;
    return {
      ...item,
    };
  });
}
