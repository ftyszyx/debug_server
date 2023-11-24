"use strict";
import path from "path";
import fs from "fs";
import { loadEnv } from "vite";
const resolve = (p) => path.resolve(process.cwd(), p);

const readHtmlTemplate = async (filePath) => {
  // console.log("path",filePath)
  return await fs.promises.readFile(filePath, { encoding: "utf8" });
};

//获取其它的
const getHtmlContent = async (filePath, env, type) => {
  let content = type === 1 ? filePath : await readHtmlTemplate(resolve(filePath)); //读取文件内容，首页的type == 1

  const newEnv = env.command === "serve" ? "dev" : "pro";
  const matchMode = [newEnv, env.mode, newEnv + "-" + env.mode];

  const regex =
    /<!--\s*(@ifdef | @ifnot )[\s\S]*?@endif\s*-->|\/\/\s*(@ifdef | @ifnot )[\s\S]*?\/\/\s*@endif|\/\*\*\s*@(ifdef|ifnot )([\s\S]*?)@endif\s+\*\*\//g;
  const matches = content.match(regex); //匹配成功

  if (!matches) {
    return content;
  }

  let ifMode = [];
  //提取开头，分别获取条件版本的mode
  matches.forEach((item) => {
    const reg =
      /<!--\s*(@ifdef | @ifnot)([\s\S]*?)-->\s*|\/\*\*\s*(@ifdef | @ifnot )([\s\S]*?)\*\/|\/\/\s*(@ifdef | @ifnot )([\s\S]*?)\n/g;
    let itemMatch = item.match(reg)[0];
    const nodeReg = /(@ifdef|@ifnot)([^]*?)(-->|\*\*\/|\n|$)/;

    let nodeMatch = itemMatch.match(nodeReg)[2].replace(/\s/g, ""); //去除环境判断字符串内的空格，防止出现空格后 || 前后出现空格
    let nodeSplit = nodeMatch.split("||"); //分割环境，适用于多环境情况下

    const isExist = nodeSplit.find((items) => matchMode.indexOf(items) > -1); //判断环境是否存在

    if (isExist) {
      if (item.indexOf("@ifnot") > -1) {
        content = content.replace(item, "");
      }
    } else {
      if (item.indexOf("@ifnot") < 0) {
        content = content.replace(item, "");
      }
    }
  });
  let regexs = /<!--[\s\S]*?-->/g; //移除html注释
  return content.replace(regexs, "");
};
//获取首页的
const GetIndexHtml = async (html, _env) => {
  let newHtml = await getHtmlContent(html, _env, 1);
  return newHtml;
};

export default function conditionalCompile() {
  let _env;
  return {
    name: "vite-ifdef",
    config(_, env) {
      _env = env;
    },
    load(id) {
      //src内的起作用
      const dirname = path.dirname(id);
      if (dirname.indexOf("/src") > -1 && dirname.indexOf("@") == -1) {
        return getHtmlContent(id, _env);
      } else {
        return null;
      }
    },
    // //首页
    transformIndexHtml(html) {
      return GetIndexHtml(html, _env);
    },
  };
}
