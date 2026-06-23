/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Lottie, { LottieRef } from 'lottie-react';
import ShareButtons from "./socialMediaSharing";
import animationData from '../../public/assets/images/data 11.json';
import { useLanguage } from "@/context/languageContext";
import { useRouter } from "next/navigation";

const YouTubeShorts = ({ webStoryUrl, shareTitle, shareUrl }: any) => {
  const { langCode } = useLanguage();
  const [imageIndex, setImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [webStory, setWebStory] = useState<any>();
  const [images, setImages] = useState<string[]>([]);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const isLastImage = imageIndex === images.length - 1;
  const [shortsImage, setShortsImage] = useState<any[]>([]);
  const router = useRouter();

  const fetchDataFromApi = async () => {
    const path = window.location.pathname;
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
        `/List_api_tables?table_name=News&status_eq=true&language_contains=${languageId}&url_contains=${webStoryUrl}&youtubeshorts_contains=https://www.youtube.com`
      );

      const data = response.data.Data.map((row: any, index: number) => ({
        ...row,
        SNo: index + 1,
      }));

      setWebStory(data[0]);

      const responseshorts = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&language_contains=${languageId}&youtubeshorts_contains=https://www.youtube.com`
      );
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

  const handleNextStory = () => {
    const currentPathname = window.location.pathname;
    const pathParts = currentPathname.split('/');
    const basePath = pathParts.slice(0, -1).join('/');
    const lastSegment = pathParts[pathParts.length - 1];
    const currentIndex = shortsImage.findIndex(
      (story) => story.url && story.url.endsWith(lastSegment)
    );
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % shortsImage.length; // Loop back to the first if at the end
      const nextStoryUrl = shortsImage[nextIndex].url;
      const newPath = `${basePath}/${nextStoryUrl.split('/').pop()}`;
      window.location.pathname = newPath;
    } else {
      console.error('Current pathname does not match any story URL');
    }
  };

  const handlePreviousStory = () => {
    const currentPathname = window.location.pathname;
    const pathParts = currentPathname.split('/');
    const basePath = pathParts.slice(0, -1).join('/');
    const lastSegment = pathParts[pathParts.length - 1];
    const currentIndex = shortsImage.findIndex(
      (story) => story.url && story.url.endsWith(lastSegment)
    );
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex - 1) % shortsImage.length; // Loop back to the first if at the end
      const nextStoryUrl = shortsImage[nextIndex].url;
      const newPath = `${basePath}/${nextStoryUrl.split('/').pop()}`;
      window.location.pathname = newPath;
    } else {
      console.error('Current pathname does not match any story URL');
    }
  };

  const handleClose = () => {
 router.replace(`/${langCode}/videos`)
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
            backgroundColor: 'black',
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
              backgroundImage: "black",
              backgroundSize: "cover",
              filter: "blur(50px)",
              zIndex: -1, // Make sure it's behind the other elements
            }}
          ></div>

          <div  style={{
                          backgroundColor: "#eb0254",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          padding: "10px 15px",
                          cursor: "pointer",
                          marginRight: "10px",
                          transition: "background-color 0.3s ease",
                        }} onClick={handlePreviousStory}>
            <ArrowBackIcon />
          </div>

          <Box>
            <div
              onClick={handleClose}
              style={{
                 position: "absolute",
                color: "#fff",
                margin:'10px -30px',
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
               margin:"40px -44px",
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

            {/* Image Display */}
            <div>
              <iframe style={{ height: '100vh', width: '500px' }}
                src={
                  webStory?.youtubeshorts
                    ? webStory.youtubeshorts.includes('?')
                      ? `${webStory.youtubeshorts.replace("youtube.com", "youtube-nocookie.com")}&rel=0&autohide=1`
                      : `${webStory.youtubeshorts.replace("youtube.com", "youtube-nocookie.com")}?rel=0&autohide=1`
                    : ''
                }
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </Box>

          <div  style={{
                          backgroundColor: "#eb0254",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          padding: "10px 15px",
                          cursor: "pointer",
                          marginLeft: "10px",
                          transition: "background-color 0.3s ease",
                        }}>
              <ArrowForwardIcon
                onClick={handleNextStory} />
          </div>

        </div>
      )}

    </>
  );
};

export default YouTubeShorts;
