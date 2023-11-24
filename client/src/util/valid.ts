/**
 * 正则 手机号验证
 * @param str - 待处理的字符串或数字
 * **/
export function checkPhone(str: string | number): boolean {
  const rex = /^1[345789]\d{9}$/;
  return rex.test(String(str));
}

export function getValidErrMsg(err: any): string {
  return err.errorFields[0].errors[0];
}
