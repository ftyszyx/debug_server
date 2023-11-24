import { FieldInfo, SearchOpInfo, SearchOps, Search_stringOps, SearchAndOr, SearchOpKey } from "@/entity/form.entity";
import { useMemo, useState } from "react";
import { Form, Select } from "antd";
export interface SearchItemInfo {
  name: string;
  op: SearchOpKey;
  value: string | number | number[] | string[] | any;
  andor: SearchAndOr;
}
export interface SearchItemProps {
  fileds: FieldInfo[];
  parent_index: number;
  onReset?: () => void;
  // value?: SearchItemInfo;
  // onChange?: (value: SearchItemInfo) => void;
}
export default function SearchItem(props: SearchItemProps) {
  const [fieldItem, SetFieldItem] = useState<FieldInfo>();
  const [Ops, SetOps] = useState<SearchOpInfo[]>([]);
  const [SelectOp, setSelectop] = useState<SearchOpKey>();
  const valuePlaceHolder = useMemo(() => {
    const use_element = fieldItem?.search_Element || fieldItem?.field_Element;
    if (!use_element) return "";
    if (use_element) {
      const element_name = use_element.displayName;
      if (element_name == "Input") {
        if (SelectOp == "between" || SelectOp == "between_not_include") {
          return "输入两个值，用逗号分隔";
        }
        return "输入值";
      }
    }
  }, [SelectOp, fieldItem]);
  // console.log("render search item ", props.parent_index);
  return (
    <div className="[&>div]:mb-0  [&>div]:mr-2 flex flex-row items-start">
      {props.parent_index != 0 && (
        <Form.Item label="" name={[props.parent_index, "andor"]} initialValue={"and"}>
          <Select style={{ width: 80 }}>
            <Select.Option value="or">Or</Select.Option>
            <Select.Option value="and">And</Select.Option>
          </Select>
        </Form.Item>
      )}
      <Form.Item label="" name={[props.parent_index, "name"]}>
        <Select
          style={{ width: 120 }}
          placeholder="选择字段"
          onChange={(value) => {
            const index = props.fileds.findIndex((item) => item.field_name == value);
            if (fieldItem && props.onReset) props.onReset();
            const fieldinfo = props.fileds[index];
            SetFieldItem(fieldinfo);
            const ops = fieldinfo.search_Ops || Search_stringOps;
            SetOps(
              SearchOps.filter((item) => {
                return ops.includes(item.name);
              })
            );
            // console.log("change value, ops:", ops);
          }}
        >
          {props.fileds.map((field_item) => {
            return (
              <Select.Option key={field_item.field_name} value={field_item.field_name}>
                {field_item.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="" name={[props.parent_index, "op"]} rules={[{ required: true }]}>
        <Select
          style={{ width: 150 }}
          placeholder="选择条件"
          onChange={(value) => {
            setSelectop(value);
          }}
        >
          {Ops.map((field_item) => {
            return (
              <Select.Option key={field_item.name} value={field_item.name}>
                {field_item.title}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      {fieldItem && (
        <Form.Item label="" name={[props.parent_index, "value"]} rules={fieldItem.search_rules || [{ required: true }]}>
          {fieldItem.search_Element ? (
            <fieldItem.search_Element {...fieldItem.search_props} placeholder={valuePlaceHolder}>
              {fieldItem.SelectOpsRender && fieldItem.SelectOpsRender()}
            </fieldItem.search_Element>
          ) : (
            <fieldItem.field_Element {...fieldItem.search_props} placeholder={valuePlaceHolder}>
              {fieldItem.SelectOpsRender && fieldItem.SelectOpsRender()}
            </fieldItem.field_Element>
          )}
        </Form.Item>
      )}
    </div>
  );
}
