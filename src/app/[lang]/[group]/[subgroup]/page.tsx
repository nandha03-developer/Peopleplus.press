"use client";
import React, { useContext, useEffect, useState } from 'react';
import { GroupSubGroupContext } from "@/context/allGroupContext";
import Newslist from '@/components/newsList';
import axios from 'axios';
import Head from 'next/head';

function Page({ params }: any) {
  const { subgroup, group }: any = React.use(params);
  const { allGroups, allsubGroups } = useContext(GroupSubGroupContext);
  const [subGroupData, setSubGroupData] = useState<any>([])
  const [newsItems, setNewsItems] = useState<any>([])
  const [popular, setPopular] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true); // Loading state

  useEffect(() => {
    sessionStorage.setItem('currentPath', window.location.pathname);
    if (Array.isArray(allGroups)) {
      const normalizedGroup = group.toLowerCase().replace(/-/g, ' ');
      const grpobj = allGroups.find((item: any) =>
        item.groupname.toLowerCase() == normalizedGroup
      );
      const subobj = allsubGroups.find((item: any) =>
        item.subgroupname.toLowerCase() == subgroup.toLowerCase().replace(/-/g, ' ')
      );

      if (grpobj && subobj) {
        setSubGroupData(subobj)
        fetchDataFromApi(grpobj.uid, subobj.uid);
      } else {
      }
    } else {
    }
  }, [group, allGroups, subgroup, allsubGroups]);

   //Fetch data from api
   const fetchDataFromApi = async (groupid: any,subgroupid: any) => {
    const path = window.location.pathname;
    const language = path.split('/')[1] || '';
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
    }        try {
        const response = await axios.get(`/List_api_tables?table_name=News&status_eq=true&groupid_eq=${groupid}&subgroupid_eq=${subgroupid}&language_contains=${languageId}&limit=9`);
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

         //To fetch popular
      const popularData = await axios.get(`/Popularnews?subgroupid=${subgroupid}&limit=5&language=${language}`);
      const popular = popularData.data;
      setPopular(popular)

       //To fetch shorts
       const responseshorts = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&groupid_eq=${groupid}&subgroupid_eq=${subgroupid}&language_contains=${languageId}&shorts_contains=.`
      );
      const datashorts = responseshorts.data.Data
      setShorts(datashorts);
      setLoadingSkeleton(false)
    } catch (error) {
       // console.error('There was an error fetching the news data!', error);
    } finally {
      setLoadingSkeleton(false)
    }
};

  return (
    <>
     {subGroupData && (
        <Head>
          <title>{subGroupData?.metatitle} - People Plus</title>
          <meta name="description" content={subGroupData?.metadescription} />

          <meta property="og:title" content={subGroupData?.metatitle} />
          <meta property="og:description" content={subGroupData?.metadescription} />
          <meta property="og:image" content="https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={subGroupData?.metatitle} />
          <meta name="twitter:description" content={subGroupData?.metadescription} />
          <meta name="twitter:image" content="https://peoplepluspress.s3.amazonaws.com/image/string/pppp.jpg" />

        </Head>
      )}
      <Newslist
       newsItems={newsItems} 
       shorts={shorts}
       subGroupData={subGroupData} 
       subgrppopular={popular}
       loadingSkeleton={loadingSkeleton}
       setLoadingSkeleton={setLoadingSkeleton} />
    </>
  );
}

export default Page;
