import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product, ProductFilter, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Updated URL to work with XAMPP setup
  private baseUrl = 'http://localhost/baby-clothes-shop/baby-clothes-api/api.php';

  constructor(private http: HttpClient) { 
    console.log('ProductService initialized with URL:', this.baseUrl);
  }

  getProducts(filters?: ProductFilter): Observable<Product[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.age_group) params = params.set('age_group', filters.age_group);
      if (filters.gender) params = params.set('gender', filters.gender);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.sort) params = params.set('sort', filters.sort);
    }

    console.log('Making API request to:', `${this.baseUrl}/products`);
    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params }).pipe(
      tap(products => console.log('Products received:', products.length, 'items')),
      catchError(error => {
        console.error('Error fetching products:', error);
        console.error('Error status:', error.status);
        console.error('Error URL:', error.url);
        return throwError(() => error);
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  getCategories(): Observable<Category> {
    console.log('Making API request to:', `${this.baseUrl}/categories`);
    return this.http.get<Category>(`${this.baseUrl}/categories`).pipe(
      tap(categories => console.log('Categories received:', categories)),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(() => error);
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getProducts({ category });
  }

  getProductsByAgeGroup(ageGroup: string): Observable<Product[]> {
    return this.getProducts({ age_group: ageGroup });
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts({ search: query });
  }
}