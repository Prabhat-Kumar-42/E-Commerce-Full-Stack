
// src/types/item.type.ts
export interface Item {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
}

