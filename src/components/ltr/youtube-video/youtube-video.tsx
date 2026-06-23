/* eslint-disable @next/next/no-img-element */

"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import TimeDisplay from "@/components/timeDisplay";
import Link from "next/link";
import { useLanguage } from "@/context/languageContext";

const YoutubeVideo = () => {

  const [initialVideos, setInitialVideos] = useState<any>([]);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [loading, setLoading] = useState(true);
  const { langCode } = useLanguage();

  const handleThumbnailClick = (index: any) => {
    setSelectedVideo(index);
  };

  const handleVideoChange = (index: number) => {
    setSelectedVideo(index);
  };

  //Fetch data from api
  const fetchDataFromApi = async () => {
    let languageCode = 0; // Default language code

    const pathname = window.location.pathname;
    const language = pathname.split('/')[1] || '';
    if (pathname.startsWith('/ta')) {
      languageCode = 1; // Tamil
    } else if (pathname.startsWith('/hi')) {
      languageCode = 2; // Hindi
    } else {
      languageCode = 0; // English
    }
  
    try {
      const response = await axios.get(
        `/List_api_tables?table_name=News&status_eq=true&language_contains=${languageCode}&youtubeurl_contains=www.youtube.com&order=desc&limit=9`
      );
      const data = response.data.Data.map((row: any, index: number) => {
        return {
          ...row,
          SNo: index + 1,
        };
      });

      setInitialVideos(data);


    } catch (error) {
      console.error("There was an error fetching the news data!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const cleanedUrl = () => {
    if (!initialVideos || !initialVideos[selectedVideo]) {
      return ''; // Return empty string if no video is selected or data is missing
    }

    const video = initialVideos[selectedVideo];
    const url = video?.youtubeurl;
    if (!url) {
      console.error("YouTube URL is not available.");
      return ''; // Return empty string if no URL is present
    }

    // Ensure the URL is valid and prepend 'https://' if missing
    const validUrl = url.startsWith('http') ? url : `https://${url}`;

    try {
      // Create a URL object from the valid YouTube URL
      const parsedUrl = new URL(validUrl);

      // Remove the 'authuser' parameter if it exists
      parsedUrl.searchParams.delete('authuser');  // Ensure authuser is removed

      // Also, remove any other parameters if necessary (like 'v', 'id', etc.)
      // parsedUrl.searchParams.delete('v'); // You can remove other unwanted params as needed

      // Add 'rel=0' (if not already present)
      parsedUrl.searchParams.set('rel', '0');

      // Return the cleaned URL as a string
      return parsedUrl.toString();
    } catch (error) {
      console.error("Error constructing URL:", error);
      return ''; // Return an empty string or a fallback URL in case of error
    }
  };



  return (
    <>
      <div className="youtube-wrapper" style={{ marginTop: "-10px" }}>
        <div className="playlist-title">
          <h4>Latest Video News</h4>
        </div>
        <div id="rypp-demo-1" className="RYPP r16-9" >
          <div>
            <div className="RYPP-playlist">
              <header>
                <h2 className="title" style={{ color: "white", alignItems: "center", display: "flex", justifyContent: "center", fontSize: "20px" }}>
                  <strong style={{ marginRight: "7px" }}>Related </strong >Videos</h2>

              </header>
              <div className="RYPP-items">
                <ol>
                  {initialVideos.map((video: any, index: any) => {
                    // Extract the video ID from the embed URL
                    const videoId = video.youtubeurl.split('/').pop();
                    // Generate the thumbnail URL (using max resolution)
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                    return (
                      <li style={{ display: 'flex' }}
                        key={`thumbnail-${index}`}
                        data-video-id={video.id}
                        className={selectedVideo === index ? 'selected' : ''}
                        onClick={() => handleThumbnailClick(index)}
                      >

                        <img

                          style={{ height: "50px", width: "60px", borderRadius: "6px" }}
                          src={thumbnailUrl}
                          className="thumb"
                          alt={`Thumbnail ${index + 1}`}
                        />
                        <div className="title-container" style={{ maxWidth: '100%',marginLeft:'5px'}}>
                          <span
                            style={{ color:'white',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2, // Limit to 2 lines
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: '13px', // Adjust font size for title
                              lineHeight: '1.2', // Adjust line height for better spacing
                            }}
                          >
                            {video.title}
                          </span>

                          <span
                            style={{ fontSize: '10px', display: 'block', marginTop: '2px' }} // Smaller font size for time display
                          >
                            <TimeDisplay dateTime={video.newsdatetime} />
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
          <div>
            {/* Render video thumbnails or any other UI to select a video */}

            {/* Single iframe for all videos */}
            {initialVideos.length > 0 && initialVideos[selectedVideo] ? (
              <iframe
                key={`RYPP-vp-da4e5dd6-${selectedVideo}`}
                className="RYPP-video-player"
                style={{ display: 'block', width: '100%' }}
                id={`RYPP-vp-da4e5dd6-${selectedVideo}`}
                name={`RYPP-vp-da4e5dd6-${selectedVideo}`}
                frameBorder="0"
                allowFullScreen
                title="YouTube Video Player"
                width="640"
                height="460"
                src={
                  initialVideos[selectedVideo]?.youtubeurl.includes('?')
                    ? `${initialVideos[selectedVideo]?.youtubeurl.replace("youtube.com", "youtube-nocookie.com")}&rel=0&autohide=1`
                    : `${initialVideos[selectedVideo]?.youtubeurl.replace("youtube.com", "youtube-nocookie.com")}?rel=0&autohide=1`
                }
              />
            ) : (
              <p>Loading video...</p>
            )}
          </div>
          {/* <div className="RYPP-video">
            {initialVideos.map((video: any, index: any) => (
              <iframe
                key={`RYPP-vp-da4e5dd6-${index}`}
                className="RYPP-video-player"
                style={{ display: index === selectedVideo ? 'block' : 'none' }}
                id={`RYPP-vp-da4e5dd6-${index}`}
                name={`RYPP-vp-da4e5dd6-${index}`}
                frameBorder="0"
                allowFullScreen
                title="YouTube Video Player"
                width="640"
                height="360"
                src={video.youtubeurl}
              ></iframe>
            ))}
          </div> */}
        </div>

      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>

        <Link href={`/${langCode}/videos`} passHref>

          <button
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z' fill='%23ffffff'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "140px 5px",
              transition: "background-position 0.5s ease, padding-left 0.5s ease",
              width: "150px",
              height: "40px",
              border: "4px solid #eb0254",
              fontSize: "16px",
              padding: "1px 7px",
              backgroundColor: "#eb0254",
              color: "white",
              borderRadius: "5px",

            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundPosition = "113px 5px";
              target.style.paddingLeft = "0";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundPosition = "140px 5px";
              target.style.paddingLeft = "7px";
            }}
          >
            More Videos
          </button>
        </Link>
      </div>


    </>
  );
};

export default YoutubeVideo;