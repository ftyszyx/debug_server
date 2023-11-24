import { ApiPropertyOptional } from '@nestjs/swagger';
export type SearchOpKey =
  | 'starts_with'
  | 'ends_with'
  | 'is'
  | 'not'
  | 'in'
  | 'not_in'
  | 'lt'
  | 'gt'
  | 'lte'
  | 'gte'
  | 'contains'
  | 'not_contains'
  | 'not_starts_with'
  | 'not_ends_with'
  | 'between'
  | 'between_not_include';
export interface SearchOpInfo {
  name: SearchOpKey;
  title: string;
}
export type OrderByKey = 'orderBy';
export type orderByOp = 'DESC' | 'ASC';
export type orderList<T> = {
  [p in keyof T]?: orderByOp;
};
export class OrderByReq<T> {
  orderBy?: orderList<T>;
}

export type SearchField<T> = {
  [P in keyof T]?: SearchOpInfo;
};
export enum SearchAndOr {
  and = 'and',
  or = 'or',
}
export class SearchFormDef<T> {
  or?: SearchField<T>[];
  and?: SearchField<T>[];
}

export class WhereSwaggerDef {
  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'object',
    },
  })
  or?: any;
  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'object',
    },
  })
  and?: any;
}
export class OrderBySwaggerDef {
  @ApiPropertyOptional({
    type: 'object',
  })
  orderBy?: any;
}
export interface IdEntity {
  id: number;
}
