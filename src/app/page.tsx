"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css'
import { useOgImage } from '@/context/ogImageContext';

const Page = () => {
  const router = useRouter();
  const { headContent, fetchOgMetaData } = useOgImage();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const supportedLangs = ['ta', 'en', 'hi'];

      // Check if the current path does not start with a supported language
      if (!supportedLangs.some(lang => currentPath.startsWith(`/${lang}`))) {
        router.replace('/en' + currentPath);
        const lan = 'en'
        localStorage.setItem('languageCode', lan);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div></div>
  );
};

export default Page;
