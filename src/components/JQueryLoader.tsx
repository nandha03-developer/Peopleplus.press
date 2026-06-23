"use client";
import { useEffect } from 'react';

const JQueryLoader = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      try {
        // Check if jQuery is already loaded
        if (!window.jQuery) {
          // Load jQuery dynamically
          const script = document.createElement('script');
          script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
          script.integrity = 'sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=';
          script.crossOrigin = 'anonymous';
          
          script.onload = () => {
            // Assign jQuery to window
            if (window.jQuery) {
              window.$ = window.jQuery;
              console.log('jQuery loaded successfully');
            }
          };
          
          script.onerror = (error) => {
            console.warn('Failed to load jQuery:', error);
          };
          
          document.head.appendChild(script);
        } else {
          // jQuery already exists, just assign $
          window.$ = window.jQuery;
        }
      } catch (error) {
        console.warn('Error setting up jQuery:', error);
      }
    }
  }, []);

  return null;
};

export default JQueryLoader;
