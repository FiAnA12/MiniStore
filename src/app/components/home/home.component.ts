import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  displayedCategories: string[] = [];
  selectedCategory: string = 'All Products';
  searchTerm: string = '';
  isLoggedIn: boolean = false;

  constructor(public authService: AuthService, private productService: ProductService, private router: Router, public cartService: CartService) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product); 
    alert(`${product.title} added to cart!`);
  }

  searchProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedCategory === 'All Products' || product.category === this.selectedCategory)
    );
  }

  filterProducts(category: string): void {
    this.selectedCategory = category;
    if (category === 'All Products') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter((item: any) => item.category === category);
    }
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
    });
    this.productService.getCategories().subscribe((categoriesData) => {
      this.categories = ['All Products', ...categoriesData];
    });
  }
}