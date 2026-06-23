/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useContext, useEffect, useState } from "react";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import Newslist from "@/components/newsList";
import axios from "axios";
import NewsDetails from "@/components/newsDetails";
import { Helmet } from "react-helmet";
import Head from "next/head";

function Page({ params }: any) {
  const { group, subgroup, subgroupdetail }: any = React.use(params);
  const { allGroups, allsubGroups } = useContext(GroupSubGroupContext);
  const { currentNews } = useContext(GroupSubGroupContext);
  const [relatedArticles, setRelatedArticles] = useState<any>([]);
  const [newsItems, setNewsItems] = useState<any>([]);
  const [mostView, setMostView] = useState([]);
  const [popular, setPopular] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [nextNews, setNextNews] = useState([]);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true); // Loading state

  useEffect(() => {
    if (Array.isArray(allGroups)) {
      const normalizedGroup = group.toLowerCase().replace(/-/g, " ");
      const grpobj = allGroups.find(
        (item: any) => item.groupname.toLowerCase() == normalizedGroup
      );
      const subobj = allsubGroups.find(
        (item: any) =>
          item.subgroupname.toLowerCase() ==
          subgroup.toLowerCase().replace(/-/g, " ")
      );

      if (grpobj && subobj) {
        fetchDataFromApi(grpobj.uid, subobj.uid);
      } else {
      }
    } else {
    }
  }, [group, allGroups, subgroup, allsubGroups]);

  //Fetch data from api
  const fetchDataFromApi = async (groupid: any, subgroupid: any) => {
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
        `/List_api_tables?table_name=News&status_eq=true&groupid_eq=${groupid}&subgroupid_eq=${subgroupid}&language_contains=${languageId}&url_contains=${subgroupdetail}`
      );
      const foundDetail = newsDetail.data.Data[0]
      // find(
      //   (item: any) => item.url == subgroupdetail
      // );

      setNewsItems(foundDetail || null);

      //To fetch quotes
      if(!foundDetail.id || foundDetail.id == undefined) return
      const quotes = await axios.get(`/Quotes?id=${foundDetail.id}`);
      setQuotes(quotes.data.important_lines);


      //To fetch related articles
      const response = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&groupid_eq=${groupid}&subgroupid_eq=${subgroupid}&language_contains=${languageId}&limit=100`
      );
      const data = response.data.Data.map((row: any, index: number) => {
        const imagesArray = row.mainimages
          ? row.mainimages.split(",").map((img: any) => img.trim())
          : [];
        const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
        return {
          ...row,
          SNo: index + 1,
          mainimages,
        };
      });
      setRelatedArticles(data);

      // //To fetch most views
      const mostViewData = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&groupid_eq=${groupid}&subgroupid_eq=${subgroupid}&limit=5&offset=0&sort_by=Views&order=Desc&language_contains=${languageId}`
      );
      const mostView = mostViewData.data.Data;
      setMostView(mostView);

      //To fetch popular
      const popularData = await axios.get(
        `/Popularnews?groupid=${groupid}&limit=5&language=${language}`
      );
      const popular = popularData.data;
      setPopular(popular);

      //To fetch next news
      const nextNewsResponse = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&groupid_eq=${groupid}&subgroupid_eq=${subgroupid}&language_contains=${languageId}&limit=50`
      );
      const nextNewsData = nextNewsResponse.data.Data.map((row: any, index: number) => {
        const imagesArray = row.mainimages
          ? row.mainimages.split(",").map((img: any) => img.trim())
          : [];
        const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
        return {
          ...row,
          SNo: index + 1,
          mainimages,
        };
      });
      setNextNews(nextNewsData);
      setLoadingSkeleton(false)
    } catch (error) {
      //console.error("There was an error fetching the news data!", error);
    } finally {
      setLoadingSkeleton(false)
    }
  };

  //   const imageArray = mainimages.split(",").map((url: any) => url.trim());
  // const firstImageUrl = imageArray[0];

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
    <>
      {newsItems && (
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

          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />
          <meta property="og:logo" content="https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={newsItems.title} />
          <meta name="twitter:description" content={newsItems.shortcontent} />
          <meta name="twitter:image" content={newsItems.images} />
        </Head>
      )}

      <NewsDetails
        newsItems={newsItems}
        relatedArticles={relatedArticles}
        setRelatedArticles={setRelatedArticles}
        mostViewed={mostView}
        popularNews={popular}
        loadingSkeleton={loadingSkeleton}
        setLoadingSkeleton={setLoadingSkeleton}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        quotes={quotes}
        nextNews={nextNews}
      />
    </>
  );
}

export default Page;