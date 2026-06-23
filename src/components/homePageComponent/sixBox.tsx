import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import TimeDisplay from "../timeDisplay";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const SixBox = ({sixbox, handleDetails, loadingImg,handleTags,setLoadingImg}: any) => {
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
        <div className="news-grid-2 border-top pt-4 mb-4">
        <div className="row gx-3 gx-lg-4 gy-4">
          {sixbox.map((item: any) => (
            <div key={item.id} className="col-6 col-md-4 col-sm-6">
              <div className="grid-item mb-0">
                <div  style={{ cursor: 'pointer' }} className="grid-item-img">
                  <a>
                    <div onClick={() => handleDetails(item)} className="image-container" style={wrapperStyle}>
                      {loadingImg && <Skeleton variant="rectangular" width={210} height={118} />}
                      <Image
                        src={item.mainimages}
                        alt="News Image"
                        layout="fill"
                        onLoadingComplete={() => setLoadingImg(false)}
                        style={imageStyle}

                      />
                    </div>
                    <div
                      className="link-icon"
                      onClick={(event) => handleIconClick(event, item.id)}
                      style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.5s ease, color 0.5s ease',
                        color: activeItems[item.id] ? 'pink' : 'transparent',
                    borderBottomRightRadius: "6px",
                    pointerEvents: "auto", // Ensure button remains clickable
                    }}
                    >
                      <style>{keyframes}</style>
                      {activeItems[item.id] ? (
                        <FaBookmark
                        style={{
                          fontSize: '16px',
                          color: 'white',
                          animation: 'bookmarkBounce 0.5s ease', // Apply the animation
                          pointerEvents: "auto", // Ensure button remains clickable
                        }}
                        />
                      ) : (
                        <FaRegBookmark
                                            style={{
                                                fontSize: '16px',
                                                color: 'white',
                                                transition: 'color 0.3s ease',
                                                pointerEvents: "auto", // Ensure button remains clickable
                                            }}
                                        />
                      )}
                    </div>
                  </a>
                </div>
                {loadingImg ? (<Box sx={{ pt: 0.5 }}>
                  <Skeleton />
                  <Skeleton width="60%" />
                </Box>) : (<h5>
                  <a onClick={() => handleDetails(item)} style={{ cursor: 'pointer' }} className="title">
                    {item.title}
                  </a>
                </h5>)}
               <ul className="authar-info d-flex align-items-center" style={{ listStyleType: 'none', paddingLeft: '0', marginBottom: '0' }}>
  {/* <li className="d-flex align-items-center" >
    <span className="post-category" style={{ cursor: 'pointer',fontSize:"12px" }} onClick={() => handleTags(item)}>{item.tags}</span>
  </li> */}
  <li className="date d-flex align-items-center" style={{marginTop: '-5px'}} >
    <TimeDisplay dateTime={item?.newsdatetime} />
  </li>
  <li style={{marginLeft: '-8px'}}>
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
          ...(activeLikeItems[item.id] ? activeHeartIconStyle : {}),
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
  </li>
</ul>

              </div>
            </div>
          ))}
        </div>
      </div>
    )
}
export default SixBox;