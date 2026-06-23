// ShortsImageContext.tsx

"use client";
import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the type for the shortsImage (you can adjust the shape of the object as needed)
// interface ShortsImage {
//   url: string;
//   title: string;
//   [key: string]: any;  // Allow for additional properties if needed
// }

interface ShortsImageContextType {
  shortsImage: any | null;
  updateShortsImage: (newImage: any) => void;
}

// Create the context with a default value of undefined
const ShortsImageContext = createContext<ShortsImageContextType | undefined>(undefined);

// Provider component to wrap your application and provide the context value
export const ShortsImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shortsImage, setShortsImage] = useState<any | null>(null);

  const updateShortsImage = (newImage: any) => {
    setShortsImage(newImage); // Update the shortsImage state
  };

  return (
    <ShortsImageContext.Provider value={{ shortsImage, updateShortsImage }}>
      {children}
    </ShortsImageContext.Provider>
  );
};

// Custom hook to access the context
export const useShortsImageContext = (): ShortsImageContextType => {
  const context = useContext(ShortsImageContext);
  if (!context) {
    throw new Error('useShortsImageContext must be used within a ShortsImageProvider');
  }
  return context;
};
