/* eslint-disable @next/next/no-img-element */
"use client";

import Layout from "@/components/ltr/layout/layout";
import LeftCarousal from "@/components/ltr/left-carousal/left-carousal";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import Link from "next/link";
import RelatedArticles from "@/components/ltr/related-articles/related-articles";
import StickyBox from "react-sticky-box";
import NewsTicker from "@/components/ltr/news-ticker-carousal/page";
import { useRouter } from "next/navigation";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "animate.css/animate.css";
import { Box, colors, IconButton, Pagination, Skeleton } from "@mui/material";
import { format } from "date-fns"; // Import format function from date-fns
import { CircularProgress } from "@mui/material";
import LayoutTwo from "@/components/ltr/layout/layout-two";
import animationData from "../../../../public/assets/images/data 11.json";
import lottie, { AnimationConfigWithData } from "lottie-web";
import Lottie, { LottieRef } from "lottie-react";
//import "../../../../app/page.module.css"
import Image from "next/image";
import TimeDisplay from "@/components/timeDisplay";
import { useCurrentNewsContext } from "@/context/newsContext";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useNewsContext } from "@/context/mostViewedContext";
import { toast, ToastContainer } from "react-toastify";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLanguage } from "@/context/languageContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Carousel, Modal } from "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Shop2Outlined } from "@mui/icons-material";

if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

// This is for Next.js. On Rect JS remove this line

