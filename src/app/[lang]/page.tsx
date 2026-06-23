/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client"
import StickyBox from "react-sticky-box";
import '../globals.css'
import NewsTicker from "@/components/ltr/news-ticker-carousal/page";
import { UseBackgroundImageLoader } from "@/components/ltr/use-background-image/use-background-image";
import Layout from "@/components/ltr/layout/layout";
import YoutubeVideo from "@/components/ltr/youtube-video/youtube-video";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import HomeFeatureCarousal from "@/components/ltr/home-feature-carousal/home-feature-carousal";
import HomeCenterSlider from "@/components/ltr/home-center-slider/home-center-slider";
import Tags from "@/components/ltr/tags/tags";
import { useContext, useEffect, useRef, useState } from "react";
import Image from 'next/image'
import sports from '../../../public/assets/images/masonry/people banner.jpg'
import axios from "axios";
import { WiDayLightning, WiDaySunny, WiDayCloudy, WiDayRain, WiDaySnow, WiThunderstorm, WiNightClear, WiNightAltCloudy, WiNightAltRain, WiNightAltSnow, WiNightAltThunderstorm, WiDayThunderstorm } from "weather-icons-react";
import animationData from '../../../public/assets/images/data 11.json';
import Lottie, { LottieRef } from 'lottie-react';
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Skeleton } from "@mui/material";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useNewsContext } from "@/context/mostViewedContext";
import { useSavedItems } from "@/context/savedNewsContext";
import { useLikedItems } from "@/context/likedNewsContext";
import { useLanguage } from "@/context/languageContext";
import LatestNewsHome from "@/components/homePageComponent/latestNewsHome";
import EditorPicks from "@/components/homePageComponent/editorPicks";
import TechAndInnovation from "@/components/homePageComponent/techAndInnovation";
import LatestReviews from "@/components/homePageComponent/latestReviews";
import TrendingTopics from "@/components/homePageComponent/trendingTopics";
import SocialMediaIcons from "@/components/socialMediaIcons";
import SixBox from "@/components/homePageComponent/sixBox";
import CenterImage from "@/components/homePageComponent/centerImage";
import MostViewPopularHome from "@/components/homePageComponent/mostViewPopularHome";
import TopStories from "@/components/homePageComponent/topStories";
import RightBox from "@/components/homePageComponent/rightBox";
import LeftBox from "@/components/homePageComponent/leftBox";
import Globeltrends from "@/components/HeaderComponent/globeltrends";
import GooglePopup from "@/components/homePageComponent/googlepopup";
import jwt from 'jsonwebtoken';
import { toast } from "react-toastify";
import GoogleSignInPrompt from "@/components/googleSignInPrompt";
import GoogleSignIn from "@/components/googleSignIn";
//import { generateToken } from '@/notifications/firebase';

export default function Home() {
  const { langCode } = useLanguage();
  const langu = langCode
  const [topNewsItem, setTopNewsItem] = useState<any>([]);
  const [popular, setPopular] = useState([]);
  const [newsItems, setNewsItems] = useState<any>([])
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { allGroups, allsubGroups, allInnerSubGroups, setCurrentNews, location } = useContext(GroupSubGroupContext);
  const { fetchNewsView } = useNewsContext(); //Most view
  const [loadingImg, setLoadingImg] = useState(true);
  const { activeItems, handleIconClick } = useSavedItems();
  const { activeLikeItems, likedItems, handleLikeClick } = useLikedItems(); //Liked News
  let hasFetchedData = false; //Limit multiple api calls 
  const [currentTotalCount, setCurrentTotalCount] = useState(0);

  function timeout(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms) )
  }

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

