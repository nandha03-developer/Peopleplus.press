/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Layout from "@/components/ltr/layout/layout";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import Link from "next/link";
import StickyBox from "react-sticky-box";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import "animate.css/animate.css";
import { Box, IconButton, Pagination, Skeleton } from "@mui/material";
import Image from "next/image";
import TimeDisplay from "@/components/timeDisplay";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useNewsContext } from "@/context/mostViewedContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLanguage } from "@/context/languageContext";
import animationData from "../../public/assets/images/data 11.json"
import Lottie from 'lottie-react';
import Shortscard from "./shortscard";
import MostViewPopularList from "./newsListComponent/mostViewedPopular";
import SocialMediaIcons from "./socialMediaIcons";
import LatestNews from "./newsListComponent/latestNews";

if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

const Page = ({currentPage, setCurrentPage, latestNews,
  newsItems, groupData, shorts, subGroupData, grppopular, subgrppopular, loadingSkeleton, setLoadingSkeleton }: any) => {
  const { langCode } = useLanguage();
  const lang = langCode;
  const [topNewsItem, setTopNewsItem] = useState<any>([]);
  const { activeItems, handleIconClick } = useSavedItems();
  const { allGroups, allsubGroups, allInnerSubGroups, setCurrentNews } = useContext(GroupSubGroupContext);
  const { fetchNewsView } = useNewsContext(); //Most view
  const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems(); //Liked News
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  UseRemoveBodyClass(["None"], ["home-seven", "home-nine", "boxed-layout", "home-six", "home-two"]);

  useEffect(() => {     //To fetch Most Viewed News
    const getTopNewsItems = () => {
      if (newsItems && newsItems.length > 0) {
        const topItems = newsItems
          .filter((item: any) => item.Views !== undefined) // Ensure `views` is defined
          .sort((a: any, b: any) => b.Views - a.Views) // Sort by views in descending order
          .slice(0, 5); // Take the first 5 items
        setTopNewsItem(topItems); // Store the top 5 items in the state
      }
    };
    getTopNewsItems(); // Call the function on component mount or newsItems change
  }, [newsItems]); // Dependency array

  const trending = newsItems.slice(0, 5);
  const firstFivePosts = newsItems.slice(0, 5);
  const nextFourPosts = newsItems.slice(5, 9);

  const lottieRef: any = useRef(null);
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2); // Set the speed to half (adjust as needed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyframes = `
  @keyframes bookmarkBounce {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1.1); }
  }
