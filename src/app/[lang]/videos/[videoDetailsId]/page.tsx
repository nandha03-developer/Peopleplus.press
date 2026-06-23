"use client"

import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import StickyBox from "react-sticky-box";
import LayoutTwo from "@/components/ltr/layout/layout-two";
import RelatedArticles from "@/components/ltr/related-articles/related-articles";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import axios from 'axios';
import { format } from "date-fns"; // Import format function from date-fns
import Layout from '@/components/ltr/layout/layout';
import Image from 'next/image';
import animationData from '../../../../../public/assets/images/data 11.json';
import Lottie, { LottieRef } from 'lottie-react';
import parse from 'html-react-parser';
import { Box,Dialog, CircularProgress } from '@mui/material';
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import dynamic from "next/dynamic";
import TimeDisplay from "@/components/timeDisplay";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useNewsContext } from "@/context/mostViewedContext"; //Most Viewed
import Head from 'next/head';
import { useLanguage } from "@/context/languageContext";
import { useRouter } from "next/navigation";
import { FaBookmark } from "react-icons/fa";
import { useSavedItems } from "@/context/savedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLikedItems } from "@/context/likedNewsContext";
import { FaRegBookmark } from 'react-icons/fa6';
import ShareButtons from '@/components/socialMediaSharing';
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton if using Material-UI
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import LoginModal from '@/components/login-modal/login-modal';
import FloatingActionButtons from '@/components/floatingbuttton';

const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
);

const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
})


