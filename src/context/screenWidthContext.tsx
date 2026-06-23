'use client'
import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface ScreenWidthContextType {
  width: any;
}

const ScreenWidthContext = createContext<ScreenWidthContextType | undefined>(undefined);

interface ScreenWidthProviderProps {
  children: ReactNode;
}

const ScreenWidthProvider: React.FC<ScreenWidthProviderProps> = ({ children }) => {
  const [width, setWidth] = useState<any>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ScreenWidthContext.Provider value={{ width }}>
      {children}
    </ScreenWidthContext.Provider>
  );
};

export { ScreenWidthContext, ScreenWidthProvider };
