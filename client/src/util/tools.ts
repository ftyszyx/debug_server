/** 这个文件封装了一些常用的工具函数 **/
import { TOKEN_KEY } from "@/config";
export const GetToken = () => {
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const SetToken = (text: string) => {
  if (text.length > 0) {
    localStorage.setItem(TOKEN_KEY, text);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};
