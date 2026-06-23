"use client"
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define the context and its default values
const LanguageContext = createContext({
  langCode: 'en',
  setLangCode: (lang: string) => {},
});

// Create a provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [langCode, setLangCode] = useState<string>('');

  // Load the language code from localStorage when the component mounts
  useEffect(() => {
    const savedLanguage = localStorage.getItem('languageCode');
    if (savedLanguage) {
      setLangCode(savedLanguage);
    }
  }, [langCode]);

  // useEffect(() => {
  //   const path = window.location.pathname;
  //   const segments = path.split('/').filter(segment => segment.trim() !== '');
  //   const lan = 'en'
  //   localStorage.setItem('languageCode', lan);
  // }, []);

 // Save the language code to localStorage whenever it changes
  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment.trim() !== '');
    localStorage.setItem('languageCode', segments[0]);
  }, [langCode]);

  // useEffect(() => {
  //   const path = window.location.pathname;
  //  const segments = path.split('/').filter(segment => segment.trim() !== '');
  //   const languageToSave = segments[0] ? segments[0] : 'en';
  //   localStorage.setItem('languageCode', languageToSave);
  //   //localStorage.setItem('languageCode', langCode);
  // }, [langCode]);

  

  return (
    <LanguageContext.Provider value={{ langCode, setLangCode }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
