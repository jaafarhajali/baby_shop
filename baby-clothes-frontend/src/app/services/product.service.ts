import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFilter, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8000/api.php';

  constructor(private http: HttpClient) { }

  getProducts(filters?: ProductFilter): Observable<Product[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.age_group) params = params.set('age_group', filters.age_group);
      if (filters.gender) params = params.set('gender', filters.gender);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.sort) params = params.set('sort', filters.sort);
    }

    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  getCategories(): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/categories`);
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