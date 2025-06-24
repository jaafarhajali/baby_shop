import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { CartItem, AddToCartRequest, UpdateCartRequest, Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8000/api.php';
  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0, itemCount: 0 });
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCart(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.baseUrl}/cart?user_id=${userId}`)
      .pipe(
        tap(items => this.updateCartSubject(items))
      );
  }

  addToCart(item: AddToCartRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart`, item)
      .pipe(
        tap(() => this.refreshCart(item.user_id))
      );
  }

  updateCartItem(itemId: number, update: UpdateCartRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/cart/${itemId}`, update);
  }

  removeFromCart(itemId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/${itemId}`)
      .pipe(
        tap(() => this.refreshCart(userId))
      );
  }

  clearCart(userId: number): Observable<any> {
    return this.getCart(userId).pipe(
      map(items => {
        const deletePromises = items.map(item => 
          this.http.delete(`${this.baseUrl}/cart/${item.id}`).toPromise()
        );
        return Promise.all(deletePromises);
      }),
      tap(() => this.updateCartSubject([]))
    );
  }

  private refreshCart(userId: number): void {
    this.getCart(userId).subscribe();
  }

  private updateCartSubject(items: CartItem[]): void {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    
    this.cartSubject.next({
      items,
      total,
      itemCount
    });
  }

  getCartItemCount(): Observable<number> {
    return this.cart$.pipe(map(cart => cart.itemCount));
  }

  getCartTotal(): Observable<number> {
    return this.cart$.pipe(map(cart => cart.total));
  }
}