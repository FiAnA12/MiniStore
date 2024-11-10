// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  private totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private authService: AuthService) {
    const initialCart = this.isBrowser() && this.authService.getIsAuthenticated()
      ? this.loadCartFromStorage()
      : this.loadCartFromSessionStorage();
    this.cartItems.next(initialCart);
    this.calculateTotal();
  }

  getCartItems(): Observable<Product[]> {
    return this.cartItems.asObservable();
  }

  getCartItemCount(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  addToCart(product: Product): void {
    const items = this.cartItems.getValue();
    const existingProduct = items.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity! += 1;
    } else {
      product.quantity = 1;
      items.push(product);
    }
    this.updateCart(items);
  }

  removeFromCart(productId: number): void {
    const items = this.cartItems.getValue().filter(item => item.id !== productId);
    this.updateCart(items);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: Product[]): void {
    this.cartItems.next(items);
    this.calculateTotal();
    if (this.authService.getIsAuthenticated()) {
      this.saveCartToStorage(items);
    } else {
      this.saveCartToSessionStorage(items);
    }
  }

  private calculateTotal(): void {
    const total = this.cartItems.getValue().reduce((sum, item) => sum + (item.price * item.quantity!), 0);
    this.totalPrice.next(total);
  }

  getTotalPrice(): Observable<number> {
    return this.totalPrice.asObservable();
  }

  private saveCartToStorage(items: Product[]): void {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }

  private loadCartFromStorage(): Product[] {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  private saveCartToSessionStorage(items: Product[]): void {
    if (this.isBrowser()) {
    sessionStorage.setItem('guestCartItems', JSON.stringify(items));
  }
}
private loadCartFromSessionStorage(): Product[] {
  if (this.isBrowser()) {
    const storedCart = sessionStorage.getItem('guestCartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
}
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }
  
}


