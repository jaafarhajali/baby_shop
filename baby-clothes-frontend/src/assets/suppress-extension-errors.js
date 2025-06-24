// Extension Error Suppression Script
// Add this to suppress common browser extension errors

(function() {
    'use strict';
    
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Patterns that indicate browser extension errors
    const extensionErrorPatterns = [
        'A listener indicated an asynchronous response by returning true',
        'message channel closed before a response was received',
        'Extension context invalidated',
        'chrome-extension://',
        'moz-extension://',
        'safari-extension://'
    ];
    
    function isExtensionError(message) {
        return extensionErrorPatterns.some(pattern => 
            message.toString().includes(pattern)
        );
    }
    
    // Override console.error to filter extension errors
    console.error = function(...args) {
        const message = args.join(' ');
        if (!isExtensionError(message)) {
            originalError.apply(console, args);
        } else {
            // Optionally log as debug info instead
            console.debug('Extension error suppressed:', message);
        }
    };
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason?.message || event.reason || '';
        if (isExtensionError(reason)) {
            event.preventDefault(); // Prevent the error from being logged
            console.debug('Extension promise rejection suppressed:', reason);
        }
    });
    
    // Handle general errors
    window.addEventListener('error', function(event) {
        const message = event.message || '';
        if (isExtensionError(message)) {
            event.preventDefault();
            console.debug('Extension error suppressed:', message);
        }
    });
    
    console.info('Extension error suppression active');
})();
