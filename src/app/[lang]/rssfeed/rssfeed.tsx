"use client"
import Layout from '@/components/ltr/layout/layout';
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useContext, useEffect, useRef, useState } from 'react';
import StickyBox from 'react-sticky-box';
import { useRouter } from "next/navigation";
import RssFeedIcon from '@mui/icons-material/RssFeed';
import { List, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material';
import animationData from '../../../../public/assets/images/data 11.json';
import Lottie from 'lottie-react';

const Page = () => {
    const { allGroups, allsubGroups, allInnerSubGroups, metroCities } =
        useContext(GroupSubGroupContext);
        const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Simulate a delay or fetch operation
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleGroupClick = (groupName: any) => {
        const langSegment = window.location.pathname.split('/')[1];
        router.push(`/feed.xml?lang=${langSegment}&rss=${groupName.toLowerCase().replace(/\s+/g, '-')}`);
    };

    const formatSubgroupName = (name: any) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    const titleStyle = {
        cursor: 'pointer',
        transition: 'color 0.3s ease', // Optional: smooth transition
    };

    const hoverStyle = {
        color: '#eb0254', // Change color on hover
    };

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
        {isLoading ? (
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
            {/* <div className='container'> */}
                {/* <div className="page-title">
                    <div className="container">
                        <div className="align-items-center row">
                            <div className="col">
                                <h1 className="mb-sm-0">
                                    <strong>RSS Feed</strong>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div> */}

                <main className="container">
                <div className="page-title">
                    <div className="container">
                        <div className="align-items-center row">
                            <div className="col">
                                <h1 className="mb-sm-0">
                                    <strong>RSS Feed</strong>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                    <StickyBox>
                        <div className="row no-gutters"> {/* Use no-gutters to remove spacing */}
                            {isLoading ? (
                                allGroups.map((_: any, index: any) => (
                                    <div key={index} className="post-head p-3 border rounded shadow-sm">
                                        <Skeleton variant='rectangular' width={300} height={100} />
                                    </div>
                                ))
                            ) : (
                                allGroups.map((group: any, index: any) => (
                                    <div key={index}>
                                        <div className="post-head p-3 border rounded shadow-sm"> {/* Adjusted padding for internal spacing */}
                                            <h2
                                                style={titleStyle}
                                                className="title"
                                                onClick={() => handleGroupClick(group.groupname)}
                                                onMouseEnter={(e) => (e.currentTarget.style.color = hoverStyle.color)}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                            >
                                                <strong>{group.groupname}</strong>
                                            </h2>
                                        </div>
                                        <div className="add-inner"> {/* Removed margin-top to eliminate gap */}
                                            <List>
                                                {allsubGroups
                                                    .filter((subGroup: any) => subGroup.groupid === group.uid) // Assuming subGroup has a groupId field
                                                    .map((subGroup: any, subIndex: any) => (
                                                        <ListItem
                                                            key={subIndex}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleGroupClick(subGroup.subgroupname)}

                                                        >
                                                            <ListItemIcon>
                                                                <RssFeedIcon />
                                                            </ListItemIcon>
                                                            <ListItemText  style={titleStyle} primary={formatSubgroupName(subGroup.subgroupname)}  onMouseEnter={(e) => (e.currentTarget.style.color = hoverStyle.color)}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = '')} />
                                                        </ListItem>
                                                    ))}
                                            </List>
                                        </div>
                                    </div>
                                ))
                            )}
                           
                        </div>
                    </StickyBox>
                </main>

            {/* </div> */}
        </Layout >
        )}
           
        </>
    )
}
export default Page;
