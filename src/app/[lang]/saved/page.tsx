"use client"
import Layout from '@/components/ltr/layout/layout';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react'
import StickyBox from 'react-sticky-box';
import animationData from '../../../../public/assets/images/data 11.json';
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useLanguage } from "@/context/languageContext";

const Page = () => {
  const { langCode } = useLanguage();
  const { allGroups, allsubGroups, allInnerSubGroups, setCurrentNews, location } = useContext(GroupSubGroupContext);
  const [newsItems, setNewsItems] = useState<any>([])
  const latest = newsItems.slice(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = latest.slice(indexOfFirstItem, indexOfLastItem);
  const [group, setGroup] = useState<any>(); //To store group data
  const [subGroup, setSubGroup] = useState<any[]>([]); //To store sub group data
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingImg, setLoadingImg] = useState(true);
  const [locationData, setLocationData] = useState<any[]>([]); //To store state and district
  const [userId, setUserId] = useState()

  function timeout(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms) )
  }

  //To fetch location view
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch location data
        const response = await axios.get('/List_api_tables?table_name=location_view');
        const newsDatas = response.data.Data;
        const data = newsDatas.map((row: any, index: any) => ({
          ...row,
          SNo: index + 1
        }));
        setLocationData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [newsItems]);

  const fetchDataFromApi = async () => {
    const userId: any = localStorage.getItem('cusId');
    setUserId(userId);
  
    try {
      const path = window.location.pathname;
      const segments = path.split("/").filter((segment) => segment.trim() !== ""); // Split path and remove empty segments
      let languageCode = "en";
  
      if (segments.length >= 2) {
        languageCode = segments[0];
      }
  
      let languageId = 0;
      switch (languageCode) {
        case "ta":
          languageId = 1; // Tamil
          break;
        case "hi":
          languageId = 2; // Hindi
          break;
        default:
          languageId = 0; // Default to English
          break;
      }
  
      // Fetch saved list
      const savedListResponse = await axios.get(`/Saved_list/?userid_eq=${userId}`);
      const savedListData = savedListResponse.data.Data;
  
      // Choose the appropriate news array based on language
      let newsIdsArray = [];
      if (languageId === 1) {
        newsIdsArray = savedListData[0]?.tamil_news || [];
      } else if (languageId === 2) {
        newsIdsArray = savedListData[0]?.hindi_news || [];
      } else {
        newsIdsArray = savedListData[0]?.english_news || [];
      }
      const newsIds = newsIdsArray.join(', ');
      const newsDataResponse = await axios.get(`/List_api_tables?table_name=News&language_contains=${languageId}&id_eq=${newsIds}`);
      const newsDataArray = newsDataResponse.data.Data;
      const processedData = newsDataArray.map((row: any, index: any) => {
        const imagesArray = row.mainimages ? row.mainimages.split(',').map((img: any) => img.trim()) : [];
        const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
        return {
          ...row,
          SNo: index + 1, // Add serial number
          mainimages, // Add main image
        };
      });
      setNewsItems(processedData);
  
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
     await timeout(1000)
 
     if(!isCancelled){
      fetchDataFromApi()
     }
    }
    handleChange()
    return () => {
     isCancelled = true
    }
   }, []);
  

  // useEffect(() => {
  //   fetchDataFromApi()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const handleClickRoute = (item: any) => {
    // fetchNewsView(item.id);
    setCurrentNews({ ...item });
    let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let innersubgrpname = allInnerSubGroups.find((group: any) => group.uid == item.innersubgroupid)?.innersubgroupname.trim().toLowerCase().replace(/\s+/g, '-') || ''

    // Check for groupid = 23
    if (item.groupid === 23) {
      // Find state and city names from locationData
      const matchedState = locationData.find((loc: any) => loc.state_id === item.stateid);
      const matchedCity = locationData.find((loc: any) => loc.city_id === item.cityid);

      const stateName = matchedState
        ? matchedState.state_name.toLowerCase().replace(/\s+/g, '-')
        : '';
      const cityName = matchedCity
        ? matchedCity.city_name.toLowerCase().replace(/\s+/g, '-')
        : '';

      router.push(`/${langCode}/india/${stateName}/${cityName}/${item.url}`);

    }
    // else if (item.groupid === 25) {
    //   // Route for groupid = 25
    //   router.push(`/${langCode}/india/${grname}/${subgrname}/${item.url}`);

    // }
    else {
      // Route to subgroup or default route
      //if (matchedSubGroup) {
      router.push(`/${langCode}/${grname}/${subgrname}/details/${item.url}`);
      // } else {
      //   router.push(`/${params.lang}/`);
      // }
    }
  }


  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%', // Make the wrapper responsive
    maxWidth: '228px', // Maximum width of the wrapper
    height: '0',
    paddingBottom: '68.8%', // Aspect ratio of 218x150 (150/218*100)
    overflow: 'hidden',
  };

  // Inline styles for the image
  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Cover the wrapper area
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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

  const handleTags = (item: any) => {  //Route to category page
    let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let innersubgrpname = allInnerSubGroups.find((group: any) => group.uid == item.innersubgroupid)?.innersubgroupname.trim().toLowerCase().replace(/\s+/g, '-') || ''
    // Check for groupid = 23
    if (item.groupid === 23) {
      // Find state and city names from locationData
      const matchedState = location.find((loc: any) => loc.state_id === item.stateid);
      const matchedCity = location.find((loc: any) => loc.city_id === item.cityid);
      const stateName = matchedState
        ? matchedState.state_name.toLowerCase().replace(/\s+/g, '-')
        : '';
      const cityName = matchedCity
        ? matchedCity.city_name.toLowerCase().replace(/\s+/g, '-')
        : '';
      if (stateName) {
        router.push(`/${langCode}/india/${stateName}`);
      } else {
        router.push(`/${langCode}/india`);
      }
    } 
    else {
      router.push(`/${langCode}/${grname}/${subgrname}`);
    }
  }

  return (
    <>
      {loading ? (
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
        <Layout>

          {userId == null ? (
            <h5
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Log in to see the saved news.
            </h5>
          ) : (
            newsItems && newsItems.length === 0 ? (
              <h5
                style={{
                  width: "100vw",
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                It looks like you haven&apos;t saved any news. Save some news to view it.
              </h5>
            ) : (
              <>
                <div className="main-container">
                  <div className="col-sm-7 col-md-8 col-xl-6 border-start border-end main-content">
                    <StickyBox>
                      {/* START POST CATEGORY STYLE FOUR (Latest articles ) */}
                      <div className="post-inner">
                        {/* post header */}
                        <div className="post-head">
                          <h2 className="title">
                            <strong>Saved News</strong>
                          </h2>
                        </div>
                        {/* post body */}
                        <div className="post-body">
                          {currentItems.map((item: any, index: any) => (
                            <div
                              className="news-list-item articles-list"
                              key={`${item.id}-${index}`}
                            // onClick={() => handleClickRoute(item)}
                            >
                              <div key={item.id}
                                className="img-wrapper"
                                onClick={() => handleClickRoute(item)}
                              >

                                <Link href={`${item.url}`} className="thumb">
                                  {" "}
                                  {/* Using 'a' tag instead of Link for simplicity */}
                                  <div style={wrapperStyle}>
                                    {loadingImg && <CircularProgress />}
                                    <Image
                                      src={item.mainimages}
                                      alt=""
                                      layout="fill" // Fill the parent container
                                      onLoadingComplete={() => setLoadingImg(false)}
                                      style={imageStyle}
                                    />
                                  </div>
                                </Link>
                              </div>
                              <div key={item.id}
                                className="post-info-2"
                                onClick={() => handleClickRoute(item)}
                              >
                                <h4 style={{ cursor: 'pointer' }}>
                                  <a className="title">
                                    {item.title}
                                  </a>
                                </h4>
                                <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                                  <li>
                                    <span style={{cursor:'pointer'}} onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleTags(item);
                                    }} className="post-category mb-0">{item.tags}</span>
                                  </li>
                                  <li>{item.date}</li>
                                </ul>
                                <p className="d-lg-block d-none">{item.shortcontent}</p>
                              </div>
                            </div>
                          ))}
                        </div>{" "}
                        {/* /. post body */}
                        {/* Post footer */}
                        <div className="post-footer">
                          <div className="row thm-margin">
                            <div className="col-xs-12 col-sm-12 col-md-12 thm-padding">
                              {/* pagination */}
                              <ul
                                className="pagination"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  listStyle: "none",
                                  padding: 0,
                                  marginBottom: "10px",
                                }}
                              >
                                {latest.length > itemsPerPage && (
                                  <>
                                    {/* Previous symbol */}
                                    <li
                                      style={{
                                        margin: "10px 2px 0",
                                      }}
                                      className="page-item"
                                      onClick={() =>
                                        paginate(currentPage > 1 ? currentPage - 1 : 1)
                                      }
                                    >
                                      <a
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          width: "30px",
                                          height: "30px",
                                          borderRadius: "50%",
                                          backgroundColor: "#fff",
                                          color: "black",
                                          textDecoration: "none",
                                          transition: "all 0.3s ease",
                                          cursor: "pointer",
                                        }}
                                        className="page-link"
                                      >
                                        &#171;
                                      </a>
                                    </li>

                                    {/* Render page numbers */}
                                    {Array.from(
                                      {
                                        length: Math.ceil(latest.length / itemsPerPage),
                                      },
                                      (_, index) => {
                                        // Display up to 5 pages around the current page
                                        const startPage = Math.max(1, currentPage - 2);
                                        const endPage = Math.min(
                                          startPage + 4,
                                          Math.ceil(latest.length / itemsPerPage)
                                        );

                                        if (index + 1 >= startPage && index + 1 <= endPage) {
                                          return (
                                            <li
                                              key={index}
                                              className="page-item"
                                              style={{
                                                margin: "10px 2px 0",
                                              }}
                                            >
                                              <a
                                                onClick={() => paginate(index + 1)}
                                                className="page-link"
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  width: "30px",
                                                  height: "30px",
                                                  borderRadius: "50%",
                                                  backgroundColor:
                                                    currentPage === index + 1 ? "#eb0254" : "#fff",
                                                  color:
                                                    currentPage === index + 1 ? "#fff" : "black",
                                                  textDecoration: "none",
                                                  transition: "all 0.3s ease",
                                                  cursor: "pointer",
                                                }}
                                              >
                                                {index + 1}
                                              </a>
                                            </li>
                                          );
                                        }
                                        return null;
                                      }
                                    )}

                                    {/* Next symbol */}
                                    <li
                                      style={{
                                        margin: "10px 2px 0",
                                      }}
                                      className="page-item"
                                      onClick={() =>
                                        paginate(
                                          currentPage < Math.ceil(latest.length / itemsPerPage)
                                            ? currentPage + 1
                                            : currentPage
                                        )
                                      }
                                    >
                                      <a
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          width: "30px",
                                          height: "30px",
                                          borderRadius: "50%",
                                          backgroundColor: "#fff",
                                          color: "black",
                                          textDecoration: "none",
                                          transition: "all 0.3s ease",
                                          cursor: "pointer",
                                        }}
                                        className="page-link"
                                      >
                                        &#187;
                                      </a>
                                    </li>
                                  </>
                                )}
                              </ul>
                              {/* /.pagination */}
                            </div>
                          </div>
                        </div>
                        {/* /.Post footer */}
                      </div>
                      {/* END OF /. POST CATEGORY STYLE FOUR (Latest articles ) */}
                      {/* START ADVERTISEMENT */}

                      {/* END OF /. ADVERTISEMENT */}
                    </StickyBox>
                  </div>
                </div>;

                <style jsx>{`
.main-container {
display: flex;
justify-content: center;
align-items: center;
padding: 20px;
}

.main-content {
width: 100%;
}

@media (min-width: 576px) {
.main-content {
max-width: 540px;
}
}

@media (min-width: 768px) {
.main-content {
max-width: 720px;
}
}

@media (min-width: 992px) {
.main-content {
max-width: 960px;
}
}

@media (min-width: 1200px) {
.main-content {
max-width: 1140px;
}
}
`}</style>
              </>
            )
          )}
        </Layout>
      )}
    </>
  )
}
export default Page
