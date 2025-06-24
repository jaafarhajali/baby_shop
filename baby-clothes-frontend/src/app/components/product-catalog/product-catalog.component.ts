import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductFilter, Category } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-catalog',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.css'
})
export class ProductCatalogComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category | null = null;
  loading = true;
  
  filters: ProductFilter = {};
  searchQuery = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Wrap in try-catch to prevent async errors
    try {
      this.loadCategories();
      
      // Load initial filters from query params
      const routeSubscription = this.route.queryParams.subscribe({
        next: (params) => {
          this.filters = {
            category: params['category'],
            age_group: params['age_group'],
            gender: params['gender'],
            search: params['search'],
            sort: params['sort']
          };
          this.searchQuery = params['search'] || '';
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error subscribing to route params:', error);
          this.loading = false;
        }
      });
      
      this.subscriptions.push(routeSubscription);
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }

  loadCategories(): void {
    const categoriesSubscription = this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Continue even if categories fail to load
      }
    });
    
    this.subscriptions.push(categoriesSubscription);
  }

  loadProducts(): void {
    this.loading = true;
    
    const productsSubscription = this.productService.getProducts(this.filters).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        // Set empty array on error to prevent UI issues
        this.products = [];
      }
    });
    
    this.subscriptions.push(productsSubscription);
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
