import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Add global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  
  // Check if it's a browser extension error
  const reason = event.reason?.message || event.reason || '';
  if (typeof reason === 'string' && 
      (reason.includes('message channel closed') || 
       reason.includes('listener indicated an asynchronous response'))) {
    // Prevent the error from being logged as uncaught
    event.preventDefault();
    console.warn('Browser extension error suppressed:', reason);
  }
});

// Add global error event handler
window.addEventListener('error', (event) => {
  const message = event.message || '';
  if (message.includes('message channel closed') || 
      message.includes('listener indicated an asynchronous response')) {
    console.warn('Browser extension error suppressed:', message);
    event.preventDefault();
  }
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
