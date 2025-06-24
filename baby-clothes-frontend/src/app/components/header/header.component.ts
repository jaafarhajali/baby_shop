import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { User } from '../../models/user.model';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  cartItemCount: number = 0;
  searchQuery: string = '';
  categories: Category | null = null;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.loadCartCount(user.id);
        } else {
          this.cartItemCount = 0;
        }
      })
    );

    // Subscribe to cart item count
    this.subscriptions.push(
      this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count;
      })
    );

    // Load categories
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadCategories(): void {
    this.subscriptions.push(
      this.productService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      })
    );
  }

  private loadCartCount(userId: number): void {
    this.subscriptions.push(
      this.cartService.getCart(userId).subscribe({
        error: (error) => {
          console.error('Error loading cart:', error);
        }
      })
    );
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
