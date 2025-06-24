export interface Favorite {
  id: number;
  user_id: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string;
  created_at: string;
}

export interface AddToFavoritesRequest {
  user_id: number;
  product_id: number;
}