const Page = () => {
  const { langCode } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<any>([]);
  const [newsShorts, setNewsShorts] = useState<any>([]);
  const [loadingImg, setLoadingImg] = useState(true);
  const { activeItems, handleIconClick } = useSavedItems();
  const { activeLikeItems, handleLikeClick } = useLikedItems(); //Liked News
  const { fetchNewsView } = useNewsContext(); //Most view
  const {
    allGroups,
    allsubGroups,
    allInnerSubGroups,
    setCurrentNews,
    location,
  } = useContext(GroupSubGroupContext);

  UseRemoveBodyClass(
    ["None"],
    ["home-seven", "home-nine", "boxed-layout", "home-six", "home-two"]
  );

  //Fetch data from api
  const fetchDataFromApi = async () => {
    const path = window.location.pathname;
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
        `/List_api_tables?table_name=News&status_eq=true&language_contains=${languageId}&youtubeurl_contains=www.youtube.com&order=desc&limit=9`
      );
      const data = response.data.Data.map((row: any, index: number) => {
        return {
          ...row,
          SNo: index + 1,
        };
      });

      setNewsItems(data);

      const shortsRes = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&language_contains=${languageId}&youtubeshorts_contains=www.youtube.com&order=desc`
      );
      const shortsData = shortsRes.data.Data.map((row: any, index: number) => {
        return {
          ...row,
          SNo: index + 1,
        };
      });

      setNewsShorts(shortsData);
    } catch (error) {
      console.error("There was an error fetching the news data!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const handleClick = (item: any) => {
    fetchNewsView(item.id);
    router.push(`/${langCode}/videos/${item.url}`);
  };

  const lottieRef: any = useRef(null);
  useEffect(() => {
    // Access Lottie instance and slow down the animation speed
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2); // Set the speed to half (adjust as needed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lineClampStyle: React.CSSProperties = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const heartIconStyle = {
    cursor: "pointer",
    display: "inline-block",
    transition: "transform 0.5s ease",
  };

  const activeHeartIconStyle = {
    animation: "like 0.5s ease",
  };

  const keyframes = `
        @keyframes bookmarkBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1.1); }
        }
      `;

  const PreviousArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-prev"
        onClick={onClick}
        style={{ display: "block", left: "-45px" }}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          style={{
            fontSize: "30px",
            borderRadius: "70%",
            backgroundColor: "#edeff4",
            padding: "5px",
            color: "#eb0254",
            marginTop: "-30px",
            position: "relative",
          }}
        />{" "}
        {/* Increased size and red color */}
      </div>
    );
  };

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-next"
        onClick={onClick}
        style={{ display: "block", right: "-35px" }}
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{
            fontSize: "30px",
            borderRadius: "70%",
            backgroundColor: "#edeff4",
            color: "#eb0254",
            marginTop: "-30px",
            position: "relative",
          }}
        />{" "}
        {/* Increased size and red color */}
      </div>
    );
  };
  const settings = {
    dots: true,
    infinite: false,
    arrows: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />, // Adding custom next arrow
    prevArrow: <PreviousArrow />, // Adding custom previous arrow
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  //Route to category page
  const handleTags = (item: any) => {
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

    // Check for groupid = 23
    if (item.groupid === 23) {
      // Find state and city names from locationData
      const matchedState = location.find(
        (loc: any) => loc.state_id === item.stateid
      );
      const matchedCity = location.find(
        (loc: any) => loc.city_id === item.cityid
      );

      const stateName = matchedState
        ? matchedState.state_name.toLowerCase().replace(/\s+/g, "-")
        : "";
      const cityName = matchedCity
        ? matchedCity.city_name.toLowerCase().replace(/\s+/g, "-")
        : "";

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
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5; // Number of videos to show at once

  const nextSlide = () => {
    if (currentIndex + itemsPerPage < newsShorts.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };
  const handleClicks = (url: string | undefined) => {
    if (url) {
      router.push(`/${langCode}/shorts/${url}`);
    }
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Lottie
            animationData={animationData}
            lottieRef={lottieRef}
            loop
            autoplay
            style={{ width: "200px", height: "200px" }} // Adjust width and height as needed
          />
        </div>
      ) : (
        <Layout>
          {newsItems && newsItems.length == 0 ? (
            <h5
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Sorry , Currently there is no videos available.
            </h5>
          ) : (
            <div className="container">
              <div className="page-title">
                <div className="container">
                  <div className="align-items-center row">
                    <div className="col">
                      <h1 className="mb-sm-0">
                        <strong style={{ fontSize: "22px" }}>Videos</strong>
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
                            Videos
                          </li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row row-m">
                <div className="col-xs-12 col-sm-12 col-md-12 main-content">
                  <div className="row row-m">
                    {newsItems.map((item: any, index: any) => (
                      <div className="col-md-4 col-p" key={index}>
                        <div
                          className="posts card-post"
                          style={{ borderRadius: "10px" }}
                        >
                          <div className="post-grid post-grid-item">
                            <figure className="posts-thumb">
                              <span className="post-category">
                                {item.category}
                              </span>
                              {/* {loadingImg && (
                                                            <Skeleton
                                                                variant="rectangular"
                                                                width={342}
                                                                height={244}
                                                            />
                                                        )} */}
                              <a>
                                <iframe
                                  title="Embedded YouTube Video"
                                  width="342"
                                  src={
                                    item?.youtubeurl.includes("?")
                                      ? `${item?.youtubeurl.replace(
                                          "youtube.com",
                                          "youtube-nocookie.com"
                                        )}&rel=0&autohide=1`
                                      : `${item?.youtubeurl.replace(
                                          "youtube.com",
                                          "youtube-nocookie.com"
                                        )}?rel=0&autohide=1`
                                  }
                                  frameBorder="0"
                                  allowFullScreen
                                  style={{
                                    maxWidth: "100%",
                                    height: "205px",
                                    borderTopLeftRadius: "10px", // Adjust the value as needed
                                    borderTopRightRadius: "10px", // Adjust the value as needed
                                  }}
                                ></iframe>
                              </a>
                            </figure>
                            <div className="posts-inner">
                              {/* <Link href={item.link} className="posts-link" /> */}
                              <h6
                                className="posts-title"
                                style={{
                                  cursor: "pointer",
                                  marginTop: "-10px",
                                  display: "-webkit-box",
                                  WebkitBoxOrient: "vertical",
                                  WebkitLineClamp: 2,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                <a onClick={() => handleClick(item)}>
                                  {item.title}
                                </a>
                              </h6>

                              <ul className="authar-info d-flex flex-wrap">
                                <li>
                                  <span
                                    onClick={() => handleTags(item)}
                                    className="post-category"
                                    style={{
                                      color: "white",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {item?.tags}
                                  </span>
                                </li>
                                <li
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "-10px",
                                  }}
                                >
                                  <i />
                                  <TimeDisplay dateTime={item?.newsdatetime} />
                                </li>
                                <li
                                  style={{
                                    listStyleType: "none",
                                    marginTop: "13px",
                                    marginLeft: "4px",
                                  }}
                                >
                                  <div
                                    className="link-icon"
                                    onClick={(event) =>
                                      handleIconClick(event, item.id)
                                    }
                                    style={{
                                      cursor: "pointer",
                                      transition:
                                        "background-color 0.5s ease, color 0.5s ease",
                                      backgroundColor: activeItems[item.id]
                                        ? "white"
                                        : "transparent", // Red when active, transparent otherwise
                                      color: activeItems[item.id]
                                        ? "white"
                                        : "transparent", // White text when active
                                      display: "flex",
                                      alignItems: "center",
                                      marginRight: "-10px",
                                      top: "-14px",
                                    }}
                                  >
                                    <style>{keyframes}</style>
                                    {activeItems[item.id] ? (
                                      <FaBookmark
                                        style={{
                                          fontSize: "14px",
                                          color: "red",
                                          animation: "bookmarkBounce 0.5s ease",
                                        }}
                                      />
                                    ) : (
                                      <FaRegBookmark
                                        style={{
                                          fontSize: "14px",
                                          color: "black",
                                          transition: "color 0.3s ease",
                                        }}
                                      />
                                    )}
                                  </div>
                                </li>
                                <li style={{ marginTop: "3px" }}>
                                  {/* Like Button with event propagation prevention */}
                                  <div
                                    key={item.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation(); // Prevent click propagation to parent
                                      handleLikeClick(e, item.id);
                                    }}
                                    style={{
                                      pointerEvents: "auto", // Ensure button remains clickable
                                    }}
                                  >
                                    <div
                                      style={{
                                        ...heartIconStyle,
                                        ...(activeLikeItems[item.id]
                                          ? activeHeartIconStyle
                                          : {}),
                                      }}
                                    >
                                      {activeLikeItems[item.id] ? (
                                        <FavoriteIcon
                                          style={{
                                            fontSize: "18px",
                                            color: "red",
                                          }}
                                        />
                                      ) : (
                                        <FavoriteBorderIcon
                                          style={{
                                            fontSize: "18px",
                                            color: "black",
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
                                  </div>
                                </li>
                              </ul>

                              {/* <p style={lineClamp5Style}>{item.shortcontent}</p> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {" "}
                      Shorts
                    </p>
                    <div
                      className="slider-container"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "20px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        width: "100%",
                      }}
                    >
                      <button
                        className="nav-button"
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        style={{
                          backgroundColor: "#eb0254",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          padding: "10px 15px",
                          cursor: "pointer",
                          marginRight: "10px",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <i className="fas fa-chevron-left"></i>{" "}
                        {/* Previous icon */}
                      </button>
                      <div
                        className="slider"
                        style={{
                          display: "flex",
                          flexWrap: "wrap", // Allow items to wrap in the container
                          gap: "10px", // space between items
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "10px", // Space between the thumbnails
                            overflowX: "auto", // Enables horizontal scrolling if needed
                            padding: "10px", // Optional padding
                          }}
                        >
                          {newsShorts
                            .slice(
                              currentIndex,
                              currentIndex + (window.innerWidth <= 768 ? 1 : 4)
                            )
                            .map(
                              (video: {
                                youtubeshorts: string;
                                id: Key | null | undefined;
                                title: any;
                                url: string | undefined;
                              }) => {
                                const shortsId = video.youtubeshorts
                                  .split("/")
                                  .pop();
                                const thumbnailUrl = `https://img.youtube.com/vi/${shortsId}/maxresdefault.jpg`;

                                return (
                                  <img
                                    key={video.id}
                                    src={thumbnailUrl}
                                    alt={`Thumbnail for ${video.title}`}
                                    onClick={() => handleClicks(video.url)}
                                    className="thumbnail" // Apply the thumbnail class
                                  />
                                );
                              }
                            )}
                        </div>
                      </div>

                      <button
                        className="nav-button"
                        onClick={nextSlide}
                        disabled={
                          currentIndex + (window.innerWidth <= 768 ? 1 : 4) >=
                          newsShorts.length
                        }
                        style={{
                          backgroundColor: "#eb0254",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          padding: "10px 15px",
                          cursor: "pointer",
                          marginLeft: "10px",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <i className="fas fa-chevron-right"></i>{" "}
                        {/* Next icon */}
                      </button>
                    </div>

                    {/* END OF /. POST BLOCK SECTION */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Layout>
      )}
    </>
  );
};

export default Page;
