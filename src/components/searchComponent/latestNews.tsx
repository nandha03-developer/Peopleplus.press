import { useState } from "react";
import Image from "next/image";
import { Box, Skeleton } from "@mui/material";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import TimeDisplay from "../timeDisplay";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const LatestNews = ({newsItems, handleNewsDetails, loadingSkeleton, handleTags}: any) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { activeItems, handleIconClick } = useSavedItems();
    const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems(); //Liked News
    const itemsPerPage = 5;
    const latest = newsItems.slice(9);
  const indexOfLastItem = currentPage * itemsPerPage;   // Logic to calculate current items to display based on pagination
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = latest.slice(indexOfFirstItem, indexOfLastItem);
  
  const paginate = (pageNumber: number) => {  // Function to handle pagination click
    setCurrentPage(pageNumber);
  };

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
             {currentItems.map((item: any) => (
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
                 }}
               >
                 {latest.length > itemsPerPage && (
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
                           textAlign: "center",
                         }}
                         className="page-link"
                       >
                         <span
                           style={{
                             fontSize: "26px",
                             marginBottom: "7px",
                           }}
                         >
                           &#171;
                         </span>
                       </a>
                     </li>

                     {/* Render page numbers */}
                     {Array.from(
                       {
                         length: Math.ceil(
                           latest.length / itemsPerPage
                         ),
                       },
                       (_, index) => {
                         // Display up to 5 pages around the current page
                         const startPage = Math.max(
                           1,
                           currentPage - 2
                         );
                         const endPage = Math.min(
                           startPage + 4,
                           Math.ceil(
                             latest.length / itemsPerPage
                           )
                         );

                         if (
                           index + 1 >= startPage &&
                           index + 1 <= endPage
                         ) {
                           return (
                             <li
                               key={index}
                               className="page-item"
                               style={{
                                 margin: "10px 2px 0",
                               }}
                             >
                               <a
                                 onClick={() =>
                                   paginate(index + 1)
                                 }
                                 className="page-link"
                                 style={{
                                   display: "flex",
                                   alignItems: "center",
                                   justifyContent: "center",
                                   width: "30px",
                                   height: "30px",
                                   borderRadius: "50%",
                                   backgroundColor:
                                     currentPage === index + 1
                                       ? "#eb0254"
                                       : "#fff",
                                   color:
                                     currentPage === index + 1
                                       ? "#fff"
                                       : "black",
                                   textDecoration: "none",
                                   transition: "all 0.3s ease",
                                   cursor: "pointer",
                                 }}
                               >
                                 {index + 1}
                               </a>
                             </li>
                           );
                         }
                         return null;
                       }
                     )}

                     {/* Next symbol */}
                     <li
                       style={{
                         margin: "10px 2px 0",
                       }}
                       className="page-item"
                       onClick={() =>
                         paginate(
                           currentPage <
                             Math.ceil(
                               latest.length / itemsPerPage
                             )
                             ? currentPage + 1
                             : currentPage
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
                         <span
                           style={{
                             fontSize: "26px",
                             marginBottom: "7px",
                           }}
                         >
                           &#187;
                         </span>
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