//   const handleSuccess = async (credentialResponse : any) => {
//     window.location.href=`/${langCode}`
//     const idToken = credentialResponse.credential;
//     const decodedData:any = decodeToken(idToken);
//     if(decodedData){
//      try{
//          const email: any = String(decodedData?.email);
//          const response = await fetch(
//              `/List_api_tables?table_name=Customer&emailid_contains=${email}`
//            );
//            const data = await response.json();
//            if(data && data.Data.length > 0){
//              localStorage.setItem("cusId", JSON.stringify(data.Data[0].id));
//              router.push(`/${langCode}`);
//            } else {
//              const body = {
//                  city: "",
//                  country: "",
//                  district: "",
//                  dob: 0,
//                  emailid: decodedData.email,
//                  firstname: decodedData.given_name,
//                  gender: "",
//                  interest: "",
//                  iseverified: decodedData.email_verified,
//                  ismverified: false,
//                  joindate: 0,
//                  lastname: decodedData.family_name,
//                  mobileno: 0,
//                  password: "",
//                  postcode: 0,
//                  profileimage: decodedData.picture,
//                  state: "",
//                  cognitoid: "google",
//              }
//              sendToApi(body);
//            }
//      } catch (error){
//          console.error("Error fetching or sending data:", error);
//      }
//     }
// };
// const decodeToken = (credentialResponse : any) => {
//  try {
//    const decoded = jwt.decode(credentialResponse);

//    return decoded; 
//  } catch (error) {
//    console.error("Failed to decode token:", error);
//    return null;
//  }
// };

// const sendToApi = async (body: any) => {
//  try {
//      const response = await axios.post('/api/customer', body, {
//          headers: {
//              'Content-Type': 'application/json',
//          },
//      });
     
//      if (response.status === 200) {
//          localStorage.setItem("cusId", JSON.stringify(response.data.id));
//          router.push(`/${langCode}`);
//      } else {
//          toast.error('Failed to add data.');
//      }

//  } catch (error: any) {
//      console.error('Error adding data:', error);
//      toast.error('Failed to add data.');
//  }
// };


// useEffect(() => {
//   // Ensure Google Identity Services is loaded
//   if (window.google && window.google.accounts) {
//     window.google.accounts.id.initialize({
//       client_id: '250303656162-b2hcppkfqq8j1ig79bla5b5s6t2oemh4.apps.googleusercontent.com',  // Replace with your actual Google Client ID
//       callback: handleSuccess, // Handle the sign-in response
//     });

//     // Show the One Tap prompt on every page reload
//     window.google.accounts.id.prompt();
//   }
// }, []);


  useEffect(() => {          //Push Notification
    const newsUpdate = async () => {
      try {
        const response = await axios.get('/List_api_tables?table_name=NewsLog&action_eq=INSERT');
        const newTotalCount = response.data.TotalCount;
        const newsData = response.data.Data; 
        if (newTotalCount > currentTotalCount) {
          setCurrentTotalCount(newTotalCount);
          const newObject = newsData[0]; 
          const imagesArray = newObject.mainimages ? newObject.mainimages.split(',').map((img: any) => img.trim()) : [];
          const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
          showNotification(newObject.title, newObject.shortcontent, mainimages, newObject.url);
        }
      } catch (error) {
        console.error('There was an error fetching the news data!', error);
      }
    };
    newsUpdate();
    const intervalId = setInterval(newsUpdate, 60000);
    return () => {
      clearInterval(intervalId);
    };
  }, [currentTotalCount]);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Notification.permission === 'default') {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error);
        }
      } 
    };
    requestNotificationPermission()
  }, []);

  const showNotification = async (title: string, body: string, icon: string, url: any) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: icon,
      });
      const path = 'https://peopleplus.press/en'
      notification.onclick = () => {
        window.open(path, '_blank');
      };
    } else {
    }
  };

