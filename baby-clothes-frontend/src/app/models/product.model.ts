export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'clothing' | 'accessories' | 'toys' | 'feeding' | 'safety';
  subcategory: string;
  age_group: 'newborn' | '0-3months' | '3-6months' | '6-12months' | '12-18months' | '18-24months' | '2-3years';
  size: string;
  gender: 'boy' | 'girl' | 'unisex';
  color: string;
  material: string;
  brand: string;
  stock_quantity: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilter {
  category?: string;
  age_group?: string;
  gender?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name' | 'newest';
  minPrice?: number;
  maxPrice?: number;
}

export interface Category {
  categories: {
    [key: string]: string[];
  };
  age_groups: string[];
  genders: string[];
}