`;

  const handleNewsDetails = (item: any) => {
    fetchNewsView(item.id);
    setCurrentNews({ ...item });
    let grname =
      allGroups
        .find((group: any) => group.uid == item.groupid)
        .groupname.trim()
        .toLowerCase()
        .replace(/\s+/g, "-") || "";
    let subgrname =
      allsubGroups
        .find((group: any) => group.uid == item.subgroupid)
        .subgroupname.trim()
        .toLowerCase()
        .replace(/\s+/g, "-") || "";
    let innersubgrpname =
      allInnerSubGroups
        .find((group: any) => group.uid == item.innersubgroupid)
        ?.innersubgroupname.trim()
        .toLowerCase()
        .replace(/\s+/g, "-") || "";
    if (item.innersubgroupid != null) {
      router.push(
        `/${lang}/${grname}/${subgrname}/${innersubgrpname}/${item.url}`
      );
    } else {
      router.push(`/${lang}/${grname}/${subgrname}/details/${item.url}`);
    }
    return;
  };

  const handleTags = (item: any) => {      //Route to category page
    fetchNewsView(item.id);
    setCurrentNews({ ...item });
    let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    router.push(`/${langCode}/${grname}/${subgrname}`);
  }

  const heartIconStyle = {
    cursor: "pointer",
    backgroundColor: "transparent",
    marginBottom: "5px",
    display: "inline-block",
  };

  const activeHeartIconStyle = {
    animation: "heartPulse 0.5s ease-in-out",
  };

  useEffect(() => {
    if (open) {
      const carouselElement = document.querySelector(
        "#carouselExampleIndicators"
      );
      if (carouselElement) {
        const carousel = new window.bootstrap.Carousel(carouselElement, {
          interval: 3000, // Interval in milliseconds
          ride: "carousel", // Ensure carousel is riding automatically
        });
        carouselElement.addEventListener("mouseenter", () => carousel.pause());
        carouselElement.addEventListener("mouseleave", () => carousel.cycle());
      }
    }
  }, [open]);

  useEffect(() => {
    if (modalOpen && carouselRef.current) {
      $(carouselRef.current).owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        dots: true,
        autoplay: false,
        startPosition: currentIndex,
      });
    }
    return () => {
      if (carouselRef.current) {
        $(carouselRef.current).trigger("destroy.owl.carousel");
      }
    };
  }, [modalOpen, currentIndex]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < trending.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0); // Loop back to start
      }
    }, 2000); // Change duration as needed
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [currentIndex, trending.length]);

  const handleNext = () => {
    if (currentIndex < trending.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      {loadingSkeleton ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Lottie
            animationData={animationData}
            lottieRef={lottieRef}
            loop
            autoplay
            style={{ width: '200px', height: '200px' }} // Adjust width and height as needed
          />
        </div>
      ) : (
        <Layout>
          <>
            <div className="container">
              <div className="newstricker_inner">
                <div className="trendingnow">
                  <strong>Trending</strong> Now
                </div>
                <div className="slider-container">
                  <div className="slider-content">
                    <div
                      className="item"
                      onClick={() => handleNewsDetails(trending[currentIndex])}
                    >
                      <span style={{ cursor: 'pointer' }}>{trending[currentIndex]?.title}</span>
                    </div>
                  </div>
                  <div className="buttons">
                    <button onClick={handlePrev} disabled={currentIndex === 0}>
                      <i className="fa-solid fa-chevron-left" style={{ color: '#b2b2b2' }}></i>
                    </button>
                    <button onClick={handleNext} disabled={currentIndex === trending.length - 1}>
                      <i className="fa-solid fa-chevron-right" style={{ color: '#b2b2b2' }}></i>
                    </button>
                  </div>
                </div>
                <style jsx>{`
        .vertical-slider {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          background-color: #fff;
          width: 100%;
          max-width: 600px;
          overflow: hidden; /* Hide overflowing content */
        }
        .slider-container {
  display: flex;
  align-items: center; /* Aligns items vertically in the center */
  justify-content: space-between; /* Spaces out the title and buttons */
}
        .slider-content {
          display: flex;
          align-items: center;
  flex: 1; /* Allows the title area to take available space */
            white-space: nowrap; /* Keep text in a single line */
          overflow: hidden;
        }
        .label {
          background-color: red;
          color: white;
          padding: 5px 10px;
          margin-right: 10px;
        }
        .item {
          flex-grow: 1;
          animation: scroll 3s linear infinite; /* Add scrolling animation */
        }
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); } /* Adjust as necessary */
        }
        .buttons {
        display: flex;
  justify-content: flex-end;
    align-items: center; /* Center the buttons vertically */
        }
      button {
  background-color: transparent;
  font-size: 12px;
  cursor: pointer;
  margin: 0 5px;
  border: 1px solid #dfdfdf;
  padding: 0px 10px;
  border-radius: 50%;
  transition: background-color 0.3s, border-color 0.3s; /* Smooth transition */
}
button:hover {
  background-color: #eb0254; /* Changes background to yellow on hover */
  border-color: #eb0254;     /* Changes border to yellow on hover */
 
}
      `}</style>
              </div>
            </div>
            {/* START PAGE TITLE */}
            <div className="page-title">
              <div className="container">
                <div className="align-items-center row">
                  <div className="col">
                    <h1 className="mb-sm-0">
                      {loadingSkeleton ? (
                        <Skeleton variant="text" animation='wave' width={400} height={20} />
                      ) : (
                        <strong>{groupData?.groupname || subGroupData?.subgroupname}</strong>
                      )}
                    </h1>
                  </div>
                  <div className="col-12 col-sm-auto">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb d-inline-block">
                        <li className="breadcrumb-item">
                          <Link href={`/${langCode}`}>Home</Link>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          {groupData?.groupname || subGroupData?.subgroupname}
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
                                onClick={() => handleNewsDetails(post)}
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
                                    onClick={() => handleNewsDetails(post)} // This is the parent click handler
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
                  <div className="col-sm-7 col-md-8 col-p main-content">
                    <StickyBox>
                      <LatestNews newsItems={newsItems} handleNewsDetails={handleNewsDetails} loadingSkeleton={loadingSkeleton} handleTags={handleTags} groupData={groupData?.uid} subGroupData={subGroupData?.uid} />
                    </StickyBox>
                  </div>
                  <div className="col-sm-5 col-md-4 col-p rightSidebar">
                    {loadingSkeleton ? (
                      <Skeleton variant="rectangular" animation='wave' width={300} height={200} />
                    ) : (
                      <StickyBox>
                        <SocialMediaIcons />
                        <MostViewPopularList topNewsItem={topNewsItem} grppopular={grppopular} subgrppopular={subgrppopular} handleNewsDetails={handleNewsDetails} />
                      </StickyBox>
                    )}
                  </div>
                </div>
                {shorts.length > 0 ? (
                  loadingSkeleton ? (
                    <Skeleton variant="rectangular" animation='wave' width="100%" height={400} />
                  ) : (
                    <Shortscard shortsImage={shorts} loadingSkeleton={loadingSkeleton} />
                  )
                ) : null}
              </div>
            </main>
          </>
        </Layout>
      )}
    </>
  );
};
export default Page;
