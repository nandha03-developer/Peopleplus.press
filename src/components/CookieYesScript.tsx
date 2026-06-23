"use client";
import { useEffect } from 'react';

const CookieYesScript = () => {
  useEffect(() => {
    // Create and load CookieYes script with error handling
    const script = document.createElement('script');
    script.async = true;
    script.id = 'cookieyes';
    script.type = 'text/javascript';
    script.src = 'https://cdn-cookieyes.com/client_data/710a6d5bf3b48347daaf53f4/script.js';
    
    script.onerror = (error) => {
      console.warn('CookieYes script failed to load:', error);
      // Remove the script element if it fails to load
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    script.onload = () => {
      console.log('CookieYes script loaded successfully');
    };

    // Add script to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.getElementById('cookieyes');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CookieYesScript;
