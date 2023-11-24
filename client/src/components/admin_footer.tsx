/* Footer 页面底部 */
import { Layout } from "antd";
import { AUTHOR, AUTHOR_WEB } from "@/config";

const { Footer } = Layout;

export default function FooterCom() {
  return (
    <Footer className="text-center flex-none ">
      © 2018-{new Date().getFullYear() + " "}
      <a href={AUTHOR_WEB} target="_blank" rel="author" className=" hover:underline">
        {AUTHOR}
      </a>
      , Inc.
    </Footer>
  );
}
