/** 通用动态面包屑 **/
import { useMemo } from "react";
import { useHistory } from "kl_router";
import { Breadcrumb } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Menu } from "@/entity/menu.entity";

interface Props {
  menus: Menu[];
}

export default function BreadCom(props: Props): JSX.Element {
  const location = useHistory();
  /** 根据当前location动态生成对应的面包屑 **/
  const breads = useMemo(() => {
    const now_url = location.PathName;
    // console.log("path:", now_url);
    const breads = [];
    let target_menu = props.menus.find((x) => x.url == now_url);
    if (target_menu) {
      breads.push({ title: target_menu.title });
      while (target_menu.parent != null && target_menu.parent != undefined) {
        target_menu = props.menus.find((x) => x.id == target_menu?.parent);
        if (target_menu == null) {
          break;
        }
        breads.push({ title: target_menu.title });
      }
    }
    breads.reverse();
    // console.log("breads:", breads);
    return breads;
  }, [location.PathName, props.menus]);

  return (
    <div className=" p-4 flex items-center">
      <EnvironmentOutlined className=" float-none text-green-500 mr-2" />
      <Breadcrumb items={breads} />
    </div>
  );
}
