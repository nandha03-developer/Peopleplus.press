import Image from "next/image";
import TimeDisplay from "../timeDisplay";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const TechAndInnovation = ({techAndInnovation, techAndInnovationDatas, handleDetails, setLoadingImg, handleTags}: any) => {
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
        <div className="panel_inner">
        <div className="panel_header">
          <h4>
            <strong>TECH &</strong> INNOVATION
          </h4>
        </div>
        <div className="panel_body">
          <div className="border-bottom" >

            <a onClick={() => handleDetails(techAndInnovation)} style={{ cursor: 'pointer' }} className="d-block mb-3">

              <Image
                src={techAndInnovation?.mainimages}
                alt="image"
                className="img-fluid"
                width={400}
                height={400}
                onLoadingComplete={() => setLoadingImg(false)}
                style={{ borderRadius: '6px' }}
              />
            </a>
            <h5>
              <a className='title' onClick={() => handleDetails(techAndInnovation)} style={{ cursor: 'pointer' }}>
                {techAndInnovation?.title}
              </a>
            </h5>
            <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
              <li>
                <span className="post-category mb-0" onClick={() => handleTags(techAndInnovation)} style={{ cursor: 'pointer' }}> {techAndInnovation?.tags}</span>
              </li>
              <li className="date">
                <TimeDisplay dateTime={techAndInnovation?.newsdatetime} />
              </li>
              <li style={{ listStyleType: 'none' }}>
                <div
                  className="link-icon"
                  onClick={(event) => handleIconClick(event, techAndInnovation.id)}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.5s ease, color 0.5s ease",
                    backgroundColor: activeItems[techAndInnovation.id] ? "white" : "transparent", // Red when active, transparent otherwise
                    color: activeItems[techAndInnovation.id] ? "white" : "transparent", // White text when active
                    display: "flex",
                    alignItems: "center",
                    marginRight: "-10px",
                    top: "-14px",
                  }}
                >
                  <style>{keyframes}</style>
                  {activeItems[techAndInnovation.id] ? (
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
                  key={techAndInnovation.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent click propagation to parent
                    handleLikeClick(e, techAndInnovation.id)
                  }}
                  style={{
                    pointerEvents: "auto", // Ensure button remains clickable
                  }}
                >
                  <div
                    style={{
                      ...heartIconStyle,
                      ...(activeLikeItems[techAndInnovation.id]
                        ? activeHeartIconStyle
                        : {}),
                    }}
                  >
                    {activeLikeItems[techAndInnovation.id] ? (
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
              {techAndInnovation?.shortcontent}
            </p>
          </div>
          {techAndInnovationDatas.map((item: any) => (
            <div key={item.id} className="border-bottom py-3">
              <h6 className="posts-title">
                <a className='title' onClick={() => handleDetails(item)} style={{ cursor: 'pointer' }}>
                  {item.title}
                </a>
              </h6>
              <ul className="authar-info d-flex align-items-center gap-1 mb-0" style={{ display: 'flex', alignItems: 'center' }}>
                <li>
                  <span className="post-category mb-0" onClick={() => handleTags(item)} style={{ cursor: 'pointer' }}> {item?.tags}</span>
                </li>
                <li className="date" style={{ marginRight: '5px', listStyleType: 'none' }}>
                  <TimeDisplay dateTime={item?.newsdatetime} />
                </li>
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
export default TechAndInnovation;