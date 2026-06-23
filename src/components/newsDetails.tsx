/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import StickyBox from "react-sticky-box";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import Layout from "@/components/ltr/layout/layout";
import Image from "next/image";
import animationData from "../../public/assets/images/data 11.json";
import Lottie, { LottieRef } from "lottie-react";
import { EditorState, ContentState, convertFromHTML, ContentBlock, } from "draft-js";
import dynamic from "next/dynamic";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton if using Material-UI
import ShareButtons from "./socialMediaSharing";
import { FaBookmark } from "react-icons/fa";
import { useSavedItems } from "@/context/savedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLikedItems } from "@/context/likedNewsContext";
import { FaRegBookmark } from "react-icons/fa6";
import { useLanguage } from "@/context/languageContext";
import { useRouter } from "next/navigation";
import FloatingActionButtons from "./floatingbuttton";
import MostViewPopular from "./mostViewPopular";
import SocialMediaIcons from "./socialMediaIcons";
import RelatedNews from "./relatedNews";
import CommentsForm from "./commentsForm";
import ReporterDataSpeaker from "./reporterDataSpeaker";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor).catch(() => {
    console.warn("Failed to load Editor, using fallback");
    return { default: () => <div>Editor not available</div> };
  }),
  { 
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

const NewsDetailPage = ({ newsItems, nextNews, relatedArticles, mostViewed, popularNews, loadingSkeleton, shareUrl, shareTitle, quotes, }: any) => {
  const { langCode } = useLanguage();
  const lang = langCode;
  const [formattedGroupName, setFormattedGroupName] = useState<string>("");
  const [formattedSubGroupName, setFormattedSubGroupName] = useState<string>("");
  const [fontSize, setFontSize] = useState(14);
  const [defaultFontSize, setDefaultFontSize] = useState(16);
  const [headerFont, setheaderFont] = useState(18);
  const [DefaultheaderFont, setDefaultheaderFont] = useState(18);
  const [isResetVisible, setIsResetVisible] = useState(false);
  const { setCurrentNews, allGroups, allsubGroups } = useContext(GroupSubGroupContext);
  const { activeItems, handleIconClick } = useSavedItems();
  const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems(); //Liked News  
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  UseRemoveBodyClass(["None"], ["home-seven", "home-nine", "boxed-layout", "home-six", "home-two"]);

  const lottieRef: any = useRef(null);
  useEffect(() => {     //Lottie animation
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2); // Set the speed to half (adjust as needed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTags = (item: any) => {
    setCurrentNews({ ...item });
    let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, "-") || "";
    let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, "-") || "";
    router.push(`/${langCode}/${grname}/${subgrname}`);
  };

  useEffect(() => {      //Breadcrumbs
    const fetchData = async () => {
      try {
        const breadcrumbItem = allGroups.find(
          (item: any) => item.uid === newsItems?.groupid
        );
        if (breadcrumbItem) {
          const formattedGroupName = breadcrumbItem.groupname.toLowerCase().replace(/\s+/g, "-").replace(/(^|\s)\S/g, (letter: any) => letter.toUpperCase());
          setFormattedGroupName(formattedGroupName);
        } else {
          setFormattedGroupName("");
        }
        const breadcrumbSub = allsubGroups.find((item: any) => item.uid === newsItems?.subgroupid);
        if (breadcrumbSub) {
          const formattedSubGroupName = breadcrumbSub.subgroupname.toLowerCase().replace(/\s+/g, "-").replace(/(^|\s)\S/g, (letter: any) => letter.toUpperCase());
          setFormattedSubGroupName(formattedSubGroupName);
        } else {
          setFormattedSubGroupName("");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [newsItems]);

  const increaseFontSize = () => {
    setFontSize((prevFontSize) => prevFontSize + 5);
    setheaderFont((prevHeaderFont: any) => prevHeaderFont + 5);
    setIsResetVisible(true); // Show the reset button when increasing font size
  };

  const decreaseFontSize = () => {
    setFontSize((prevFontSize) => prevFontSize - 5);
    setheaderFont((prevHeaderFont: any) => prevHeaderFont - 5);
    setIsResetVisible(true); // Show the reset button when increasing font size
  };

  const resetFontSize = () => {
    setFontSize(defaultFontSize);
    setheaderFont(DefaultheaderFont);
    setIsResetVisible(false); // Hide the reset button after reset
  };

  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  const customContentStateConverter = (contentState: any) => {
    const newBlockMap = contentState.getBlockMap().map((block: any) => {
      const entityKey = block.getEntityAt(0);
      if (entityKey !== null) {
        const entityBlock = contentState.getEntity(entityKey);
        const entityType = entityBlock.getType();
        switch (entityType) {
          case "IMAGE": {
            const data = entityBlock.getData();
            const { src, height, width } = data;
            const newBlock = block.merge({ type: "atomic", text: "img", data: { src, height, width }, });
            return newBlock;
          }
          default:
            return block;
        }
      }
      return block;
    });
    const newContentState = contentState.set("blockMap", newBlockMap);
    return newContentState;
  };

  const createEditorStateFromHTML = (html: string) => {
    html = html.replace(/^"|"$/g, ""); // Remove surrounding quotes
    html = html.replace(/\\"/g, '"'); // Remove escaped double quotes
    html = html.replace(/\\n/g, "<br />"); // Replace escaped newlines with <br>
    html = html.replace(/ {2,}/g, (match) => "&nbsp;".repeat(match.length)); // Replace multiple spaces with non-breaking spaces

    html = html.replace(/<p>\s*<\/p>/g, "<br />"); // Replace empty <p> tags with <br>
    html = html.replace(/<br\s*\/?>/g, "<br />");

    // Log the processed HTML for debugging

    // Convert HTML to Draft.js blocks
    const blocksFromHTML = convertFromHTML(html);
    const editorState = EditorState.createWithContent(
      customContentStateConverter(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
    return editorState;
  };

  useEffect(() => {
    if (newsItems && newsItems.longcontent) {
      const editorStateFromAPI = createEditorStateFromHTML(
        newsItems.longcontent
      );
      setEditorState(editorStateFromAPI || EditorState.createEmpty());
    }
  }, [newsItems]);

  const capitalizeFirstLetter = (string: string): string => {
    const modifiedString = string.replace(/-/g, " ");
    return modifiedString.charAt(0).toUpperCase() + modifiedString.slice(1);
  };

  const images = newsItems?.mainimages?.split(",") || [];
  const [skeletonVisible, setSkeletonVisible] = useState(true); // To control skeleton timing

  useEffect(() => {
    const timer = setTimeout(() => {
      setSkeletonVisible(false); // Hide skeleton after 500ms
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [newsItems]);

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

  const handleNewsDetails = (item: any) => {
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

    router.push(`/${lang}/${grname}/${subgrname}/details/${item.url}`);
  };

  const handleNextNews = () => {  //Next News
    const currentPathname = window.location.pathname;
    const pathParts = currentPathname.split('/');
    const lastSegment = pathParts[pathParts.length - 1];
    const currentIndex = nextNews.findIndex(
      (story: any) => story.url && story.url.endsWith(lastSegment)
    );
    if (currentIndex !== -1) {
      if (currentIndex < nextNews.length - 1) {
        const nextStoryUrl = nextNews[currentIndex + 1].url; // Get the next story URL
        window.location.href = nextStoryUrl; // Navigate to the next story
      } else {
        console.warn('No further story available.');
      }
    }
  };

  //Carousel
  const goToPrevious = () => {
    setCurrentIndex((prevIndex: any) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex: any) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {   // Automatic slide effect (optional)
    if (images && images.length > 0) {
      const interval = setInterval(goToNext, 3000); // Change slides every 3 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [images, currentIndex]);

  // Render only if images array is not empty
  if (!images || images.length === 0) return null;

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
                          <Link href={`/${lang}`}>Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                          <Link href={`/${lang}/${formattedGroupName.toLowerCase()}`}>
                            {formattedGroupName}
                          </Link>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page">
                          <Link
                            href={`/${lang}/${formattedGroupName.toLowerCase()}/${formattedSubGroupName.toLowerCase()}`}>
                            {capitalizeFirstLetter(formattedSubGroupName)}
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
                    <div className="post_details_block details_block2">
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <ul
                          className="td-category"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: 0,
                            padding: 0,
                            listStyle: "none",
                          }}
                        >
                          <li>
                            <span
                              style={{ fontSize: "10px", cursor: "pointer" }}
                              onClick={() => handleTags(newsItems)}
                              className="post-category"
                            >
                              {newsItems?.tags}
                            </span>
                          </li>
                          <li style={{ marginLeft: "7px" }}>  
                            <div  //Like Button
                              key={newsItems?.id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); // Prevent click propagation to parent
                                handleLikeClick(e, newsItems?.id);
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
                          <li style={{ marginTop: "-7px", marginLeft: "7px" }}>
                            <div
                              onClick={(event) =>
                                handleIconClick(event, newsItems?.id)
                              }
                              style={{
                                cursor: "pointer",
                                transition:
                                  "background-color 0.5s ease, color 0.5s ease",
                                backgroundColor: activeItems[newsItems?.id]
                                  ? "white"
                                  : "transparent", // Red when active, transparent otherwise
                                color: activeItems[newsItems?.id]
                                  ? "white"
                                  : "transparent", // White text when active
                              }}
                            >
                              <style>{keyframes}</style>
                              {activeItems[newsItems?.id] ? (
                                <FaBookmark
                                  style={{
                                    fontSize: "14px",
                                    color: "black",
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
                          <li style={{ marginTop: "-7px" }}>
                            <ShareButtons url={shareUrl} title={shareTitle} style={{ color: 'black', fontSize: '18px' }} />
                          </li>
                        </ul>
                        <div style={{ display: "flex", marginTop: "-12px" }}>
                          <button
                            onClick={decreaseFontSize}
                            style={{
                              marginRight: "10px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            <i
                              className='FontAwesomeIcon icon="fa-sharp fa-solid fa-magnifying-glass-minus'
                              style={{
                                color:
                                  window.matchMedia &&
                                    window.matchMedia(
                                      "(prefers-color-scheme: dark)"
                                    ).matches
                                    ? "black"
                                    : "black",
                              }}
                            ></i>
                          </button>
                          <button
                            onClick={increaseFontSize}
                            style={{
                              marginRight: "10px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            <i
                              className='FontAwesomeIcon icon="fa-duotone fa-solid fa-magnifying-glass-plus'
                              style={{
                                color:
                                  window.matchMedia &&
                                    window.matchMedia(
                                      "(prefers-color-scheme: dark)"
                                    ).matches
                                    ? "black"
                                    : "black",
                              }}
                            ></i>
                          </button>
                          {isResetVisible && (
                            <button
                              onClick={resetFontSize}
                              style={{background: "none", border: "none", cursor: "pointer", fontSize: "12px",}}>
                              <i
                                className='FontAwesomeIcon icon="fa-sharp fa-solid fa-rotate-right'
                                style={{
                                  color:
                                    window.matchMedia &&
                                      window.matchMedia(
                                        "(prefers-color-scheme: dark)"
                                      ).matches
                                      ? "black"
                                      : "black",
                                }}
                              ></i>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="post-header">
                        <div>
                          {loadingSkeleton || !newsItems?.title ? (
                            <Skeleton variant="text" width={640} height={100} />
                          ) : (
                            <h2
                              style={{fontSize: `${headerFont}px`, fontWeight: "bold", color: "black",}}>
                              {newsItems.title}
                            </h2>
                          )}
                        </div>                       
                          <ReporterDataSpeaker newsItems={newsItems} />
                        {loadingSkeleton ? (
                          <Skeleton variant="rectangular"  width={640}  height={400}  />
                            ) : (
                          <div className="slider" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            <div className="slider-post post-height-1 social-icon" style={{ margin: '0 10px', flex: '1', textAlign: 'center', position: 'relative' }}>
                              {/* Previous Slide Button */}
                              {images.length > 1 && (
                                <button
                                  className="nav-button prev"
                                  onClick={goToPrevious}
                                  style={{
                                    position: 'absolute',
                                    left: '1px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    zIndex: 1,
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#eb0254'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
                                >
                                  ❮
                                </button>
                              )}
                              <figure className="social-icon">
                                <Image
                                  priority
                                  quality={100}
                                  width={300} // Optional if using a responsive framework
                                  height={400} // Optional if using a responsive framework
                                  // onLoadingComplete={() => setLoadingSkeleton(false)}
                                  src={images[currentIndex]?.trim()}
                                  alt="PeoplePlus"
                                  className="img-fluid"
                                  style={{
                                    width: "100%",
                                    height: "475px",
                                    borderBottomRightRadius: "6px",
                                    borderBottomLeftRadius: "6px",
                                    borderTopRightRadius: "6px",
                                    borderTopLeftRadius: "6px",
                                  }} // Inline CSS for fixed dimensions
                                />
                              </figure>
                              {/* Next Slide Button */}
                              {images.length > 1 && (
                                <button
                                  className="nav-button next"
                                  onClick={goToNext}
                                  style={{
                                    position: 'absolute',
                                    right: '1px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    zIndex: 1,
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#eb0254'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
                                >
                                  ❯
                                </button>
                              )}
                              {/* Dots for navigation */}
                              {images.length > 1 && (
                                <div
                                  className="dot-navigation"
                                  style={{
                                    position: 'absolute',
                                    bottom: '1px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 2,
                                    display: 'flex'
                                  }}
                                >
                                  {images.map((_: any, index: any) => (
                                    <span
                                      key={index}
                                      className={`dot ${currentIndex === index ? 'active' : ''}`}
                                      onClick={() => setCurrentIndex(index)}
                                      style={{
                                        height: '10px',
                                        width: '10px',
                                        margin: '0 5px',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        backgroundColor: currentIndex === index ? 'red' : 'white', // Red for active, white for default
                                        cursor: 'pointer'
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="article_comment">
                          <p
                            style={{
                              fontSize: `${fontSize}px`,
                              fontWeight: "bold",
                              color: "black",
                              textAlign: "justify",
                            }}
                          >
                            {quotes[0]}
                          </p>
                        </div>
                        {loadingSkeleton ? (
                          <Skeleton variant="rectangular" animation="wave" width={620}  height="400px" />
                            ) : (
                          <div
                            style={{
                              fontSize: `${fontSize}px`,
                              color: "black",
                              textAlign: "justify",
                              marginTop: "3%",
                            }}
                          >
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
                          <p style={{fontSize: `${fontSize}px`, fontWeight: "bold", color: "black",  }}>
                            {quotes[1]}
                          </p>
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
                        </div>
                      </div>
                    </div>
                    <RelatedNews relatedArticles={relatedArticles} loadingSkeleton={loadingSkeleton} handleTags={handleTags} newsItems={newsItems} />
                    <CommentsForm newsItems={newsItems} />
                  </StickyBox>
                </div>
                <div className="col-md-4 col-p rightSidebar">
                  <StickyBox>
                    <div className="add-inner">
                      {loadingSkeleton ? (
                        <Skeleton variant="rectangular" width={300} height={300}  />
                      ) : (
                        <>
                          <Image width={300} height={300} alt="image"
                            src={newsItems?.images}
                            className="img-fluid"
                            style={{ borderRadius: "6px" }}
                          />
                        </>
                      )}
                    </div>
                    <SocialMediaIcons />
                    <MostViewPopular popularNews={popularNews} mostViewed={mostViewed} handleNewsDetails={handleNewsDetails} />
                  </StickyBox>
                </div>
              </div>
            </div>
          </main>
        </Layout>
      )}
    </>
  );
};
export default NewsDetailPage;
