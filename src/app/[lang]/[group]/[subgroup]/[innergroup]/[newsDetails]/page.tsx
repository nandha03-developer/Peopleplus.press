"use client";
import React, { useContext, useEffect, useState } from 'react';
import { GroupSubGroupContext } from "@/context/allGroupContext";
import Newslist from '@/components/newsList';
import axios from 'axios';
import NewsDetails from '@/components/newsDetails';
import { useCurrentNewsContext } from "@/context/newsContext";

function Page({ params }: any) {
   const { group } = params;
  const [groupData, setGroupData] = useState([])
  const [newsItems, setNewsItems] = useState<any>([])
  const { currentNews} = useContext(GroupSubGroupContext);


//   useEffect(() => {
//     if (Array.isArray(allGroups)) {
//       const normalizedGroup = group.url;
//       const obj = allGroups.find((item: any) =>
//         item.url == normalizedGroup
//       );
//       if (obj) {
// setGroupData(obj);
//       } else {
//       }
//     } else {
//     }
//   }, [group, allGroups]);

  

  return (
    <>
      <NewsDetails newsItems={currentNews} groupData={groupData} />
    </>
  );
}

export default Page;
