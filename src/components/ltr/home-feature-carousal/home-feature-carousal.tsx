import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "animate.css/animate.css";
import Image from "next/image";
import image from "../../../../public/assets/images/masonry/home/fashion.jpg";
import sports from "../../../../public/assets/images/masonry/home/sports.jpg";
import travel from "../../../../public/assets/images/masonry/home/travel1.jpg";
import business from "../../../../public/assets/images/masonry/home/business.jpg";
import Link from "next/link";
import headerSport from '../../../../public/assets/headerImages/sport.png'
import headerBusiness from '../../../../public/assets/headerImages/business.webp'
import headerPolitics from '../../../../public/assets/headerImages/politics.png'
import headerEntertainment from '../../../../public/assets/headerImages/entertainment.png'
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { Box, CircularProgress, Skeleton } from "@mui/material";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { GroupSubGroupContext } from "@/context/allGroupContext";

// Better dynamic import with error handling
const OwlCarousel = dynamic(
    () => import("react-owl-carousel").catch(() => {
        console.warn("Failed to load OwlCarousel, using fallback");
        return { default: () => <div>Carousel not available</div> };
    }),
    {
        ssr: false,
        loading: () => <div>Loading carousel...</div>
    }
);

if (typeof window !== "undefined") {
    try {
        window.$ = window.jQuery = require("jquery");
    } catch (error) {
        console.warn("jQuery failed to load:", error);
    }
}

const HomeFeatureCarousal = ({ slider, lang, handleDetails, handleTags }: any) => {

  const [group, setGroup] = useState<any>(); //To store group data
  const [subGroup, setSubGroup] = useState<any[]>([]); //To store sub group data
  const router = useRouter();
  const { activeItems, handleIconClick } = useSavedItems();
  const { allGroups, allsubGroups, allInnerSubGroups, setCurrentNews } =
    useContext(GroupSubGroupContext);
  const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems(); //Liked News


  const handleClickRoute = (groupid: any, subgroupid: any, title: string) => {
    const seoFriendlyTitle = title.replace(/\s+/g, '-');
    const encodedTitle = encodeURIComponent(seoFriendlyTitle);
    // Find the group
    const matchedGroup = group.find((grp: any) => grp.uid === groupid);
    if (matchedGroup) {
      const groupName = matchedGroup.groupname
        .toLowerCase()
        .replace(/\s+/g, '-');
      // Find the subgroup 
      const matchedSubGroup = subgroupid ? subGroup.find((subgrp: any) => subgrp.uid === subgroupid) : null;
      if (matchedSubGroup) {
        const subGroupName = matchedSubGroup.subgroupname
          .toLowerCase()
          .replace(/\s+/g, '-');
        // Route to subgroup
        router.push(`/${lang}/${groupName}/${subGroupName}/${encodedTitle}`);
      } else {
        router.push(`/${lang}`);
      }
    } else {
      console.error('No matching group found');
    }
  };

  const [loadingImg, setLoadingImg] = useState(true);

  const heartIconStyle = {
    cursor: "pointer",
    backgroundColor: "transparent",
    marginBottom: "5px",
    display: "inline-block",
  };

  const activeHeartIconStyle = {
    animation: "heartPulse 0.5s ease-in-out",
  };

  const keyframes = `
  @keyframes bookmarkBounce {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1.1); }
  }
`;

const [isMobile, setIsMobile] = useState(false);

const handleResize = () => {
  setIsMobile(window.innerWidth <= 768); // Adjust the width as necessary
};

useEffect(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); // Check initial size

  return () => window.removeEventListener('resize', handleResize);
}, []);

  return (
<div style={{ 
    display: 'flex', 
    marginRight: '-10px',  
    flexDirection: 'row', // Keep horizontal layout
    overflowX: isMobile ? 'auto' : 'visible', // Enable horizontal scrolling for mobile
    maxWidth: isMobile ? '100%' : 'auto' // Set max width for mobile view
}}>
  {slider.map((item : any, index : any) => {
    const images = item.mainimages.split(',');
    const firstImage = images[0].trim();
    return (
      <div
        className="news-list-item"
        key={item.id}
        style={{ display: 'flex', alignItems: 'center', margin: '10px 0', minWidth: isMobile ? '100%' : 'auto' }} // Ensure each item takes full width in mobile
      >
        <div className="img-wrapper" style={{ width: '100%', height: '80px' }}>
          <a style={{ cursor: 'pointer' }} className="thumb">
            <div onClick={() => handleDetails(item)} style={{ position: 'relative', width: '100%', height: '100%' }}>
              {loadingImg && <Skeleton variant="rectangular" width={100} height={80} />}
              <Image
                src={firstImage}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                className="img-fluid"
                onLoadingComplete={() => setLoadingImg(false)}
                onError={() => {
                  console.error("Image failed to load:", firstImage);
                  setLoadingImg(false); // or handle accordingly
                }}
                style={{ borderRadius: '6px' }}
              />
            </div>
          </a>
          <div
            className="link-icon"
            onClick={(event) => {
              event.stopPropagation();
              handleIconClick(event, item.id);
            }}
            style={{
              cursor: "pointer",
              transition: "background-color 0.5s ease, color 0.5s ease",
              color: activeItems[item.id] ? "pink" : "transparent",
              borderBottomRightRadius: "5px"
            }}
          >
            <style>{keyframes}</style>
            {activeItems[item.id] ? (
              <FaBookmark
                style={{
                  fontSize: "14px",
                  color: "white",
                  animation: "bookmarkBounce 0.5s ease",
                }}
              />
            ) : (
              <FaRegBookmark
                style={{
                  fontSize: "14px",
                  color: "white",
                  transition: "color 0.3s ease",
                }}
              />
            )}
          </div>
        </div>

        <div className="post-info-2">
          <span onClick={() => handleTags(item)} style={{ cursor: 'pointer' }} className="post-category">{item.tags}</span>
          <h5 className="mb-0">
            <a onClick={() => handleDetails(item)} style={{ cursor: 'pointer' }} className="title">
              {item.title}
            </a>
          </h5>
        </div>
      </div>
    );
  })}
</div>



  );
};

export default HomeFeatureCarousal;