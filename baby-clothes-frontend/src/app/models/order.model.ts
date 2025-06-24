export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  user_id: number;
  total_amount: number;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

export interface OrderResponse {
  message: string;
  order_id: number;
}