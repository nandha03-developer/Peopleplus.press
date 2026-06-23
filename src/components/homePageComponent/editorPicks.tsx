import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import TimeDisplay from "../timeDisplay";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const EditorPicks = ({editorPicksOne, editorPicks, handleDetails, loadingImg, setLoadingImg, handleTags }: any) => {
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
    <div className="panel_inner mb-0">
    <div className="panel_header">
      <h4>
        <strong>EDITORS</strong> PICKS
      </h4>
    </div>
    <div className="panel_body">
      <div className="border-bottom" >
        <a onClick={() => handleDetails(editorPicksOne)} style={{ cursor: 'pointer' }} className="d-block mb-3">
          {loadingImg && <Skeleton variant="rectangular" width={40} height={40} />}
          <Image
            src={editorPicksOne?.mainimages}
            alt="image"
            className="img-fluid"
            width={400}
            height={400}
            onLoadingComplete={() => setLoadingImg(false)}
            style={{ borderRadius: '6px' }}
          />
        </a>

        {loadingImg ? (<Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>) : (
          <h5>
            <a className='title' style={{ cursor: 'pointer' }} onClick={() => handleDetails(editorPicksOne)}>
              {editorPicksOne?.title}
            </a>

          </h5>
        )}
        <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
          <li>
            <span className="post-category mb-0" onClick={() => handleTags(editorPicksOne)} style={{ cursor: 'pointer' }}>{editorPicksOne?.tags}</span>
          </li>
          <li className="date">
            <TimeDisplay dateTime={editorPicksOne?.newsdatetime} />
          </li>
          <li style={{ listStyleType: 'none' }}>
            <div
              className="link-icon"
              onClick={(event) => handleIconClick(event, editorPicksOne.id)}
              style={{
                cursor: "pointer",
                transition: "background-color 0.5s ease, color 0.5s ease",
                backgroundColor: activeItems[editorPicksOne.id] ? "white" : "transparent", // Red when active, transparent otherwise
                color: activeItems[editorPicksOne.id] ? "white" : "transparent", // White text when active
                display: "flex",
                alignItems: "center",
                marginRight: "-10px",
                top: "-14px",
              }}
            >
              <style>{keyframes}</style>
              {activeItems[editorPicksOne.id] ? (
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
              key={editorPicksOne.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent click propagation to parent
                handleLikeClick(e, editorPicksOne.id)
              }}
              style={{
                pointerEvents: "auto", // Ensure button remains clickable
              }}
            >
              <div
                style={{
                  ...heartIconStyle,
                  ...(activeLikeItems[editorPicksOne.id]
                    ? activeHeartIconStyle
                    : {}),
                }}
              >
                {activeLikeItems[editorPicksOne.id] ? (
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
          {editorPicksOne?.shortcontent}
        </p>
      </div>

      {editorPicks.map((item: any) => (
        <div key={item.id} className="border-bottom py-3" >
          <h6 className="posts-title">
            <a className='title' style={{ cursor: 'pointer' }} onClick={() => handleDetails(item)}>
              {item.title}
            </a>
          </h6>
          <ul className="align-items-center authar-info d-flex flex-wrap gap-1 mb-0">
            <li>
              <span className="post-category mb-0" style={{ cursor: 'pointer' }} onClick={() => handleTags(item)}>{item?.tags}</span>
            </li>
            <li className="date" style={{ marginRight: '5px' }}> <TimeDisplay dateTime={item?.newsdatetime} /></li>
            <li style={{ listStyleType: 'none' }}>
              <div
                className="link-icon"
                onClick={(event) => handleIconClick(event, item.id)}
                style={{
                  cursor: "pointer",
                  transition: "background-color 0.5s ease, color 0.5s ease",
                  backgroundColor: activeItems[item.id] ? "white" : "transparent", // Red when active, transparent otherwise
                  color: activeItems[item.id] ? "white" : "transparent", // White text when active
                  display: "flex",
                  alignItems: "center",
                  marginRight: "-7px",
                  top: "-14px",
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


            </li>
            <li style={{ marginTop: '5px' }}>
              {/* Like Button with event propagation prevention */}
              <div
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // Prevent click propagation to parent
                  handleLikeClick(e, item.id)
                }}
                style={{
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
            </li>
          </ul>
        </div>
      ))}
    </div>
  </div>
  )
}
  export default EditorPicks;