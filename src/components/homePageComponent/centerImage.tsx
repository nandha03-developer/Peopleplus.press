import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import TimeDisplay from "../timeDisplay";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const CenterImage = ({centerImage, handleDetails, loadingImg, setLoadingImg, handleTags}: any) => {
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

    return (
        <div className="post-inner">
        {/* post body */}
        <div className="post-body py-0">
          <article>
            <figure style={{ cursor: 'pointer' }}>
              <a onClick={() => handleDetails(centerImage)}>
                <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden', boxShadow: 'none' }}>
                  {loadingImg && <Box sx={{ width: 300 }}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                  </Box>}

                  <Image
                    src={centerImage?.mainimages || null}
                    alt="Description of the image"
                    layout="fill"
                    objectFit="cover" // This will make sure the image covers the entire container
                    onLoadingComplete={() => setLoadingImg(false)}
                    style={{ borderRadius: '6px' }}
                  />
                </div>
              </a>
            </figure>
            <div className="post-info">
              <h3 className="fs-4">
                <a onClick={() => handleDetails(centerImage)} style={{ cursor: 'pointer', borderRadius: '6px' }}>
                  {centerImage?.title}
                </a>
              </h3>
              <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                <li>
                  <span onClick={() => handleTags(centerImage)} style={{ cursor: 'pointer' }} className="post-category mb-0">{centerImage?.tags}</span>
                </li>
                {/* <li>
              By <span className="editor-name">John Doe</span>
            </li> */}
                <li className="date">
                  <TimeDisplay dateTime={centerImage?.newsdatetime} />
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <div
                    className="link-icon"
                    onClick={(event) => handleIconClick(event, centerImage?.id)}
                    style={{
                      cursor: "pointer",
                      transition: "background-color 0.5s ease, color 0.5s ease",
                      backgroundColor: activeItems[centerImage?.id] ? "white" : "transparent", // Red when active, transparent otherwise
                      color: activeItems[centerImage?.id] ? "white" : "transparent", // White text when active
                      display: "flex",
                      alignItems: "center",
                      marginRight: "-10px",
                      top: "-14px",
                    }}
                  >
                    <style>{keyframes}</style>
                    {activeItems[centerImage?.id] ? (
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


                </li>
                <li style={{ marginTop: '5px' }}>
                  {/* Like Button with event propagation prevention */}
                  <div
                    key={centerImage?.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent click propagation to parent
                      handleLikeClick(e, centerImage?.id)
                    }}
                    style={{
                      pointerEvents: "auto", // Ensure button remains clickable
                    }}
                  >
                    <div
                      style={{
                        ...heartIconStyle,
                        ...(activeLikeItems[centerImage?.id]
                          ? activeHeartIconStyle
                          : {}),
                      }}
                    >
                      {activeLikeItems[centerImage?.id] ? (
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
              <p>
                {centerImage?.shortcontent}
              </p>
            </div>
            {/* Buttons */}

          </article>
        </div>
        <style jsx>{`
.post-actions {
margin-top: 10px;
}
.btn-action {
background: none;
border: none;
color: #007bff;
cursor: pointer;
font-size: 14px;
}
.btn-action:hover {
text-decoration: underline;
}
`}</style>
      </div>
    )
}
export default CenterImage;