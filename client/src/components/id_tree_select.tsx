import { IdItem } from "@/entity/api.entity";
import { FilterTreeKeys, MyTreeInfo, TreeNodeType } from "@/util/tree";
import { Input, Tree } from "antd";
import { DataNode } from "antd/es/tree";
import React, { useEffect, useMemo, useState } from "react";
interface TreeSelectProps<EntityT> {
  value?: number[];
  onChange?: (data: number[]) => void;
  disabled?: boolean;
  treeInfo: MyTreeInfo<EntityT>;
}
export function RenderTreeItem<T>(data: TreeNodeType<T>[], search: string, dest: DataNode[]) {
  data.forEach((item) => {
    const index = item.title.indexOf(search);
    const beforestr = item.title.substring(0, index);
    const afterstr = item.title.substring(index + search.length);
    const title =
      index > -1 ? (
        <span>
          {beforestr} <span style={{ color: "red" }}>{search}</span>
          {afterstr}
        </span>
      ) : (
        <span>{item.title}</span>
      );
    if (item.show !== false) {
      if (item.children) {
        const childs: DataNode[] = [];
        RenderTreeItem(item.children, search, childs);
        dest.push({ title, key: item.key, children: childs });
      } else {
        dest.push({ title, key: item.key });
      }
    }
  });
}
export default function IdTreeSelect<EntityT extends IdItem>(props: TreeSelectProps<EntityT>) {
  // console.log("redner IdTreeSelect", props);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [expandKeys, setExpandKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const keylist = props.value?.map((item) => item.toString()) || [];
    // console.log("keylist", keylist, props.value);
    setCheckList(keylist);
  }, [props.value]);
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandKeys(newExpandedKeys as string[]);
    setAutoExpandParent(false);
  };
  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
    const show_keys = new Set<string>();
    props.treeInfo.datalist.forEach((item) => {
      item.show = true;
    });
    FilterTreeKeys(props.treeInfo.trees, value, show_keys);
    setExpandKeys(Array.from(show_keys));
  };

  const treedata = useMemo(() => {
    const rootnodes: DataNode[] = [];
    RenderTreeItem(props.treeInfo.trees, search, rootnodes);
    console.log("redner tree node", rootnodes);
    return rootnodes;
  }, [expandKeys, props.treeInfo]);
  return (
    <div>
      <Input value={search} style={{ marginBottom: 8 }} onChange={onSearchChange} placeholder="输入关键字进行过滤"></Input>
      <Tree
        disabled={props.disabled}
        checkable
        onCheck={(checked) => {
          let checked_res = checked as string[];
          // console.log("check", checked_res);
          let valid_checked = checked_res.filter((x) => {
            let info = props.treeInfo.datamap.get(x);
            // console.log("check2", info, x);
            if (info && info.fake) return false;
            return true;
          });
          setCheckList(valid_checked);
          // console.log("change ", checked_res, valid_checked.map(Number));
          console.log("change ", valid_checked.map(Number));
          if (props.onChange) props.onChange(valid_checked.map(Number));
        }}
        checkedKeys={checkList}
        onExpand={onExpand}
        autoExpandParent={autoExpandParent}
        expandedKeys={expandKeys}
        treeData={treedata}
      />
    </div>
  );
}
