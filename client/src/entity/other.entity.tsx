import React from "react";
export type ChildProps = {
  children?: React.ReactNode;
};

export interface StoreBase<T> {
  items: T[]; // 拥有的所有菜单对象
  setItems: (items: T[]) => void;
  FetchAll: (force?: boolean) => Promise<void>;
}

export interface CommonOpItem {
  id: number | string;
  title: string;
}

export interface EnumTypeItem {
  value: string | number;
  label: string;
}
