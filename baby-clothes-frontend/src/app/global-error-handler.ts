import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Filter out common browser extension errors
    if (this.isBrowserExtensionError(error)) {
      // Log these errors less prominently
      console.warn('Browser extension error (filtered):', error.message);
      return;
    }
    
    // Log application errors normally
    console.error('Application error:', error);
    
    // You can add more sophisticated error handling here
    // such as sending errors to a logging service
  }
  
  private isBrowserExtensionError(error: any): boolean {
    const message = error?.message || '';
    const stack = error?.stack || '';
    
    // Common patterns for browser extension errors
    const extensionErrorPatterns = [
      'A listener indicated an asynchronous response by returning true',
      'message channel closed',
      'Extension context invalidated',
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://',
      'Content script',
      'inject.js'
    ];
    
    return extensionErrorPatterns.some(pattern => 
      message.includes(pattern) || stack.includes(pattern)
    );
  }
}
