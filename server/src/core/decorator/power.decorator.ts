import { SetMetadata } from '@nestjs/common';
import { ModuleType, PowerCodeType } from 'src/entity/constant';

export const POWER_KEY = 'powercode';
export type PowerCodeMeta = { module: ModuleType; code: PowerCodeType };
export const PowerCode = (params: PowerCodeMeta) => {
  return SetMetadata(POWER_KEY, params);
};
