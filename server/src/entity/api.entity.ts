import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { OrderByReq, OrderBySwaggerDef, SearchFormDef, WhereSwaggerDef } from './sql.entity';
import { ChatLogEntity } from 'src/chat_server/chat_Log.entity';
import { ChatRoomEntity } from 'src/chat_room/chat_room.entity';

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

export interface TokenPayload {
  user_name: string;
  id: number;
}

export interface chatLogErr {
  msg: string;
  code: number;
}
export interface JoinRoomReq {
  guid: string;
  nick: string;
}

export interface JoinRoomResp {
  room_id: ChatRoomEntity;
}
