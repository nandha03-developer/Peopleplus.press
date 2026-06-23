/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client"
import React, { use, useContext, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import StickyBox from "react-sticky-box";
import RelatedArticles from "@/components/ltr/related-articles/related-articles";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import axios from 'axios';
import Layout from '@/components/ltr/layout/layout';
import Image from 'next/image';
import animationData from '../../../../../../../public/assets/images/data 11.json';
import Lottie, { LottieRef } from 'lottie-react';
import { Box, Dialog, CircularProgress } from '@mui/material';
import dynamic from "next/dynamic";
import TimeDisplay from "@/components/timeDisplay";
import { useNewsContext } from "@/context/mostViewedContext"; //Most Viewed
import { useLikedItems } from "@/context/likedNewsContext"; //Liked News
import Head from 'next/head';
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton if using Material-UI
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import ShareButtons from '@/components/socialMediaSharing';
import { FaBookmark } from "react-icons/fa";
import { useSavedItems } from "@/context/savedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { FaRegBookmark } from 'react-icons/fa6';
import LoginModal from '@/components/login-modal/login-modal';
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useRouter } from "next/navigation";
import FloatingActionButtons from '@/components/floatingbuttton';
import SocialMediaIcons from '@/components/socialMediaIcons';
import CommentsForm from '@/components/commentsForm';
import ReporterDataSpeaker from '@/components/reporterDataSpeaker';
import CarouselDetails from '@/components/indiaComponent/carouselDetails';
import { useLanguage } from '@/context/languageContext';

const Editor = dynamic(() => import("react-draft-wysiwyg").then(mod => mod.Editor), { ssr: false });

