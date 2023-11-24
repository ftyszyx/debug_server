import { useState, useMemo } from "react";
import { Layout, Menu as MenuAntd } from "antd";
import { Link, useHistory } from "kl_router";
import { cloneDeep } from "lodash";
const { Sider } = Layout;
import "@/assets/styles/admin_menu.less";
import ImgLogo from "@/assets/logo.png";
import type { ItemType, MenuItemType } from "antd/lib/menu/hooks/useItems";
import { Menu } from "@/entity/menu.entity";
import { SystemName } from "@/config";
import { GetCommonTree } from "@/util/tree";
import Icon from "@/components/icon";
interface Props {
  data: Menu[]; // 所有的菜单数据
  collapsed: boolean; // 菜单咱开还是收起
}
type MenuNodeType = Menu & MenuItemType;
export default function MenuCom(props: Props): JSX.Element {
  const location = useHistory();
  const [chosedKey, setChosedKey] = useState<string[]>([]); // 当前选中
  const [openKeys, setOpenKeys] = useState<string[]>([]); // 当前需要被展开的项

  // 当页面路由跳转时，即location发生改变，则更新选中项
  // useEffect(() => {
  //   console.log("chosekeys:", chosedKey, "openkeys:", openKeys);
  // }, [location]);

  const menutree_info = useMemo(() => {
    const menulist = cloneDeep(props.data as MenuNodeType[]);
    menulist.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    return GetCommonTree(menulist);
  }, [props.data]);
  /** 处理原始数据，将原始数据处理为层级关系 **/
  const treeDom: ItemType[] = useMemo(() => {
    console.log("treeinfo", menutree_info);
    menutree_info.datalist.forEach((item) => {
      item.label = item.title;
      item.icon = <Icon type={item.icon_style_type}></Icon>;
    });
    console.log("menu list", menutree_info.trees);
    return menutree_info.trees;
  }, [menutree_info]);

  return (
    <Sider width={256} className="sider" trigger={null} collapsible collapsed={props.collapsed}>
      <div className={props.collapsed ? "menuLogo hide" : "menuLogo"}>
        <Link to="/">
          <img src={ImgLogo} />
          <div>{SystemName}</div>
        </Link>
      </div>
      <MenuAntd
        theme="dark"
        mode="inline"
        items={treeDom}
        selectedKeys={chosedKey}
        {...(props.collapsed ? {} : { openKeys })}
        onOpenChange={(keys: string[]) => setOpenKeys(keys)}
        onSelect={(e) => {
          const menuinfo = menutree_info.datamap.get(e.key);
          if (menuinfo) {
            console.log("menu path to ", menuinfo.url);
            location.push(menuinfo.url);
            setChosedKey([menuinfo.key]);
          }
        }}
      />
    </Sider>
  );
}
