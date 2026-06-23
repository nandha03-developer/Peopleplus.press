/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Image from "next/image";

const CarouselDetails = ({newsItems}: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = newsItems?.mainimages?.split(',') || [];

    //Carousel
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Automatic slide effect (optional)
  useEffect(() => {
    if (images && images.length > 0) {
      const interval = setInterval(goToNext, 3000); // Change slides every 3 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [images, currentIndex]);

  // Render only if images array is not empty
  if (!images || images.length === 0) return null;

    return (
        <div className="slider-post post-height-1 social-icon" style={{ margin: '0 10px', flex: '1', textAlign: 'center', position: 'relative' }}>

        {/* Previous Slide Button */}
        {images.length > 1 && (
          <button
            className="nav-button prev"
            onClick={goToPrevious}
            style={{
              position: 'absolute',
              left: '1px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
              zIndex: 1,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#eb0254'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
          >
            ❮
          </button>
        )}

        <figure className="social-icon">
          <Image
            priority
            //unoptimized={true}
            quality={100}
            width={300} // Optional if using a responsive framework
            height={400} // Optional if using a responsive framework
            // onLoadingComplete={() => setLoadingSkeleton(false)}
            src={images[currentIndex]?.trim()}
            alt="PeoplePlus"
            className="img-fluid"
            style={{
              width: "100%",
              height: "475px",
              borderBottomRightRadius: "6px",
              borderBottomLeftRadius: "6px",
              borderTopRightRadius: "6px",
              borderTopLeftRadius: "6px",
            }} // Inline CSS for fixed dimensions
          />
        </figure>

        {/* Next Slide Button */}
        {images.length > 1 && (
          <button
            className="nav-button next"
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: '1px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
              zIndex: 1,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#eb0254'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
          >
            ❯
          </button>
        )}

        {/* Dots for navigation */}
        {images.length > 1 && (
          <div className="dot-navigation" style={{
            position: 'absolute',
            bottom: '1px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex'

          }}>
            {images.map((_: any, index: any) => (
              <span
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                style={{
                  height: '10px',
                  width: '10px',
                  margin: '0 5px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  backgroundColor: currentIndex === index ? 'red' : 'white', // Red for active, white for default
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        )}
      </div>
    )
}
export default CarouselDetails;