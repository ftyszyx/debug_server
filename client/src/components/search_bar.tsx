import { FieldInfo, SearchFormDef, SearchAndOr, SearchField, getFileElementName } from "@/entity/form.entity";
import { Button, Form, Space, message } from "antd";
import SearchItem, { SearchItemInfo } from "./search_bar_item";
import { useMemo, useState } from "react";
import { OperateCode } from "@/entity/page.entity";
import { DownOutlined } from "@ant-design/icons";
import { getValidErrMsg } from "@/util/valid";

export interface SearchBarProps {
  fileds: FieldInfo[];
  onSure: (info: SearchFormDef) => void;
}
export default function SearchBar(props: SearchBarProps) {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(true);
  // console.log("render search bar");
  const searchFields = useMemo(() => {
    return props.fileds.filter((x) => x.field_operate & OperateCode.Search);
  }, props.fileds);

  const getSearchItemValue = (item: SearchItemInfo): SearchField => {
    const fieldinfo = props.fileds.find((x) => x.field_name == item.name);
    const element_name = getFileElementName(fieldinfo);
    const key = item.name;
    const op_name = item.op;
    if (op_name == "between" || op_name == "between_not_include") {
      if (element_name == "Input") {
        const value = (item.value as string).split(",").map(Number);
        if (value.length != 2) {
          throw new Error("输入数据格式有问题");
        }
        return { [key]: { [op_name]: value } };
      }
    }
    if (element_name == "RangePicker") {
      const time_start = item.value[0].format();
      const time_end = item.value[1].format();
      return { [key]: { [op_name]: [time_start, time_end] } };
    }
    return { [key]: { [op_name]: item.value } };
  };
  const getSearchForm = (items: SearchItemInfo[]): SearchFormDef => {
    let search_res: SearchFormDef = { and: [], or: [] };
    if (items.length <= 0) return {};
    var item_first = items[0];
    let item_first_res = getSearchItemValue(item_first);
    if (items.length == 1) return { and: [item_first_res] };
    var item_second = items[1];
    if (item_second.andor == SearchAndOr.or) {
      search_res.and?.push(item_first_res);
    } else {
      search_res.or?.push(item_first_res);
    }
    for (let i = 1; i < items.length; i++) {
      var iteminfo = items[i];
      var item_res = getSearchItemValue(iteminfo);
      if (iteminfo.andor == SearchAndOr.or) {
        search_res.and?.push(item_res);
      } else {
        search_res.or?.push(item_res);
      }
    }
    return search_res;
  };
  async function getFormValue() {
    const values = await form.validateFields().catch((reason) => {
      console.log("err", reason);
      message.error(getValidErrMsg(reason));
    });
    if (values == null) return null;
    console.log("get form", { ...values });
    const { items } = values;
    if (!items) message.error("异常");
    const res = getSearchForm(items as SearchItemInfo[]);
    console.log("get form res", res);
    return res;
  }
  return (
    <div className="flex items-start flex-col">
      <Space size="small" className=" my-2">
        <Button
          type="primary"
          onClick={async () => {
            const res = await getFormValue();
            if (res) props.onSure(res);
          }}
        >
          搜索
        </Button>
        <Button
          onClick={() => {
            form.setFieldValue(["items"], []);
          }}
        >
          清除
        </Button>
        <a
          style={{ fontSize: 12 }}
          onClick={() => {
            setExpand(!expand);
          }}
        >
          <DownOutlined rotate={expand ? 180 : 0} />
          折叠
        </a>
      </Space>
      <Form
        className={expand ? "flex flex-wrap " : "hidden"}
        form={form}
        name="search_form"
        autoComplete="off"
        initialValues={{ items: [{}] }}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => {
            return (
              // <div className=" flex flex-wrap  items-center">
              <Space size={[8, 16]} wrap>
                {fields.map((field) => {
                  return (
                    <div className="flex mr-3 border-red-500 border-[1px] border-dashed" key={field.name}>
                      <Form.Item name={[field.name]} className=" my-0">
                        <SearchItem
                          fileds={searchFields}
                          parent_index={field.name}
                          onReset={() => {
                            const fieldkey = ["items", field.name, "value"];
                            const opkey = ["items", field.name, "op"];
                            const oldvalue = form.getFieldValue(fieldkey);
                            const oldop = form.getFieldValue(opkey);
                            // const oldvalue1 = form.getFieldValue(["items", field.name]);
                            // console.log("reset1", oldvalue1);
                            // console.log("reset2", oldvalue);
                            if (oldvalue) {
                              form.setFieldValue(fieldkey, undefined);
                            }
                            if (oldop) {
                              form.setFieldValue(opkey, undefined);
                            }
                          }}
                        ></SearchItem>
                      </Form.Item>
                      <Button
                        className="ml-2"
                        type="default"
                        onClick={() => {
                          remove(field.name);
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  );
                })}
                <Button
                  className=" ml-1"
                  type="default"
                  onClick={() => {
                    add();
                  }}
                >
                  添加
                </Button>
              </Space>
            );
          }}
        </Form.List>
      </Form>
    </div>
  );
}
