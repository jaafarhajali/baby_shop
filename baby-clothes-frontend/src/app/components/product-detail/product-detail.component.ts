import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  loading = true;
  isFavorite = false;
  addingToCart = false;
  addingToFavorites = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
      this.checkIfFavorite(productId);
    });
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  checkIfFavorite(productId: number): void {
    if (this.authService.isLoggedIn()) {
      this.favoritesService.isFavorite(productId).subscribe(isFav => {
        this.isFavorite = isFav;
      });
    }
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to add items to cart');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product) {
      alert('Product not found');
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      alert('User session expired. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }

    this.addingToCart = true;
    
    const cartItem = {
      user_id: userId,
      product_id: this.product.id,
      quantity: this.quantity
    };
    
    console.log('Adding to cart:', cartItem);
    
    this.cartService.addToCart(cartItem).subscribe({
      next: (response) => {
        console.log('Cart add success:', response);
        this.addingToCart = false;
        alert('Product added to cart successfully!');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.addingToCart = false;
        
        let errorMessage = 'Error adding product to cart';
        if (error.status === 400) {
          errorMessage = 'Invalid request. Please check your input.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.status === 0) {
          errorMessage = 'Connection error. Please check if the server is running.';
        }
        
        alert(errorMessage);
      }
    });
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product) return;

    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.addingToFavorites = true;

    if (this.isFavorite) {
      // Remove from favorites - need to get favorite ID first
      this.favoritesService.getFavorites(userId).subscribe(favorites => {
        const favorite = favorites.find(f => f.product_id === this.product!.id);
        if (favorite) {
          this.favoritesService.removeFromFavorites(favorite.id, userId).subscribe({
            next: () => {
              this.isFavorite = false;
              this.addingToFavorites = false;
            },
            error: (error) => {
              console.error('Error removing from favorites:', error);
              this.addingToFavorites = false;
            }
          });
        }
      });
    } else {
      // Add to favorites
      this.favoritesService.addToFavorites({
        user_id: userId,
        product_id: this.product.id
      }).subscribe({
        next: () => {
          this.isFavorite = true;
          this.addingToFavorites = false;
        },
        error: (error) => {
          console.error('Error adding to favorites:', error);
          this.addingToFavorites = false;
        }
      });
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock_quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isInStock(): boolean {
    return this.product ? this.product.stock_quantity > 0 : false;
  }
}
