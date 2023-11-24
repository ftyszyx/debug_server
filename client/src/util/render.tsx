import { Status } from "@/config";
import { CommonOpItem, EnumTypeItem } from "@/entity/other.entity";
import { Select } from "antd";
export function RenderStatusOps() {
  return (
    <>
      <Select.Option key={1} value={Status.Enable}>
        启用
      </Select.Option>
      <Select.Option key={-1} value={Status.Disable}>
        禁用
      </Select.Option>
    </>
  );
}

export function RenderEnumOps(values: EnumTypeItem[]) {
  return (
    <>
      {values.map((item) => {
        return (
          <Select.Option key={item.value} label={item.label} value={item.value}>
            {item.label}
          </Select.Option>
        );
      })}
    </>
  );
}

export function RenderCommonOps(items: CommonOpItem[]) {
  return (
    <>
      {items.map((item) => {
        return (
          <Select.Option key={item.id} label={item.title} value={item.id}>
            {item.title}
          </Select.Option>
        );
      })}
    </>
  );
}

export function renderStatusTable(status: number) {
  return status === 1 ? <span style={{ color: "green" }}>启用</span> : <span style={{ color: "red" }}>禁用</span>;
}
export function rednerEnumTable(value: string | number, itmes: EnumTypeItem[]) {
  var info = itmes.find((x) => x.value == value);
  return <span>{info?.label}</span>;
}
