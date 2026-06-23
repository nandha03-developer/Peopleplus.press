/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../../public/assets/styles/webstories.module.scss";
import axios from "axios";
import Lottie, { LottieRef } from 'lottie-react';
import ShareButtons from "./socialMediaSharing";
import animationData from '../../public/assets/images/data 11.json';
import { useShortsImage } from "./shortsImageState";

const Stories = ({ webStoryUrl, shareTitle, shareUrl }: any) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [webStory, setWebStory] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const isLastImage = imageIndex === images.length - 1;
 const [shortsImage, setShortsImage] = useState<any[]>([]);
  
  const fetchDataFromApi = async () => {
    const path = window.location.pathname;
    const segmentsLen = path.split('/').filter(Boolean);
    const segments = path.split("/").filter((segment) => segment.trim() !== "");
    let languageCode = segments.length >= 2 ? segments[0] : "en";
    let languageId = 0;

    switch (languageCode) {
      case "ta":
        languageId = 1;
        break;
      case "hi":
        languageId = 2;
        break;
    }

    try {
      const response = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&language_contains=${languageId}&url_contains=${webStoryUrl}&shorts_contains=.`
      );

      const data = response.data.Data.map((row: any, index: number) => ({
        ...row,
        SNo: index + 1,
      }));

      setWebStory(data);

      let responseshorts
      if(segmentsLen.length == 3){
        responseshorts = await axios.get(
          `/List_api_tables?table_name=News&status_eq=true&subgroupid_eq=${data[0].subgroupid}&language_contains=${languageId}&shorts_contains=.`
        );
      } else {
        responseshorts = await axios.get(
          `/List_api_tables?table_name=News&status_eq=true&groupid_eq=${data[0].groupid}&language_contains=${languageId}&shorts_contains=.`
        );
      }
      
      const datashorts = responseshorts.data.Data
     setShortsImage(datashorts)
setLoadingSkeleton(false)
    } catch (error) {
      console.error("Error fetching data", error);
      setWebStory([]);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  useEffect(() => {
    if (webStory[currentStoryIndex]) {
      const shortsString = webStory[currentStoryIndex].shorts;
      const imageArray = shortsString.split(",").map((img: any) => img.trim());
      setImages(imageArray);
      setImageIndex(0);
      setProgress(0); // Reset progress for new story
    }
  }, [currentStoryIndex, webStory]);

  useEffect(() => {
    if (images.length === 0) return;

    const img = new Image();
    img.src = images[imageIndex];
    setProgress(0); // Reset progress when changing images
    const intervalTime = 100;
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100; // Maintain at 100
        }
        return prevProgress + 100 / (5000 / intervalTime);
      });
    }, intervalTime);

    const imageTimeout = setTimeout(() => {
      setImageIndex((prevIndex) => {
        // Check if there's a next image
        return prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex;
      });
      setProgress(100); // Set progress to 100 immediately after duration ends
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(imageTimeout);
    };
  }, [imageIndex, images]);


  const handleNextStory = () => {
    const currentPathname = window.location.pathname;
    const pathParts = currentPathname.split('/');
    const lastSegment = pathParts[pathParts.length - 1];

    // Finding the current index based on the last segment of the pathname
    const currentIndex = shortsImage.findIndex(
      (story: any) => story.url && story.url.endsWith(lastSegment)
    );

    if (currentIndex !== -1) {
      const currentStory = shortsImage[currentIndex];

      // Split the shorts URLs into an array
      const imageUrls = currentStory.shorts.split(',').map((url: any) => url.trim());

      if (imageIndex < imageUrls.length) {
        const currentImageUrl = imageUrls[imageIndex]; // Get the current image URL
        setImageIndex(imageIndex + 1);
      }

      // Check if we have displayed all images
      if (imageIndex === imageUrls.length - 1) {
        // Prepare to navigate to the next story
        if (currentIndex < shortsImage.length - 1) {
          const nextStoryUrl = shortsImage[currentIndex + 1].url; // Get the next story URL
          window.location.href = nextStoryUrl;
        } else {
          console.warn('No further story available.');
        }
      }
    }

    setProgress(0);
  };

  const handlePreviousStory = () => {
    const currentPathname = window.location.pathname;
    const pathParts = currentPathname.split('/');
    const lastSegment = pathParts[pathParts.length - 1];

    // Finding the current index based on the last segment of the pathname
    const currentIndex = shortsImage.findIndex(
      (story: any) => story.url && story.url.endsWith(lastSegment)
    );

    if (currentIndex !== -1) {
      const currentStory = shortsImage[currentIndex];

      // Split the shorts URLs into an array
      const imageUrls = currentStory.shorts.split(',').map((url: any) => url.trim());

      // If we are not at the first image
      if (imageIndex > 0) {
        // Go to the previous image
        const previousImageUrl = imageUrls[imageIndex - 1]; // Get the previous image URL 
        // Update the state to display the previous image
        setImageIndex(imageIndex - 1);
        // Example: setImageDisplayUrl(previousImageUrl); // Update the UI to show this image
      } else {
        // If at the first image, check if there is a previous story
        if (currentIndex > 0) {
          // Navigate to the previous story
          const previousStoryUrl = shortsImage[currentIndex - 1].url; // Get the previous story URL

          window.location.href = previousStoryUrl;
        } else {
          console.warn('No previous story available.');
        }
      }
    }

    setProgress(0);
  };

  //Call handleNextStory function every 5 sec
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNextStory();
    }, 5000); // Call every 5 seconds

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, [imageIndex, shortsImage]);

  const handleReplayStory = () => {
    setImageIndex(0);
    setProgress(0);
  };

  const handleImageClick = (event: any) => {
    const image = event.target;
    const { left, width } = image.getBoundingClientRect();
    const clickX = event.clientX - left; // Get click position relative to the image

    if (clickX < width / 2) {
      // Clicked on the left half
      handlePreviousStory();
    } else {
      // Clicked on the right half
      handleNextStory();
    }
  };


  const handleClose = () => {
    const storedPath: any = sessionStorage.getItem('currentPath');
    window.location.href = storedPath;
  };

  const imageStyle: any = {
    width: "100%",
    height: "100%",
    objectFit: "scale-down",
    backgroundColor: "black",
  };

  const titleStyle: any = {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "10px",
    borderRadius: "10px",
    width: "100%",
  };

  const progressBarContainerStyle: any = {
    display: "flex",
    position: "absolute",
    top: "10px",
    width: "90%",
    left: "50%",
    transform: "translateX(-50%)",
  };

  const progressBarStyle: any = {
    flex: 1,
    height: "4px",
    backgroundColor: "#555",
    margin: "0 2px",
    position: "relative",
  };

  const getActiveProgressBarStyle = (index: any) => {
    let backgroundColor;

    if (index < imageIndex) {
      // Previous images are complete
      backgroundColor = "#eb0254";
    } else if (index === imageIndex) {
      if (progress >= 100) {
        backgroundColor = "#eb0254"; // Current image complete
      } else {
        backgroundColor = "#eb0254"; // Current image in progress
      }
    }
    // else {
    //   backgroundColor = 'lightblue'; // Future images
    // }

    return {
      backgroundColor,
      height: "100%", // Adjust height as needed
      transition: "width 0.1s ease-in-out", // Smooth transition for width
    };
  };

   //lottie loading
   const lottieRef: any = useRef(null);
   useEffect(() => {
     // Access Lottie instance and slow down the animation speed
     if (lottieRef.current) {
       lottieRef.current.setSpeed(2); // Set the speed to half (adjust as needed)
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

  return (
    <>
   {loadingSkeleton ? (
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
     <Lottie
       animationData={animationData}
       lottieRef={lottieRef}
       loop
       autoplay
       style={{ width: '200px', height: '200px' }} // Adjust width and height as needed
     />
   </div>
   ) : (
<div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${images[imageIndex]})`,
          backgroundSize: "cover",
          filter: "blur(50px)",
          zIndex: -1, // Make sure it's behind the other elements
        }}
      ></div>

      <div onClick={handlePreviousStory} className={styles.backButton}>
        <ArrowBackIcon className={styles.preicon} />
      </div>

      <Box className={styles.storyContainer}>
        <div
          className={styles.closeButton}
          onClick={handleClose}
          style={{
            position: "absolute",
            zIndex: 2,
            color: "#fff",
            top: "25px",
            left: "10px",
            cursor: "pointer",
          }}
        >
          <CloseIcon
            style={{ backgroundColor: "black", borderRadius: "50%", fontSize: '22px' }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: "22px",
            right: "10px",
            zIndex: 2,
            color: "#fff",
          }}
        >
          <ShareButtons
            url={shareUrl}
            title={shareTitle}
            style={{
              color: "white",
              fontSize: "30px",
              padding: "5px",
              backgroundColor: "black",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Progress Bar */}

        <Box style={progressBarContainerStyle}>
          {images.map((_, index) => (
            <Box key={index} style={progressBarStyle}>
              <Box
                style={{
                  ...getActiveProgressBarStyle(index),
                  width: index === imageIndex ? `${progress}%` : "100%", // Only show progress on the current image
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Image Display */}
        {images.length > 0 && (
          <img
            onClick={handleImageClick}
            src={images[imageIndex]}
            alt={`${webStory[currentStoryIndex].title}`}
            style={imageStyle}
          />
        )}
        <div className={`${styles.title} title`} style={titleStyle}>
          {webStory[currentStoryIndex]?.title}
        </div>
      </Box>

      <div className={styles.nextButton}>
        {isLastImage && progress >= 100 ? (
          <ReplayIcon
            onClick={handleReplayStory}
            className={styles.preicon}
          />
        ) : (
          <ArrowForwardIcon
            onClick={handleNextStory}
            className={styles.preicon}
          />
        )}
      </div>

    </div>
   )}
    
    </>
  );
};

export default Stories;
