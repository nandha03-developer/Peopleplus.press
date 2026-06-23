"use client";
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

// Define the shape of news item
interface NewsItem {
  [key: string]: any; // Allows for an object with any number of properties
}

interface NewsContextType {
  currentNews: NewsItem | null;
  setCurrentNews: (news: NewsItem) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const CurrentNewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentNews, setCurrentNews] = useState<NewsItem | null>({});
 
  return (
    <NewsContext.Provider value={{ currentNews, setCurrentNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useCurrentNewsContext = (): NewsContextType => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useCurrentNewsContext must be used within a CurrentNewsProvider');
  }
  return context;
};
