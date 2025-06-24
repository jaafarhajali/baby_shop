import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductFilter, Category } from '../../models/product.model';

@Component({
  selector: 'app-product-catalog',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.css'
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  categories: Category | null = null;
  loading = true;
  
  filters: ProductFilter = {};
  searchQuery = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    // Load initial filters from query params
    this.route.queryParams.subscribe(params => {
      this.filters = {
        category: params['category'],
        age_group: params['age_group'],
        gender: params['gender'],
        search: params['search'],
        sort: params['sort']
      };
      this.searchQuery = params['search'] || '';
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.filters).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.updateUrl();
    this.loadProducts();
  }

  onSearch(): void {
    this.filters.search = this.searchQuery;
    this.updateUrl();
    this.loadProducts();
  }

  clearFilters(): void {
    this.filters = {};
    this.searchQuery = '';
    this.updateUrl();
    this.loadProducts();
  }

  private updateUrl(): void {
    const queryParams: any = {};
    
    if (this.filters.category) queryParams.category = this.filters.category;
    if (this.filters.age_group) queryParams.age_group = this.filters.age_group;
    if (this.filters.gender) queryParams.gender = this.filters.gender;
    if (this.filters.search) queryParams.search = this.filters.search;
    if (this.filters.sort) queryParams.sort = this.filters.sort;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
