"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { extractHeadContent } from '@/utils/parseHtmlHead';

// Define types for the context value
interface OgImageContextType {
  ogMetaData: {
    title: string | null;
    description: string | null;
    image: string | null;
  };
  fetchOgMetaData: (id: string) => Promise<void>;
  headContent?: any;
}

// Create the context with a default value (for TypeScript type safety)
const OgImageContext = createContext<OgImageContextType | undefined>(undefined);

// Create a provider component
interface OgImageProviderProps {
  children: ReactNode;
}

export function OgImageProvider({ children }: OgImageProviderProps) {
  const [ogMetaData, setOgMetaData] = useState<{
    title: string | null;
    description: string | null;
    image: string | null;
  }>({
    title: null,
    description: null,
    image: null,
  });

  const [headContent, setHeadContent] = useState<string[]>([]);

  

  const fetchOgMetaData = async (id: any) => {
    debugger
    try {
      const response = await fetch(`/ogimage?id=${id}`);
      const html: any = await response.text();
      const newContent: any = extractHeadContent(html);
      setHeadContent(newContent); 
      // Use DOMParser to parse the HTML
    //   const parser = new DOMParser();
    //   const doc = parser.parseFromString(html, 'text/html');
      
    //   // Extract meta tags
    //   const title = doc.querySelector('title')?.textContent || null;
    //   const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || null;
    //   const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null;

    //   setOgMetaData({ title, description, image });
    } catch (error) {
      console.error('Failed to fetch Open Graph meta data:', error);
    }
  };

  return (
    <OgImageContext.Provider value={{ ogMetaData, fetchOgMetaData , headContent}}>
      {children}
    </OgImageContext.Provider>
  );
}

// Custom hook to use the context
export function useOgImage() {
  const context = useContext(OgImageContext);
  if (context === undefined) {
    throw new Error('useOgImage must be used within an OgImageProvider');
  }
  return context;
}
