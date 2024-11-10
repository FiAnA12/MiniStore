import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  product: Product = {
    title: '',
    price: 0,
    description: '',
    image: '',
    id: 0,
    category: ''
  };
  products: Product[] = []; 
  submissionMessage: string | null = null;
  isEditing: boolean = false; 
  editProductId: number | null = null; 

  constructor(private productService: ProductService, public authService: AuthService, private router: Router, public cartService: CartService) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to home page after logout
  }

  onSubmit(): void {
    if (this.isEditing && this.editProductId !== null) {
      this.updateProduct(this.editProductId);
    } else {
      this.addNewProduct();
    }
  }

  addNewProduct(): void {
    this.productService.addProduct(this.product).subscribe({
      next: (newProduct) => {
        this.submissionMessage = 'Product added successfully!';
        this.products.push(newProduct); // Add the new product to the list
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.submissionMessage = 'Failed to add product. Please try again.';
      }
    });
  }

  updateProduct(id: number): void {
    this.productService.updateProduct(id, this.product).subscribe({
      next: (updatedProduct) => {
        this.submissionMessage = 'Product updated successfully!';
        const index = this.products.findIndex(prod => prod.id === id);
        if (index !== -1) {
          this.products[index] = updatedProduct; // Update the product in the list
        }
        this.resetForm();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.submissionMessage = 'Failed to update product. Please try again.';
      }
    });
  }

  editProduct(product: Product): void {
    if (product.id !== undefined && product.id !== null) {
      this.editProductId = product.id; 
      this.product = { ...product };
      this.isEditing = true;
    } else {
      console.error("Product ID is undefined. Cannot edit this product.");
    }
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.submissionMessage = 'Product deleted successfully!';
        this.products = this.products.filter(product => product.id !== id); // Remove product from list
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.submissionMessage = 'Failed to delete product. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.product = {
      title: '',
      price: 0,
      description: '',
      image: '',
      id: 0,
      category: ''
    };
    this.isEditing = false;
    this.editProductId = null;
  }
}
