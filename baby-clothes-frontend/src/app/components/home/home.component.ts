import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category | null = null;
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCategories();
  }
  loadFeaturedProducts(): void {
    console.log('Loading featured products...');
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Products received:', products.length);
        this.featuredProducts = products.slice(0, 8);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        console.error('Error status:', error.status);
        console.error('Error URL:', error.url);
        this.loading = false;
        
        // Provide user feedback based on error type
        if (error.status === 0) {
          console.error('Connection refused - check if XAMPP Apache is running and API URL is correct');
        } else if (error.status === 404) {
          console.error('API endpoint not found - check the URL path');
        } else if (error.status === 500) {
          console.error('Server error - check PHP syntax and database connection');
        }
      }
    });
  }
  loadCategories(): void {
    console.log('Loading categories...');
    this.productService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categories received:', categories);
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        console.error('Error status:', error.status);
      }
    });
  }
}
