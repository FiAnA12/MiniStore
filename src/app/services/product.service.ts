// src/app/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/categories`);
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/category/${category}`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  addProduct(productData: Product): Observable<Product> {
  return this.http.post<Product>(`${this.apiUrl}/products`, productData);
  }

  updateProduct(id: number, productData: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, productData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
}


