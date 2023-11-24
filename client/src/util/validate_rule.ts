import { Rule } from "antd/es/form";

export const PasswordRules: Rule[] = [
  { required: true, whitespace: true, message: "必填" },
  { min: 6, message: "最少输入6位字符" },
  { max: 18, message: "最多输入18位字符" },
];
