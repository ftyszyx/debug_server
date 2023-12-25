/** 通用动态面包屑 **/
import { useMemo } from "react";
import { useHistory } from "kl_router";
import { Breadcrumb } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Menu } from "@/entity/menu.entity";
import { pathToRegexp } from "path-to-regexp";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";

interface Props {
  menus: Menu[];
}

export default function BreadCom(props: Props): JSX.Element {
  const location = useHistory();
  /** 根据当前location动态生成对应的面包屑 **/
  const breads = useMemo(() => {
    const now_url = location.PathName;
    const breads: BreadcrumbItemType[] = [];
    for (let i = 0; i < props.menus.length; i++) {
      let menuinfo = props.menus[i];
      const regs = pathToRegexp(menuinfo.url, [], { end: true, start: true });
      if (regs.test(now_url)) {
        breads.push({ title: menuinfo.title });
        while (menuinfo.parent != null && menuinfo.parent != "0") {
          const new_menun = props.menus.find((x) => x.id.toString() == menuinfo?.parent);
          if (new_menun == null) {
            break;
          }
          breads.push({ title: new_menun.title });
          menuinfo = new_menun;
        }
        breads.reverse();
        break;
      }
    }
    return breads;
  }, [location.PathName, props.menus]);

  return (
    <div className=" p-4 flex items-center">
      <EnvironmentOutlined className=" float-none text-green-500 mr-2" />
      <Breadcrumb items={breads} />
    </div>
  );
}
