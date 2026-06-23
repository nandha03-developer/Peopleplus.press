/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import Layout from "@/components/ltr/layout/layout";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import Link from "next/link";
import StickyBox from "react-sticky-box";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "animate.css/animate.css";
import { Box, Skeleton } from "@mui/material";
import animationData from "../../../../../public/assets/images/data 11.json";
import Lottie from "lottie-react";
import "../../../../app/page.module.css";
import Image from "next/image";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import TimeDisplay from "@/components/timeDisplay";
import { useNewsContext } from "@/context/mostViewedContext";
import { useLanguage } from "@/context/languageContext";
import { useLikedItems } from "@/context/likedNewsContext";
import { useSavedItems } from "@/context/savedNewsContext";
import Shortscard from "@/components/shortscard";
import MostViewPopular from "@/components/indiaComponent/mostViewPopularIndia";
import SocialMediaIcons from "@/components/socialMediaIcons";
import CarouselComponent from "@/components/indiaComponent/carouselComponent";
import NewsTicker from "@/components/ltr/news-ticker-carousal/page";
import { useRouter } from "next/navigation";
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}
const Page = ({ params }: any) => {
  const { langCode } = useLanguage();
  const lang = langCode;
  const [mostView, setMostView] = useState([]);
  const [popular, setPopular] = useState([]);
  const [newsItems, setNewsItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { fetchNewsView } = useNewsContext(); //Most view
  const { allGroups, allsubGroups, allInnerSubGroups, metroCities, setCurrentNews, location } = useContext(GroupSubGroupContext);
  const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems(); //Liked News
  const { activeItems, handleIconClick } = useSavedItems();
  const itemsPerPage = 5;
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shorts, setShorts] = useState<any>([]);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [latestNews, setLatestNews] = useState<any>([]);
  UseRemoveBodyClass(
    ["None"],
    ["home-seven", "home-nine", "boxed-layout", "home-six", "home-two"]
  );

  // Fetch data from api
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
      const response = await axios.get(
        "/List_api_tables?table_name=location_view&metrocity_eq=true"
      );
  
      const cityIds = response.data.Data.map((city: any) => city.district_id);

      const requests = await axios.get(
        `/List_api_tables?table_name=News&groupid_eq=23&districtid_eq=${cityIds}&limit=9&offset=0&language_contains=${languageId}`
      );
      const data = requests.data.Data.filter((row: any) => row.cityid !== 0 && row.stateid !== 0 && row.districtid !== 0).map((row: any, index: number) => {
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
      setNewsItems(data);

      //To fetch most views
      const mostViewData = await axios.get(
        `/List_api_tables?table_name=News&groupid_eq=23&status_eq=true&districtid_eq=${cityIds}&limit=5&offset=0&sort_by=Views&order=Desc&language_contains=${languageId}`
      );
      const mostView = mostViewData.data.Data;
      setMostView(mostView);

      //To fetch popular
      const popular = await axios.get(`/Popularnews?districtid_eq=${cityIds}&limit=5&language=${language}`);
      const popularNews = popular.data.filter((row: any) =>
        row.cityid !== 0 &&
        row.stateid !== 0 &&
        row.districtid !== 0
      )
      setPopular(popularNews);
      //To fetch shorts
      const responseshorts = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&districtid_eq=${cityIds}&language_contains=${languageId}&shorts_contains=.`
      );
      const datashorts = responseshorts.data.Data;
      setShorts(datashorts);
      setLoadingSkeleton(false)
    } catch (error) {
      console.error("There was an error fetching the news data!", error);
    } finally {
      setLoadingSkeleton(false);
    }
  };

  function timeout(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms) )
  }

  useEffect(() => {
   let isCancelled = false
   const handleChange = async () => {
    await timeout(1000)

    if(!isCancelled){
      sessionStorage.setItem('currentPath', window.location.pathname);
      fetchDataFromApi();
    }
   }
   handleChange()
   return () => {
    isCancelled = true
   }
  }, []);

  // useEffect(() => {
  //   sessionStorage.setItem('currentPath', window.location.pathname);
  //   fetchDataFromApi();
  // }, []);

  const handleClick = async (item: any) => {
    fetchNewsView(item.id);
    try {
      const cityData = metroCities.find((city: any) => city.district_id == item.districtid);
      if (cityData) {
        const cityName = cityData.district_name;
        if (cityName) {
          router.push(`/${lang}/india/metrocities/${cityName.trim().toLowerCase().replace(/\s+/g, '-')}/${item.url}`);
        } else {
          console.error("City name not found");
        }
      } else {
        console.error("City not found");
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  const trending = newsItems.slice(0, 5);
  const firstFivePosts = newsItems.slice(0, 5);
  const nextFourPosts = newsItems.slice(5, 9);
  const totalPages = 50
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);
  const startPage = Math.max(1, currentPage - halfVisible);
  const endPage = Math.min(totalPages, currentPage + halfVisible);
  
  // Function to handle pagination click
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const fetchNewsData = async (page: any) => {
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
      const response = await axios.get(
        "/List_api_tables?table_name=location_view&metrocity_eq=true"
      );
  
      const cityIds = response.data.Data.map((city: any) => city.district_id);
      const offset = (page - 1) + 2;

      const requests = await axios.get(
        `/List_api_tables?table_name=News&districtid_eq=${cityIds}&language_contains=${languageId}&limit=${itemsPerPage}&offset=${offset}&groupid_eq=23&status_eq=true`
      );
      const data = requests.data.Data.filter((row: any) => row.cityid !== 0 && row.stateid !== 0 && row.districtid !== 0).map((row: any, index: number) => {
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
      setLatestNews(data);

    } catch (error) {
      console.error("There was an error fetching the news data!", error);
    } finally {
      setLoadingSkeleton(false);
    }
  };

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
     await timeout(1000)
 
     if(!isCancelled){
      sessionStorage.setItem('currentPath', window.location.pathname);
      fetchNewsData(currentPage);
     }
    }
    handleChange()
    return () => {
     isCancelled = true
    }
   }, [currentPage]);

  // useEffect(() => {
  //   fetchNewsData(currentPage);
  // }, [currentPage]);

  const lottieRef: any = useRef(null);
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2); // Set the speed to half (adjust as needed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Route to category page
  const handleTags = async (item: any, newsItems: any) => {
    // Find group and subgroup names
    const grname = allGroups.find((group: any) => group.groupname === item)?.groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    const subgrname = allsubGroups.find((group: any) => group.subgroupname === item)?.subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
  
        // Fetch state data
        const selectState = await axios.get(`/List_api_tables?table_name=State&state_contains=${item}`);
        const stateDataCount = selectState.data.TotalCount;
        const stateData = selectState.data.Data[0];
  
        // If a state is found
        if (stateDataCount > 0) {
            const stateName = stateData.state.trim().toLowerCase().replace(/\s+/g, '-');
            router.push(`/${langCode}/india/${stateName}`);
            return; // Exit after successful state route
        } else if (stateDataCount == 0)  {
          const selectCity = await axios.get(`/List_api_tables?table_name=District&district_contains=${item}`);
          const cityData = selectCity.data.Data[0]; // Assuming single district match
  
          const overallState = await axios.get(`/List_api_tables?table_name=State&id_eq=${cityData.stateid}`);
          const res = overallState.data.Data[0]; 
              const districtName = cityData.district.trim().toLowerCase().replace(/\s+/g, '-');
              router.push(`/${langCode}/india/${res.state.trim().toLowerCase().replace(/\s+/g, '-')}/${districtName}`);
              return; // Exit after successful district route
        }
    else if (grname) {
        router.push(`/${langCode}/${grname}`);
    } 
    else if (subgrname) {
        router.push(`/${langCode}/${grname}/${subgrname}`);
    } 
    else {
        router.push(`/${langCode}/india`);
    }
  };

  const wrapperStyle: React.CSSProperties = { position: "relative", width: "100%", maxWidth: "228px", height: "0", paddingBottom: "68.8%", overflow: "hidden", };
  // Inline styles for the image
  const imageStyle: React.CSSProperties = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: '6px', };

  const heartIconStyle = { cursor: "pointer", backgroundColor: "transparent", marginBottom: "5px", display: "inline-block", };

  const activeHeartIconStyle = { animation: "heartPulse 0.5s ease-in-out", };

  const keyframes = `
    @keyframes bookmarkBounce {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1.1); }
    }
    `;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % trending.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [trending.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : trending.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex < trending.length - 1 ? prevIndex + 1 : 0);
  };

  return (
    <>
      {loadingSkeleton ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Lottie animationData={animationData} lottieRef={lottieRef} loop autoplay style={{ width: '200px', height: '200px' }} />
        </div>
      ) : (
        <Layout>
          <div className="container">
            <div className="newstricker_inner">
              <div className="trendingnow">
                <strong>Trending</strong> Now
              </div>
              <div className="slider-containerss">
                <div className="slider-contentss">
                  {trending.map((item: any, index: any) => (
                    <div key={item.id} className="item" onClick={(e) => handleClick(item)} style={{ transform: `translateY(-${index * 100}%)`, transition: 'transform 2s ease', opacity: index === currentIndex ? 1 : 0, height: '100%', }}>
                      <span style={{ cursor: 'pointer', display: 'block' }}>{item.title}</span>
                    </div>
                  ))}
                </div>
                <div className="buttons" style={{ zIndex: 1, marginTop: "-8px" }}>
                  <button onClick={handlePrev} disabled={trending.length <= 1} style={{ zIndex: 0 }}>
                    <i className="ti ti-angle-left" style={{ color: '#b2b2b2' }}></i>
                  </button>
                  <button onClick={handleNext} disabled={trending.length <= 1} style={{ zIndex: 0 }}>
                    <i className="ti ti-angle-right" style={{ color: '#b2b2b2' }}></i>
                  </button>
                </div>
                <style jsx>{`
      .slider-containerss {
    overflow: hidden; 
    position: relative;
    height: 50px; 
  }
  .slider-contentss {
    display: flex;
    flex-direction: column; /* Stack items vertically */
    height: 100%; /* Fill the container height */
  }
  .item {
    display: flex;
    align-items: left; /* Center align content */
    justify-content: left; /* Center align content */
    height: 50px; /* Match this to the container height */
    box-sizing: border-box; /* Prevent padding from affecting height */
    transition: opacity 2s ease; /* Fade transition for visibility */
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    position: absolute; /* Position buttons on top */
    right: 10px; /* Adjust as needed */
    top: 50%; /* Center the buttons */
    transform: translateY(-50%); /* Adjust for centering */
  }
 button {
    background-color: transparent;
    font-size: 12px;
    cursor: pointer;
    margin: 5px 0;
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
          </div>

          {/* START PAGE TITLE */}
          <div className="page-title">
            <div className="container">
              <div className="align-items-center row">
                <div className="col">
                  <h1 className="mb-sm-0">
                    <strong>Metro Cities</strong>
                  </h1>
                </div>
                <div className="col-12 col-sm-auto">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-inline-block">
                      <li className="breadcrumb-item">
                        <Link href={`/${lang}`}>Home</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link href={`/${lang}/india`}>India</Link>
                      </li>

                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Metro Cities
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* END OF /. PAGE TITLE */}
          {/* *** START PAGE MAIN CONTENT *** */}
          <main className="page_main_wrapper">
            {/* START POST BLOCK SECTION */}
            <section className="slider-inner">
              <div className="container">
                <div className="row thm-margin">
                  {loadingSkeleton ? (
                    <Skeleton variant="rectangular" animation='wave' width='100%' height='500px' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                  ) : (
                    <>
                      <div className="col-md-6 thm-padding">
                        <CarouselComponent firstFivePosts={firstFivePosts} handleClick={handleClick} handleTags={handleTags} />
                      </div>
                      <div className="col-md-6 thm-padding">
                        <div className="row slider-right-post thm-margin">
                          {nextFourPosts.map((post: any) => (
                            <div key={post.id} className="col-6 col-sm-6 thm-padding">
                              <div className="slider-post post-height-2">
                                <div style={{ cursor: "pointer" }} onClick={() => handleClick(post)}>
                                  {loadingSkeleton ? (
                                    <Skeleton variant="rectangular" width={210} height={118} />
                                  ) : (
                                    <Image layout="fill" objectFit="cover" onLoadingComplete={() => setLoadingSkeleton(false)} src={post.mainimages} alt="PeoplePlus" className="img-fluid" />)}
                                </div>

                                <div className="link-icon" onClick={(event) => handleIconClick(event, post.id)}
                                  style={{ cursor: "pointer", transition: "background-color 0.5s ease, color 0.5s ease", color: activeItems[post.id] ? "pink" : "transparent", }}>
                                  <style>{keyframes}</style>
                                  {activeItems[post.id] ? (
                                    <FaBookmark style={{ fontSize: "16px", color: "white", animation: "bookmarkBounce 0.5s ease", }} />
                                  ) : (
                                    <FaRegBookmark style={{ fontSize: "16px", color: "white", transition: "color 0.3s ease", }} />
                                  )}
                                </div>

                                <div className="post-text">
                                  <span className="post-category">{post.tags}</span>

                                  {loadingSkeleton ? (
                                    <Box sx={{ pt: 0.5 }}><Skeleton /><Skeleton width="60%" /></Box>
                                  ) : (
                                    <h4 style={{ cursor: "pointer" }}><div>{post.title}</div></h4>
                                  )}
                                  <ul className="authar-info d-flex flex-wrap">
                                    <li className="d-md-block d-none">
                                      {" "}
                                      <TimeDisplay dateTime={post?.newsdatetime} />
                                    </li>
                                    <li>
                                      <div key={post.id} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLikeClick(e, post.id); }}
                                        style={{ pointerEvents: "auto", }}>
                                        <div style={{ ...heartIconStyle, ...(activeLikeItems[post.id] ? activeHeartIconStyle : {}), }}>
                                          {activeLikeItems[post.id] ? (
                                            <FavoriteIcon name="heart" style={{ fontSize: "20px", color: "red" }} />
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
                                      </div>
                                    </li>
                                  </ul>
                                  <div className="link-icon" onClick={(event) => handleIconClick(event, post.id)}
                                    style={{ cursor: "pointer", transition: "background-color 0.5s ease, color 0.5s ease", color: activeItems[post.id] ? "pink" : "transparent", }}>
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
            {/* END OF /. POST BLOCK SECTION */}
            <div className="container">
              <div className="row row-m">
                {/* START MAIN CONTENT */}
                <div className="col-sm-7 col-md-8 col-p main-content">
                  <StickyBox>
                    <div className="post-inner">
                      {/*post header*/}
                      <div className="post-head">
                        <h2 className="title">
                          <strong>Latest</strong> News
                        </h2>
                      </div>
                      {/* post body */}
                      <div className="post-body">
                        <div className="news-list">
                          {latestNews.map((item: any) => (
                            <div key={item.id} className="news-list-item articles-list">
                              <div className="img-wrapper" style={{ cursor: "pointer" }}>
                                <div style={wrapperStyle} onClick={() => handleClick(item)}>
                                  {loadingSkeleton ? (
                                    <Skeleton variant="rectangular" width={210} height={118} />
                                  ) : (
                                    <Image src={item?.mainimages} alt="image" layout="fill" style={imageStyle} onLoadingComplete={() => setLoadingSkeleton(false)} />
                                  )}
                                </div>
                                <div className="link-icon" onClick={(event) => handleIconClick(event, item.id)}
                                  style={{ cursor: "pointer", transition: "background-color 0.5s ease, color 0.5s ease", color: activeItems[item.id] ? "pink" : "transparent", borderBottomRightRadius: "6px" }} >
                                  <style>{keyframes}</style>
                                  {activeItems[item.id] ? (
                                    <FaBookmark style={{ fontSize: "16px", color: "white", animation: "bookmarkBounce 0.5s ease", }} />
                                  ) : (
                                    <FaRegBookmark style={{ fontSize: "16px", color: "white", transition: "color 0.3s ease", }} />
                                  )}
                                </div>
                              </div>

                              <div className="post-info-2">
                                {loadingSkeleton ? (
                                  <Box sx={{ pt: 0.5 }}>
                                    <Skeleton />
                                    <Skeleton width="60%" />
                                  </Box>
                                ) : (
                                  <h4>
                                    <Link href={`/${lang}/india/metrocities/${item.subgroupid}/${item.url || item.title}`} className="title">
                                      {item.title}
                                    </Link>
                                  </h4>
                                )}
                                <ul className="authar-info d-flex flex-wrap">
                                  <li>
                                    <span className="post-category" style={{ cursor: 'pointer' }} onClick={() => handleTags(item.tags, item)}>{item.tags}</span>
                                  </li>
                                  <li style={{ marginTop: '2px' }} className="d-md-block d-none">{" "}<TimeDisplay dateTime={item?.newsdatetime} />
                                  </li>

                                  <li style={{ marginTop: '-2px' }}>
                                    <div key={item.id} onClick={(event) => handleLikeClick(event, item.id)} style={heartIconStyle}>
                                      <div style={{ ...heartIconStyle, ...(activeLikeItems[item.id] ? activeHeartIconStyle : {}), }}>
                                        {activeLikeItems[item.id] ? (
                                          <FavoriteIcon style={{ fontSize: "20px", color: "red", }} />
                                        ) : (
                                          <FavoriteBorderIcon style={{ fontSize: "20px", color: "black", }} />
                                        )}
                                      </div>
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
                                <p className="d-lg-block d-none">{item.shortcontent}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>{" "}

                      <div className="post-footer">
                        <div className="row thm-margin">
                          <div className="col-xs-12 col-sm-12 col-md-12 thm-padding">
                            <ul
                              className="pagination"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                listStyle: "none",
                                padding: 0,
                                marginBottom: "10px",
                                cursor: 'pointer'
                              }}
                            >
                              {newsItems.length > itemsPerPage && (
                                <>
                                  {/* Previous symbol */}
                                  <li
                                    style={{
                                      margin: "10px 2px 0",
                                    }}
                                    className="page-item"
                                    onClick={() =>
                                      paginate(
                                        currentPage > 1 ? currentPage - 1 : 1
                                      )
                                    }
                                  >
                                    <a
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        backgroundColor: "#fff",
                                        color: "black",
                                        textDecoration: "none",
                                        transition: "all 0.3s ease",
                                        cursor: "pointer",
                                      }}
                                      className="page-link"
                                    >
                                      <span style={{ fontSize: '26px', marginBottom: '7px' }}>&#171;</span>

                                    </a>
                                  </li>

                                  {/* Render page numbers */}
                                  {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                                    const pageNumber = startPage + index;
                                    const isCurrentPage = currentPage === pageNumber;

                                    return (
                                      <li key={pageNumber} className="page-item" style={{ margin: "10px 2px 0" }}>
                                        <a
                                          onClick={() => paginate(pageNumber)}
                                          className="page-link"
                                          style={{
                                            backgroundColor: isCurrentPage ? "#eb0254" : "#fff",
                                            color: isCurrentPage ? "#fff" : "black",
                                            borderRadius: "50%", cursor: 'pointer'
                                          }}
                                        >
                                          {pageNumber}
                                        </a>
                                      </li>
                                    );
                                  })}
                                  {/* Next symbol */}
                                  <li
                                    style={{ margin: "10px 2px 0" }}
                                    className="page-item"
                                    onClick={() => {
                                      if (currentPage < totalPages) {
                                        paginate(currentPage + 1);
                                      }
                                    }}
                                  >
                                    <a
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        backgroundColor: "#fff",
                                        color: "black",
                                        textDecoration: "none",
                                        transition: "all 0.3s ease",
                                        cursor: "pointer",
                                      }}
                                      className="page-link"
                                    >
                                      <span style={{ fontSize: '26px', marginBottom: '7px' }}>&#187;</span>
                                    </a>
                                  </li>

                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </StickyBox>
                </div>
                <div className="col-sm-5 col-md-4 col-p rightSidebar">
                  {loadingSkeleton ? (
                    <Skeleton variant="rectangular" animation='wave' width={300} height={200} />
                  ) : (
                    <StickyBox>
                      <SocialMediaIcons />
                      <MostViewPopular mostViewed={mostView} handleClick={handleClick} popularNews={popular} />
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
        </Layout>
      )}
    </>
  );
};
export default Page;
