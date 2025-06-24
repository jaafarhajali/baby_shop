export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url: string;
  created_at: string;
}

export interface AddToCartRequest {
  user_id: number;
  product_id: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}