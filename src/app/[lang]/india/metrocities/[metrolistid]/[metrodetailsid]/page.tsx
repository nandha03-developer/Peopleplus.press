/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client"
import React, { use, useContext, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import StickyBox from "react-sticky-box";
import LayoutTwo from "@/components/ltr/layout/layout-two";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import axios from 'axios';
import { format } from "date-fns"; // Import format function from date-fns
import Layout from '@/components/ltr/layout/layout';
import Image from 'next/image';
import animationData from '../../../../../../../public/assets/images/data 11.json';
import Lottie, { LottieRef } from 'lottie-react';
import parse from 'html-react-parser';
import { Box, CircularProgress, Dialog } from '@mui/material';
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import dynamic from "next/dynamic";
import TimeDisplay from "@/components/timeDisplay";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useNewsContext } from "@/context/mostViewedContext"; //Most Viewed
import Head from 'next/head';
import { useLanguage } from "@/context/languageContext";
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton if using Material-UI
import ShareButtons from '@/components/socialMediaSharing';
import { FaBookmark } from "react-icons/fa";
import { useSavedItems } from "@/context/savedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLikedItems } from "@/context/likedNewsContext";
import { FaRegBookmark } from 'react-icons/fa6';
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import LoginModal from '@/components/login-modal/login-modal';
import { IconButton } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from "next/navigation";
import FloatingActionButtons from '@/components/floatingbuttton';
import MostViewPopular from '@/components/indiaComponent/mostViewPopularIndia';
import SocialMediaIcons from '@/components/socialMediaIcons';
import CommentsForm from '@/components/commentsForm';
import ReporterDataSpeaker from '@/components/reporterDataSpeaker';
import RelatedNews from '@/components/indiaComponent/relatedNews';
import CarouselDetails from '@/components/indiaComponent/carouselDetails';


