import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service'; // Import ProductService to fetch product details

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  total = 0;

  constructor(
    public authService: AuthService, 
    public cartService: CartService, 
    private router: Router, 
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  logout(): void {
    this.cartService.clearCart();
    this.authService.logout();
    this.router.navigate(['/']);
  }


  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.calculateTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.total = 0;
  }
}