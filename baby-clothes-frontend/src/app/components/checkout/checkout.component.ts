import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart.model';
import { CreateOrderRequest } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cart: Cart = { items: [], total: 0, itemCount: 0 };
  loading = true;
  processing = false;
  
  orderData = {
    shipping_address: '',
    billing_address: '',
    payment_method: 'credit_card',
    same_as_shipping: true
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCart(userId);
  }

  loadCart(userId: number): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.loading = false;
      
      if (cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    this.cartService.getCart(userId).subscribe({
      error: (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
      }
    });
  }

  onSameAsShippingChange(): void {
    if (this.orderData.same_as_shipping) {
      this.orderData.billing_address = this.orderData.shipping_address;
    }
  }

  onShippingAddressChange(): void {
    if (this.orderData.same_as_shipping) {
      this.orderData.billing_address = this.orderData.shipping_address;
    }
  }

  submitOrder(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    if (!this.validateForm()) return;

    this.processing = true;

    const orderRequest: CreateOrderRequest = {
      user_id: userId,
      total_amount: this.cart.total,
      shipping_address: this.orderData.shipping_address,
      billing_address: this.orderData.billing_address,
      payment_method: this.orderData.payment_method,
      items: this.cart.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.processing = false;
        alert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.processing = false;
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
      }
    });
  }

  private validateForm(): boolean {
    if (!this.orderData.shipping_address.trim()) {
      alert('Please enter a shipping address');
      return false;
    }

    if (!this.orderData.same_as_shipping && !this.orderData.billing_address.trim()) {
      alert('Please enter a billing address');
      return false;
    }

    return true;
  }
}