const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
const NewsDetailPage = ({ params }: any) => {
  const { langCode } = useLanguage();
  const lang = langCode;
  const resolvedParams: any = use(params);
  const metroDetailsParams = (resolvedParams.metrodetailsid);
  const metroListParams = (resolvedParams.metrolistid);
  const [newsItems, setNewsItems] = useState<any>();
  const [nextNews, setNextNews] = useState<any>([])
  const [loading, setLoading] = useState(true);
  const [mostViewed, setMostViewed] = useState<any>([]); //To store most viewd news
  const [popularNews, setPopularNews] = useState<any>([]); //To store popular news
  const { fetchNewsView } = useNewsContext(); //Most view
  const [loadingImg, setLoadingImg] = useState(true);
  const { metroCities, allGroups, allsubGroups } = useContext(GroupSubGroupContext);
  const [voice, setVoice] = useState(null);
  const [tamilVoice, setTamilVoice] = useState(null);
  const [hindiVoice, setHindiVoice] = useState(null);
  const [languageCode, setLanguageCode] = useState('en');
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState(null);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const { activeItems, handleIconClick } = useSavedItems();
  const { activeLikeItems, handleLikeClick } = useLikedItems(); //Liked News
  const [commentMessage, setCommentMessage] = useState('')
  const [comments, setComments] = useState<any>([]);
  const [replyMessage, setReplyMessage] = useState(''); // For reply messages
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyCommentData, setReplyCommentData] = useState<any>([]);
  const [customer, setCustomer] = useState<any>([])
  const [open, setOpen] = useState(false);
  const [errorComment, setErrorComment] = useState('');
  const [errorReply, setErrorReply] = useState('');
  const [showControls, setShowControls] = useState(false);
  
  const [capKey, setCapKey] = useState(null); // Google reCAPTCHA key
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const router = useRouter();
  UseRemoveBodyClass(['None'], ['home-seven', 'home-nine', 'boxed-layout', 'home-six', 'home-two']);

  function timeout(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms) )
  }

  useEffect(() => {
   let isCancelled = false
   const handleChange = async () => {
    await timeout(1000)

    if(!isCancelled){
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
    const response = await axios.get(
      "/List_api_tables?table_name=location_view&metrocity_eq=true"
    );

    const cityIds = response.data.Data.map((city: any) => city.district_id);
    try {
      const response = await axios.get(
        `/List_api_tables?table_name=News&language_contains=${languageId}&groupid_eq=23`
      );
      const data = response.data.Data.map((row: any, index: number) => ({
        ...row,
        SNo: index + 1,
      }));


      let matchedItem = null;
      data.forEach((item: any) => {
        if (item.url == metroDetailsParams) {
          matchedItem = item;
        }
      });
      if (matchedItem) {
        setNewsItems(matchedItem);
      }
      //To fetch most viewed news
      const mostViewData = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&districtid_eq=${cityIds}&limit=5&offset=0&sort_by=Views&order=Desc&language_contains=${languageId}&groupid_eq=23`
      );
      const mostViewedNews = mostViewData.data.Data
      setMostViewed(mostViewedNews);

      //To fetch most popular news
      const popular = await axios.get(`/Popularnews?districtid_eq=${cityIds}&limit=5&language=${language}`);
      const popularNews = popular.data.filter((row: any) =>
        row.cityid !== 0 &&
        row.stateid !== 0 &&
        row.districtid !== 0
      );
      setPopularNews(popularNews)

      //To fetch next news
      const nextNewsResponse = await axios.get(
        `/List_api_tables?table_name=News&districtid_eq=${cityIds}&limit=60&offset=0&language_contains=${languageCode}`
      );
      const nextNewsData = nextNewsResponse.data.Data.map((row: any, index: number) => {
        const imagesArray = row.mainimages ? row.mainimages.split(',').map((img: any) => img.trim()) : [];
        const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
        return {
          ...row,
          SNo: index + 1,
          mainimages
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
  const [fontSize, setFontSize] = useState(14);
  const [defaultFontSize, setDefaultFontSize] = useState(16);
  const [headerFont, setheaderFont] = useState(18);
  const [DefaultheaderFont, setDefaultheaderFont] = useState(18);
  const [isResetVisible, setIsResetVisible] = useState(false);
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
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const createEditorStateFromHTML = (html: string): EditorState | undefined => {
    if (html) {
      html = html.replace(/^"|"$/g, "");
      html = html.replace(/\\"/g, '"'); // Remove escaped double quotes
      html = html.replace(/\\n/g, ""); // Remove escaped newline characters
      const blocksFromHTML = convertFromHTML(html);
      var editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      );
      return editorState;
    }
    // return EditorState.createWithContent(contentState);
  };
  useEffect(() => {
    if (newsItems && newsItems.longcontent) {
      const editorStateFromAPI = createEditorStateFromHTML(
        newsItems.longcontent
      );
      setEditorState(editorStateFromAPI || EditorState.createEmpty());
    }
  }, [newsItems]);

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

    const response = await axios.get(
      "/List_api_tables?table_name=location_view&metrocity_eq=true"
    );

    const cityIds = response.data.Data.map((city: any) => city.district_id);
    try {
      const response = await axios.get(
        `/List_api_tables?table_name=News&districtid_eq=${cityIds}&limit=60&offset=0&language_contains=${languageCode}&groupid_eq=23`
      );
      const data = response.data.Data.map((row: any, index: number) => {
        const imagesArray = row.mainimages ? row.mainimages.split(',').map((img: any) => img.trim()) : [];
        const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
        return {
          ...row,
          SNo: index + 1,
          mainimages
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
 
     if(!isCancelled){
      fetchDataFromApiRelated();
     }
    }
    handleChange()
    return () => {
     isCancelled = true
    }
   }, []);

  

  const newsDate = new Date(newsItems?.newsdatetime);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthName = monthNames[newsDate.getMonth()];
  const containerRef = useRef<HTMLLIElement | null>(null);

  const imagesArray = newsItems?.mainimages
    ? newsItems.mainimages.split(",").map((img: any) => img.trim())
    : [];
  const ogImage = imagesArray.length > 0 ? imagesArray[0] : null;


  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": newsItems?.title,
    "datePublished": newsItems?.newsdatetime,
    "dateModified": newsItems?.newsdatetime || newsItems?.newsdatetime,
    "author": {
      "@type": "Person",
      "name": newsItems?.reporter
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
    "description": newsItems?.shortcontent
  };

  const [skeletonVisible, setSkeletonVisible] = useState(true); // To control skeleton timing

  useEffect(() => {
    const timer = setTimeout(() => {
      setSkeletonVisible(false); // Hide skeleton after 500ms
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [newsItems]);

  const newsId = newsItems?.id
  useEffect(() => {
    if(!newsId || newsId == undefined) return
    const fetchQuotes = async () => {
      try {
        const response = await axios.get(`/Quotes?id=${newsId}`);
        setQuotes(response.data.important_lines); // Adjust based on the structure of the response
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [newsId]);

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

  const heartIconStyle = {cursor: "pointer",backgroundColor: "transparent",marginBottom: "5px",display: "inline-block",};

  const activeHeartIconStyle = { animation: "heartPulse 0.5s ease-in-out",};

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

  const handleClick = async (item: any) => {
    fetchNewsView(item.id);
    try {
      const cityData = metroCities.find((city: any) => city.city_id == item.cityid);
      if (cityData) {
        const cityName = cityData.city_name;
        if (cityName) {
          router.push(`/${lang}/india/metrocities/${cityName}/${item.url}`);
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

  const handleClose = () => setOpen(false);

  //Next News
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

  return (
    <>
      <Head>
        <title>{newsItems?.title} - People Plus</title>
        <meta name="description" content={newsItems?.shortcontent} />
        <meta property="og:title" content={newsItems?.title} />
        <meta property="og:description" content={newsItems?.shortcontent} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={newsItems?.title} />
        <meta name="twitter:description" content={newsItems?.shortcontent} />
        <meta name="twitter:image" content={newsItems?.images} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Head>

      {loadingSkeleton ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Lottie animationData={animationData}lottieRef={lottieRef} loop autoplay style={{ width: '200px', height: '200px' }}/></div>
      ) : (
        <Layout>
          {/* *** START PAGE MAIN CONTENT *** */}
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
                          <Link href={`/${langCode}`}>Home</Link>
                        </li>
                        <li className="breadcrumb-item" aria-current="page">
                          <Link href={`/${langCode}/india`}>India</Link>
                        </li>

                        <li className="breadcrumb-item" aria-current="page">
                          <Link href={`/${langCode}/india/metrocities`}>Metro Cities</Link>
                        </li>

                        <li className="breadcrumb-item active" aria-current="page">
                          <Link href={`/${langCode}/india/metrocities/${metroListParams}`}>{metroListParams}</Link>
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
                    <div className="post_details_block details_block2">
                      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <ul className="td-category" style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0, listStyle: 'none' }}>
                          <li>
                            <span style={{ cursor: 'pointer' }} onClick={() => handleTags(newsItems.tags)} className="post-category" >{newsItems?.tags}</span>
                          </li>
                          <li style={{ marginLeft: '7px' }}>
                            <div key={newsItems?.id} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLikeClick(e, newsItems.id)}}style={{pointerEvents: "auto",}}>
                              <div style={{...heartIconStyle, ...(activeLikeItems[newsItems?.id]? activeHeartIconStyle: {}),}}>
                                {activeLikeItems[newsItems?.id] ? (
                                  <FavoriteIcon style={{ fontSize: "20px",color: "red",}}/>
                                ) : (
                                  <FavoriteBorderIcon style={{fontSize: "20px",color: "black",}}/>
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
                            <div onClick={(event) => handleIconClick(event, newsItems.id)}style={{ cursor: "pointer",transition: "background-color 0.5s ease, color 0.5s ease",backgroundColor: activeItems[newsItems?.id] ? "white" : "transparent",}}>
                              <style>{keyframes}</style>
                              {activeItems[newsItems?.id] ? (
                                <FaBookmark style={{fontSize: "16px",color: "black",animation: "bookmarkBounce 0.5s ease",}}/>
                              ) : (
                                <FaRegBookmark style={{fontSize: "16px",color: "black",transition: "color 0.3s ease",}}/>
                              )}
                            </div>


                          </li>
                          <li style={{ marginTop: '-7px' }}><ShareButtons url={shareUrl} title={shareTitle} style={{ color: 'black', fontSize: '18px' }} /></li>
                        </ul>
                        <div style={{ display: 'flex', marginTop: '-12px' }}><button onClick={decreaseFontSize} style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <i className='FontAwesomeIcon icon="fa-sharp fa-solid fa-magnifying-glass-minus' style={{
                              color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black'}}></i></button>
                         
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
                            <Skeleton variant="text" width={600} height={100} />
                          ) : (
                            <h2 style={{ fontSize: `${headerFont}px`, fontWeight: 'bold', color: "black", marginTop: '-20px' }}>{newsItems.title}</h2>
                          )}
                        </div>
                        <ReporterDataSpeaker newsItems={newsItems} />
                        {loadingSkeleton ? (
                          <Skeleton variant="rectangular" width={640}height={400}/>
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
                          <p style={{ fontSize: `${fontSize}px`, fontWeight: 'bold', color: "black", textAlign: "justify" }}>{quotes[1]}</p>
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
                    <RelatedNews relatedArticles={relatedArticles} loadingSkeleton={loadingSkeleton} handleTags={handleTags} />
                    <CommentsForm newsItems={newsItems} />
                  </StickyBox>
                </div>
                {/* END OF /. MAIN CONTENT */}
                {/* START SIDE CONTENT */}
                <div className="col-md-4 col-p rightSidebar">
                  <StickyBox>
                    {/* START ADVERTISEMENT */}
                    <div className="add-inner">
                      {loadingSkeleton ? (
                        <Skeleton variant="rectangular" width={300} height={300} />
                      ) : (
                        <Image src={newsItems?.images}className="img-fluid"alt="image" width={300} height={300}style={{ borderRadius: '6px' }}/>
                      )}
                    </div>
                    <SocialMediaIcons />
                    <MostViewPopular mostViewed={mostViewed} popularNews={popularNews} handleClick={handleClick} />
                    {/* END OF /. NAV TABS */}
                  </StickyBox>
                </div>
              </div>
            </div>
          </main>
          <Dialog open={open} onClose={handleClose} PaperProps={{
            style: {width: '400px',height: 'auto',  borderRadius: '15px',},}}>
            <LoginModal onClose={handleClose} />
          </Dialog>
        </Layout>
      )}
    </>
  );
};
export default NewsDetailPage;