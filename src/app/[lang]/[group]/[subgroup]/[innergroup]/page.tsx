"use client";
import React, { useContext, useEffect, useState } from 'react';
import Layout from "@/components/ltr/layout/layout";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import Newslist from '@/components/newsList';
import axios from 'axios';
import Head from 'next/head';

function Page({ params }: any) {
  const { subgroup, group, innergroup }: any = React.use(params);
  const { allGroups, allsubGroups, allInnerSubGroups } = useContext(GroupSubGroupContext);
  const [innerSubGroupData, setInnerSubGroupData] = useState<any>([]);
  const [newsItems, setNewsItems] = useState<any>([]);

  useEffect(() => {
    if (Array.isArray(allGroups)) {
      const normalizedGroup = group.toLowerCase();
      const grpobj = allGroups.find((item: any) =>
        item.groupname.toLowerCase() == normalizedGroup
      );
      const subobj = allsubGroups.find((item: any) =>
        item.subgroupname.toLowerCase() == subgroup.toLowerCase()
      );
      const innerSubGroupObj = allInnerSubGroups.find((item: any) =>
        item.innersubgroupname.toLowerCase() == innergroup.toLowerCase()
      );

      if (grpobj && subobj && innerSubGroupObj) {
        setInnerSubGroupData(innerSubGroupObj);
        fetchDataFromApi(grpobj.uid, subobj.uid, innerSubGroupObj.uid);
      } else {
      }
    } else {
    }
  }, [group, allGroups, subgroup, allsubGroups, innergroup, allInnerSubGroups]);

  // Fetch data from API
  const fetchDataFromApi = async (groupid: any, subgroupid: any, innerSubGroupid: any) => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment.trim() !== ''); // Split path and remove empty segments
    let languageCode = 'en';
    if (segments.length >= 2) {
      languageCode = segments[0];
    }
    let languageId = 0;
    switch (languageCode) {
      case 'ta':
        languageId = 1; // Tamil
        break;
      case 'hi':
        languageId = 2; // Hindi
        break;
    }
    try {
      const response = await axios.get(`/List_api_tables?table_name=News&groupid_eq=${groupid}&subgroupid_eq=${subgroupid}&innersubgroupid_eq=${innerSubGroupid}&language_contains=${languageId}`);
      const data = response.data.Data.map((row: any, index: number) => {
        const imagesArray = row.mainimages ? row.mainimages.split(',').map((img: any) => img.trim()) : [];
        const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
        return {
          ...row,
          SNo: index + 1,
          mainimages
        };
      });
      setNewsItems(data);
    } catch (error) {
      //console.error('There was an error fetching the news data!', error);
    }
  };

  return (
    <>
      {innerSubGroupData && (
        <Head>
          <title>{innerSubGroupData?.metatitle} - People Plus</title>
          <meta name="description" content={innerSubGroupData?.metadescription} />

          <meta property="og:title" content={innerSubGroupData?.metatitle} />
          <meta property="og:description" content={innerSubGroupData?.metadescription} />
          <meta property="og:image" content="https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={innerSubGroupData?.metatitle} />
          <meta name="twitter:description" content={innerSubGroupData?.metadescription} />
          <meta name="twitter:image" content="https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg" />

        </Head>
      )}
      {newsItems.length > 0 ? (
        <Newslist newsItems={newsItems} subGroupData={innerSubGroupData} />
      ) : (
        <Layout>
          <h2 style={{height:'100vh',display:'flex', justifyContent:'center', alignItems:'center'}}>Sorry, Currently there is no news available !</h2>
        </Layout>
      )}

    </>
  );
}

export default Page;
