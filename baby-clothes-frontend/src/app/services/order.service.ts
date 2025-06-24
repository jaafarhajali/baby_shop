import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest, OrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost/baby-clothes-shop/baby-clothes-api/api.php';

  constructor(private http: HttpClient) { }

  createOrder(orderData: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/orders`, orderData);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders?user_id=${userId}`);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${orderId}`);
  }
}