const NewsDetailPage = ({ params, shareUrl,loadingSkeleton, shareTitle, quotes }: any) => {
    const lang = params.lang
    const { videoDetailsId } = params;

    const { langCode } = useLanguage();
    const [newsItems, setNewsItems] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [mostViewed, setMostViewed] = useState<any>([]); //To store most viewd news
    const [popularNews, setPopularNews] = useState<any>([]); //To store popular news
    // const [newsId, setNewsId] = useState<number | null>(null);
    // const [decodedTitle, setDecodedTitle] = useState<string>('');
    // const [filteredNewsItem, setFilteredNewsItem] = useState<any>(null);
    const [loadingImg, setLoadingImg] = useState(true);
    const {setCurrentNews, allGroups, allsubGroups, allInnerSubGroups, metroCities } = useContext(GroupSubGroupContext);
    const [voice, setVoice] = useState(null);
    const [tamilVoice, setTamilVoice] = useState(null);
    const [hindiVoice, setHindiVoice] = useState(null);
    const [languageCode, setLanguageCode] = useState('en');
    const router = useRouter();
    const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems(); //Liked News
    const { activeItems, handleIconClick } = useSavedItems();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [errorComment, setErrorComment] = useState('');
    const [errorReply, setErrorReply] = useState('');
    const [capKey, setCapKey] = useState(null); // Google reCAPTCHA key
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [commentMessage, setCommentMessage] = useState('')
  const [comments, setComments] = useState<any>([]);
  const [replyMessage, setReplyMessage] = useState(''); // For reply messages
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyCommentData, setReplyCommentData] = useState<any>([]);
  

    UseRemoveBodyClass(['None'], ['home-seven', 'home-nine', 'boxed-layout', 'home-six', 'home-two']);

    const customerId: any = localStorage.getItem('cusId');
    const userId = JSON.parse(customerId);

    //Fetch data from api
    const fetchDataFromApi = async () => {
        const path = window.location.pathname;
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
        const cityIds = metroCities.map((city: any) => city.city_id);
        try {
            const response = await axios.get(
                `/List_api_tables?table_name=News&status_eq=true&language_contains=${languageId}&youtubeurl_contains=www.youtube.com`
            );
            const data = response.data.Data.map((row: any, index: number) => ({
                ...row,
                SNo: index + 1,
            }));


            let matchedItem = null;
            data.forEach((item: any) => {
                if (item.url == params.videoDetailsId) {
                    matchedItem = item;
                }
            });
            if (matchedItem) {
                setNewsItems(matchedItem);
            } else {
            }

            //To fetch most viewed news
            const mostView = await axios.get(`/List_api_tables?table_name=News&status_eq=true&language_contains=${languageId}&youtubeurl_contains=www.youtube.com`);
            const mostViewedNews = mostView.data.Data
            setMostViewed(mostViewedNews);

            //To fetch most popular news
            // const popular = await axios.get(`/Popularnews?limit=5&language_contains=${languageId}&youtubeurl_contains=www.youtube.com`);
            // const popularNews = popular.data
            // setPopularNews(popularNews)

        } catch (error) {
            console.error("There was an error fetching the news data!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataFromApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //lottie loading
    const lottieRef: any = useRef(null);
    useEffect(() => {
        // Access Lottie instance and slow down the animation speed
        if (lottieRef.current) {
            lottieRef.current.setSpeed(2); // Set the speed to half (adjust as needed)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //To fetch group and sub group
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Fetch group data
    //             const groupResponse = await fetch("/List_api_tables?table_name=Group");
    //             if (!groupResponse.ok) {
    //                 throw new Error("Network response for group data was not ok");
    //             }
    //             const groupResult = await groupResponse.json();
    //             const groupData = groupResult.Data;

    //             // Fetch subgroup data
    //             const subGroupResponse = await fetch(
    //                 "/List_api_tables?table_name=SubGroup"
    //             );
    //             if (!subGroupResponse.ok) {
    //                 throw new Error("Network response for subgroup data was not ok");
    //             }
    //             const subGroupResult = await subGroupResponse.json();
    //             const subGroupData = subGroupResult.Data;

    //             // Format group name if available
    //             const breadcrumbItem = groupData.find(
    //                 (item: any) => item.uid === newsItems?.groupid
    //             );
    //             if (breadcrumbItem) {
    //                 const formattedGroupName = breadcrumbItem.groupname
    //                     .toLowerCase()
    //                     .replace(/\s+/g, "-")
    //                     .replace(/(^|\s)\S/g, (letter: any) => letter.toUpperCase()); // Capitalize first letter

    //                 setFormattedGroupName(formattedGroupName);
    //             } else {
    //                 setFormattedGroupName("");
    //             }

    //             // Format subgroup name if available
    //             const breadcrumbSub = subGroupData.find(
    //                 (item: any) => item.uid === newsItems?.subgroupid
    //             );
    //             if (breadcrumbSub) {
    //                 const formattedSubGroupName = breadcrumbSub.subgroupname
    //                     .toLowerCase()
    //                     .replace(/\s+/g, "-")
    //                     .replace(/(^|\s)\S/g, (letter: any) => letter.toUpperCase()); // Capitalize first letter

    //                 setFormattedSubGroupName(formattedSubGroupName);
    //             } else {
    //                 setFormattedSubGroupName("");
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch data:", error);
    //         }
    //     };

    //     fetchData();
    // }, [newsItems]);

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

            // Clean up any unwanted characters
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

    const [showControls, setShowControls] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const stopReading = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsReading(false);
        setIsPaused(false);
        setShowControls(false)
      }
    };
  
    const pauseReading = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    };
  
    const resumeReading = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    };

    const handleReadAloud = () => {
        if ('speechSynthesis' in window) {
            setShowControls(true);
            const speech = new SpeechSynthesisUtterance();
            const contentToRead = `${newsItems?.title || ''}. ${newsItems?.longcontent || ''}`;
            speech.text = contentToRead;

            // Set the language and voice based on detected language code
            if (languageCode === 'ta') {
                speech.lang = 'ta-IN'; // Tamil
                if (tamilVoice) {
                    speech.voice = tamilVoice;
                }
            } else if (languageCode === 'hi') {
                speech.lang = 'hi-IN'; // Hindi
                if (hindiVoice) {
                    speech.voice = hindiVoice;
                }
            } else {
                speech.lang = 'en-US'; // Default to English
                if (voice) {
                    speech.voice = voice;
                }
            }

            speech.rate = 1;
            speech.pitch = 1;

            window.speechSynthesis.speak(speech);
        } else {
            toast.error('Sorry, your browser does not support text-to-speech.');
        }
    };

    const capitalizeFirstLetter = (string: string): string => {
        const modifiedString = string.replace(/-/g, " ");
        return modifiedString.charAt(0).toUpperCase() + modifiedString.slice(1);
    };

    const options = {
        loop: true,
        items: 1,
        dots: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        autoplay: true,
        autoplayTimeout: 4000, //Set AutoPlay to 4 seconds
        autoplayHoverPause: true,
        nav: true,
        navText: [
            "<i class='ti ti ti-angle-left'></i>",
            "<i class='ti ti ti-angle-right'></i>"
        ]
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

        try {
            const response = await axios.get(
                `/List_api_tables?table_name=News&status_eq=true&language_contains=${languageCode}&youtubeurl_contains=www.youtube.com`
            );
            const data = response.data.Data.map((row: any, index: number) => {
                // const imagesArray = row.mainimages ? row.mainimages.split(',').map((img: any) => img.trim()) : [];
                // const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
                return {
                    ...row,
                    SNo: index + 1,
                    //mainimages
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
        fetchDataFromApiRelated();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const containerRef = useRef<HTMLLIElement | null>(null);

      //Route to category page
      const handleTags = (item: any) => {
        setCurrentNews({ ...item });
        let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
        let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
  
        // let innersubgrpname = allInnerSubGroups.find((group: any) => group.uid == item.innersubgroupid)?.innersubgroupname.trim().toLowerCase().replace(/\s+/g, '-') || ''
   
        router.push(`/${langCode}/${grname}/${subgrname}`);
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

      const fetchComments = async (newsId: any) => {
        try {
          // Fetch comments for the given newsId
          const response = await axios.get(`/List_api_tables?table_name=Comments&newsid_eq=${newsId}&sort_by=commentdatetime&order=desc&limit=3`);
    
          if (response.status === 200) {
            const commentsData = response.data.Data;
    
            // Fetch customer data for each comment's customer ID
            const commentsWithCustomers = await Promise.all(commentsData.map(async (comment: any) => {
              const customerData = await fetchCustomerData(comment.customerid); // Fetch customer data
              return {
                ...comment,
                customer: customerData // Add customer data to the comment
              };
            }));
    
            // Update state with comments that include their customer data
            setComments(commentsWithCustomers);
    
            // Fetch replies for each comment
            await Promise.all(commentsData.map((comment: any) => fetchReplyComments(comment.id)));
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
    
      // Function to fetch customer data by customer ID
      const fetchCustomerData = async (customerId: any) => {
        try {
          const response = await axios.get(`/List_api_tables?table_name=Customer&id_eq=${customerId}`);
          return response.data.Data[0]; // Return the first customer object
        } catch (error) {
          console.error('Error fetching customer data:', error);
          return null; // Return null if there's an error
        }
      };

      //Comment OnChange
  const handleMessageChange = (e: any) => {
    setCommentMessage(e.target.value);
    setErrorComment('');
  };

  //Fetch Comments
  const hasFetched = useRef(false);

  useEffect(() => {
    if (newsItems?.id && !hasFetched.current) {
      fetchComments(newsItems.id);
      hasFetched.current = true; // Set to true after fetching
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsItems?.id]);

       // Comment Submit
  const handleSubmitComment = async (e: any) => {
    e.preventDefault();
    recaptchaRef.current?.execute();
    const customerId: any = localStorage.getItem('cusId');
    const userId = JSON.parse(customerId)
    if (!userId) {
      setOpen(true);
      return;
    }

    if (!commentMessage.trim()) {
      setErrorComment('Comment cannot be empty.'); // Set the error message
      return; // Prevent submission
    } else {
      setErrorComment(''); // Clear error if validation passes
    }

    const currentDateTime = new Date().toISOString();

    const body = {
      comment: commentMessage,
      commentdatetime: currentDateTime,
      customerid: userId,
      newsid: newsItems.id,
      status: true
    }

    try {
      const response = await axios.post('/api/comments', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status == 200) {
        toast.success('Data added successfully!');
        setCommentMessage("")
        fetchComments(newsItems.id);
      } else {
        toast.error('Failed to add data.');
      }

    } catch (error: any) {
      console.error('Error adding data:', error);
      toast.error('Failed to add data.');
    }
  }

  //Reply Comments
  // const fetchReplyComments = async (commentId: any) => {
  //   const requestOptions: RequestInit = {
  //     method: "GET",
  //     redirect: "follow"
  //   };

  //   try {
  //     const response = await fetch(`/List_api_tables?table_name=CommentReply&commentid_eq=${commentId}&sort_by=dateandtime&order=desc&limit=3`, requestOptions);
  //     if (response.ok) {
  //       const result = await response.json(); // Assuming the response is JSON
  //       // You can update the state to include replies for each comment
  //       setReplyCommentData((prevData: any) => ({
  //         ...prevData,
  //         [commentId]: result.Data // Store replies under their respective comment IDs
  //       }));
  //     } else {
  //       console.error('Error fetching replies:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching replies:', error);
  //   }
  // };

  const fetchReplyComments = async (commentId: any) => {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch(`/List_api_tables?table_name=CommentReply&commentid_eq=${commentId}&sort_by=dateandtime&order=desc&limit=3`, requestOptions);

      if (response.ok) {
        const result = await response.json(); // Assuming the response is JSON

        // Fetch customer data for each reply's customer ID
        const repliesWithCustomers = await Promise.all(result.Data.map(async (reply: any) => {
          const customerData = await fetchCustomerData(reply.customerid); // Fetch customer data
          return {
            ...reply,
            customer: customerData // Add customer data to the reply
          };
        }));

        // Update the state to include replies under their respective comment IDs
        setReplyCommentData((prevData: any) => ({
          ...prevData,
          [commentId]: repliesWithCustomers // Store replies with customer data
        }));
      } else {
        console.error('Error fetching replies:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  //Comment reply onchange
  const handleReply = (commentId: any) => {
    setReplyingTo(commentId); // Set the comment ID we are replying to
  };

  //Comment reply submit
  const handleSubmitReply = async (e: any, commentId: any) => {
    e.preventDefault();
    recaptchaRef.current?.execute();
    const customerId: any = localStorage.getItem('cusId');
    const userId = JSON.parse(customerId)
    if (!userId) {
      setOpen(true);
      return;
    }

    if (!replyMessage.trim()) {
      setErrorReply('Comment cannot be empty.'); // Set the error message
      return; // Prevent submission
    } else {
      setErrorReply(''); // Clear error if validation passes
    }
    const currentDateTime = new Date().toISOString();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "commentid": commentId,
      "commentmessage": replyMessage,
      "customerid": userId,
      "newsid": newsItems.id,
      "status": true,
      "dateandtime": currentDateTime
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("/api/commentreply", requestOptions);
      if (response.ok) {
        toast.success("Reply submitted successfully!");
        setReplyMessage('');
        fetchReplyComments(commentId)
      } else {
        toast.error("Failed to submit reply."); // Optional: handle error response
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again."); // Optional: handle fetch error
    }
  }


    return (
        <>

           
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
                                                <li className="breadcrumb-item active" aria-current="page">
                                                    <Link href={`/${langCode}/videos`}>Videos</Link>
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

                                            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <ul className="td-category" style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0, listStyle: 'none' }}>
                                                    <li>
                                                        <span style={{ fontSize: '10px', cursor:'pointer',color:"white" }}className="post-category" onClick={()=>handleTags(newsItems)} >
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
                          <ShareButtons url={shareUrl} title={shareTitle} style={{color: 'black', fontSize: '18px'}} />
                        </li>
                                                </ul>
                                                <div style={{ display: 'flex', marginTop: '-12px' }}>
                        <button onClick={decreaseFontSize} style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                          <i className='FontAwesomeIcon icon="fa-sharp fa-solid fa-magnifying-glass-minus' style={{
                            color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black'
                          }}></i>
                        </button>
                        <button onClick={increaseFontSize} style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                          <i className='FontAwesomeIcon icon="fa-duotone fa-solid fa-magnifying-glass-plus' style={{
                            color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black'
                          }}></i>
                        </button>
                        {isResetVisible && (
                          <button onClick={resetFontSize} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
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
                          <Skeleton variant="text" width={640} height={100} />
                        ) : (
                                                <h2 style={{ fontSize: `${headerFont}px`, fontWeight: 'bold', color: "black" }}>{newsItems?.title}</h2>
                        )}
                        </div>
                                                <ul className="authar-info d-flex flex-wrap">
                                                    <li className='author-name' style={{ fontSize: '11px', color: "black" }}>{newsItems?.reporter}</li>

                                                    <li style={{ fontSize: '11px', color: "black", padding: '0px 0px' }}>|</li>

                                                    <li className='date' style={{ fontSize: '11px', color: "black" }}>
                                                        {newsItems?.newsdatetime && (
                                                            <>
                                                                {`${('0' + new Date(newsItems.newsdatetime).getDate()).slice(-2)} ${monthName} ${new Date(newsItems.newsdatetime).getFullYear()}  ${('0' + new Date(newsItems.newsdatetime).getHours()).slice(-2)}:${('0' + new Date(newsItems.newsdatetime).getMinutes()).slice(-2)}`}
                                                            </>
                                                        )}
                                                    </li>

                                                    {languageCode !== 'ta' && (
                          <>
                            <li style={{ fontSize: '11px', color: "black", padding: '0px 0px' }}>|</li>
                            <li  className="d-flex align-items-center" style={{marginTop: '-5px',fontSize: '15px', padding:'0px'
 }}>

                            <button
          onClick={() => {
            handleReadAloud();
            setIsReading(true);
          }}
        style={{ background: 'none', border: 'none', padding: '2', cursor: 'pointer' }}
      >
        <VolumeUpIcon style={{ fontSize: '15px', color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black' }} /> {/* Speaker Icon */}
      </button>
      {showControls && (
        <>
      <button
        onClick={stopReading}
        style={{ background: 'none', border: 'none', padding: '2', cursor: 'pointer' }}
      >
        <StopIcon style={{ fontSize: '15px', color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black' }} /> {/* Stop Icon */}
      </button>
      <button
        onClick={pauseReading}
        style={{ background: 'none', border: 'none', padding: '2', cursor: 'pointer' }}
        disabled={isPaused}
      >
        <PauseIcon style={{ fontSize: '15px',   color: isPaused ? 'gray' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black') }} /> {/* Pause Icon */}
      </button>
      <button
        onClick={resumeReading}
        style={{ background: 'none', border: 'none', padding: '2', cursor: 'pointer' }}
        disabled={!isPaused}
      >
        <PlayArrowIcon style={{ fontSize: '15px',color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'black' }}  /> {/* Play Icon */}
      </button>
      </>
    )}
    
                            </li>
                                                    </>
                                                    )}
                                                </ul>
                                                <figure className="posts-thumb">
                                                    
                                                    {/* <span className="post-category">{newsItems.category}</span> */}
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
                                        width="668"
                                        src={ 
                                          newsItems?.youtubeurl.includes('?')
                                            ? `${newsItems?.youtubeurl.replace("youtube.com", "youtube-nocookie.com")}&rel=0&autohide=1`
                                            : `${newsItems?.youtubeurl.replace("youtube.com", "youtube-nocookie.com")}?rel=0&autohide=1`
                                        }
                                       
                                        frameBorder="0"
                                        allowFullScreen

                                       style={{ maxWidth: '100%', height: '500px',borderBottomRightRadius:"6px",borderBottomLeftRadius:"6px",borderTopRightRadius:"6px",borderTopLeftRadius:"6px" }}

                                      ></iframe>
                                                    </a>
                                                </figure>
                                                <div style={{ marginTop: "3%" }}>
                                                    {newsItems?.longcontent ? (
                                                        parse(newsItems.longcontent)
                                                    ) : (
                                                        <p>No content available</p> // Fallback if longcontent is missing
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                  <FloatingActionButtons />
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
                                                    <strong>Related </strong> Videos
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
                                                                    <div>
                                                                        <Link href={`${article.url}`} className="thumb">
                                                                            {loadingImg && <CircularProgress />}
                                                                            <iframe
                                        title="Embedded YouTube Video"
                                        width="200"
                                        
                                        src={article.youtubeurl}
                                        frameBorder="0"
                                        allowFullScreen

                                       style={{ maxWidth: '100%', height: '150px',borderRadius: '6px' }}

                                      ></iframe>
                                                                        </Link>
                                                                    </div>
                                                                    {loadingSkeleton ? (<Box sx={{ pt: 0.5 }}>
                                  <Skeleton />
                                  <Skeleton width="60%" />
                                </Box>) : (
                                                                    <h5 className="title"  style={{ fontSize: '12px', color: "black", fontWeight: 'bold' }}>
                                                                        <Link href={`${article.url}`}  > {article.title}</Link>
                                                                    </h5>
                                )}
                                                                     {loadingSkeleton ? (<Box sx={{ pt: 0.5 }}>
                                  <Skeleton />
                                  <Skeleton width="60%" />
                                </Box>) : (
                                                                    <p className="date">
                                                                        <TimeDisplay dateTime={article?.newsdatetime} />


                                                                    </p>
                                )}
                                                                    {loadingSkeleton ? (<Box sx={{ pt: 0.5 }}>
                                  <Skeleton />
                                  <Skeleton width="60%" />
                                </Box>) : (
                                                                    <ul className="authar-info d-flex flex-wrap">
                                                                        <li>{article.date}</li>

                                       
                                                                    </ul>
                                )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* RelatedArticles Component */}
                                                <RelatedArticles />
                                            </div>
                                            {/* Post footer */}
                                            
                                        </div>
                                        {/* END OF /. RELATED ARTICLES */}
                                        {/* START COMMENT */}
                                        <div className="comments-container">
                                        <ul className="comments-list">
                      {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment: any) => (
                          <li key={comment.id}>
                            <div className="comment-main-level">
                              <div className="comment-avatar">
                                <Image
                                  priority
                                 // unoptimized={true}
                                  quality={100}
                                  objectFit="cover"
                                  src={comment.customer.profileimage}
                                  alt='profile image'
                                  width={20}
                                  height={20}
                                />
                                {/* <img src="assets/images/avatar-1.jpg" alt="" /> */}
                              </div>
                              <div className="comment-box">
                                <div className="comment-content">
                                  <div className="comment-header">
                                    <cite className="comment-author">- {comment.customer.firstname}</cite>
                                    <time
                                      dateTime={comment.commentdatetime}
                                      className="comment-datetime"
                                    >
                                      {new Date(comment.commentdatetime).toLocaleString()}
                                    </time>
                                  </div>
                                  <p>{comment.comment}</p>
                                  {userId !== comment.customerid && (
                                    <button onClick={() => handleReply(comment.id)} className="btn btn-news">Reply</button>
                                  )}
                                </div>
                                {/* Reply input field */}
                                {replyingTo === comment.id && (
                                  <div className="reply-form comment-form">
                                    <div className="form-group">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id={`reply-${comment.id}`}
                                          value={replyMessage}
                                          onChange={(e) => setReplyMessage(e.target.value)}
                                          name="replyMessage"
                                          placeholder=" Comment"
                                          autoComplete="reply coment"
                                          style={{
                                            textAlign: 'left', // Keep text left-aligned for user input
                                            paddingLeft: '15px', // Add padding to the left to move placeholder text to the right
                                          }}
                                          onFocus={(e) => {
                                            e.target.placeholder = 'Enter Your Name'; // Clear placeholder on focus
                                          }}
                                          onBlur={(e) => {
                                            e.target.placeholder = ' Enter Your Name'; // Restore placeholder on blur
                                          }}
                                        />
                                        {errorReply && <div className="text-danger">{errorReply}</div>}

                                      </div>
                                      <button className="btn btn-news" onClick={(e) => handleSubmitReply(e, comment.id)}>
                                        {""}
                                        Submit Reply
                                      </button>
                                    </div>



                                  </div>
                                )}
                              </div>
                            </div>

                            {/* If you want to show replies, you could add a nested comments list here */}
                            {replyCommentData[comment.id] && replyCommentData[comment.id].length > 0 && (
                              <ul className="comments-list reply-list">
                                {replyCommentData[comment.id]?.map((reply: any) => (
                                  <li key={reply.id}> {/* Use a unique key from your reply object */}
                                    <div className="comment-avatar">
                                      <Image
                                        priority
                                       // unoptimized={true}
                                        quality={100}
                                        objectFit="cover"
                                        src={reply.customer.profileimage}
                                        alt='profile image'
                                        width={20}
                                        height={20}
                                      />
                                    </div>
                                    <div className="comment-box">
                                      <div className="comment-content">
                                        <div className="comment-header">
                                          <cite className="comment-author">
                                            - {reply.customer.firstname} {/* Assuming authorName is a field in your reply data */}
                                          </cite>
                                          <time dateTime={reply.dateandtime} className="comment-datetime">
                                            {new Date(reply.dateandtime).toLocaleString()} {/* Format date as needed */}
                                          </time>
                                        </div>
                                        <p>
                                          {reply.commentmessage} {/* Assuming commentMessage is a field in your reply data */}
                                        </p>
                                        {/* <Link href="#" className="btn btn-news">
                  Reply
                </Link> */}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))
                      ) : (
                        <li>No comments available.</li> // Fallback message when no comments
                      )}
                    </ul>
                                        </div>
                                        {/* END OF /. COMMENT */}
                                        {/* START COMMENTS FORMS */}
                                        <form className="comment-form" action="#" method="post">
                                            <h3>
                                                <strong>Leave</strong> a Comment
                                            </h3>
                                           
                                            <div className="form-group">
                      <label htmlFor="message">Comment*</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        placeholder="Your Comment ..."
                        rows={5}
                        defaultValue={""}
                        value={commentMessage}
                        autoComplete="message"
                        onChange={handleMessageChange}

                        style={{
                          textAlign: 'left', // Keep text left-aligned for user input
                          padding: '10px', // Add padding to move placeholder text to the right
                        }}
                        onFocus={(e) => {
                          e.target.placeholder = 'Your Comment'; // Clear placeholder on focus
                        }}
                        onBlur={(e) => {
                          e.target.placeholder = 'Your Comment'; // Restore placeholder on blur
                        }}
                      />
                      {errorComment && <div className="text-danger">{errorComment}</div>}
                    </div>
                    <button onClick={handleSubmitComment} className="btn btn-news">
                      {" "}
                      Submit
                    </button>
                    <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6LdcJGMqAAAAAKlGl1L6Lp2Fb5PCrhW8oQ_w_Lwl"
        size="invisible"
        onChange={(value: any) => setCapKey(value)}
      />
                  </form>
                                        {/* END OF /. COMMENTS FORMS */}
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
                                            <Image
                                                src={newsItems?.images}
                                                className="img-fluid"
                                                alt="image"
                                                width={300}
                                                onLoadingComplete={() => setLoadingImg(false)}
                                                height={300}
                                            />
                    )}
                                        </div>
                                        {/* END OF /. ADVERTISEMENT */}
                                        {/* START SOCIAL COUNTER TEXT */}
                                        <div className="align-items-center d-flex fs-6 justify-content-center mb-1 text-center social-counter-total" >
                                            <i className="fa-solid fa-heart text-primary me-1" style={{ fontSize: '1.5rem', fontWeight: 'bold' }} />
                                            <span style={{ fontWeight: 'bold' }}>FOLLOW US ON</span>
                                        </div>
                                        {/* END OF /. SOCIAL COUNTER TEXT */}
                                        {/* START SOCIAL ICON */}
                                        <div className="social-media-inner mb-2">
                                            <ul className="g-1 row social-media">

                                                <li className="col-4">
                                                    <a target="_blank" href="https://www.facebook.com/profile.php?id=61565107168918&mibextid=ZbWKwL" className="fb">
                                                        <i className="fab fa-facebook-f" />
                                                        {/* <div>3,794</div>
                                <p>Followers</p> */}
                                                    </a>
                                                </li>
                                                <li className="col-4">
                                                    <a target="_blank" href="https://www.instagram.com/peoplepluspress/" className="insta">
                                                        <i className="fab fa-instagram" />
                                                        {/* <div>941</div>
                                <p>Followers</p> */}
                                                    </a>
                                                </li>
                                                <li className="col-4">
                                                    <a target="_blank" href="https://youtube.com/@peoplepluspress?si=nW-cBjQmVvVkftnD" className="you_tube">
                                                        <i className="fab fa-youtube" />
                                                        {/* <div>7,820</div>
                                <p>Subscribers</p> */}
                                                    </a>
                                                </li>
                                                <li className="col-4">
                                                    <a target="_blank" href="https://x.com/peoplepluspress" className="twitter">
                                                        <i className="fa-brands fa-x-twitter" />
                                                        {/* <div>1,562</div>
                                <p>Followers</p> */}
                                                    </a>
                                                </li>
                                                <li className="col-4">
                                                    <a target="_blank" href="https://www.facebook.com/profile.php?id=61565107168918&mibextid=ZbWKwL" className="rss">
                                                        <i className="fa-brands fa-linkedin" />
                                                        {/* <div>2,035</div>
                                <p>Followers</p> */}
                                                    </a>
                                                </li>
                                                <li className="col-4">
                                                    <a target="_blank" href="https://in.pinterest.com/peopleplusp/" className="pint">
                                                        <i className="fa-brands fa-pinterest" />
                                                        {/* <div>1,310</div>
                                <p>Followers</p> */}
                                                    </a>
                                                </li>
                                            </ul>{" "}
                                            {/* /.social icon */}
                                        </div>
                                        {/* END OF /. SOCIAL ICON */}
                                        {/* START NAV TABS */}
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
                                                        Popular Videos
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
                                                                    <div className="text"
                                                                    >
                                                                        <Link
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
                                                            <ul>
                                                                {popularNews.map((item: any, index: any) => (
                                                                    <li key={item.id}>
                                                                        <span className="count">{String(index + 1).padStart(2, '0')}</span>
                                                                        <div
                                                                            className="text"
                                                                        >
                                                                            <Link
                                                                                href={`/${item.url}`}
                                                                            >
                                                                                {item.title}
                                                                            </Link>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p style={{ textAlign: 'center' }}>No popular videos</p>
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
                    {/* *** END OF /. PAGE MAIN CONTENT *** */}

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
            
        </>
    );
};

export default NewsDetailPage;