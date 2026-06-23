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
import animationData from '../../public/assets/images/data 11.json';
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useLanguage } from "@/context/languageContext";


const Page = ({newsItems }: any) => {
   
    const { langCode } = useLanguage();
    const { allGroups, allsubGroups, allInnerSubGroups, setCurrentNews } = useContext(GroupSubGroupContext);
    //const [newsItems, setNewsItems] = useState<any>([])
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
        //     // Route for groupid = 25
        //     router.push(`/${langCode}/india/${grname}/${subgrname}/${item.url}`);

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

    return (
        <>
            {
                newsItems.length > 0 ? (
                    <>
                        <div className="main-container">
                            <div className="col-sm-7 col-md-8 col-xl-6 border-start border-end main-content">
                                <StickyBox>
                                    {/* START POST CATEGORY STYLE FOUR (Latest articles ) */}
                                    <div className="post-inner">
                                        {/* post header */}
                                        <div className="post-head">
                                            <h2 className="title">
                                                <strong>News</strong>
                                            </h2>
                                        </div>
                                        {/* post body */}
                                        <div className="post-body" style={{overflowY:'scroll', height:'500px'}}>
                                            {currentItems.map((item: any) => (
                                                <div
                                                    className="news-list-item articles-list"
                                                    key={item.id}
                                                // onClick={() => handleClickRoute(item)}
                                                >
                                                    <div key={item.id}
                                                        className="img-wrapper"
                                                        onClick={() => handleClickRoute(item)}
                                                    >
                                                        <div className="align-items-center bg-primary d-flex justify-content-center position-absolute rounded-circle text-white trending-post z-1">
                                                            <i className="fa-solid fa-bolt-lightning" />
                                                        </div>
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
                                                                <span className="post-category mb-0">{item.tags}</span>
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
                ) : (
                    <div></div>
                )
            }
        </>
    )
}
export default Page
