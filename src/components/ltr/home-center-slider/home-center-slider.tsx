/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import Image from 'next/image';
import 'animate.css/animate.css';
import { Skeleton } from "@mui/material";
import TimeDisplay from "@/components/timeDisplay";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLikedItems } from "@/context/likedNewsContext";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { useSavedItems } from "@/context/savedNewsContext";
import { useNewsContext } from "@/context/mostViewedContext";
import { useLanguage } from "@/context/languageContext";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useRouter } from "next/navigation";

const HomeCenterSlider = ({ homeCenter, lang, handleDetails } : any) => {
  const [loadingImg, setLoadingImg] = useState(true);
  const { allGroups, allsubGroups, allInnerSubGroups, setCurrentNews } = useContext(GroupSubGroupContext);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { activeLikeItems, handleLikeClick } = useLikedItems();
  const { activeItems, handleIconClick } = useSavedItems();
  const { langCode } = useLanguage();
  const { fetchNewsView } = useNewsContext();
  const [locationData, setLocationData] = useState<any[]>([]); //To store state and district

  // Handle Previous and Next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % homeCenter.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? homeCenter.length - 1 : prevIndex - 1
    );
  };

  // Automatic slide transition using useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 9000); // Change slide every 5 seconds

    // Cleanup the timer on component unmount
    return () => clearInterval(timer);
  }, [homeCenter.length]);

  const [group, setGroup] = useState<any>(); //To store group data
  const [subGroup, setSubGroup] = useState<any[]>([]); //To store sub group data


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
        router.push(`/${lang}/`);
      }
    } else {
      console.error('No matching group found');
    }
};

   //Route to category page
 const handleTags = (item: any) => {
    fetchNewsView(item.id);
    setCurrentNews({ ...item });
    let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let innersubgrpname = allInnerSubGroups.find((group: any) => group.uid == item.innersubgroupid)?.innersubgroupname.trim().toLowerCase().replace(/\s+/g, '-') || ''
  
    // Check for groupid = 23
    if (item.groupid === 23) {
      // Find state and city names from locationData
      const matchedState = locationData.find((loc: any) => loc.state_id === item.stateid);
      const matchedCity = locationData.find((loc: any) => loc.city_id === item.cityid);
  
      const stateName = matchedState
        ? matchedState.state_name.toLowerCase().replace(/\s+/g, '-')
        : '';
      const cityName = matchedCity
        ? matchedCity.city_name.toLowerCase().replace(/\s+/g, '-')
        : '';
  
        if (stateName) {
          router.push(`/${langCode}/india/${stateName}`);
        } else {
          router.push(`/${langCode}/india`);
        }
  
    } 
    // else if (item.groupid === 25) {
    //   // Route for groupid = 25
    //   router.push(`/${langCode}/india/${grname}/${subgrname}`);
  
    // } 
    else {
      // Route to subgroup or default route
      //if (matchedSubGroup) {
      router.push(`/${langCode}/${grname}/${subgrname}`);
      // } else {
      //   router.push(`/${params.lang}/`);
      // }
    }
  }

  return (
    <div className="slider-container">
      {/* Previous Slide Button */}
      <button className="nav-button prev" onClick={prevSlide}>❮</button>
      
      {homeCenter.map((item : any, index : any) => (
        <div className={`slider-item ${index === currentIndex ? 'active' : ''}`} key={item.id} onClick={() => handleDetails(item)}>
          <div className="slider-post post-height-1">
            <a style={{ cursor: 'pointer' }} className="news-image">
              {loadingImg && <Skeleton variant="rectangular" width={510} height={318} />}
              <Image
                src={item.mainimages}
                alt='image'
                className="img-fluid"
                layout="fill"
                objectFit="cover"
                onLoadingComplete={() => setLoadingImg(false)}
              />
            </a>
            <div className="post-text">

            <span  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation(); 
                                    handleTags(item)
                                  }} style={{cursor: 'pointer',marginTop:'5px',
                                    pointerEvents: "auto",}} className="post-category">{item.tags}</span>
             
              <h2>

                <a style={{ cursor: 'pointer' }}>{item.title}</a>
              </h2>
              <ul className="author-info d-flex flex-wrap" style={{ listStyleType: 'none', paddingLeft: 0 }}>
  <li className="date" style={{ color: 'white' }}>
    <TimeDisplay dateTime={item?.newsdatetime} />
  </li>
  {/* Like Button next to the Date */}
  <li>
    <div
      key={item.id}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent click propagation to parent
        handleLikeClick(e, item.id);
      }}
      style={{
        cursor: "pointer",
        pointerEvents: "auto", // Ensure button remains clickable
        display: "inline-flex", // Inline to be next to the date
        alignItems: "center", // Center align the icon with the date
        marginLeft: "10px" // Space between date and like icon
      }}
    >
      {activeLikeItems[item.id] ? (
        <FavoriteIcon
          style={{
            fontSize: "20px",
            color: "red",
            animation: "heartPulse 0.5s ease", // Like animation
          }}
        />
      ) : (
        <FavoriteBorderIcon
          style={{
            fontSize: "20px",
            color: "white",
          }}
        />
      )}
    </div>
    <style>
      {`
        @keyframes heartPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}
    </style>
  </li>
</ul>

            </div>
          </div>
          <div className="link-icon" onClick={(event) => {
            event.stopPropagation();
            handleIconClick(event, item.id);
          }} style={{
            cursor: "pointer",
            color: activeItems[item.id] ? "pink" : "transparent",
          }}>
            {activeItems[item.id] ? (
              <FaBookmark style={{ fontSize: "16px", color: "white" }} />
            ) : (
              <FaRegBookmark style={{ fontSize: "16px", color: "white" }} />
            )}
          </div>

          {/* Dots for Navigation inside Image */}
          <div className="dots-container">
            {homeCenter.map((_: any, index : any) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)} // Change slide on dot click
              ></span>
            ))}
          </div>
        </div>
      ))}

      {/* Next Slide Button */}
      <button className="nav-button next" onClick={nextSlide}>❯</button>

      <style jsx>{`
        .slider-container {
          position: relative;
          overflow: hidden;
        }
        .slider-item {
          display: none;
          transition: opacity 0.5s ease-in-out;
          position: relative; // Ensure child elements can be positioned absolutely
        }
        .slider-item.active {
          display: block;
          opacity: 1;
        }
        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          padding: 10px;
          z-index: 10; // Ensures buttons are above slider
        }
       .nav-button.prev {
  left: 1px;
  border-radius: 1px;
}

.nav-button.next {
  right: 1px;
  border-radius: 1px;
}

.nav-button.prev:hover,
.nav-button.next:hover {
  background-color: #eb0254;  /* Add yellow background on hover */
  cursor: pointer;           /* Change cursor to pointer */
  color : white;
}

        .dots-container {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
        }
        .dot {
          height: 10px;
          width: 10px;
          margin: 0 5px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          display: inline-block;
          cursor: pointer;
        }
        .dot.active {
          background-color: rgba(255, 255, 255, 0.9); // Active dot color
        }
      `}</style>
    </div>
  );
};

export default HomeCenterSlider;