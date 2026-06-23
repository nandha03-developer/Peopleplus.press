import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TimeDisplay from "../timeDisplay";

const LeftBox = ({leftone, lefttwo, leftthree, handleDetails, loadingImg, setLoadingImg, handleTags, loading, handleImageLoad}: any) => {

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
        <div className="col-md-4 col-xxl-4 thm-padding d-md-none d-xxl-block">
        <div className="row slider-right-post thm-margin">
          <div className="col-6 col-sm-6 thm-padding">
            <div className="slider-post post-height-4">
              <a style={{ cursor: 'pointer' }} className="news-image">
                <div onClick={() => handleDetails(leftone)} style={{ position: 'relative', width: '100%', height: '500px' }}>
                  {loading && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1
                    }}>
                      <Box sx={{ width: 300 }}>
                        <Skeleton />
                        <Skeleton animation="wave" />
                        <Skeleton animation={false} />
                      </Box>
                    </div>
                  )}
                  {loadingImg && <Box sx={{ width: 300 }}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                  </Box>}

                  <Image
                    src={leftone?.mainimages || null}
                    alt="la"
                    className="img-fluid"
                    layout="fill"
                    objectFit="cover"
                    onLoad={handleImageLoad}
                    onLoadingComplete={() => setLoadingImg(false)}


                  />
                </div>
              </a>
              <div
                className="link-icon"
                onClick={(event) =>
                  handleIconClick(event, leftone?.id)
                }
                style={{
                  cursor: "pointer",
                  transition:
                    "background-color 0.5s ease, color 0.5s ease",
                  color: activeItems[leftone?.id]
                    ? "pink"
                    : "transparent",
                }}
              >
                <style>{keyframes}</style>
                {activeItems[leftone?.id] ? (
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
                <span onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTags(leftone)
                }} className="post-category" style={{
                  cursor: 'pointer', marginTop: '5px',
                  pointerEvents: "auto",
                }}>{leftone?.tags}</span>


                {loadingImg ? (<Box sx={{ width: 300 }}>
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>) : (<h4>
                  <a className="title" style={{ cursor: 'pointer' }}>
                    {leftone?.title}
                  </a>
                </h4>)}
                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                  <li className="date">
                    <TimeDisplay dateTime={leftone?.newsdatetime} />
                  </li>
                  <li>
                    {/* Like Button with event propagation prevention */}
                    <div
                      key={leftone?.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent click propagation to parent

                        handleLikeClick(e, leftone?.id)
                      }}
                      style={{
                        marginTop: '5px',
                        pointerEvents: "auto", // Ensure button remains clickable
                      }}
                    >
                      <div
                        style={{
                          ...heartIconStyle,
                          ...(activeLikeItems[leftone?.id]
                            ? activeHeartIconStyle
                            : {}),
                        }}
                      >
                        {activeLikeItems[leftone?.id] ? (
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
                    handleIconClick(event, leftone?.id)
                  }
                  style={{
                    cursor: "pointer",
                    transition:
                      "background-color 0.5s ease, color 0.5s ease",
                    color: activeItems[leftone?.id]
                      ? "pink"
                      : "transparent",
                  }}
                >
                  <style>{keyframes}</style>
                  {activeItems[leftone?.id] ? (
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
            <div className="slider-post post-height-4">
              <a onClick={() => handleDetails(lefttwo)} style={{ cursor: 'pointer' }} className="news-image">
                {loadingImg && <Box sx={{ width: 300 }}>
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>}
                <Image
                  src={lefttwo?.mainimages || null}
                  alt="la"
                  className="img-fluid"
                  layout="fill" // Use layout="fill" to fill the parent div with the image
                  objectFit="cover"
                  onLoadingComplete={() => setLoadingImg(false)}

                />
              </a>
              <div
                className="link-icon"
                onClick={(event) =>
                  handleIconClick(event, lefttwo?.id)
                }
                style={{
                  cursor: "pointer",
                  transition:
                    "background-color 0.5s ease, color 0.5s ease",
                  color: activeItems[lefttwo?.id]
                    ? "pink"
                    : "transparent",
                }}
              >
                <style>{keyframes}</style>
                {activeItems[lefttwo?.id] ? (
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
                <span className="post-category"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTags(lefttwo)
                  }}
                  style={{
                    cursor: 'pointer', marginTop: '5px',
                    pointerEvents: "auto",
                  }}>
                  {lefttwo?.tags}</span>
                <h4>

                  <a style={{ cursor: 'pointer' }}>
                    {lefttwo?.title}
                  </a>
                </h4>
                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">

                  <li className="date">
                    <TimeDisplay dateTime={lefttwo?.newsdatetime} />
                  </li>
                  <li>
                    {/* Like Button with event propagation prevention */}
                    <div
                      key={lefttwo?.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent click propagation to parent
                        handleLikeClick(e, lefttwo?.id)
                      }}
                      style={{
                        marginTop: '5px',
                        pointerEvents: "auto", // Ensure button remains clickable
                      }}
                    >
                      <div
                        style={{
                          ...heartIconStyle,
                          ...(activeLikeItems[lefttwo?.id]
                            ? activeHeartIconStyle
                            : {}),
                        }}
                      >
                        {activeLikeItems[lefttwo?.id] ? (
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
                    handleIconClick(event, lefttwo?.id)
                  }
                  style={{
                    cursor: "pointer",
                    transition:
                      "background-color 0.5s ease, color 0.5s ease",
                    color: activeItems[lefttwo?.id]
                      ? "pink"
                      : "transparent",
                  }}
                >
                  <style>{keyframes}</style>
                  {activeItems[lefttwo?.id] ? (
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
                {/* Buttons */}

              </div>
            </div>
          </div>
          <div className="col-md-12 col-sm-12 d-md-block d-none thm-padding">
            <div className="slider-post post-height-4 ">
              <a onClick={() => handleDetails(leftthree)} style={{ cursor: 'pointer' }}>
                {loadingImg && <Box sx={{ width: 300 }}>
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>}

                <Image
                  src={leftthree?.mainimages || null}
                  alt="la"
                  className="img-fluid"
                  layout="fill" // Use layout="fill" to fill the parent div with the image
                  objectFit="cover"
                  onLoadingComplete={() => setLoadingImg(false)}

                />
              </a>
              <div
                className="link-icon"
                onClick={(event) =>
                  handleIconClick(event, leftthree?.id)
                }
                style={{
                  cursor: "pointer",
                  transition:
                    "background-color 0.5s ease, color 0.5s ease",
                  color: activeItems[leftthree?.id]
                    ? "pink"
                    : "transparent",
                }}
              >
                <style>{keyframes}</style>
                {activeItems[leftthree?.id] ? (
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
                <span onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTags(leftthree)
                }} className="post-category" style={{
                  cursor: 'pointer', marginTop: '5px',
                  pointerEvents: "auto",
                }} >{leftthree?.tags}</span>
                <h4>
                  <a style={{ cursor: 'pointer' }}>
                    {leftthree?.title}
                  </a>
                </h4>
                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">

                  <li className="date">
                    {leftthree?.newsdatetime && (
                      <>
                        <TimeDisplay dateTime={leftthree?.newsdatetime} />                                  </>
                    )}
                  </li>
                  <li>
                    {/* Like Button with event propagation prevention */}
                    <div
                      key={leftthree?.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent click propagation to parent
                        handleLikeClick(e, leftthree?.id)
                      }}
                      style={{
                        marginTop: '5px',
                        pointerEvents: "auto", // Ensure button remains clickable
                      }}
                    >
                      <div
                        style={{
                          ...heartIconStyle,
                          ...(activeLikeItems[leftthree?.id]
                            ? activeHeartIconStyle
                            : {}),
                        }}
                      >
                        {activeLikeItems[leftthree?.id] ? (
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
                    handleIconClick(event, leftthree?.id)
                  }
                  style={{
                    cursor: "pointer",
                    transition:
                      "background-color 0.5s ease, color 0.5s ease",
                    color: activeItems[leftthree?.id]
                      ? "pink"
                      : "transparent",
                  }}
                >
                  <style>{keyframes}</style>
                  {activeItems[leftthree?.id] ? (
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
export default LeftBox;