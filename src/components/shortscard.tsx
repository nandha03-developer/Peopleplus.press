/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from 'react';
import { CgStories } from 'react-icons/cg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/languageContext";
import { Skeleton } from '@mui/material';
import { useShortsImage } from './shortsImageState';
import Image from 'next/image';

const ShortsCard = ({ shortsImage, loadingSkeleton }: any) => {
  const { langCode } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const itemsPerPage = 2; // Reduced items per page for mobile responsiveness
  const scrollRef = useRef(null);
  const { updateShortsImage } = useShortsImage();
  const router = useRouter();

  // Adjusted dimensions for responsive design
  const CARD_WIDTH = '160px'; // Smaller width for mobile
  const CARD_HEIGHT = '300px'; // Smaller height for mobile

  const handleNext = () => {
    if (currentIndex + itemsPerPage < shortsImage.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const handlePrevious = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  // const handleWebStory = (itemUrl: any) => {
  //   router.push(`/${langCode}/webstory/${itemUrl}`);
  // };

  const handleWebStory = (itemUrl: any) => {
    updateShortsImage(shortsImage);
    router.push(`/${langCode}/webstory/${itemUrl}`);
  };


  const cardStyle: any = (index: any) => ({
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: '0 13px',
    position: 'relative',
    transition: 'transform 0.3s',
    cursor: 'pointer',
    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
    boxShadow: hoveredIndex === index ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none',
    overflow: 'hidden',
    borderRadius: '8px',
    top:"16px"
  });

  const imageStyle: React.CSSProperties = {
    width: '160px',
    height: '300px',
    objectFit: 'scale-down',     // Ensures the image fills the container without distortion
    borderRadius: '8px',    // Keeps the rounded corners
   backgroundColor:"black",
  
  };
  

  return (
    <div>
      <div className="post-head">
        <h2 className="title">
          <strong>Shorts</strong>
        </h2>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <div className="slick-arrow slick-prev" onClick={handlePrevious} style={{ display: 'block',right: '-35px', cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: '24px', color: '#eb0254' }} />
        </div>

        <div style={{
          overflow: 'hidden',
          width: '100%', // Ensures responsive width
          maxWidth: '90vw', // Limits max width on smaller screens
        }}>
          <main
            ref={scrollRef}
            className="page-content"
            style={{
              display: 'flex',
              flexDirection: 'row',
              transition: 'transform 0.5s ease',
              transform: `translateX(-${(currentIndex / itemsPerPage) * 100}%)`
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', textDecoration: 'none', position: 'relative',height:"335px" }}>
              {shortsImage.map((item: any, index: any) => {
                const firstImage = item.shorts.split(',').map((image: any) => image.trim())[0];

                return (
                  <div
                  key={item.id || index} // Apply the key directly to the div
                  onClick={() => handleWebStory(item.url)}
                  style={cardStyle(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {loadingSkeleton ? (
                    <Skeleton variant="rectangular" width={CARD_WIDTH} height={CARD_HEIGHT} />
                  ) : (
                    <>
<Image src={firstImage} alt="First Card Image" style={imageStyle} width={500} height={300} />
<span style={{ position: 'absolute', top: '10px', left: '10px', color: 'white' }}>
                        <CgStories style={{ color: 'white', backgroundColor: 'black', borderRadius: '50%', padding: '3px', fontSize: '24px' }} />
                      </span>
                    </>
                  )}
                </div>
              );
              
              })}
            </div>
          </main>
        </div>

        <div className="slick-arrow slick-next" onClick={handleNext} style={{ display: 'block',right: '-35px', cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '24px', color: '#eb0254' }} />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .post-head h2.title {
            font-size: 18px;
          }
          .slick-arrow {
            font-size: 20px;
          }
        }
        @media (max-width: 480px) {
          .post-head h2.title {
            font-size: 16px;
          }
          .slick-arrow {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default ShortsCard;
