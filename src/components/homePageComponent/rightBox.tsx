import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TimeDisplay from "../timeDisplay";

const RightBox = ({rightone, righttwo, rightthree, handleDetails, loadingImg, setLoadingImg, handleTags}: any) => {
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
        <div className="col-md-6 col-xxl-4 thm-padding">
        <div className="row slider-right-post thm-margin">
          <div className="col-md-12 col-sm-12 d-md-block d-none thm-padding">
            <div className="slider-post post-height-2">
              <a onClick={() => handleDetails(rightone)} style={{ cursor: 'pointer' }} className="news-image">
                {loadingImg && <Box sx={{ width: 300 }}>
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>}
                <Image src={rightone?.mainimages || null} alt="la" className="img-fluid"
                  layout="fill" // Use layout="fill" to fill the parent div with the image
                  objectFit="cover"
                  onLoadingComplete={() => setLoadingImg(false)} />
              </a>
              <div
                className="link-icon"
                onClick={(event) =>
                  handleIconClick(event, rightone?.id)
                }
                style={{
                  cursor: "pointer",
                  transition:
                    "background-color 0.5s ease, color 0.5s ease",
                  color: activeItems[rightone?.id]
                    ? "pink"
                    : "transparent",
                }}
              >
                <style>{keyframes}</style>
                {activeItems[rightone?.id] ? (
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
              <div className="post-text">
                <span className="post-category" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTags(rightone)
                }}
                  style={{
                    cursor: 'pointer', marginTop: '5px',
                    pointerEvents: "auto",
                  }}>{rightone?.tags}</span>
                <h4>
                  <a style={{ cursor: 'pointer' }}>
                    {rightone?.title}
                  </a>
                </h4>
                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                  <li className="date">
                    {rightone?.newsdatetime && (
                      <>
                        <TimeDisplay dateTime={rightone?.newsdatetime} />
                      </>
                    )}
                  </li>
                  <li>
                    {/* Like Button with event propagation prevention */}
                    <div
                      key={rightone?.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent click propagation to parent
                        handleLikeClick(e, rightone?.id)
                      }}
                      style={{
                        marginTop: '5px',
                        pointerEvents: "auto", // Ensure button remains clickable
                      }}
                    >
                      <div
                        style={{
                          ...heartIconStyle,
                          ...(activeLikeItems[rightone?.id]
                            ? activeHeartIconStyle
                            : {}),
                        }}
                      >
                        {activeLikeItems[rightone?.id] ? (
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
                              color: "white",
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
                {/* Save/Bookmark Button */}
                <div
                  className="link-icon"
                  onClick={(event) =>
                    handleIconClick(event, rightone?.id)
                  }
                  style={{
                    cursor: "pointer",
                    transition:
                      "background-color 0.5s ease, color 0.5s ease",
                    color: activeItems[rightone?.id]
                      ? "pink"
                      : "transparent",
                  }}
                >
                  <style>{keyframes}</style>
                  {activeItems[rightone?.id] ? (
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
            </div>
          </div>
          <div className="col-6 col-sm-6 thm-padding">
            <div className="slider-post post-height-2">
              <a onClick={() => handleDetails(righttwo)} style={{ cursor: 'pointer' }} className="news-image">
                {loadingImg && <Box sx={{ width: 300 }}>
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>}
                <Image src={righttwo?.mainimages || null} alt="la" className="img-fluid"
                  layout="fill" // Use layout="fill" to fill the parent div with the image
                  objectFit="cover"
                  onLoadingComplete={() => setLoadingImg(false)} />
              </a>
              <div
                className="link-icon"
                onClick={(event) =>
                  handleIconClick(event, righttwo?.id)
                }
                style={{
                  cursor: "pointer",
                  transition:
                    "background-color 0.5s ease, color 0.5s ease",
                  color: activeItems[righttwo?.id]
                    ? "pink"
                    : "transparent",
                }}
              >
                <style>{keyframes}</style>
                {activeItems[righttwo?.id] ? (
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
              <div className="post-text">
                <span className="post-category" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTags(righttwo)
                }}
                  style={{
                    cursor: 'pointer', marginTop: '5px',
                    pointerEvents: "auto",
                  }}>{righttwo?.tags}</span>
                <h4>
                  <a style={{ cursor: 'pointer' }}>
                    {righttwo?.title}
                  </a>
                </h4>
                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                  <li className="date">
                    {righttwo?.newsdatetime && (
                      <>
                        <TimeDisplay dateTime={righttwo?.newsdatetime} />
                      </>
                    )}
                  </li>
                  <li>
                    {/* Like Button with event propagation prevention */}
                    <div
                      key={righttwo?.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent click propagation to parent
                        handleLikeClick(e, righttwo?.id)
                      }}
                      style={{
                        marginTop: '5px',
                        pointerEvents: "auto", // Ensure button remains clickable
                      }}
                    >
                      <div
                        style={{
                          ...heartIconStyle,
                          ...(activeLikeItems[righttwo?.id]
                            ? activeHeartIconStyle
                            : {}),
                        }}
                      >
                        {activeLikeItems[righttwo?.id] ? (
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
                              color: "white",
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
                <div
                  className="link-icon"
                  onClick={(event) =>
                    handleIconClick(event, righttwo?.id)
                  }
                  style={{
                    cursor: "pointer",
                    transition:
                      "background-color 0.5s ease, color 0.5s ease",
                    color: activeItems[righttwo?.id]
                      ? "pink"
                      : "transparent",
                  }}
                >
                  <style>{keyframes}</style>
                  {activeItems[righttwo?.id] ? (
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
            </div>
          </div>

          <div className="col-6 col-sm-6 thm-padding">
            <div className="slider-post post-height-2">
              <a onClick={() => handleDetails(rightthree)} style={{ cursor: 'pointer' }} className="news-image">
                {loadingImg && <Box sx={{ width: 300 }}>
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>}
                <Image src={rightthree?.mainimages || null} alt="la" className="img-fluid"
                  layout="fill" // Use layout="fill" to fill the parent div with the image
                  objectFit="cover"
                  onLoadingComplete={() => setLoadingImg(false)} />
              </a>
              <div
                className="link-icon"
                onClick={(event) =>
                  handleIconClick(event, rightthree?.id)
                }
                style={{
                  cursor: "pointer",
                  transition:
                    "background-color 0.5s ease, color 0.5s ease",
                  color: activeItems[rightthree?.id]
                    ? "pink"
                    : "transparent",
                }}
              >
                <style>{keyframes}</style>
                {activeItems[rightthree?.id] ? (
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
              <div className="post-text">
                <span className="post-category" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTags(rightthree)
                }}
                  style={{
                    cursor: 'pointer', marginTop: '5px',
                    pointerEvents: "auto",
                  }} >{rightthree?.tags}</span>
                <h4>
                  <a style={{ cursor: 'pointer' }}>
                    {rightthree?.title}
                  </a>
                </h4>
                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                  <li className="date">
                    {rightthree?.newsdatetime && (
                      <>
                        <TimeDisplay dateTime={rightthree?.newsdatetime} />
                      </>
                    )}
                  </li>
                  <li>
                    {/* Like Button with event propagation prevention */}
                    <div
                      key={rightthree?.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent click propagation to parent
                        handleLikeClick(e, rightthree?.id)
                      }}
                      style={{
                        marginTop: '5px',
                        pointerEvents: "auto", // Ensure button remains clickable
                      }}
                    >
                      <div
                        style={{
                          ...heartIconStyle,
                          ...(activeLikeItems[rightthree?.id]
                            ? activeHeartIconStyle
                            : {}),
                        }}
                      >
                        {activeLikeItems[rightthree?.id] ? (
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
                              color: "white",
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
                <div
                  className="link-icon"
                  onClick={(event) =>
                    handleIconClick(event, rightthree?.id)
                  }
                  style={{
                    cursor: "pointer",
                    transition:
                      "background-color 0.5s ease, color 0.5s ease",
                    color: activeItems[rightthree?.id]
                      ? "pink"
                      : "transparent",
                  }}
                >
                  <style>{keyframes}</style>
                  {activeItems[rightthree?.id] ? (
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
            </div>
          </div>
        </div>

        <style jsx>{`
.post-actions {
margin-top: 10px;
}
.btn-action {
background: none;
border: none;
color: white;
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
export default RightBox;