const NewsDetailPage = ({ params }: any) => {
  const resolvedParams: any = use(params);
  const indiaDetailsParams = (resolvedParams.indiaDetailsId);
  const { langCode } = useLanguage();
  const lang = langCode
  const [newsItems, setNewsItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [mostViewed, setMostViewed] = useState<any>([]); //To store most viewd news
  const [popularNews, setPopularNews] = useState<any>([]); //To store popular news
  const [nextNews, setNextNews] = useState<any>([]);
  const [loadingImg, setLoadingImg] = useState(true);
  const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems(); //Liked News
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState(null);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const { activeItems, handleIconClick } = useSavedItems();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [defaultFontSize, setDefaultFontSize] = useState(16);
  const [headerFont, setheaderFont] = useState(18);
  const [DefaultheaderFont, setDefaultheaderFont] = useState(18);
  const [isResetVisible, setIsResetVisible] = useState(false);
  const { allGroups, allsubGroups, allInnerSubGroups, setCurrentNews, location } =
    useContext(GroupSubGroupContext);
  const [stateName, setStateName] = useState(location)
  UseRemoveBodyClass(['None'], ['home-seven', 'home-nine', 'boxed-layout', 'home-six', 'home-two']);
  const router = useRouter();

  function timeout(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)

      if (!isCancelled) {
        fetchDataFromApi();
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, []);


  const fetchDataFromApi = async () => {  //Fetch data from api
    const path = window.location.pathname;
    const language = path.split('/')[1] || '';
    const segments = path.split('/').filter(segment => segment.trim() !== ''); // Split path and remove empty segments
    let languageCode = 'en'; // Default language code
    if (segments.length >= 2) {
      languageCode = segments[0]; // Assuming language code is the second segment (/en/politics)
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
      const response = await axios.get(
        `/List_api_tables?table_name=News&url_contains=${indiaDetailsParams}&language_contains=${languageId}`
      );
      const data = response.data.Data
        .filter((row: any) =>
          row.cityid !== 0 &&
          row.stateid !== 0 &&
          row.districtid !== 0
        )
        .map((row: any, index: number) => ({
          ...row,
          SNo: index + 1,
        }));
      let matchedItem = null;
      data.forEach((item: any) => {
        if (item.url == indiaDetailsParams) {
          matchedItem = item; // Store matched item
        }
      });
      if (matchedItem) {
        setNewsItems(matchedItem);
      } else {
      }

      //To fetch most viewed news
      const mostView = await axios.get(`/List_api_tables?table_name=News&groupid_eq=23&limit=5&offset=0&sort_by=Views&order=Desc&language_contains=${languageId}`);
      const mostViewedNews = mostView.data.Data
        .filter((row: any) =>
          row.cityid !== 0 &&
          row.stateid !== 0 &&
          row.districtid !== 0
        );

      setMostViewed(mostViewedNews);

      //To fetch most popular news
      const popular = await axios.get(`/Popularnews?groupid_eq=23&limit=5&language=${language}`);
      const popularNews = popular.data
      setPopularNews(popularNews)

      //To fetch next news
      const nextNewsRespinse = await axios.get(
        `/List_api_tables?table_name=News&limit=60&offset=0&language_contains=${languageCode}&groupid_eq=23`
      );
      const nextNewsData = nextNewsRespinse.data.Data.map((row: any, index: number) => {
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
      setNextNews(nextNewsData);
      setLoadingSkeleton(false)
    } catch (error) {
      console.error("There was an error fetching the news data!", error);
    } finally {
      setLoadingSkeleton(false);
    }
  };

  //lottie loading
  const lottieRef: any = useRef(null);
  useEffect(() => {
    // Access Lottie instance and slow down the animation speed
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2); // Set the speed to half (adjust as needed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const breadcrumbItem: any = stateName.find((item: any) => item.state_id == newsItems?.stateid);
  const breadcrumbSub: any = stateName.find((item: any) => item.district_id == newsItems?.districtid);

  const increaseFontSize = () => {
    setFontSize(prevFontSize => prevFontSize + 5);
    setheaderFont((prevHeaderFont: any) => prevHeaderFont + 5);
    setIsResetVisible(true); // Show the reset button when increasing font size
  };

  const decreaseFontSize = () => {
    setFontSize(prevFontSize => prevFontSize - 5);
    setheaderFont((prevHeaderFont: any) => prevHeaderFont - 5);
    setIsResetVisible(true); // Show the reset button when increasing font size

  };

  const resetFontSize = () => {
    setFontSize(defaultFontSize);
    setheaderFont(DefaultheaderFont);
    setIsResetVisible(false); // Hide the reset button after reset

  };

  const handleTags = async (item: any) => {
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
    } else if (stateDataCount == 0) {
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

  const images = newsItems?.mainimages?.split(',') || [];

  const [relatedArticles, setRelatedArticles] = useState<any>([]);

  const fetchDataFromApiRelated = async () => {
    let languageCode = 0; // Default language code

    const pathname = window.location.pathname;
    if (pathname.startsWith("/ta")) {
      languageCode = 1; // Tamil
    } else if (pathname.startsWith("/hi")) {
      languageCode = 2; // Hindi
    } else {
      languageCode = 0; // English
    }

    // Fetch data from API based on language code
    try {
      const response = await axios.get(
        `/List_api_tables?table_name=News&limit=60&offset=0&language_contains=${languageCode}&groupid_eq=23`
      );
      const data = response.data.Data.map((row: any, index: number) => {
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
      setRelatedArticles(data);
    } catch (error) {
      console.error("There was an error fetching the news data!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)

      if (!isCancelled) {
        fetchDataFromApiRelated();
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, []);



  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;

  // Calculate total pages
  const totalPages = Math.ceil(relatedArticles.length / articlesPerPage);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // Get the articles to display on the current page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const selectedArticles = relatedArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setActiveButton('next');
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setActiveButton('previous');
      setTimeout(() => setActiveButton(null), 500); // Reset after 2 seconds


    }
  };

  const newsDate = new Date(newsItems?.newsdatetime);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const monthName = monthNames[newsDate.getMonth()];

  const imagesArray = newsItems.mainimages
    ? newsItems.mainimages.split(",").map((img: any) => img.trim())
    : [];
  const ogImage = imagesArray.length > 0 ? imagesArray[0] : null;


  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": newsItems.title,
    "datePublished": newsItems.newsdatetime,
    "dateModified": newsItems.newsdatetime || newsItems.newsdatetime,
    "author": {
      "@type": "Person",
      "name": newsItems.reporter
    },
    "publisher": {
      "@type": "Organization",
      "name": "People Plus",
      "logo": {
        "@type": "ImageObject",
        "url": "/public/apple-touch-icon.png", // Replace with the actual logo URL
        "width": 600,
        "height": 60
      }
    },
    "image": ogImage,
    "description": newsItems.shortcontent
  };

  const [skeletonVisible, setSkeletonVisible] = useState(true); // To control skeleton timing

  useEffect(() => {
    // Minimum skeleton display time (e.g., 500ms)
    const timer = setTimeout(() => {
      setSkeletonVisible(false); // Hide skeleton after 500ms
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [newsItems]);

  const handleImageLoadComplete = () => {
    setLoadingImg(false); // Stop loading image once fully loaded
  };
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const createEditorStateFromHTML = (html: string): EditorState | undefined => {
    if (html) {
      html = html.replace(/^"|"$/g, '');

      // Clean up any unwanted characters
      html = html.replace(/\\"/g, '"'); // Remove escaped double quotes
      html = html.replace(/\\n/g, ''); // Remove escaped newline characters
      const blocksFromHTML = convertFromHTML(html);
      var editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
      return editorState
    }
    // return EditorState.createWithContent(contentState);
  };
  useEffect(() => {
    if (newsItems && newsItems.longcontent) {
      const editorStateFromAPI = createEditorStateFromHTML(newsItems.longcontent);
      setEditorState(editorStateFromAPI || EditorState.createEmpty());
    }
  }, [newsItems]);

  //const newsId = newsItems.id

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        if (!newsItems.id || newsItems.id == undefined) return
        const response = await axios.get(`/Quotes?id=${newsItems.id}`);
        setQuotes(response.data.important_lines); // Adjust based on the structure of the response
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [newsItems.id]);

  //Social media sharing
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle =
    typeof document !== "undefined"
      ? document.title
      : "PeoplePlus - Latest Indian News, Trends, and Insights";

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

  const handleClose = () => setOpen(false);

  const handleNextNews = () => {
    const currentPathname = window.location.pathname;
    const pathParts = currentPathname.split('/');
    const lastSegment = pathParts[pathParts.length - 1];

    // Find the current index based on the last segment of the pathname
    const currentIndex = relatedArticles.findIndex(
      (story: any) => story.url && story.url.endsWith(lastSegment)
    );

    // If currentIndex is found
    if (currentIndex !== -1) {
      // Check if there is a next story available
      if (currentIndex < relatedArticles.length - 1) {
        const nextStoryUrl = relatedArticles[currentIndex + 1].url; // Get the next story URL
        window.location.href = nextStoryUrl; // Navigate to the next story
      } else {
        console.warn('No further story available.');
      }
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Automatic slide effect (optional)
  useEffect(() => {
    if (images && images.length > 0) {
      const interval = setInterval(goToNext, 3000); // Change slides every 3 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [images, currentIndex]);

  // Render only if images array is not empty
  if (!images || images.length === 0) return null;


  return (
    <>
      <Head>
        <title>{newsItems.title} - People Plus</title>
        <meta name="description" content={newsItems.shortcontent} />

        <meta property="og:title" content={newsItems.title} />
        <meta property="og:description" content={newsItems.shortcontent} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={newsItems.title} />
        <meta name="twitter:description" content={newsItems.shortcontent} />
        <meta name="twitter:image" content={newsItems.images} />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Head>
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

          <main className="page_main_wrapper">
            {/* START PAGE TITLE */}
            <div className="page-title">
              <div className="container">
                <div className="align-items-center row">
                  <div className="col">
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
                        <li className="breadcrumb-item">
                          <Link href={breadcrumbItem ? `/${lang}/india/${breadcrumbItem.state_name.toLowerCase().replace(/\s+/g, "-")}` : '/'}>
                            {breadcrumbItem ? breadcrumbItem.state_name : ''}
                          </Link>
                        </li>

                        <li className="breadcrumb-item active" aria-current="page">
                          <Link href={breadcrumbSub ? `/${lang}/india/${breadcrumbItem.state_name.toLowerCase().replace(/\s+/g, "-")}/${breadcrumbSub.district_name.toLowerCase().replace(/\s+/g, "-")}` : '/'}>
                            {breadcrumbSub ? breadcrumbSub.district_name : ''}
                          </Link>
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            {/* END OF /. PAGE TITLE */}
            <div className="container">
              <div className="row row-m">
                {/* START MAIN CONTENT */}
                <div className="col-md-8 col-p  main-content">
                  <StickyBox>
                    {/* <div className="post_details_inner"> */}

                    <div className="post_details_block details_block2">

                      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <ul className="td-category" style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0, listStyle: 'none' }}>
                          <li>
                            <span onClick={() => handleTags(newsItems.tags)} style={{ cursor: 'pointer' }} className="post-category">
                              {newsItems?.tags}
                            </span>
                          </li>
                          <li style={{ marginLeft: '7px' }}>
                            {/* Like Button with event propagation prevention */}
                            <div
                              key={newsItems?.id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); // Prevent click propagation to parent
                                handleLikeClick(e, newsItems.id)
                              }}
                              style={{
                                pointerEvents: "auto", // Ensure button remains clickable
                              }}
                            >
                              <div
                                style={{
                                  ...heartIconStyle,
                                  ...(activeLikeItems[newsItems?.id]
                                    ? activeHeartIconStyle
                                    : {}),
                                }}
                              >
                                {activeLikeItems[newsItems?.id] ? (
                                  <FavoriteIcon
                                    style={{
                                      fontSize: "20px",
                                      color: "red",
                                    }}
                                  />
                                ) : (
                                  <FavoriteBorderIcon
                                    style={{
                                      fontSize: "20px",
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
                          <li style={{ marginTop: '-7px', marginLeft: '7px' }}>
                            <div
                              // className="link-icon"
                              onClick={(event) => handleIconClick(event, newsItems.id)}
                              style={{
                                cursor: "pointer",
                                transition: "background-color 0.5s ease, color 0.5s ease",
                                backgroundColor: activeItems[newsItems?.id] ? "white" : "transparent", // Red when active, transparent otherwise
                                color: activeItems[newsItems?.id] ? "white" : "transparent", // White text when active
                                // display: "flex",
                                // alignItems: "center",
                                // marginRight: "-10px",
                                // top: "-14px",
                              }}
                            >
                              <style>{keyframes}</style>
                              {activeItems[newsItems?.id] ? (
                                <FaBookmark
                                  style={{
                                    fontSize: "16px",
                                    color: "black",
                                    animation: "bookmarkBounce 0.5s ease",
                                  }}
                                />
                              ) : (
                                <FaRegBookmark
                                  style={{
                                    fontSize: "16px",
                                    color: "black",
                                    transition: "color 0.3s ease",
                                  }}
                                />
                              )}
                            </div>


                          </li>
                          <li style={{ marginTop: '-7px' }}>
                            <ShareButtons url={shareUrl} title={shareTitle} style={{ color: 'black', fontSize: '18px' }} />
                          </li>

                        </ul>
                        <div style={{ display: 'flex', marginTop: '-12px' }}>
                          <button onClick={decreaseFontSize} style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <i className='FontAwesomeIcon icon="fa-sharp fa-solid fa-magnifying-glass-minus' style={{
                              color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black'
                            }}></i>
                          </button>
                          <button onClick={increaseFontSize} style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <i className='FontAwesomeIcon icon="fa-duotone fa-solid fa-magnifying-glass-plus' style={{
                              color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black'
                            }}></i>
                          </button>
                          {isResetVisible && (
                            <button onClick={resetFontSize} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                              <i className='FontAwesomeIcon icon="fa-sharp fa-solid fa-rotate-right' style={{
                                color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black'
                              }}></i>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="post-header">
                        <div>
                          {loadingSkeleton || !newsItems?.title ? (
                            // Show Skeleton while loading or if no title
                            <Skeleton variant="text" width={600} height={100} />
                          ) : (
                            // Actual title once loaded
                            <h2 style={{ fontSize: `${headerFont}px`, fontWeight: 'bold', color: "black", marginTop: "-20px" }}>
                              {newsItems.title}
                            </h2>
                          )}
                        </div>
                        <ReporterDataSpeaker newsItems={newsItems} />
                        {loadingSkeleton ? (
                          <Skeleton
                            variant="rectangular"
                            width={640}
                            height={400}
                          />
                        ) : (

                          <div className="slider" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            <CarouselDetails newsItems={newsItems} />
                          </div>
                        )}
                        <div className="article_comment">
                          <p style={{ fontSize: `${fontSize}px`, fontWeight: 'bold', color: "black", textAlign: "justify" }}>{quotes[0]}</p>
                        </div>
                        {loadingSkeleton ? (
                          <Skeleton variant="rectangular" animation="wave" width={620} height='400px' />
                        ) : (
                          <div style={{ fontSize: `${fontSize}px`, color: "black", textAlign: "justify", marginTop: "3%" }}>
                            <Editor
                              editorState={editorState}
                              toolbarHidden
                              readOnly
                              toolbarClassName="hide-toolbar"
                              wrapperClassName="editor-wrapper"
                              editorClassName="editor-content"
                            />
                          </div>
                        )}


                        <div className="article_comment">
                          <p style={{ fontSize: `${fontSize}px`, fontWeight: 'bold', color: "black" }}>{quotes[1]}</p>
                        </div>

                      </div>
                    </div>

                    <div>
                      <FloatingActionButtons onClick={handleNextNews} />
                    </div>

                    {/* Post footer */}
                    <div className="post-footer">
                      <div className="row thm-margin">
                        <div className="col-xs-12 col-sm-12 col-md-12 thm-padding">
                          {/* pagination */}
                          {/* /.pagination */}
                        </div>
                      </div>
                    </div>

                    {/* START RELATED ARTICLES */}
                    <div className="post-inner post-inner-2">
                      {/*post header*/}
                      <div className="post-head"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "20px"
                        }}
                      >
                        <h2 className="title">
                          <strong>Related </strong> News
                        </h2>
                        <div className="pagination-buttons" style={{ display: 'flex' }}>
                          <div
                            style={{ marginRight: '10px' }}
                            onClick={handlePreviousPage}
                            className="pagination-button"
                          >
                            <a
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                backgroundColor: activeButton === 'previous' ? '#eb0254' : '#fff',
                                color: activeButton === 'previous' ? '#fff' : 'black',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                border: '2px solid grey',
                                boxShadow: activeButton === 'previous' ? '0px 0px 10px rgba(0, 0, 0, 0.2)' : 'none',
                                margin: 0, // Remove any margin
                                padding: 0, // Remove any padding
                              }}
                              className="page-link"
                            >
                              <span style={{ fontSize: '26px', marginBottom: '7px' }}>&#171;</span>
                            </a>
                          </div>

                          <div
                            onClick={handleNextPage}
                            className="pagination-button"
                          >
                            <a
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                backgroundColor: activeButton === 'next' ? '#eb0254' : '#fff',
                                color: activeButton === 'next' ? '#fff' : 'black',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                border: '2px solid grey',
                                boxShadow: activeButton === 'next' ? '0px 0px 10px rgba(0, 0, 0, 0.2)' : 'none',
                                margin: 0, // Remove any margin
                                padding: 0, // Remove any padding
                              }}
                              className="page-link"
                            >
                              <span style={{ fontSize: '26px', marginBottom: '7px' }}>&#187;</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* post body */}
                      <div className="post-body">
                        <div className="row">
                          {selectedArticles.map((article: any) => {
                            const images = article.mainimages.split(",");
                            const firstImage =
                              images[0]?.trim() ||
                              "/path/to/fallback-image.jpg";

                            return (
                              <div
                                key={article.id}
                                className="col-xs-6 col-sm-4 col-md-4 col-padding"
                              >
                                <div className="grid-item">
                                  <div
                                    className="grid-item-img"
                                    style={{
                                      position: "relative",
                                      width: "100%",
                                      height: "135px",
                                    }}
                                  >
                                    <Link href={`${article.url}`} className="thumb">
                                      {loadingSkeleton && <Skeleton variant="rectangular" width="100%" height="135px" />}
                                      <Image
                                        src={firstImage || null}
                                        alt={article.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="img-fluid"
                                        style={{ borderRadius: '6px' }}
                                      />
                                    </Link>
                                  </div>
                                  {loadingSkeleton ? (<Box sx={{ pt: 0.5 }}>
                                    <Skeleton />
                                    <Skeleton width="60%" />
                                  </Box>) : (
                                    <h5 className="title" style={{ fontSize: '12px', color: "black", fontWeight: 'bold' }}>
                                      <Link href={`${article.url}`}  > {article.title}</Link>
                                    </h5>
                                  )}
                                  {loadingSkeleton ? (
                                    <Box sx={{ pt: 0.5 }}>
                                      <Skeleton />
                                      <Skeleton width="60%" />
                                    </Box>
                                  ) : (
                                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "7px" }}>
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          fontSize: "9px",
                                        }}
                                        onClick={() => handleTags(article.tags)}
                                        className="post-category"
                                      >
                                        {article?.tags}
                                      </span>
                                      <p
                                        className="date"
                                        style={{
                                          fontSize: "13px",
                                          color: "black",
                                          top: "4px",
                                          position: "relative",
                                        }}
                                      >
                                        <TimeDisplay dateTime={article?.newsdatetime} />
                                      </p>
                                    </div>

                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* RelatedArticles Component */}
                        <RelatedArticles />
                      </div>

                    </div>
                    <CommentsForm newsItems={newsItems} />
                  </StickyBox>
                </div>
                <div className="col-md-4 col-p rightSidebar">
                  <StickyBox>
                    <div className="add-inner">
                      {loadingSkeleton ? (
                        <Skeleton variant="rectangular" width={300} height={300} />
                      ) : (
                        <Image
                          src={newsItems?.images}
                          className="img-fluid"
                          alt="image"
                          width={300}
                          height={300}
                          style={{ borderRadius: '10px' }}
                        />
                      )}
                    </div>
                    <SocialMediaIcons />
                    <div className="tabs-wrapper">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link border-0 active"
                            id="most-viewed"
                            data-bs-toggle="tab"
                            data-bs-target="#most-viewed-pane"
                            type="button"
                            role="tab"
                            aria-controls="most-viewed-pane"
                            aria-selected="true"
                          >
                            Most Viewed
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link border-0"
                            id="popular-news"
                            data-bs-toggle="tab"
                            data-bs-target="#popular-news-pane"
                            type="button"
                            role="tab"
                            aria-controls="popular-news-pane"
                            aria-selected="false"
                          >
                            Popular news
                          </button>
                        </li>
                      </ul>
                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="most-viewed-pane"
                          role="tabpanel"
                          aria-labelledby="most-viewed"
                          tabIndex={0}
                        >
                          <div className="most-viewed">
                            <ul id="most-today" className="content tabs-content">
                              {mostViewed.map((item: any, index: any) => (
                                <li key={item.id}>
                                  <span className="count">{String(index + 1).padStart(2, '0')}</span>
                                  <div className="text" style={{ fontSize: '15px' }}
                                  >
                                    <Link style={{ color: 'black' }}
                                      href={`${item.url}`}
                                    >
                                      {item.title}
                                    </Link>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="popular-news-pane"
                          role="tabpanel"
                          aria-labelledby="popular-news"
                          tabIndex={0}
                        >
                          <div className="most-viewed">
                            {popularNews.length > 0 ? (
                              <ul id="most-today" className="content tabs-content">
                                {popularNews.map((item: any, index: any) => (
                                  <div key={item.id} className="p-post">
                                    <h4 style={{ textAlign: 'center' }}>
                                      <Link href={item.url}>
                                        {item.title}
                                      </Link>
                                    </h4>
                                    <ul className="authar-info d-flex flex-wrap justify-content-center" style={{ marginTop: '-15px', marginBottom: '-15px' }}>
                                      <li className="date d-flex" >
                                        <i className="ti ti-timer " style={{ marginRight: '5px' }} />
                                        <TimeDisplay dateTime={item?.newsdatetime} />
                                      </li>
                                    </ul>
                                  </div>
                                ))}
                              </ul>
                            ) : (
                              <p style={{ textAlign: 'center' }}>No popular news</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* END OF /. NAV TABS */}
                  </StickyBox>
                </div>
                {/* END OF /. SIDE CONTENT */}
              </div>
            </div>
          </main>
          <Dialog open={open} onClose={handleClose} PaperProps={{
            style: {
              width: '400px',
              height: 'auto',
              borderRadius: '15px',
            },
          }}>
            <LoginModal onClose={handleClose} />
          </Dialog>
        </Layout>
      )}
    </>
  );
};

export default NewsDetailPage;