import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { OrderByReq, OrderBySwaggerDef, SearchFormDef, WhereSwaggerDef } from './sql.entity';

export interface ListResp<T> {
  list: T[];
  total: number;
}
export class PageReq {
  @ApiProperty()
  pageNum: number;
  @ApiProperty()
  pageSize: number;
}
export interface ApiResp<T> {
  code: number; // 状态，200成功
  data?: T; // 返回的数据
  message?: string; // 返回的消息
}

export class Loginreq {
  @ApiProperty()
  user_name: string;
  @ApiProperty()
  password: string;
}

export class IdReq {
  @ApiProperty()
  id: number;
}
export class IdsReq {
  @ApiProperty()
  ids: number[];
}
export interface UpReq<T> {
  id: number;
  data: T;
}
export class UpRolePowerReq {
  @ApiProperty()
  role_ids: number[] = [];
  @ApiProperty()
  power_id: number = 0;
}

export class UpRoleMenuReq {
  @ApiProperty()
  role_ids: number[] = [];
  @ApiProperty()
  menu_id: number = 0;
}
export class ChangePassReq {
  @ApiProperty()
  id: number;
  @ApiProperty()
  new_pass: string;
}
export class ChangeMyPassReq {
  @ApiProperty()
  new_pass: string;
}
export type ListReq<T> = PageReq & SearchFormDef<T> & OrderByReq<T>;
export class ListReqSwagger extends IntersectionType(PageReq, WhereSwaggerDef, OrderBySwaggerDef) {}
