"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface NewsContextType {
  newsData: any;
  error: string | null;
  fetchNewsView: (id: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [newsData, setNewsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const encrypt = (value: String, key: string): string => {
    let encrypted = '';
    for (let i = 0; i < value.length; i++) {
      encrypted += String.fromCharCode(value.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return encrypted;
  };

  const fetchNewsView = async (id: String) => {
    try {
      const idString = id.toString();
      const encryptedValue = encrypt(idString, 'people@123plus');

      const response = await axios.post(`/news-view-count?id=${encryptedValue}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setNewsData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError('Failed to fetch news');
    }
  };

  return (
    <NewsContext.Provider value={{ newsData, error, fetchNewsView }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNewsContext must be used within a NewsProvider');
  }
  return context;
};
