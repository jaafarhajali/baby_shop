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
        this.cart = cart;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
