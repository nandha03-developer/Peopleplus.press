import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import TimeDisplay from "../timeDisplay";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const LatestReviews = ({latestReviewOne, handleDetails, loadingImg , latestReviews, setLoadingImg}: any) => {
    const { activeItems, handleIconClick } = useSavedItems();
    const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems();

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

    const wrapperStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%', // Make the wrapper responsive
        maxWidth: '228px', // Maximum width of the wrapper
        height: '0',
        paddingBottom: '68.8%', // Aspect ratio of 218x150 (150/218*100)
        overflow: 'hidden',
    
      };

      const imageStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Cover the wrapper area
        borderRadius: '6px'
      };

    return (
        <div className="panel_inner review-inner">
        <div className="panel_header">
          <h4>
            <strong>Latest</strong> Reviews
          </h4>
        </div>
        <div className="panel_body">
          <div className="more-post" onClick={() => handleDetails(latestReviewOne)}>
            <a style={{ cursor: 'pointer' }} className="news-image">
              <div className="image-container" style={{ width: '100%', height: '100%', }}>
                {loadingImg && <Box sx={{ width: 300 }}>
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>}

                <Image
                  src={latestReviewOne?.mainimages}
                  alt=""
                  className="img-fluid w-100"
                  width={100}
                  height={74}
                  onLoadingComplete={() => setLoadingImg(false)}
                  style={{ borderRadius: '6px' }}
                />
              </div>
            </a>
            <div className="post-text">
              <ul className="align-items-center authar-info d-flex flex-wrap gap-1 mb-1">

                <li className="date">
                  <TimeDisplay dateTime={latestReviewOne?.newsdatetime} />
                </li>

              </ul>
              {loadingImg ? (<Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>) : (
                <h4 className="mb-0">
                  {latestReviewOne?.title}
                </h4>
              )}
            </div>
          </div>
          <div className="mt-4 news-list" style={{ width: "100%" }}>
            {latestReviews.map((item: any) => (
              <div key={item.id} className="news-list-item p-0">
                <div onClick={() => handleDetails(item)} style={{ cursor: 'pointer' }} className="img-wrapper">
                  <a className="thumb">
                    <div className="image-container" style={wrapperStyle}>
                      {loadingImg && <Box sx={{ width: 300 }}>
                        <Skeleton />
                        <Skeleton animation="wave" />
                        <Skeleton animation={false} />
                      </Box>}
                      <Image
                        src={item.mainimages}
                        alt="News Image"
                        className="img-fluid"
                        layout="fill" // Fills the parent container
                        style={imageStyle}
                        onLoadingComplete={() => setLoadingImg(false)}
                      />
                    </div>
                  </a>
                </div>
                <div className="post-info-2" >
                  {loadingImg ? (<Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                  </Box>) : (
                    <h5 style={{ width: "150px" }}>
                      <a onClick={() => handleDetails(item)} style={{ cursor: 'pointer' }} className="title">
                        {item.title}
                      </a>
                    </h5>
                  )}
                  <div style={{ display: 'flex' }}>
                    <div className="date"> <TimeDisplay dateTime={item?.newsdatetime} /></div>
                    <div
                      className="link-icon"
                      onClick={(event) => handleIconClick(event, item.id)}
                      style={{
                        cursor: "pointer",
                        transition: "background-color 0.5s ease, color 0.5s ease",
                        backgroundColor: activeItems[item.id] ? "white" : "transparent", // Red when active, transparent otherwise
                        color: activeItems[item.id] ? "white" : "transparent", // White text when active
                        marginRight: "30px",
                        bottom: "2px",
                      }}
                    >
                      <style>{keyframes}</style>
                      {activeItems[item.id] ? (
                        <FaBookmark
                          style={{
                            fontSize: "16px",
                            color: "red",
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
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent click propagation to parent
                        handleLikeClick(e, item.id)
                      }}
                      style={{
                        marginLeft: '10px',
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
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    )
}
export default LatestReviews;