useEffect(() => {
    document.documentElement.removeAttribute('dir');
  }, []);

  UseRemoveBodyClass(['home-nine'], ['home-six', 'home-seven', 'home-two', 'boxed-layout', 'layout-rtl']);
  UseBackgroundImageLoader()

  //weather
  const [error, setError] = useState<any>(null);
  const [dailyForecasts, setDailyForecasts] = useState<any>([]);
  const [todayForecast, setTodayForecast] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  const showPositionRef = useRef(false);

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
     await timeout(1000)
 
     if(!isCancelled){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        setError("Geolocation is not supported by this browser.");
      }
     }
    }
    handleChange()
    return () => {
     isCancelled = true
    }
   }, []);

  // useEffect(() => {
  //   // if (!showPositionRef.current) {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(showPosition, showError);
  //     } else {
  //       setError("Geolocation is not supported by this browser.");
  //     }
  //     showPositionRef.current = true; // Set the flag to true
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const showError = (error: any) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        setError("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        setError("An unknown error occurred.");
        break;
      default:
        setError("An unknown error occurred.");
        break;
    }
  };

  const showPosition = async (position: any) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // await getLocation(lat, lon);
    await getWeather(lat, lon);
  };

  const getIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };
  const kelvinToCelsius = (tempKelvin: any) => {
    return (tempKelvin - 273.15).toFixed(2); // Fixed to 2 decimal places
  };

  const getWeather = async (latitude: any, longitude: any) => {
    const apiKey = '64ee8b17eb8f34f8e9e8b408354edafa';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    try {
      const response = await axios.get(url);
      const weatherData = response.data;

      // Extracting data for 5-day forecast
      const dailyForecasts = weatherData.list.filter((item: any) => {
        // Filter by forecasts for 12:00:00 of each day
        return item.dt_txt.includes('12:00:00');
      }).map((item: any) => {
        const weather = item.weather[0];
        return {
          date: item.dt_txt, // Date and time of the forecast
          temperature: kelvinToCelsius(item.main.temp), // Temperature
          weather: item.weather[0].description,
          iconUrl: getIconUrl(weather.icon)
        };
      });
      setDailyForecasts(dailyForecasts)

      // Extracting 3-hour forecast for today
      const todayForecast = weatherData.list.filter((item: any) => {
        // Filter by forecasts for today
        const today = new Date();
        const forecastDate = new Date(item.dt_txt);
        return forecastDate.getDate() === today.getDate(); // Adjust timezone if necessary
      }).map((item: any) => {
        const weather = item.weather[0];
        return {
          time: item.dt_txt.split(' ')[1], // Extracting time (assuming format is consistent)
          temperature: kelvinToCelsius(item.main.temp), // Temperature
          weather: item.weather[0].description,
          iconUrl: getIconUrl(weather.icon)
        };
      });
      if (todayForecast.length < 3) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowForecast = weatherData.list.filter((item: any) => {
          const forecastDate = new Date(item.dt_txt);
          return forecastDate.getDate() === tomorrow.getDate(); // Filter by tomorrow's date
        }).map((item: any) => ({
          time: item.dt_txt.split(' ')[1], // Extracting time (assuming format is consistent)
          temperature: kelvinToCelsius(item.main.temp), // Convert temperature to Celsius
          weather: item.weather[0].description,
          iconUrl: getIconUrl(item.weather[0].icon)
        }));
        const combinedForecast: any = [...todayForecast, ...tomorrowForecast.slice(0, 5 - todayForecast.length)];
        setTodayForecast(combinedForecast);
      } else {
        setTodayForecast(todayForecast.slice(0, 3));
      }
      dailyForecasts.forEach((day: any) => {
      });
      todayForecast.forEach((hourly: any) => {
      });

    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getDayOfWeek = (dateString: any) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const formatTime = (timeString: any) => {
    // Split the time into hours and minutes
    const [hours, minutes] = timeString.split(':');

    // Create a Date object to format the time
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    // Format time to 12-hour format with AM/PM
    let formattedTime = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    return formattedTime;
  };

  //today weather report
  const [weatherResponse, setWeatherResponse] = useState<any>(null)

  const getWeatherToday = async (latitude: any, longitude: any) => {
    const apiKey = '64ee8b17eb8f34f8e9e8b408354edafa'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    try {
      const response = await axios.get(url);
      setWeatherResponse(response.data)
      // localStorage.setItem('weatherResponse', JSON.stringify(response.data));
    } catch (error) {
      setError("Error fetching weather data.");
    }
  };
  const showPositionToday = async (position: any) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    await getWeatherToday(lat, lon);
  };

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
     await timeout(1000)
 
     if(!isCancelled){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositionToday, showError);
      } else {
        setError("Geolocation is not supported by this browser.");
      }
     }
    }
    handleChange()
    return () => {
     isCancelled = true
    }
   }, []);
  
  // useEffect(() => {
  //   if (!weatherRef.current) {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(showPositionToday, showError);
  //     } else {
  //       setError("Geolocation is not supported by this browser.");
  //     }
  //     weatherRef.current = true; // Set the flag to true
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const getWeatherIconClass = (weatherCondition: any) => {
    const isDayTime = () => {
      const currentHour = new Date().getHours();
      return currentHour >= 6 && currentHour < 18; // Day time is between 6 AM and 6 PM
    };

    const dayIcons: any = {
      'Clear': <WiDaySunny size={30} />,
      'Clouds': <WiDayCloudy size={30} />,
      'Rain': <WiDayRain size={30} />,
      'Snow': <WiDaySnow size={30} />,
      'Thunderstorm': <WiDayThunderstorm size={30} />,
      'Default': <WiDayCloudy size={30} />
    };

    const nightIcons: any = {
      'Clear': <WiNightClear size={30} />,
      'Clouds': <WiNightAltCloudy size={30} />,
      'Rain': <WiNightAltRain size={30} />,
      'Snow': <WiNightAltSnow size={30} />,
      'Thunderstorm': <WiNightAltThunderstorm size={30} />,
      'Default': <WiNightAltCloudy size={30} />
    };
    const icon = isDayTime() ? dayIcons[weatherCondition] : nightIcons[weatherCondition];
    return icon || (isDayTime() ? dayIcons['Default'] : nightIcons['Default']);
  };

  const weatherDes: any = weatherResponse?.weather.main
  const iconClass = getWeatherIconClass(weatherDes);

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString(undefined, options);
    setCurrentDate(formattedDate);
  }, []);

  const lottieRef: any = useRef(null);  //lottie loading
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2); // Set the speed to half (adjust as needed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDataFromApi = async () => {    //Data fetching from api
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

    // Fetch data from API based on language code
    try {
      const response = await axios.get(`/List_api_tables?table_name=News&limit=60&status_eq=true&offset=0&language_contains=${languageCode}`);
      const data = response.data.Data.map((row: any, index: number) => {
        const imagesArray = row.mainimages ? row.mainimages.split(',').map((img: any) => img.trim()) : [];
        const mainimages = imagesArray.length > 0 ? imagesArray[0] : null;
        setIsTableLoading(false);
        return {
          ...row,
          SNo: index + 1,
          mainimages
        };
      });
      setNewsItems(data);

      //To fetch popular
      const popularData = await axios.get(`/Popularnews?language=${language}&limit=5`);
      const popular = popularData.data;
      setPopular(popular)

      //To fetch most viewed
      const mostViewData = await axios.get(`/List_api_tables?table_name=News&limit=5&offset=0&sort_by=Views&order=Desc&language_contains=${languageCode}`);
      const mostView = mostViewData.data.Data;
      setTopNewsItem(mostView)

    } catch (error) {
      console.error('There was an error fetching the news data!', error);
    } finally {
      setLoading(false);
      setIsTableLoading(false);
    }
  }

  const trending = newsItems.slice(0, 4);
  const slider = newsItems.slice(0, 4);
  const leftone = newsItems[4];
  const lefttwo = newsItems[6];
  const leftthree = newsItems[7];
  const homeCenter = newsItems.slice(8, 13);
  const rightone = newsItems[13];
  const righttwo = newsItems[14];
  const rightthree = newsItems[15];
  const topStories = newsItems.slice(16, 19);
  const centerImage = newsItems[19];
  const sixbox = newsItems.slice(20, 26);
  const latestReviewOne = newsItems[26];
  const latestReviews = newsItems.slice(27, 30);
  const techAndInnovation = newsItems[30];
  const techAndInnovationDatas = newsItems.slice(31, 34);
  const editorPicksOne = newsItems[34];
  const editorPicks = newsItems.slice(35, 38);
  const latestArticle = newsItems.slice(38);
  const latest = newsItems.slice(39);

  const handleDetails = (item: any) => {   //Route to details page
    fetchNewsView(item.id);
    setCurrentNews({ ...item });
    let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let innersubgrpname = allInnerSubGroups.find((group: any) => group.uid == item.innersubgroupid)?.innersubgroupname.trim().toLowerCase().replace(/\s+/g, '-') || ''
    // Check for groupid = 23
    if (item.groupid === 23) {
      // Find state and city names from locationData
      const matchedState = location.find((loc: any) => loc.state_id === item.stateid);
      const matchedCity = location.find((loc: any) => loc.district_id === item.districtid);

      const stateName = matchedState
        ? matchedState.state_name.toLowerCase().replace(/\s+/g, '-')
        : '';
      const cityName = matchedCity
        ? matchedCity.district_name.toLowerCase().replace(/\s+/g, '-')
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

      // } else {
      //   router.push(`/${params.lang}/`);
      // }
      const origin = window.location.origin;
      if (!origin) {
        router.push(`https://www.peopleplus.press/en/${grname}/${subgrname}/details/${item.url}`);
      } else {
        router.push(`/${langCode}/${grname}/${subgrname}/details/${item.url}`);
      }
    }
  }

  const handleTags = async (item: any) => {  //Route to category page
    fetchNewsView(item.id);
    setCurrentNews({ ...item });
    let grname = allGroups.find((group: any) => group.uid == item.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let subgrname = allsubGroups.find((group: any) => group.uid == item.subgroupid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
    let innersubgrpname = allInnerSubGroups.find((group: any) => group.uid == item.innersubgroupid)?.innersubgroupname.trim().toLowerCase().replace(/\s+/g, '-') || ''
    // Check for groupid = 23
    if (item.groupid === 23) {
      const selectState = await axios.get(`/List_api_tables?table_name=State&state_contains=${item.tags}`);
      const stateDataCount = selectState.data.TotalCount;
      const stateData = selectState.data.Data[0];

      // If a state is found
      if (stateDataCount > 0) {
          const stateName = stateData.state.trim().toLowerCase().replace(/\s+/g, '-');
          router.push(`/${langCode}/india/${stateName}`);
          return; // Exit after successful state route
      } else if (stateDataCount == 0)  {
        const selectCity = await axios.get(`/List_api_tables?table_name=District&district_contains=${item.tags}`);
        const cityData = selectCity.data.Data[0]; // Assuming single district match

        const overallState = await axios.get(`/List_api_tables?table_name=State&id_eq=${cityData.stateid}`);
        const res = overallState.data.Data[0]; 
            const districtName = cityData.district.trim().toLowerCase().replace(/\s+/g, '-');
            router.push(`/${langCode}/india/${res.state.trim().toLowerCase().replace(/\s+/g, '-')}/${districtName}`);
            return; // Exit after successful district route
      }
    }
    else {
      // Route to subgroup or default route
      //if (matchedSubGroup) {
      router.push(`/${langCode}/${grname}/${subgrname}`);
      // } else {
      //   router.push(`/${params.lang}/`);
      // }
    }
  }

  const handleImageLoad = () => {
    setLoading(false);
  };

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
          {/* <GoogleSignInPrompt /> */}
          {/* <GoogleSignIn /> */}
          <main className="page_main_wrapper">
            <div>
              <NewsTicker handleDetails={handleDetails} trending={trending} />
            </div>
            <div
              className="bg-img feature-section py-4 py-lg-3 py-xl-4"
              data-image-src="assets/images/bg-shape.png"
            >
              <div className="container">
                <HomeFeatureCarousal handleTags={handleTags} handleDetails={handleDetails} lang={langu} slider={slider} />
              </div>
            </div>
            <section className="slider-inner">
              <div className="container-fluid p-0">
                <div className="row thm-margin">
                  <LeftBox leftone={leftone} lefttwo={lefttwo} leftthree={leftthree} handleDetails={handleDetails} loadingImg={loadingImg} setLoadingImg={setLoadingImg} handleTags={handleTags} loading={loading} handleImageLoad={handleImageLoad} />
                  <div className="col-md-6 col-xxl-4 thm-padding">
                    <div className="slider-wrapper">
                      <HomeCenterSlider handleDetails={handleDetails} lang={langu} homeCenter={homeCenter} />
                    </div>
                  </div>
                  <RightBox rightone={rightone} righttwo={righttwo} rightthree={rightthree} handleDetails={handleDetails} loadingImg={loadingImg} setLoadingImg={setLoadingImg} handleTags={handleTags} />
                </div>
              </div>
            </section>
            <div className="container">
              <div className="row gx-lg-5">
                <div className="col-md-3 leftSidebar d-none d-xl-block">
                  <StickyBox >
                    <TopStories topStories={topStories} loadingImg={loadingImg} handleDetails={handleDetails} handleTags={handleTags} />
                    <MostViewPopularHome topNewsItem={topNewsItem} popular={popular} handleDetails={handleDetails} />
                  </StickyBox>
                </div>
                <div className="col-sm-7 col-md-8 col-xl-6 border-start border-end main-content">
                  <StickyBox>
                    <CenterImage centerImage={centerImage} handleDetails={handleDetails} loadingImg={loadingImg} setLoadingImg={setLoadingImg} handleTags={handleTags} />
                    <SixBox sixbox={sixbox} handleDetails={handleDetails} loadingImg={loadingImg} setLoadingImg={setLoadingImg} />
                    <div className="add-inner">
                      {loadingImg && <Box sx={{ width: 300 }}>
                        <Skeleton />
                        <Skeleton animation="wave" />
                        <Skeleton animation={false} />
                      </Box>}
                      <Image src={sports} alt="la" className="img-fluid" onLoadingComplete={() => setLoadingImg(false)}
                        style={{ width: '100%', borderRadius: '6px' }}
                      />
                    </div>
                  </StickyBox>
                </div>
                <div className="col-sm-5 col-md-4 col-xl-3 rightSidebar">
                  <StickyBox>
                    <SocialMediaIcons />
                    <TrendingTopics />
                    <LatestReviews latestReviewOne={latestReviewOne} handleDetails={handleDetails} loadingImg={loadingImg} setLoadingImg={setLoadingImg} latestReviews={latestReviews} />
                  </StickyBox>
                </div>
              </div>
            </div>
            <div className="mb-4 py-5 position-relative video-section">
              <div className="container">
                <div className="row justify-content-center mb-5">
                  <div className="col-md-6 text-center">
                    <h3 className="text-white" style={{ fontSize: '20px', fontWeight: '400px' }}>Latest Video News</h3>
                  </div>
                </div>
                <YoutubeVideo />
              </div>
            </div>
            <section className="articles-wrapper">
              <div className="container">
                <div className="row gx-lg-5">
                  <div className="col-md-3 leftSidebar d-none d-xl-block">
                    <StickyBox>
                      <TechAndInnovation techAndInnovation={techAndInnovation} techAndInnovationDatas={techAndInnovationDatas} handleDetails={handleDetails} setLoadingImg={setLoadingImg} handleTags={handleTags} />
                      <EditorPicks editorPicksOne={editorPicksOne} editorPicks={editorPicks} handleDetails={handleDetails} loadingImg={loadingImg} setLoadingImg={setLoadingImg} handleTags={handleTags} />
                    </StickyBox>
                  </div>
                  <div className="col-sm-7 col-md-8 col-xl-6 border-start border-end main-content">
                    <StickyBox>
                      <LatestNewsHome latest={latest} handleDetails={handleDetails} loadingImg={loadingImg} setLoadingImg={setLoadingImg} handleTags={handleTags} />
                    </StickyBox>
                  </div>
                  <div className="col-sm-5 col-md-4 col-xl-3 rightSidebar">
                    <StickyBox>
                      {/* START WEATHER */}
                      <div className="weather-wrapper-2 weather-bg-2" style={{ borderRadius: '7px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                        <div className="weather-temperature">
                          <div className="weather-now">
                            <span className="big-degrees" style={{ marginLeft: '15px' }}>{weatherResponse?.main?.temp}</span>
                            <span className="circle">°</span>
                            <span className="weather-unit">C</span>
                          </div>
                        </div>
                        <div className="weather-info">
                          <div className="weather-name">{weatherResponse?.weather[0]?.description} {iconClass}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          {todayForecast.map((forecast: any, index) => (
                            <div className="weather-hours" style={{ fontSize: '10px' }} key={index}>
                              <div className="hour">{formatTime(forecast.time)}</div>
                              <div className="hour-icon">
                                <img src={forecast.iconUrl} alt={forecast.weather} />
                              </div>
                              <div className="hour-degrees">
                                <span className="degrees">{forecast.temperature}</span>
                                <span className="circle">°C</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <hr />
                        <div className="weather-week-2" style={{ display: 'flex', justifyContent: "space-between" }}>
                          {dailyForecasts.map((day: any, index: any) => (
                            <div className="weather-days" key={index}>
                              <div className={`day-${index}`}>{getDayOfWeek(day.date)}</div>
                              <div className="day-icon">
                                <img src={day.iconUrl} alt={day.weather} />
                              </div>
                              <div className="day-degrees" style={{ fontSize: '10px' }}>
                                <span className={`degrees-${index}`}>{day.temperature}&deg;C</span>
                                {/* <span className="circle">°</span> */}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="weather-footer">
                          <div className="weather-date">{currentDate}</div>
                          <div className="weather-city">{weatherResponse?.name}</div>
                        </div>
                      </div>
                      <Tags />
                    </StickyBox>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Globeltrends/>
          {/* <GooglePopup/> */}
        </Layout>
      )}
    </>
  )
}