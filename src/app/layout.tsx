// /* eslint-disable @next/next/next-script-for-ga */
// /* eslint-disable @next/next/no-css-tags */
// // RootLayout.tsx

// import React, { ReactNode } from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "@icon/themify-icons/themify-icons.css";
// import ImportJs from "@/components/ltr/import-js/import-js";
// import Providers from "./theme-providers";
// import StyleSelectors from "@/components/rtl/style-selector/style-selector";
// import Head from "next/head";
// import "bootstrap/dist/css/bootstrap.css";
// import "./globals.css";
// import { SavedItemsProvider } from "@/context/savedNewsContext";
// import { NewsProvider } from "@/context/mostViewedContext";
// import { LikedItemsProvider } from "@/context/likedNewsContext";
// import { OgImageProvider, useOgImage } from "@/context/ogImageContext";
// import { GroupSubGroupProvider } from "@/context/allGroupContext";
// import { CurrentNewsProvider } from "@/context/newsContext";
// import { LanguageProvider } from "@/context/languageContext";
// import { ScreenWidthProvider } from "@/context/screenWidthContext";
// import { ShortsImageProvider } from "@/context/shortsImageContext";
// import ErrorBoundary from "@/components/ErrorBoundary";
// import CookieYesScript from "@/components/CookieYesScript";
// import JQueryLoader from "@/components/JQueryLoader";

// export const metadata: any = {
//   title: "PeoplePlus - Latest Indian News, Trends, and Insights",
//   description: "Get the latest Indian news, trends, and insights from PeoplePlus Press. Stay informed on politics, business, technology, and more.",
//   icons: {
//     icon: ["https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"],
//     apple: ["https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"],
//     shortcut: ["https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg"],
//   },
//   verification: {
//     google: "AtGeIsFsYtAia0m5aLXXJNZ4lbPMyw1ys0AUPIPVWdc",
//   },
//   alternates: {
//     canonical: "https://peopleplus.press/en"
//   },
//   openGraph: {
//     title: "PeoplePlus - Latest Indian News, Trends, and Insights",
//     description: "Get the latest Indian news, trends, and insights from PeoplePlus Press. Stay informed on politics, business, technology, and more.",
//     images: [{ url: "https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg" }],
//   },
// };

// interface Props {
//   children: ReactNode;
// }

// const RootLayout: React.FC<Props> = ({ children }: Props) => {
//   // const { headContent } = useOgImage(); // Use the context hook here

//   return (
//     <html lang="en">
//       <head>
//         <meta name="viewpo`rt" content="width=device-width, initial-scale=1.0" />
//         <title>PeoplePlus - Latest Indian News, Trends, and Insights</title>
//         <link rel="stylesheet" href="../globals.css" />
//         <link rel="alternate" href="https://www.peopleplus.press/en" hrefLang="ta-in" />
//         <link rel="alternate" href="https://www.peopleplus.press/en" hrefLang="hi-in" />
//         <link rel="alternate" href="https://www.peopleplus.press/en" hrefLang="gu-in" />
//         <link rel="alternate" href="https://www.peopleplus.press/en" hrefLang="kn-in" />
//         <link rel="alternate" href="https://www.peopleplus.press/en" hrefLang="mr-in" />
//         <link rel="alternate" href="https://www.peopleplus.press/en" hrefLang="pa-in" />
//         <link rel="alternate" href="https://www.peopleplus.press/en" hrefLang="sa-in" />
//         <link rel="alternate" href="https://www.peopleplus.press/en" hrefLang="te-in" />
//         <link rel="alternate" href="https://www.peopleplus.press/en" hrefLang="mal-in" />
//         <script src="https://accounts.google.com/gsi/client" async defer></script>
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "WebSite",
//               "name": "PeopleplusPress",
//               "alternateName": "Peopleplus",
//               "url": "https://peopleplus.press/en",
//               "potentialAction": {
//                 "@type": "SearchAction",
//                 "target": {
//                   "@type": "EntryPoint",
//                   "urlTemplate": "https://peopleplus.press/en/{search_term_string}"
//                 },
//                 "query-input": "required name=search_term_string"
//               },
//               "breadcrumb": {
//                 "@type": "BreadcrumbList",
//                 "itemListElement": [
//                   {
//                     "@type": "ListItem",
//                     "position": 1,
//                     "name": "Home",
//                     "item": "https://peopleplus.press/en"
//                   },
//                   {
//                     "@type": "ListItem",
//                     "position": 2,
//                     "name": "{search_term_string}",
//                     "item": "https://peopleplus.press/en/{search_term_string}"
//                   },
//                   {
//                     "@type": "ListItem",
//                     "position": 3,
//                     "name": "{search_term_strings}",
//                     "item": "https://peopleplus.press/en/{search_term_string}/{search_term_strings}"
//                   }
//                 ]
//               }
//             })
//           }}
//         />
//         <script async src="https://www.googletagmanager.com/gtag/js?id=G-W68N383P5P"></script>
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               window.dataLayer = window.dataLayer || [];
//               function gtag(){dataLayer.push(arguments);}
//               gtag('js', new Date());
//               gtag('config', 'G-W68N383P5P', {
//                 cookie_flags: 'SameSite=Strict; Secure',
//               });
//             `,
//           }}
//         />

//         {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-W68N383P5P"></script>
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               window.dataLayer = window.dataLayer || [];
//               function gtag(){dataLayer.push(arguments);}
//               gtag('js', new Date());
//               gtag('config', 'G-W68N383P5P');
//             `,
//           }}
//         /> */}
//       </head>
//       <ImportJs />
//       <body>
//         <JQueryLoader />
//         <CookieYesScript />
//         <ErrorBoundary>
//           <LanguageProvider>
//             <CurrentNewsProvider>
//               <GroupSubGroupProvider>
//                 <OgImageProvider>
//                   <NewsProvider>
//                     <SavedItemsProvider>
//                       <LikedItemsProvider>
//                         <Providers>
//                           {children}
//                           <StyleSelectors />
//                         </Providers>
//                       </LikedItemsProvider>
//                     </SavedItemsProvider>
//                   </NewsProvider>
//                 </OgImageProvider>
//               </GroupSubGroupProvider>
//             </CurrentNewsProvider>
//           </LanguageProvider>
//         </ErrorBoundary>
//       </body>
//     </html>
//   );
// };

// export default RootLayout;
