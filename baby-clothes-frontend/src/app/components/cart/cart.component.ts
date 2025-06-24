import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem, Cart } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = { items: [], total: 0, itemCount: 0 };
  loading = true;
  updatingItems: Set<number> = new Set();
  
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    
    // Subscribe to cart changes
    this.subscriptions.push(
      this.cartService.cart$.subscribe(cart => {
        console.log('Cart updated:', cart);
        this.cart = cart;
        
        // Debug: log image URLs
        if (cart.items && cart.items.length > 0) {
          cart.items.forEach(item => {
            console.log(`Item: ${item.name}, Image URL: ${item.image_url}, Price: ${item.price} (type: ${typeof item.price})`);
          });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Helper methods to ensure numeric values for price calculations
  getPrice(price: any): number {
    return typeof price === 'number' ? price : parseFloat(price) || 0;
  }

  getItemTotal(item: CartItem): number {
    return this.getPrice(item.price) * item.quantity;
  }

  formatPrice(price: any): string {
    return this.getPrice(price).toFixed(2);
  }

  formatItemTotal(item: CartItem): string {
    return this.getItemTotal(item).toFixed(2);
  }

  formatCartTotal(): string {
    return this.getPrice(this.cart.total).toFixed(2);
  }

  // Image error handler
  onImageError(event: any, item: CartItem): void {
    console.log('Image failed to load for item:', item.name, 'URL:', item.image_url);
    // Set a fallback image
    event.target.src = 'assets/onesie-white.jpeg';
  }

  loadCart(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.cartService.getCart(userId).subscribe({
        next: () => {
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading cart:', error);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;
    
    this.updatingItems.add(item.id);
    
    this.cartService.updateCartItem(item.id, { quantity: newQuantity }).subscribe({
      next: () => {
        this.updatingItems.delete(item.id);
        this.loadCart();
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
        this.updatingItems.delete(item.id);
      }
    });
  }

  removeItem(item: CartItem): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.updatingItems.add(item.id);
    
    this.cartService.removeFromCart(item.id, userId).subscribe({
      next: () => {
        this.updatingItems.delete(item.id);
      },
      error: (error) => {
        console.error('Error removing cart item:', error);
        this.updatingItems.delete(item.id);
      }
    });
  }

  clearCart(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart(userId).subscribe({
        next: () => {
          // Cart will be updated through subscription
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
        }
      });
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isEmpty(): boolean {
    return this.cart.items.length === 0;
  }
}
