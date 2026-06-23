/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import Layout from '@/components/ltr/layout/layout';
import { UseBackgroundImageLoader } from '@/components/ltr/use-background-image/use-background-image';
import UseRemoveBodyClass from '@/components/ltr/useEffect-hook/useEffect-hook';
import Lottie from 'lottie-react';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import animationData from '../../../../public/assets/images/data 11.json';
import axios from 'axios';
import { useRouter } from "next/navigation";
import {  Box,Skeleton } from '@mui/material';
import Image from 'next/image';
import { useLanguage } from "@/context/languageContext";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useNewsContext } from '@/context/mostViewedContext';
import TimeDisplay from '@/components/timeDisplay';

const Page = ({params,loadingSkeleton,handleTags}:any) => {
  const { langCode } = useLanguage();
    UseRemoveBodyClass(['None'], ['home-seven', 'home-nine','boxed-layout','home-six','home-two']);
    UseBackgroundImageLoader()
    const [loading, setLoading] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const lottieRef: any = useRef(null);
    useEffect(() => {
        // Access Lottie instance and slow down the animation speed
        if (lottieRef.current) {
            lottieRef.current.setSpeed(2); // Set the speed to half (adjust as needed)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [newsItems, setNewsItems] = useState<any>([])


    const fetchDataFromApi = async () => {
        let languageCode = 0; // Default language code
    
        const pathname = window.location.pathname;
        if (pathname.startsWith('/ta')) {
          languageCode = 1; // Tamil
        } else if (pathname.startsWith('/hi')) {
          languageCode = 2; // Hindi
        } else {
          languageCode = 0; // English
        }
    
        // Fetch data from API based on language code
        try {
          const response = await axios.get(`/List_api_tables?table_name=News&language_contains=${languageCode}&limit=8`);
          const data = response.data.Data.map((row: any, index: number) => {
            const imagesArray = row.mainimages
              ? row.mainimages.split(",").map((img: any) => img.trim())
              : [];
            const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
            return {
              ...row,
              SNo: index + 1,
              mainimages,
            };
          });
          setNewsItems(data);
        } catch (error) {
          console.error('There was an error fetching the news data!', error);
        } finally {
          setLoading(false);
        }
      }
    
      useEffect(() => {
        fetchDataFromApi()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      const router = useRouter();

      const [locationData, setLocationData] = useState<any[]>([]); //To store state and district
      const { allGroups, allsubGroups, allInnerSubGroups, setCurrentNews } = useContext(GroupSubGroupContext);
      const { fetchNewsView } = useNewsContext(); //Most view

      //Route to details page
  const handleDetails = (item: any) => {
    fetchNewsView(item.id);
    setCurrentNews({ ...item });
    let grname = allGroups.find((group: any) => group.uid == item.groupid)?.groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid)?.subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
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
      const latest = newsItems.slice(39);

      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 5;
    
      // Logic to calculate current items to display based on pagination
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = latest.slice(indexOfFirstItem, indexOfLastItem);
      const [loadingImg, setLoadingImg] = useState(true);

      const wrapperStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%', // Make the wrapper responsive
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
        borderRadius: '6px', // Rounded corners
    };

   // const trending = newsItems.slice(0, 4);

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
            {/* *** START PAGE MAIN CONTENT *** */}
            <main className="page_main_wrapper">
                {/* START PAGE HEADER */}
                <section
                    className="inner-head bg-img"
                    data-image-src="/assets/images/p_+1.png"
                >
                    <div className="container position-relative">
                        <div className="row">
                            <div className="col-sm-12">
                                <h2 className="entry-title" style={{fontFamily:"sans-serif"}}>About Us</h2>
                                <p className="description" style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif" }}>
                                "Stay ahead of the curve with People Plus Press, your trusted source for global news, in-depth analysis, and timely updates. We're committed to providing accurate and thorough coverage to keep you well-informed and up-to-date on current events."
                                </p>
                                <div className="breadcrumb"
                                  style={{
                                    padding: '10px 15px', // Padding around the breadcrumb
                                    borderRadius: '5px', // Rounded corners
                                  }}>
                                    <ul style={{
      listStyle: 'none', // Remove default list styles
      padding: 0, // Remove default padding
      margin: 0, // Remove default margin
      display: 'flex', // Use flexbox for horizontal alignment
      alignItems: 'center', // Center items vertically
    }} >
                                        <li>
                                            <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>Home</Link>
                                        </li>
                                        <li style={{  color: 'white',marginLeft:"-10px" }}>&#x27A4;</li>
                                        <li className="ib current-page"  style={{
        color: 'black', // Color for the current page
        marginLeft:"-10px"     
      }}>About</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* END OF /. PAGE HEADER */}
                <div className="team about-content">
                    <div className="container">
                        <div className="about-title">
                            <h1 style={{fontWeight: "bold", fontSize: "20px",color:"black",marginTop:"-20px",marginBottom:"15px"}}>Our Mission</h1>
                          
                            <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                            People Plus Press, established in 2024, has swiftly become a trusted source for daily news updates, consistently growing its audience and influence. 

Over the years, people Plus Press&apos;s independent editorial stance and reliable, balanced presentation of news have garnered serious attention and respect from readers in India and beyond. 
                            </p>
                            <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                            People Plus Press boasts a wide network of full-time and part-time correspondents and photographers across India. The platform is renowned for its robust reportage from major cities and states nationwide. 
                            </p>
                            <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                            Apart from this, People Plus Group has also established a media institute, imbued with the same foundational values. It is designed to create new generations of industry-ready broadcast journalism professionals, who are invested with both practical skills and a grounding in ethical best practices.
                            </p>
                        </div>
                       
                        {/* end row */}
                        <div className="about-title">
                            <h2 style={{fontWeight: "bold", fontSize: "20px",color:"black"}}>Bold History that Fuels the Future</h2>
                            <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                            People Plus Press has a significant online presence: it was among the pioneering Indian news platforms to embrace the digital age, launching its website in 2024. The digital offerings, including the website, app, and e-paper, cater to an ever-growing audience. 
                            </p>
                            <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                            In addition to daily news updates, People Plus Press offers a variety of special segments and features. Our commitment to providing in-depth analysis and timely news coverage ensures our readers are well-informed on critical issues. 
                            </p>
                            {/* <p>
                            At a time of global ferment, media across the world is embattled and in a state of flux. But through inevitable cycles of high and low, travail and triumph, the People Plus Group remains steadfast, winning admiration for holding the line and remaining a torchbearer for independent and credible journalism.  
                            </p> */}
                            <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                            People Plus Press is committed to delivering news that matters. Our editions are tailored to suit different regions, offering unique news and advertisement content. With a focus on quality journalism and an unwavering commitment to truth, People Plus Press continues to set the standard for news reporting in India. 
                            </p>
                            <p style={{ fontSize: "16px",fontFamily: "Montserrat, sans-serif",color:"#2b2121", textAlign: "justify" }}>
                            At a time of global ferment, media across the world is embattled and in a state of flux. But through inevitable cycles of high and low, travail and triumph, the People Plus Group remains steadfast, winning admiration for holding the line and remaining a torchbearer for independent and credible journalism.     
                            </p>
                        </div>
                        <h2>Related News</h2>
                        <div className="news-grid-2">
                      <div className="row ">
                        {newsItems.map((item: any) => (
                          <div key={item.id} className="col-6 col-md-3" onClick={() => handleDetails(item)}>
                            <div className="grid-item">
                              <div className="grid-item-img">
                                <Link href={`${item.url}`}>
                                  <div className="image-container"  style={wrapperStyle}>
                                  {loadingImg &&(
                                        <Skeleton
                                          variant="rectangular"
                                          width={210}
                                          height={118}
                                        />
                                      )}
                                    <Image
                                      src={item.mainimages}
                                      alt="News Image"
                                      layout="fill" // Fill the parent div with the image
                                      onLoadingComplete={() => setLoadingImg(false)}
                                      style={imageStyle} // Apply inline styles
                                    />
                                  </div>
                             
                                </Link>
                              </div>
                              {loadingSkeleton ? (
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton />
                      <Skeleton width="60%" />
                    </Box>
                  ) : (
                    <h5
                      className="title"
                      style={{
                        fontSize: "12px",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      <Link href={`${item.url}`}>
                        {" "}
                        {item.title}
                      </Link>
                    </h5>
                  )}

{loadingSkeleton ? (
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton />
                      <Skeleton width="60%" />
                    </Box>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "7px" }}>
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "9px",
                          pointerEvents: "auto", // Ensure button remains clickable
                        }}
                        onClick={() => handleTags(newsItems)}
                        className="post-category"
                      >
                        {item?.tags}
                      </span>
                      <div
                        className="date"
                        style={{
                          fontSize: "13px",
                          color: "black",
                          top: "-3px",
                          position: "relative",
                        }}
                      >
                        <TimeDisplay dateTime={item?.newsdatetime} />
                      </div>
                    </div>

                  )}

                            </div>
                          </div>
                        ))}   
                      </div>
                    </div>
                    </div>
                </div>
            </main>
            {/* *** END OF /. PAGE MAIN CONTENT *** */}


        </Layout>
          )}
        </>
    );
};

export default Page;