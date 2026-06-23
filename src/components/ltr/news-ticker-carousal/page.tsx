// components/NewsTicker.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/languageContext";

// Define the type for each item in the trending array
interface TrendingItem {
  id: number;
  title: string;
  tags: any[];
}

// Functional component NewsTicker
const NewsTicker = ({ trending, handleDetails }: { trending: TrendingItem[], handleDetails: (item: TrendingItem) => void; }) => {
  const { langCode } = useLanguage();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Placeholder state for group and subgroup
  const [group, setGroup] = useState<any[]>([]); // Ensure to replace with proper type
  const [subGroup, setSubGroup] = useState<any[]>([]); // Ensure to replace with proper type

  const handleClickRoute = (groupid: any, subgroupid: any, title: string) => {
    try {
      const seoFriendlyTitle = title.replace(/\s+/g, '-');
      const encodedTitle = encodeURIComponent(seoFriendlyTitle);

      const matchedGroup = group.find((grp: any) => grp.uid === groupid);
      const groupName = matchedGroup?.groupname.toLowerCase().replace(/\s+/g, '-') || '';
      const matchedSubGroup = subgroupid ? subGroup.find((subgrp: any) => subgrp.uid === subgroupid) : null;
      const subGroupName = matchedSubGroup?.subgroupname.toLowerCase().replace(/\s+/g, '-') || '';

      router.push(`/${langCode}/${groupName}/${subGroupName}/${encodedTitle}`);
    } catch (error) {
      console.error('Error in routing:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % trending.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [trending.length]);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % trending.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + trending.length) % trending.length);
  };

  return (
    <div className="container">
      <div className="newstricker_inner">
        <div className="trendingnow">
          <strong>Trending</strong> Now
        </div>
        <div className="slider-container">
          <div className="slider-content">
            <div className="item" onClick={() => handleDetails(trending[currentIndex])}>
              <span style={{ cursor: 'pointer' }}>{trending[currentIndex]?.title}</span>
            </div>
          </div>
          <div className="buttons">
            <button onClick={handlePrev} disabled={trending.length <= 1}>
              <i className="fa-solid fa-chevron-left" style={{ color: '#b2b2b2' }}></i>
            </button>
            <button onClick={handleNext} disabled={trending.length <= 1}>
              <i className="fa-solid fa-chevron-right" style={{ color: '#b2b2b2' }}></i>
            </button>
          </div>
        </div>
        <style jsx>{`
          .slider-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .slider-content {
            display: flex;
            align-items: center;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
          }
          .item {
            flex-grow: 1;
          }
          .buttons {
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
          button {
            background-color: transparent;
            font-size: 12px;
            cursor: pointer;
            margin: 0 5px;
            border: 1px solid #dfdfdf;
            padding: 0px 10px;
            border-radius: 50%;
            transition: background-color 0.3s, border-color 0.3s;
          }
          button:hover {
            background-color: #eb0254; 
            border-color: #eb0254;
          }
        `}</style>
      </div>
    </div>
  );
};

// Exporting NewsTicker component as default
export default NewsTicker;
