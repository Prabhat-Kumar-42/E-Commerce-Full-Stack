import type { Item } from "./item.type";

// src/types/cart.type.ts
export type CartItem = {
  id: string;
  quantity: number;
  item: Item; 
};

export interface Cart {
  id: string;
  items: CartItem[];
}