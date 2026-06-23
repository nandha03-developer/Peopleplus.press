import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Skeleton } from "@mui/material";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import TimeDisplay from "../timeDisplay";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";

const LatestNews = ({ handleNewsDetails, loadingSkeleton, handleTags, groupData, subGroupData, newsItems}: any) => {
   const [currentPage, setCurrentPage] = useState(1);
   const [latestNews, setLatestNews] = useState<any>([]);
    const { activeItems, handleIconClick } = useSavedItems();
    const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems(); //Liked News
    const itemsPerPage = 5;
    const totalPages = 50
    const maxVisiblePages = 5; // Total visible page numbers
    const halfVisible = Math.floor(maxVisiblePages / 2);
    const startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, currentPage + halfVisible);
  
  const paginate = (pageNumber: number) => {  // Function to handle pagination click
    setCurrentPage(pageNumber);
  };

  // Function to fetch news data for latest news
   const fetchNewsData = async (page: any) => {
    let languageCode = 0; // Default language code

    const pathname = window.location.pathname;
    const language = pathname.split('/')[1] || '';
    if (pathname.startsWith('/ta')) {
        languageCode = 1; // Tamil
    } else if (pathname.startsWith('/hi')) {
        languageCode = 2; // Hindi
    } else {
        languageCode = 0; // English
    }
    const offset = (page - 1) + 2; // Calculate the offset

    try {
      let latestNewsRes
      if(groupData == undefined){
        latestNewsRes = await axios.get(`/List_api_tables?table_name=News&subgroupid_eq=${subGroupData}&limit=${itemsPerPage}&status_eq=true&offset=${offset}&language_contains=${languageCode}`);
      } else {
        latestNewsRes = await axios.get(`/List_api_tables?table_name=News&groupid_eq=${groupData}&limit=${itemsPerPage}&status_eq=true&offset=${offset}&language_contains=${languageCode}`);
      }
        const latestNewsData = latestNewsRes.data.Data.map((row: any, index: any) => {
            const imagesArray = row.mainimages ? row.mainimages.split(',').map((img: any) => img.trim()) : [];
            const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
            return {
                ...row,
                SNo: index + 1,
                mainimages,
            };
        });
        setLatestNews(latestNewsData);
    } catch (error) {
        console.error("Error fetching news data:", error);
    }
};

useEffect(() => {
  fetchNewsData(currentPage);
}, [currentPage]);

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "100%", // Make the wrapper responsive
    maxWidth: "228px", // Maximum width of the wrapper
    height: "0",
    paddingBottom: "68.8%", // Aspect ratio of 218x150 (150/218*100)
    overflow: "hidden",
  };

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", // Cover the wrapper area
    borderRadius: '6px',
  };

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

    return (
        <div className="post-inner">
        <div className="post-head">
           <h2 className="title">
             <strong>Latest</strong> News
           </h2>
         </div>
        <div className="post-body">
           <div className="news-list">
             {latestNews.map((item: any) => (
               <div
                 key={item.id}
                 className="news-list-item articles-list"
               >
                 <div
                   style={{ cursor: "pointer" }}
                   className="img-wrapper"
                 ><div
                     onClick={() => handleNewsDetails(item)}
                     style={wrapperStyle}
                   >
                     {loadingSkeleton ? (
                       <Skeleton
                         variant="rectangular"
                         width={210}
                         height={118}
                       />
                     ) : (
                       <Image
                         src={item?.mainimages}
                         alt="PeoplePlus"
                         className="img-fluid"
                         layout="fill" // Fills the parent container
                         style={imageStyle}
                       />
                     )}
                   </div>
                   <div
                     className="link-icon"
                     onClick={(event) =>
                       handleIconClick(event, item.id)
                     }
                     style={{
                       cursor: "pointer",
                       transition:
                         "background-color 0.5s ease, color 0.5s ease",
                       color: activeItems[item.id]
                         ? "pink"
                         : "transparent",
                       borderBottomRightRadius: "6px"
                     }}
                   >
                     <style>{keyframes}</style>
                     {activeItems[item.id] ? (
                       <FaBookmark
                         style={{
                           fontSize: "16px",
                           color: "white",
                           animation: "bookmarkBounce 0.5s ease", // Apply the animation
                         }}
                       />
                     ) : (
                       <FaRegBookmark
                         style={{
                           fontSize: "16px",
                           color: "white",
                           transition: "color 0.3s ease",

                         }}
                       />
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
                       <div
                         onClick={() => handleNewsDetails(item)}
                         style={{ cursor: "pointer" }}
                         className="clickable-title"
                       >
                         {item.title}
                       </div>
                     </h4>
                   )}
                   <ul className="authar-info d-flex flex-wrap">
                     <li>
                       <span className="post-category" style={{ cursor: 'pointer' }} onClick={() => handleTags(item)}>{item.tags}</span>
                     </li>
                     <li className="d-md-block d-none" style={{ marginTop: '2px' }}>
                       <TimeDisplay
                         dateTime={item?.newsdatetime}
                       />
                     </li>

                     <li style={{ marginTop: '-2px' }}>
                       <div
                         key={item.id}
                         onClick={(event) =>
                           handleLikeClick(event, item.id)
                         }
                         style={heartIconStyle}
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
                   <p className="d-lg-block d-none">
                     {item.shortcontent}
                   </p>
                 </div>
               </div>
             ))}
           </div>
         </div>{" "}
         {/* /. post body */}
         {/* Post footer */}
         <div className="post-footer">
           <div className="row thm-margin">
             <div className="col-xs-12 col-sm-12 col-md-12 thm-padding">
               {/* pagination */}
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
               {/* /.pagination */}
             </div>
           </div>
         </div>{" "}
         {/* /.Post footer*/}
       </div>
    )
}
export default LatestNews;