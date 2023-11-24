/* 用于菜单的自定义图标 */
import { createFromIconfontCN } from "@ant-design/icons";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_807846_pr1ga2v5r7.js",
});

interface Props {
  type: string;
  className?: string | undefined;
}

export default function Icon(props: Props): JSX.Element {
  return <IconFont type={props.type} className={props.className} />;
}
