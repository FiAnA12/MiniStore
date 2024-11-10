// src/app/models/cart.model.ts
export interface CartItem {
    productId?: number;
    quantity: number;
  }
  
  export interface Cart {
    id?: number;
    userId: number;
    date: string;
    products: CartItem[];
  }
  