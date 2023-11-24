import { Status } from "@/config";
import { Power } from "@/entity/power.entity";
import { getMoudleLabel } from "@/entity/power_code";

type TreeSrcType = { id: number; title: string; status: Status; parent?: number };
export type TreeNodeType<T> = {
  id: number;
  key: string;
  title: string;
  children?: TreeNodeType<T>[];
  parent?: string;
  show?: boolean;
  fake?: boolean;
  status: Status;
} & T;
export interface MyTreeInfo<EntityT> {
  trees: TreeNodeType<EntityT>[];
  datalist: TreeNodeType<EntityT>[];
  datamap: Map<string, TreeNodeType<EntityT>>;
}

//获取树
export const GetCommonTree = <T extends TreeSrcType>(src_items: T[]): MyTreeInfo<T> => {
  let tree_nodes: TreeNodeType<T>[] = [];
  let datalist: TreeNodeType<T>[] = [];
  let datamap = new Map<string, TreeNodeType<T>>();
  const menu_map = new Map<string, T>();
  if (src_items.length > 0) {
    src_items.forEach((item) => {
      menu_map.set(item.id.toString(), item);
    });
    const addTreeNode = (item: T): TreeNodeType<T> => {
      // console.log("add tree node");
      const node_item = Object.assign({ key: item.id.toString() }, { ...item }) as TreeNodeType<T>;
      if (datamap.has(node_item.key.toString())) return datamap.get(node_item.key.toString())!;
      if (item.parent && item.parent != 0) {
        const parent_node = addTreeNode(menu_map.get(item.parent.toString())!);
        if (parent_node.children) {
          parent_node.children.push(node_item);
        } else {
          parent_node.children = [node_item];
        }
      } else {
        tree_nodes.push(node_item);
      }
      datamap.set(node_item.key.toString(), node_item);
      datalist.push(node_item);
      return node_item;
    };
    src_items.forEach((item) => {
      addTreeNode(item);
    });
  }
  return { trees: tree_nodes, datalist, datamap };
};

export const FilterTreeKeys = <T>(nodes: TreeNodeType<T>[], search_text: string, show_keys: Set<React.Key>) => {
  if (!search_text || search_text.length == 0) return false;
  let child_have_add = false;
  for (let i = 0; i < nodes.length; i++) {
    let have_add = false;
    const node = nodes[i];
    // console.log("filter title", node.title);
    if (node.title.indexOf(search_text) > -1) {
      // console.log("add key:", node);
      show_keys.add(node.key);
      child_have_add = true;
      have_add = true;
    }
    if (node.children) {
      if (FilterTreeKeys(node.children, search_text, show_keys)) {
        // console.log("add key2", node.key);
        show_keys.add(node.key);
        child_have_add = true;
        have_add = true;
      }
    }
    if (have_add == false) {
      node.show = false;
    }
  }
  return child_have_add;
};

export const GetPowerTree = (powers: Power[]): MyTreeInfo<Power> => {
  let trees: TreeNodeType<Power>[] = [];
  let datalist: TreeNodeType<Power>[] = [];
  let parent_map = new Map<string, TreeNodeType<Power>>();
  let data_map = new Map<string, TreeNodeType<Power>>();
  powers.forEach((item) => {
    const code_parent = item.code.split(":")[0].trim();
    const nodeitem = Object.assign({ ...item }, { key: item.id.toString() });
    let parent_node = parent_map.get(item.module);
    if (!parent_node) {
      const parent_id = item.id + 1000000;
      const module_label = getMoudleLabel(item.module);
      parent_node = {
        key: parent_id.toString(),
        id: parent_id,
        module: item.module,
        code: code_parent,
        status: Status.Enable,
        sorts: item.sorts,
        title: module_label,
        desc: module_label,
        children: [],
        fake: true,
      };
      parent_map.set(item.module, parent_node);
      datalist.push(parent_node);
      trees.push(parent_node);
      data_map.set(parent_node.key, parent_node);
    }
    parent_node.children!.push(nodeitem);
    datalist.push(nodeitem);
    data_map.set(item.id.toString(), nodeitem);
  });
  return { trees, datalist, datamap: data_map };
};
