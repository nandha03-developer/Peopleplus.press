/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useContext, useEffect, useState } from 'react'
import Layout from "@/components/ltr/layout/layout";
import axios from 'axios';
import Link from 'next/link';
import { useLanguage } from '@/context/languageContext';
import { Box, Skeleton } from '@mui/material';
import CarouselComponent from "@/components/indiaComponent/carouselComponent";
import { GroupSubGroupContext } from '@/context/allGroupContext';
import { useRouter } from 'next/navigation';
import { useNewsContext } from '@/context/mostViewedContext';
import Image from 'next/image';
import TimeDisplay from '@/components/timeDisplay';
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StickyBox from 'react-sticky-box';
import LatestNews from '@/components/searchComponent/latestNews';


const formatName = (metrolistid: string) => {
    return metrolistid
      .split('-') // Split the string by hyphens
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word and lowercase the rest
      .join(' '); // Join the words with spaces
  };

function Page({ params }: any) {
    const { langCode } = useLanguage();
    const { searchNewsId }: any = React.use(params);
    const formattedName = formatName(searchNewsId);
    const [newsItems, setNewsItems] = useState([])
    const [loadingSkeleton, setLoadingSkeleton] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0);
    const { setCurrentNews, allGroups, allsubGroups, allInnerSubGroups, location } = useContext(GroupSubGroupContext);
    const { fetchNewsView } = useNewsContext(); //Most view
    const { activeItems, handleIconClick } = useSavedItems();
      const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems();
    const router = useRouter();

    const fetchDataFromApi = async () => {
        const path = window.location.pathname;
        const language = path.split('/')[1] || '';
        const segments = path.split('/').filter(segment => segment.trim() !== '');
        let languageCode = 'en';
        if (segments.length >= 2) {
            languageCode = segments[0];
        }
        let languageId = 0; // Default language ID
        switch (languageCode) {
            case 'ta':
                languageId = 1; // Tamil
                break;
            case 'hi':
                languageId = 2; // Hindi
                break;
        }
        try {
            const response = await axios.get(`/List_api_tables?table_name=News&Searchparms=${formattedName}&language_eq=${languageId}`);
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
            setLoadingSkeleton(false)
        } catch (error) {
            console.error('There was an error fetching the news data!', error);
        } finally {
            setLoadingSkeleton(false)
        }
    }

    useEffect(() => {
        fetchDataFromApi()
    }, [])

    const firstFivePosts = newsItems.slice(0, 5);
    const nextFourPosts = newsItems.slice(5, 9);
    const latest = newsItems.slice(9);

    //Capitalize First Letter
    const capitalizeFirstLetter = (string: any) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleClick = (item: any) => {   //Route to details page
       fetchNewsView(item.id);
        setCurrentNews({ ...item });
        let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
        let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
        let innersubgrpname = allInnerSubGroups.find((group: any) => group.uid == item.innersubgroupid)?.innersubgroupname.trim().toLowerCase().replace(/\s+/g, '-') || ''
        // Check for groupid = 23
        if (item.groupid === 23) {
          // Find state and city names from locationData
          const matchedState = location.find((loc: any) => loc.state_id === item.stateid);
          const matchedCity = location.find((loc: any) => loc.city_id === item.cityid);
    
          const stateName = matchedState
            ? matchedState.state_name.toLowerCase().replace(/\s+/g, '-')
            : '';
          const cityName = matchedCity
            ? matchedCity.city_name.toLowerCase().replace(/\s+/g, '-')
            : '';
          router.push(`/${langCode}/india/${stateName}/${cityName}/${item.url}`);
        }
        else {
          const origin = window.location.origin;
          if (!origin) {
            router.push(`https://www.peopleplus.press/en/${grname}/${subgrname}/details/${item.url}`);
          } else {
            router.push(`/${langCode}/${grname}/${subgrname}/details/${item.url}`);
          }
        }
      }
    
      const handleTags = (item: any) => {  //Route to category page
        let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
        let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
        let innersubgrpname = allInnerSubGroups.find((group: any) => group.uid == item.innersubgroupid)?.innersubgroupname.trim().toLowerCase().replace(/\s+/g, '-') || ''
        // Check for groupid = 23
        if (item.groupid === 23) {
          // Find state and city names from locationData
          const matchedState = location.find((loc: any) => loc.state_id === item.stateid);
          const matchedCity = location.find((loc: any) => loc.city_id === item.cityid);
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
        else {
          router.push(`/${langCode}/${grname}/${subgrname}`);
        }
      }

      const keyframes = `
      @keyframes bookmarkBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1.1); }
      }
    `;
    
      const heartIconStyle = {
        cursor: "pointer",
        backgroundColor: "transparent",
        marginBottom: "5px",
        display: "inline-block",
      };
    
      const activeHeartIconStyle = {
        animation: "heartPulse 0.5s ease-in-out",
      };

      const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % firstFivePosts.length);
      };
    
      const prevSlide = () => {
        setCurrentIndex(
          (prevIndex) =>
            (prevIndex - 1 + firstFivePosts.length) % firstFivePosts.length
        );
      };
    
      const goToSlide = (index: any) => {
        setCurrentIndex(index);
      };
    
      useEffect(() => {  // Automatic slide effect
        if (firstFivePosts.length > 0) {
          const interval = setInterval(nextSlide, 9000); // Change slides every 3 seconds
          return () => clearInterval(interval); // Cleanup interval on unmount
        }
      }, [firstFivePosts, currentIndex]);

    return (
        <Layout>
            <>
                <div className="page-title">
                    <div className="container">
                        <div className="align-items-center row">
                            <div className="col">
                                <h1 className="mb-sm-0">
                                    <strong>{capitalizeFirstLetter(searchNewsId.replace(/-/g, ' '))}</strong>
                                </h1>
                            </div>
                            <div className="col-12 col-sm-auto">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb d-inline-block">
                                        <li className="breadcrumb-item">
                                            <Link href={`/${langCode}`}>Home</Link>
                                        </li>

                                        <li className="breadcrumb-item active" aria-current="page">
                                            {capitalizeFirstLetter(searchNewsId)}
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="page_main_wrapper">
                    <section className="slider-inner">
                        <div className="container">
                            <div className="row thm-margin">
                                {loadingSkeleton ? (
                                    <Skeleton variant="rectangular" animation='wave' width='100%' height='500px' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                                ) : (
                                    <>
                                        <div className="col-md-6 thm-padding">
                                        <div
                            className="slider-container"
                            style={{ position: "relative" }}
                          >
                            <button
                              className="nav-button prev"
                              onClick={prevSlide}
                            >
                              ❮
                            </button>
                            {firstFivePosts.map((post: any, index: any) => (
                              <div
                                key={post.id}
                                className={`slider-post post-height-1 ${index === currentIndex ? "active" : "inactive"
                                  }`}
                                style={{
                                  display:
                                    index === currentIndex ? "block" : "none",
                                }}
                                onClick={() => handleClick(post)}
                              >
                                <Image style={{ cursor: 'pointer' }}
                                  layout="fill"
                                  src={post.mainimages}
                                  alt="PeoplePlus"
                                  className="img-fluid"
                                />
                                <div className="post-text">
                                  <span
                                    className="post-category"
                                    style={{
                                      cursor: "pointer",
                                      marginTop: "5px",
                                      pointerEvents: "auto",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleTags(post);
                                    }}
                                  >
                                    {post.tags}
                                  </span>
                                  <h2>
                                    <a style={{ cursor: "pointer", pointerEvents: "auto", }}> {post.title} </a>
                                  </h2>
                                  <ul className="authar-info d-flex flex-wrap">
                                    <li className="date" style={{ color: "white" }}>
                                      <TimeDisplay dateTime={post?.newsdatetime} />
                                    </li>
                                    <li>
                                      <div
                                        key={post.id}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation(); // Prevent click propagation to parent
                                          handleLikeClick(e, post.id);
                                        }}
                                        style={{
                                          cursor: "pointer",
                                          pointerEvents: "auto", // Ensure button remains clickable
                                          display: "inline-flex", // Inline to be next to the date
                                          alignItems: "center", // Center align the icon with the date
                                          marginLeft: "10px", // Space between date and like icon
                                        }}
                                      >
                                        {activeLikeItems[post.id] ? (
                                          <FavoriteIcon
                                            style={{ fontSize: "20px", color: "red", animation: "heartPulse 0.5s ease", }} />
                                        ) : (
                                          <FavoriteBorderIcon style={{ fontSize: "20px", color: "white", }} />
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
                                  <div
                                    className="link-icon"
                                    onClick={(event) => {
                                      event.stopPropagation(); // Stop event propagation
                                      handleIconClick(event, post.id);
                                    }}
                                    style={{
                                      cursor: "pointer",
                                      transition:
                                        "background-color 0.5s ease, color 0.5s ease",
                                      color: activeItems[post.id]
                                        ? "pink"
                                        : "transparent",
                                      pointerEvents: "auto",
                                    }}
                                  >
                                    {activeItems[post.id] ? (
                                      <FaBookmark  style={{ fontSize: "16px", color: "white", animation: "bookmarkBounce 0.5s ease", }} />
                                    ) : (
                                      <FaRegBookmark style={{ fontSize: "16px", color: "white", transition: "color 0.3s ease", }} />
                                     )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button className="nav-button next" onClick={nextSlide}> ❯ </button>
                            <div className="dots-container">
                              {firstFivePosts.map((_: any, index: any) => (
                                <span
                                  key={index}
                                  className={`dot ${index === currentIndex ? "active" : ""
                                    }`}
                                  onClick={() => goToSlide(index)} // Clickable dot to navigate
                                />
                              ))}
                            </div>
                            <style jsx>{`
                            .slider-post {
                              min-height: 250px;
                              position: relative;
                            }
                            .active {
                              display: block;
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
                              left: 2px;
                            }
                            .nav-button.next {
                              right: 2px;
                            }
                            .nav-button.prev:hover,
                            .nav-button.next:hover {
                              background-color: #eb0254; /* Add background on hover */
                              color: white;
                            }
                            .inactive {
                              display: none;
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
                              background-color: rgba(
                                255,
                                255,
                                255,
                                0.9
                              ); // Active dot color
                            }
                          `}</style>
                          </div>
                                        </div>
                                        <div className="col-md-6 thm-padding">
                                            <div className="row slider-right-post thm-margin">
                                            {nextFourPosts.map((post: any) => (
                              <div key={post.id} className="col-6 col-sm-6 thm-padding">
                                <div className="slider-post post-height-2">
                                  <div
                                    onClick={() => handleClick(post)} // This is the parent click handler
                                    style={{ cursor: "pointer" }}
                                  >
                                    {loadingSkeleton ? (
                                      <Skeleton variant="rectangular" width={210} height={118} />
                                    ) : (
                                      <Image layout="fill" objectFit="cover" src={post.mainimages} alt="People Plus" className="img-fluid" />
                                    )}
                                    </div>
                                  <div
                                    className="link-icon"
                                    onClick={(event) => handleIconClick(event, post.id)}
                                    style={{
                                      cursor: "pointer",
                                      transition:
                                        "background-color 0.5s ease, color 0.5s ease",
                                      color: activeItems[post.id]
                                        ? "pink"
                                        : "transparent",
                                    }}
                                  >
                                    <style>{keyframes}</style>
                                    {activeItems[post.id] ? (
                                      <FaBookmark style={{ fontSize: "16px", color: "white", animation: "bookmarkBounce 0.5s ease", }} />
                                    ) : (
                                      <FaRegBookmark
                                        style={{fontSize: "16px", color: "white", transition: "color 0.3s ease", }} />
                                      )}
                                  </div><div className="post-text">
                                    <span className="post-category" onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleTags(post)
                                    }}
                                      style={{cursor: 'pointer', marginTop: '5px', pointerEvents: "auto",  }} >
                                     {post.tags}
                                    </span>
                                    {loadingSkeleton ? (
                                      <Box sx={{ pt: 0.5 }}>
                                        <Skeleton />
                                        <Skeleton width="60%" />
                                      </Box>
                                    ) : (
                                      <h4><p>{post.title}</p></h4>
                                     )}
                                    <ul className="authar-info d-flex flex-wrap">
                                      <li className="d-md-block d-none">
                                        <TimeDisplay dateTime={post?.newsdatetime} />
                                      </li>
                                      <li>
                                        <div
                                          key={post.id}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation(); // Prevent click propagation to parent
                                            handleLikeClick(e, post.id);
                                          }}
                                          style={{pointerEvents: "auto",}}>
                                         <div
                                            style={{
                                              ...heartIconStyle,
                                              ...(activeLikeItems[post.id]
                                                ? activeHeartIconStyle
                                                : {}),
                                            }}
                                          >
                                            {activeLikeItems[post.id] ? (
                                              <FavoriteIcon style={{ fontSize: "20px", color: "red", }} />
                                            ) : (
                                              <FavoriteBorderIcon
                                                style={{ fontSize: "20px", color: "white", }} />
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
                                        </div>
                                      </li>
                                    </ul>
                                    <div
                                      className="link-icon"
                                      onClick={(event) => handleIconClick(event, post.id)}
                                      style={{
                                        cursor: "pointer",
                                        transition:
                                          "background-color 0.5s ease, color 0.5s ease",
                                        color: activeItems[post.id]
                                          ? "pink"
                                          : "transparent",
                                      }}
                                    >
                                      <style>{keyframes}</style>
                                      {activeItems[post.id] ? (
                                        <FaBookmark style={{ fontSize: "16px", color: "white", animation: "bookmarkBounce 0.5s ease", }} />
                                      ) : (
                                        <FaRegBookmark style={{ fontSize: "16px", color: "white", transition: "color 0.3s ease", }} />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="container">
                <div className="row row-m">
                  <div className="col-xs-12 col-sm-12 col-md-12 thm-padding">
                    <StickyBox>
                      <LatestNews newsItems={latest} handleNewsDetails={handleClick} loadingSkeleton={loadingSkeleton} handleTags={handleTags} />
                    </StickyBox>
                  </div>
                </div>
              </div>
                </main>
            </>
        </Layout>
    )
}

export default Page