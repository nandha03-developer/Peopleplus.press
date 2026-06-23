/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TimeDisplay from "../timeDisplay";
import { useSavedItems } from "@/context/savedNewsContext";
import { FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useLikedItems } from "@/context/likedNewsContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const CarouselComponent = ({firstFivePosts, handleClick, handleTags}: any) => {
    const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const { activeItems, handleIconClick } = useSavedItems();
      const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems();
  
    useEffect(() => {
        if (modalOpen && carouselRef.current) {
          $(carouselRef.current).owlCarousel({
            items: 1,
            loop: true,
            nav: true,
            dots: true,
            autoplay: false,
            startPosition: currentIndex,
          });
        }
        return () => {
          if (carouselRef.current) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            $(carouselRef.current).trigger('destroy.owl.carousel');
          }
        };
      }, [modalOpen, currentIndex]);
    
      const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % firstFivePosts.length);
      };
    
      const prevSlide = () => {
        setCurrentIndex(
          (prevIndex) =>
            (prevIndex - 1 + firstFivePosts.length) % firstFivePosts.length
        );
      };
    
      const goToSlide = (index: any) => {
        setCurrentIndex(index);
      };
    
      // Automatic slide effect
      useEffect(() => {
        if (firstFivePosts.length > 0) {
          const interval = setInterval(nextSlide, 3000); // Change slides every 3 seconds
          return () => clearInterval(interval); // Cleanup interval on unmount
        }
      }, [firstFivePosts, currentIndex]);

    return (
        <div
        className="slider-container"
        style={{ position: "relative" }}
      >
        {/* Previous Slide Button */}
        <button
          className="nav-button prev"
          onClick={prevSlide}
        >
          ❮
        </button>

        {firstFivePosts.map((post: any, index: any) => (
          <div
            key={post.id}
            className={`slider-post post-height-1 ${
              index === currentIndex ? "active" : "inactive"
            }`}
            style={{
              display:
                index === currentIndex ? "block" : "none",
            }}
            onClick={() => handleClick(post)}
          >
            <Image style={{cursor:'pointer'}}
              layout="fill"
              src={post.mainimages}
              alt="PeoplePlus"
              className="img-fluid"
            />
            <div className="post-text">
              <span
                className="post-category"
                style={{
                  cursor: "pointer",
                  marginTop: "5px",
                  pointerEvents: "auto",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTags(post.tags, post)
                }}
              >
                {post.tags}
              </span>
              <h2>
                <a
                  style={{
                    cursor: "pointer",
                    pointerEvents: "auto",
                  }}
                >
                  {post.title}
                </a>
              </h2>
              <ul className="authar-info d-flex flex-wrap">
                <li
                  className="date"
                  style={{ color: "white" }}
                >
                  <TimeDisplay
                    dateTime={post?.newsdatetime}
                  />
                </li>
                {/* Like Button next to the Date */}
                <li>
                  <div
                    key={post.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent click propagation to parent
                      handleLikeClick(e, post.id);
                    }}
                    style={{
                      cursor: "pointer",
                      pointerEvents: "auto", // Ensure button remains clickable
                      display: "inline-flex", // Inline to be next to the date
                      alignItems: "center", // Center align the icon with the date
                      marginLeft: "10px", // Space between date and like icon
                    }}
                  >
                    {activeLikeItems[post.id] ? (
                      <FavoriteIcon
                        style={{
                          fontSize: "20px",
                          color: "red",
                          animation: "heartPulse 0.5s ease", // Like animation
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
                </li>
              </ul>

              {/* Save Icon */}
              <div
                className="link-icon"
                onClick={(event) => {
                  event.stopPropagation(); // Stop event propagation
                  handleIconClick(event, post.id);
                }}
                style={{
                  cursor: "pointer",
                  transition:
                    "background-color 0.5s ease, color 0.5s ease",
                  color: activeItems[post.id]
                    ? "pink"
                    : "transparent",
                  pointerEvents: "auto",
                }}
              >
                {activeItems[post.id] ? (
                  <FaBookmark
                    style={{
                      fontSize: "16px",
                      color: "white",
                      animation: "bookmarkBounce 0.5s ease",
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
        ))}

        {/* Next Slide Button */}
        <button
          className="nav-button next"
          onClick={nextSlide}
        >
          ❯
        </button>

        {/* Dots for Navigation */}
        <div className="dots-container">
          {firstFivePosts.map((_: any, index: any) => (
            <span
              key={index}
              className={`dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => goToSlide(index)} // Clickable dot to navigate
            />
          ))}
        </div>

        <style jsx>{`
          .slider-post {
            min-height: 250px;
            position: relative;
          }
          .active {
            display: block;
          }
          .nav-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.5);
            border: none;
            cursor: pointer;
            padding: 10px;
            z-index: 10; // Ensures buttons are above slider
          }
          .nav-button.prev {
            left: 1px;
          }
          .nav-button.next {
            right: 1px;
          }
          .nav-button.prev:hover,
          .nav-button.next:hover {
            background-color: #eb0254; /* Add background on hover */
            color: white;
          }
          .inactive {
            display: none;
          }
          .dots-container {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
          }
          .dot {
            height: 10px;
            width: 10px;
            margin: 0 5px;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            display: inline-block;
            cursor: pointer;
          }
          .dot.active {
            background-color: rgba(
              255,
              255,
              255,
              0.9
            ); // Active dot color
          }
        `}</style>
      </div>
    )
}

export default CarouselComponent  