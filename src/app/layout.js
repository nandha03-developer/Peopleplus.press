/* eslint-disable @next/next/no-css-tags */
import '@fortawesome/fontawesome-free/css/all.min.css';
import "@icon/themify-icons/themify-icons.css"
//import { Cormorant_Garamond, Roboto, Source_Sans_3 } from 'next/font/google'

import ImportJs from '@/components/ltr/import-js/import-js';
import Providers from './theme-providers';
import StyleSelectors from '@/components/rtl/style-selector/style-selector';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';

export const metadata = {
  title: 'People Plus - Latest News and Insights on Global Trends',
  description: 'Stay updated with People Plus on the latest global news, insights, and trends in technology, business, and culture. Your go-to source for in-depth analysis and expert opinions.',
  icons: {
    icon: ['/fav icon-02.ico?v=4'],
    apple: ['/fav icon-02.ico?v=4'],
    shortcut: ['/fav icon-02.ico?v=4']
  },
  verification:{
    google:"LaEfhPXuzFylditr6x2_1IZhTHa4UN_dsurp5NhhNCA"
  },
  alternates:{
    canonical:"https://peopleplus.press/en"
  },
  openGraph: {
    title: "People Plus - Latest News and Insights on Global Trends",
    description: "Stay updated with People Plus on the latest global news, insights, and trends in technology, business, and culture. Your go-to source for in-depth analysis and expert opinions.",
    images: [{ url: "/fav icon-02.ico?v=4" }],
  },
};

{/*  END OF /. FONT DECLARATION */ }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
     {/* <meta charset="UTF-8"/> */}
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>People Plus - Latest News and Insights on Global Trends</title>
    <link rel="stylesheet" href="../globals.css"/>
</head>
      <ImportJs />
      <body>
        <Providers>  
          {children}
          <StyleSelectors/>
        </Providers>

        
      </body>
    </html>
  )
}
