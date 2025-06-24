import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Favorite, AddToFavoritesRequest } from '../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private baseUrl = 'http://localhost/baby-clothes-shop/baby-clothes-api/api.php';
  private favoritesSubject = new BehaviorSubject<Favorite[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) { }

  getFavorites(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.baseUrl}/favorites?user_id=${userId}`)
      .pipe(
        tap(favorites => this.favoritesSubject.next(favorites))
      );
  }

  addToFavorites(item: AddToFavoritesRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/favorites`, item)
      .pipe(
        tap(() => this.refreshFavorites(item.user_id))
      );
  }

  removeFromFavorites(favoriteId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/favorites/${favoriteId}`)
      .pipe(
        tap(() => this.refreshFavorites(userId))
      );
  }

  isFavorite(productId: number): Observable<boolean> {
    return new Observable(observer => {
      this.favorites$.subscribe(favorites => {
        const isFav = favorites.some(fav => fav.product_id === productId);
        observer.next(isFav);
      });
    });
  }

  private refreshFavorites(userId: number): void {
    this.getFavorites(userId).subscribe();
  }
}