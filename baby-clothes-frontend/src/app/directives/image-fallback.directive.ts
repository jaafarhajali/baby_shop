// Angular Image Error Directive
// Add this to your Angular project for better image error handling

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {
  @Input() appImageFallback: string = 'assets/placeholder.png';

  constructor(private el: ElementRef) {}

  @HostListener('error', ['$event'])
  onImageError(event: Event) {
    const element = this.el.nativeElement as HTMLImageElement;
    
    // Set fallback image
    element.src = this.appImageFallback;
    
    // Add error styling
    element.style.background = '#f8f9fa';
    element.style.border = '2px dashed #dee2e6';
    element.style.objectFit = 'contain';
    
    // Add error class for additional styling
    element.classList.add('image-error');
    
    console.warn('Image failed to load:', event);
  }

  @HostListener('load', ['$event'])
  onImageLoad(event: Event) {
    const element = this.el.nativeElement as HTMLImageElement;
    
    // Remove error styling if image loads successfully
    element.classList.remove('image-error');
    element.classList.add('image-loaded');
  }
}

// Usage in templates:
// <img [src]="product.image_url" [alt]="product.name" appImageFallback="assets/placeholder.png" class="product-image">
