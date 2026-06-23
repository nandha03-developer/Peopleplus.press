/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Webstories from '@/components/webstories'
import YouTubeShorts from '@/components/youtubeShorts';
import axios from 'axios';
import Head from 'next/head';
import React, { use, useEffect, useState } from 'react'

const Page = ({ params }: any) => {
  const { shortsId }: any = use(params);
  const [newsItems, setNewsItems] = useState<any>([]);

  //Fetch data from api
  const fetchDataFromApi = async () => {
    const path = window.location.pathname;
    const language = path.split('/')[1] || '';
    const segments = path.split("/").filter((segment) => segment.trim() !== ""); // Split path and remove empty segments
    let languageCode = "en";
    if (segments.length >= 2) {
      languageCode = segments[0];
    }
    let languageId = 0;
    switch (languageCode) {
      case "ta":
        languageId = 1; // Tamil
        break;
      case "hi":
        languageId = 2; // Hindi
        break;
    }
    try {
      //To fetch particular news
      const newsDetail = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&language_contains=${languageId}&url_contains=${shortsId}&youtubeshorts_contains=https://www.youtube.com`
      );
      const foundDetail = newsDetail.data.Data.find(
        (item: any) => item.url == shortsId
      );
      setNewsItems(foundDetail || null);

    } catch (error) {
      //console.error("There was an error fetching the news data!", error);
    } 
  };

 useEffect (()=> {
  fetchDataFromApi()
 },[])

 const imagesArray = newsItems.mainimages
    ? newsItems.mainimages.split(",").map((img: any) => img.trim())
    : [];
  const ogImage = imagesArray.length > 0 ? imagesArray[0] : null;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle =
  typeof document !== "undefined"
    ? document.title
    : "PeoplePlus - Latest Indian News, Trends, and Insights";

  return (
    <div>
      <Head>
          <title>{newsItems.title} - People Plus</title>
          <meta name="description" content={newsItems.shortcontent} />

          <meta property="og:title" content={newsItems.title} />
          <meta property="og:description" content={newsItems.shortcontent} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={typeof window !== "undefined" ? window.location.href : ""}
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={newsItems.title} />
          <meta name="twitter:description" content={newsItems.shortcontent} />
          <meta name="twitter:image" content={newsItems.images} />
        </Head>
        
        <YouTubeShorts webStoryUrl={shortsId} shareUrl={shareUrl}         
        shareTitle={shareTitle} />
    </div>
  )
}

export default Page