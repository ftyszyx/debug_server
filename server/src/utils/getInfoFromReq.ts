import { Request } from 'express';

export const getInfoFromReq = (req: Request) => {
  const { method, url, body, ip } = req;
  return { method, url, body, ip };
};
