import { Skeleton } from "@mui/material";
import TimeDisplay from "../timeDisplay";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const TopStories = ({topStories,loadingImg, handleDetails, handleTags }: any) => {
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
<div>
<div className="panel_header">
                      <h4>
                        <strong>Top </strong> Stories
                      </h4>
                    </div>
                    <div className="border-bottom posts">
                      <ul>
                        {topStories.map((post: any) => (
                          <li key={post.id} className="post-grid">
                            <div className="posts-inner px-0">
                              {loadingImg ? (<Skeleton />) : (
                                <h6 className="posts-title">
                                  <a onClick={() => handleDetails(post)} style={{ cursor: 'pointer' }}>{post.title}</a>
                                </h6>
                              )}
                              <ul className="align-items-center authar-info d-flex flex-wrap">
                                <li>
                                  <span className="post-category" onClick={() => handleTags(post)} style={{ cursor: 'pointer' }}>{post.tags}</span>
                                </li>
                                <li className="d-md-block d-none"><TimeDisplay dateTime={post?.newsdatetime} /></li>
                                <li style={{ listStyleType: 'none' }}>
                                  <div
                                    className="link-icon"
                                    onClick={(event) => handleIconClick(event, post.id)}
                                    style={{
                                      cursor: "pointer",
                                      transition: "background-color 0.5s ease, color 0.5s ease",
                                      backgroundColor: activeItems[post.id] ? "white" : "transparent", // Red when active, transparent otherwise
                                      color: activeItems[post.id] ? "white" : "transparent", // White text when active
                                      display: "flex",
                                      alignItems: "center",
                                      marginRight: "-10px",
                                      top: "-14px",

                                    }}
                                  >
                                    <style>{keyframes}</style>
                                    {activeItems[post.id] ? (
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
                                    key={post.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation(); // Prevent click propagation to parent
                                      handleLikeClick(e, post.id)
                                    }}
                                    style={{
                                      pointerEvents: "auto", // Ensure button remains clickable
                                    }}
                                  >
                                    <div
                                      style={{
                                        ...heartIconStyle,
                                        ...(activeLikeItems[post.id]
                                          ? activeHeartIconStyle
                                          : {}),
                                      }}
                                    >
                                      {activeLikeItems[post.id] ? (
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
                              {loadingImg ? (<Skeleton />) : (<p>{post.shortcontent}</p>)}

                            </div>
                          </li>
                        ))}
                      </ul>
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
export default TopStories;