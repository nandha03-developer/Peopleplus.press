// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import React, { useEffect, useRef, useState } from "react";
// import { WiDayLightning, WiDaySunny, WiDayCloudy, WiDayRain, WiDaySnow, WiThunderstorm, WiNightClear, WiNightAltCloudy, WiNightAltRain, WiNightAltSnow, WiNightAltThunderstorm, WiDayThunderstorm } from "weather-icons-react";
// import ThemeChanger from "../style-selectors/style-selector";
// import travelIcon from "@iconify-icons/streamline/travel-places-beach-island-waves-outdoor-recreation-tree-beach-palm-wave-water";
// import { Icon } from "@iconify/react/dist/iconify.js"
// import axios from "axios";
// import Image from "next/image";
// import cloudData from '../../../../public/assets/animatedJson/cloud.json.json';
// import Lottie from 'lottie-react';
// import { IoLogoFacebook } from "react-icons/io5";
// import { FaInstagram } from "react-icons/fa";
// import { FaYoutube } from "react-icons/fa";
// import { BsTwitterX } from "react-icons/bs";


// type HomeLink = {
//   href: string;
//   text: string;
//   badge?: string;
// };

// const HomeLinks: HomeLink[] = [
//   { href: "/", text: "Home – Layout 1", badge: "NEW" },
//   { href: "/home-two", text: "Home – Layout 2", badge: "POPULAR" },
//   { href: "/home-three", text: "Home – (Box) Layout 3" },
//   { href: "/home-four", text: "Home – Layout 4" },
//   { href: "/home-five", text: "Home – Layout 5" },
//   { href: "/home-six", text: "Home – Layout 6" },
//   { href: "/home-seven", text: "Home – Layout 7" },
//   { href: "/home-eight", text: "Home – Layout 8" },
//   { href: "/home-nine", text: "Home – Layout 9" },
//   { href: "/category-style", text: "Category - layout 1" },
//   { href: "/category-style-two", text: "Category - layout 2" },
//   { href: "/category-style-three", text: "Category - layout 3" },
//   { href: "/post-template", text: "Post - layout 1" },
//   { href: "/post-template-two", text: "Post - layout 2" },
//   { href: "/post-template-three", text: "Post - layout 3" },
//   { href: "/about", text: "About Us" },
//   { href: "/typography", text: "Typography" },
//   { href: "/contact", text: "Contact" },
//   { href: "/faq", text: "Faq" },
//   { href: "/india/cities", text: "Cities" },
// ];

// const Header: React.FC = () => {
//   const linkRef = useRef<HTMLAnchorElement | null>(null);
//   const [isSidebarActive, setSidebarActive] = useState(false);
//   const [isOverlayActive, setOverlayActive] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const path = usePathname();

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const toggleSidebar = () => {
//     setSidebarActive(!isSidebarActive);
//     setOverlayActive(!isOverlayActive);
//   };

//   const closeSidebar = () => {
//     setSidebarActive(false);
//     setOverlayActive(false);
//   };

//   useEffect(() => {
//     const dismissOverlay = document.querySelector("#dismiss");
//     const overlay = document.querySelector(".overlay");
//     const navIcon = document.querySelector("#nav-icon");

//     if (dismissOverlay && overlay) {
//       dismissOverlay.addEventListener("click", closeSidebar);
//       overlay.addEventListener("click", closeSidebar);
//     }

//     if (navIcon) {
//       navIcon.addEventListener("click", toggleSidebar);
//     }

//     return () => {
//       if (dismissOverlay && overlay) {
//         dismissOverlay.removeEventListener("click", closeSidebar);
//         overlay.removeEventListener("click", closeSidebar);
//       }
//       if (navIcon) {
//         navIcon.removeEventListener("click", toggleSidebar);
//       }
//     };
//   }, [isSidebarActive, isOverlayActive, toggleSidebar]);

//   useEffect(() => {
//     const fullSkinSearch = () => {
//       let wHeight = window.innerHeight;

//       const fullscreenSearchform = document.getElementById(
//         "fullscreen-searchform"
//       );
//       if (fullscreenSearchform) {
//         fullscreenSearchform.style.top = `${wHeight / 2}px`;

//         window.addEventListener("resize", () => {
//           wHeight = window.innerHeight;
//           fullscreenSearchform.style.top = `${wHeight / 2}px`;
//         });
//       }
//     };

//     fullSkinSearch();

//     return () => {
//       window.removeEventListener("resize", () => {
//         // Cleanup function if needed
//       });
//     };
//   }, []);

//   const handleSearchButtonClick = () => {
//     setIsSearchOpen(!isSearchOpen);
//   };

//   const handleCloseButtonClick = () => {
//     setIsSearchOpen(false);
//   };

//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   const toggleDropdown = (dropdown: string) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

//   const [currentDate, setCurrentDate] = useState("");

//   useEffect(() => {
//     const date = new Date();
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     };
//     const formattedDate = date.toLocaleDateString(undefined, options);
//     setCurrentDate(formattedDate);
//   }, []);

//   const [weatherData, setWeatherData] = useState<any>(null);
//   const [location, setLocation] = useState<any>(null);
//   const [weatherIcon, setWeatherIcon] = useState();
//   const [aqiIcon, setAQIIcon] = useState();
//   const [airPollution, setAirPollution] = useState<any>(null);
//   const [error, setError] = useState<any>(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('EN');


//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(showPosition, showError);
//     } else {
//       setError("Geolocation is not supported by this browser.");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const showPosition = async (position: any) => {
//     const lat = position.coords.latitude;
//     const lon = position.coords.longitude;
//     await getLocation(lat, lon);
//     await getWeather(lat, lon);
//   };

//   const showError = (error: any) => {
//     switch (error.code) {
//       case error.PERMISSION_DENIED:
//         setError("User denied the request for Geolocation.");
//         break;
//       case error.POSITION_UNAVAILABLE:
//         setError("Location information is unavailable.");
//         break;
//       case error.TIMEOUT:
//         setError("The request to get user location timed out.");
//         break;
//       case error.UNKNOWN_ERROR:
//         setError("An unknown error occurred.");
//         break;
//       default:
//         setError("An unknown error occurred.");
//         break;
//     }
//   };

//   const getLocation = async (latitude: any, longitude: any) => {
//     const apiKey = `AIzaSyDbpm5vXbVRqlLB_d5BhInZ01MqhQtMQs4`
//     const apiEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
//     try {
//       const response = await axios.get(apiEndpoint);
//       const results = response.data.results;
//       if (results.length > 0) {
//         const city = results[0].address_components.find((component: any) =>
//           component.types.includes('locality'))
//         // setLocation(results[0].formatted_address);
//         if (city) {
//           setLocation(city.long_name); // or city.short_name depending on your preference
//         } else {
//           setError("City not found in the location data.");
//         }
//       } else {
//         setError("Location not found.");
//       }

//     } catch (error) {
//       setError("Error fetching location data.");
//     }
//   };
//   const AQI_ICONS = {
//     1: '😊 Good', // Good
//     2: '😊 Fair', // Fair
//     3: '😐 Moderate', // Moderate
//     4: '😷 Poor', // Poor
//     5: '🤢 Very Poor'  // Very Poor
//   };

//   const getAQIIcon: any = (aqi: any) => {
//     if (aqi >= 0 && aqi <= 50) {
//       return AQI_ICONS[1]; // Good
//     } else if (aqi > 50 && aqi <= 100) {
//       return AQI_ICONS[2]; // Fair
//     } else if (aqi > 100 && aqi <= 150) {
//       return AQI_ICONS[3]; // Moderate
//     } else if (aqi > 150 && aqi <= 200) {
//       return AQI_ICONS[4]; // Poor
//     } else {
//       return AQI_ICONS[5]; // Very Poor
//     }
//   };

//   const getWeather = async (latitude: any, longitude: any) => {
//     const apiKey = '64ee8b17eb8f34f8e9e8b408354edafa'; // Replace with your OpenWeatherMap API key
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
//     const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

//     try {
//       const response = await axios.get(url);
//       const airResponse = await axios.get(pollutionUrl);
//       localStorage.setItem('weatherResponse', JSON.stringify(response.data));

//       const mainWeatherData = response.data.weather.map((weather: any) => weather.main);
//       setWeatherIcon(mainWeatherData[0]);
//       const airQualityIndex = airResponse.data.list[0].main.aqi;
//       setAQIIcon(getAQIIcon(airQualityIndex));
//       setAirPollution(airQualityIndex)


//       setLocation(response.data.name)
//       setWeatherData(response.data.main.temp);
//     } catch (error) {
//       setError("Error fetching weather data.");
//     }
//   };


//   const getWeatherIcon = (weatherCondition: any) => {

//     const isDayTime = () => {
//       const currentHour = new Date().getHours();
//       return currentHour >= 6 && currentHour < 18; // Day time is between 6 AM and 6 PM
//     };

//     const dayIcons: any = {
//       'Clear': <WiDaySunny size={30} />,
//       'Clouds': <WiDayCloudy size={30} />,
//       'Rain': <WiDayRain size={30} />,
//       'Snow': <WiDaySnow size={30} />,
//       'Thunderstorm': <WiDayThunderstorm size={30} />,
//       'Default': <WiDayCloudy size={30} />
//     };

//     const nightIcons: any = {
//       'Clear': <WiNightClear size={30} />,
//       'Clouds': <WiNightAltCloudy size={30} />,
//       'Rain': <WiNightAltRain size={30} />,
//       'Snow': <WiNightAltSnow size={30} />,
//       'Thunderstorm': <WiNightAltThunderstorm size={30} />,
//       'Default': <WiNightAltCloudy size={30} />
//     };

//     const icon = isDayTime() ? dayIcons[weatherCondition] : nightIcons[weatherCondition];

//     return icon || (isDayTime() ? dayIcons['Default'] : nightIcons['Default']);
//   };

//   const extractLast4thWord = (location: any) => {
//     if (!location) return '';
//     const words = location.split(' ');
//     return words.length >= 4 ? words[words.length - 6] : '';
//   };

//   const handleMouseEnter = () => {
//     if (linkRef.current) {
//       linkRef.current.style.color = "#eb0254";
//       const span = linkRef.current.querySelector('span');
//       if (span && span instanceof HTMLElement) {
//         span.style.transform = "scaleY(1)";
//       }
//     }
//   };

//   const handleMouseLeave = () => {
//     if (linkRef.current) {
//       linkRef.current.style.color = "black";
//       const span = linkRef.current.querySelector('span');
//       if (span && span instanceof HTMLElement) {
//         span.style.transform = "scaleY(0)";
//       }
//     }
//   };


//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.href.split('#')[1] || ''); // Get parameters after #
//     const langParam = urlParams.get('lang');

//     if (langParam) {
//       setSelectedLanguage(langParam);
//     }
//   }, []);


//   const translations: any = {
//     ENG: {
//       INDIA: 'INDIA',
//       STATE: 'STATE',
//       TAMILNADU: 'TAMILNADU',
//       ANDHRAPRADESH: 'ANDHRA PRADESH',
//       ARUNACHAL_PRADESH: 'ARUNACHAL PRADESH',
//       ASSAM: 'ASSAM',
//       BIHAR: 'BIHAR',
//       CHHATTISGARH: 'CHHATTISGARH',
//       GOA: 'GOA',
//       GUJARAT: 'GUJARAT',
//       HARYANA: 'HARYANA',
//       HIMACHAL_PRADESH: 'HIMACHAL PRADESH',
//       JHARKHAND: 'JHARKHAND',
//       KARNATAKA: 'KARNATAKA',
//       KERALA: 'KERALA',
//       MADHYA_PRADESH: 'MADHYA PRADESH',
//       MAHARASHTRA: 'MAHARASHTRA',
//       MANIPUR: 'MANIPUR',
//       MEGHALAYA: 'MEGHALAYA',
//       MIZORAM: 'MIZORAM',
//       NAGALAND: 'NAGALAND',
//       ODISHA: 'ODISHA',
//       PUNJAB: 'PUNJAB',
//       RAJASTHAN: 'RAJASTHAN',
//       SIKKIM: 'SIKKIM',
//       TAMIL_NADU: 'TAMIL NADU',
//       TELANGANA: 'TELANGANA',
//       TRIPURA: 'TRIPURA',
//       UTTAR_PRADESH: 'UTTAR PRADESH',
//       UTTARAKHAND: 'UTTARAKHAND'
//     },
//     TAM: {
//       INDIA: 'இந்தியா',
//       STATE: 'மாநிலம்',
//       TAMILNADU: 'தமிழ்நாடு',
//       ANDHRAPRADESH: 'ஆந்திரா பிரதேசம்',
//       ARUNACHAL_PRADESH: 'அருணாசல பிரதேசம்',
//       ASSAM: 'அசாம்',
//       BIHAR: 'பீகார்',
//       CHHATTISGARH: 'சட்டீஸ்கர்',
//       GOA: 'கோவா',
//       GUJARAT: 'குஜராத்',
//       HARYANA: 'ஹரியானா',
//       HIMACHAL_PRADESH: 'ஹிமாச்சல் பிரதேசம்',
//       JHARKHAND: 'ஜார்கண்ட்',
//       KARNATAKA: 'கர்நாடகா',
//       KERALA: 'கேரளா',
//       MADHYA_PRADESH: 'மத்திய பிரதேசம்',
//       MAHARASHTRA: 'மகாராஷ்டிரா',
//       MANIPUR: 'மணிபூர்',
//       MEGHALAYA: 'மேகாலயா',
//       MIZORAM: 'மிசோரம்',
//       NAGALAND: 'நாகாலாந்து',
//       ODISHA: 'ஒடிசா',
//       PUNJAB: 'பஞ்சாப்',
//       RAJASTHAN: 'ராஜஸ்தான்',
//       SIKKIM: 'சிக்கிம்',
//       TELANGANA: 'தெலங்கானா',
//       TRIPURA: 'திரிபுரா',
//       UTTAR_PRADESH: 'உத்தரபிரதேசம்',
//       UTTARAKHAND: 'உத்தராஞ்சல்'
//     },
//     HIN: {
//       INDIA: 'भारत',
//       STATE: 'राज्य',
//       TAMILNADU: 'तमिलनाडु',
//       ANDHRAPRADESH: 'आंध्र प्रदेश',
//       ARUNACHAL_PRADESH: 'अरुणाचल प्रदेश',
//       ASSAM: 'असम',
//       BIHAR: 'बिहार',
//       CHHATTISGARH: 'छत्तीसगढ़',
//       GOA: 'गोवा',
//       GUJARAT: 'गुजरात',
//       HARYANA: 'हरियाणा',
//       HIMACHAL_PRADESH: 'हिमाचल प्रदेश',
//       JHARKHAND: 'झारखंड',
//       KARNATAKA: 'कर्नाटक',
//       KERALA: 'केरल',
//       MADHYA_PRADESH: 'मध्य प्रदेश',
//       MAHARASHTRA: 'महाराष्ट्र',
//       MANIPUR: 'मणिपुर',
//       MEGHALAYA: 'मेघालय',
//       MIZORAM: 'मिज़ोरम',
//       NAGALAND: 'नागालैंड',
//       ODISHA: 'ओडिशा',
//       PUNJAB: 'पंजाब',
//       RAJASTHAN: 'राजस्थान',
//       SIKKIM: 'सिक्किम',
//       TELANGANA: 'तेलंगाना',
//       TRIPURA: 'त्रिपुरा',
//       UTTAR_PRADESH: 'उत्तर प्रदेश',
//       UTTARAKHAND: 'उत्तराखंड'
//     }
//   };

//   const [langParam, setLangParam] = useState('ENG'); // Default language param
//   const [translatedTexts, setTranslatedTexts] = useState<any>({}); // State to hold all translated texts

//   useEffect(() => {
//     const hash = window.location.hash;

//     if (hash.includes('?lang=')) {
//       const newLangParam = hash.split('?lang=')[1];
//       setLangParam(newLangParam);
//     }
//   }, []); // Run useEffect only once on mount to initialize langParam

//   useEffect(() => {
//     if (langParam && translations[langParam]) {
//       setTranslatedTexts(translations[langParam]);
//     } else {
//       // Default to English translations if langParam is invalid
//       setTranslatedTexts(translations['ENG']);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [langParam]); // Run useEffect whenever langParam changes


//   //Open language in another tab
//   const [language, setLanguage] = useState('english');
//   const [languageCode, setLanguageCode] = useState('')

//   const handleLanguageSelect = (lang: any) => {
//     let url;
//     let languageCode;
//     switch (lang) {
//       case 'TAM':
//         url = 'http://tamil.localhost:3000';
//         languageCode = 1;
//         break;
//       case 'HIN':
//         url = 'http://hindi.localhost:3000';
//         languageCode = 2;
//         break;
//       default:
//         url = 'http://localhost:3000';
//         languageCode = 0;
//     }
//     setLanguage(lang);

//     window.open(url, '_blank');
//   };

//   useEffect(() => {
//     let languageCode = ''; // Default to English
//     const hostname = window.location.hostname;
//     if (hostname.includes('tamil')) {
//       languageCode = 'TAM'; // Tamil
//     } else if (hostname.includes('hindi')) {
//       languageCode = 'HIN'; // Hindi
//     } else {
//       languageCode = 'ENG';
//     }

//     setLanguageCode(languageCode);
//   }, []);

//   return (
//     <>
//       <header>

//         <div className="header-top">
//           <div className="container">
//             <div className="row">
//               <div className="col">
//                 <div className="d-flex top-left-menu">
//                   <ul className="align-items-center d-flex flex-wrap">
//                     <li>
//                       <div className="header-social">
//                         <ul className="align-items-center d-flex gap-2">
//                           <li style={{}}>
//                             <Link target="_blank" href="https://x.com/peoplepluspress">

//                               <div style={{ marginBottom: "3px", }}>
//                                 <IoLogoFacebook />
//                               </div>
//                             </Link>
//                           </li>

//                           <li>
//                             <Link target="_blank" href="https://www.instagram.com/peoplepluspress">
//                               <div style={{ marginBottom: "3px" }}>
//                                 <FaInstagram />
//                               </div>

//                             </Link>
//                           </li>
//                           <li>
//                             <Link target="_blank" href="https://youtube.com/@peoplepluspress?si=nW-cBjQmVvVkftnD">
//                               <div style={{ marginBottom: "3px" }}>
//                                 <FaYoutube />
//                               </div>

//                             </Link>
//                           </li>
//                           <li>
//                             <Link target="_blank" href="https://x.com/peoplepluspress">
//                               <div style={{ marginBottom: "3px" }}>
//                                 <BsTwitterX />
//                               </div>

//                             </Link>
//                           </li>
//                         </ul>
//                       </div>
//                     </li>
//                     <li className="d-none d-sm-block">
//                       <Link href="/contact">Contact</Link>
//                     </li>
//                     <li className="d-none d-sm-block">
//                       <Link href="#">Share</Link>
//                     </li>
//                     <li className="d-none d-sm-block">
//                       <Link href="/about">About</Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <div className="col-auto ms-auto">
//                 <div className="header-right-menu">
//                   <ul className="d-flex justify-content-end">
//                     <li className="d-md-block d-none">
//                       {/* Currency:{" "} */}
//                       <Link href="#" className="fw-bold">
//                         {/* USD */}
//                       </Link>
//                     </li>
//                     <li className="d-md-block d-none">
//                       <div className="dropdown language-dropdown">
//                         <button
//                           className="btn p-0 dropdown-toggle d-flex align-items-center gap-2"
//                           type="button"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           <i className="fa-solid fa-earth-americas" />
//                           <div
//                             className="fw-semibold"
//                             style={{ color: "white" }}
//                           >
//                             {languageCode}
//                           </div>
//                         </button>
//                         <ul className="dropdown-menu show">
//             <li>
//               <Link
//                 onClick={() => handleLanguageSelect('ENG')}
//                 className={`dropdown-item ${languageCode === 'ENG' ? 'active' : ''}`}
//                 href="#"
//               >
//                 <Image src="/assets/images/a2.jpg" alt="pp" width={16} height={16} />
//                 <span className="language-text">EN</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 onClick={() => handleLanguageSelect('TAM')}
//                 className={`dropdown-item ${languageCode === 'TAM' ? 'active' : ''}`}
//                 href="#"
//               >
//                 <Image src="/assets/images/tamilA.png" alt="pp" width={16} height={16} />
//                 <span className="language-text">TAM</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 onClick={() => handleLanguageSelect('HIN')}
//                 className={`dropdown-item ${languageCode === 'HIN' ? 'active' : ''}`}
//                 href="#"
//               >
//                 <Image src="/assets/images/hindiImage.png" alt="pp" width={16} height={16} />
//                 <span className="language-text">HIN</span>
//               </Link>
//             </li>
//           </ul>
//                       </div>
//                       {/* Wishlist:{" "} */}
//                       {/* <Link href="#" className="fw-bold">
//                                                     12
//                                                 </Link> */}
//                     </li>
//                     <li>
//                       {" "}
//                       <Link href="/page-signup">
//                         <i className="fa fa-lock" /> Sign Up{" "}
//                       </Link>
//                       <span className="fw-bold">or</span>
//                       <Link href="/page-login"> Login</Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="d-md-block d-none header-mid">
//           <div className="container">
//             <div className="row align-items-center justify-content-center">
//               <div className="col d-flex align-items-center justify-content-between w-100">
//                 {/* Left content: nav-icon, search button, and weather info */}
//                 <div className="d-flex align-items-center">
//                   <div id="nav-icon" className={isSidebarActive ? "open" : ""} style={{ marginRight: '10px' }}>
//                     <span />
//                     <span />
//                     <span />
//                   </div>
//                   <button
//                     type="button"
//                     className="d-none d-sm-block"
//                     onClick={handleSearchButtonClick}
//                     style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginRight: '10px' }}
//                   >
//                     <i className="fa fa-search" aria-hidden="true" style={{ color: 'black' }} />
//                   </button>
//                   <div style={{ display: 'flex', alignItems: 'center', fontWeight: '600', textTransform: 'uppercase' }}>
//                     <div style={{ marginLeft: '5px', width: '2px', height: '20px', borderLeft: '1px solid black' }} />
//                     <span style={{ marginLeft: '5px' }}>{currentDate}</span>
//                   </div>
//                 </div>

//                 {/* Center logo */}
//                 <div className="align-items-center d-flex gap-3 justify-content-center">

//                   {/* <Link href="/" className="header-logo">
//                     <img
//                       src="/assets/images/website logo-01.png"
//                       className="header-logo_dark"
//                       alt="PeoplePlus"
//                       style={{ marginTop: "-10px" }}
//                     />
//                   </Link> */}

//                 </div>

//                 {/* Right content: date */}
//                 <div style={{ display: 'flex', alignItems: 'center', fontWeight: '600', textTransform: 'uppercase' }}>
//                   {/* <Lottie
//               style={{ width: '50px', height: '50px', marginRight: '5px' }}
//               animationData={cloudData}
//               loop
//               autoplay
//             /> */}  {getWeatherIcon(weatherIcon)}
//                   <span>{location}&nbsp;{weatherData}&deg;C</span>
//                   <div style={{ marginLeft: '5px', width: '2px', height: '20px', borderLeft: '1px solid black' }} />
//                   <span style={{ marginLeft: '5px' }}>Air: {aqiIcon}</span>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>


//         <nav className="custom-navbar navbar navbar-expand-lg sticky-top flex-column no-logo no-logo">
//           <div
//             className={`fullscreen-search-overlay ${isSearchOpen ? "fullscreen-search-overlay-show" : ""
//               }`}
//           >
//             <Link
//               href="#"
//               className="fullscreen-close"
//               onClick={handleCloseButtonClick}
//               id="fullscreen-close-button"
//             >
//               <i className="ti ti-close" />
//             </Link>
//             <div id="fullscreen-search-wrapper">
//               <form method="get" id="fullscreen-searchform">
//                 <input
//                   type="text"
//                   defaultValue=""
//                   placeholder="Type keyword(s) here"
//                   id="fullscreen-search-input"
//                 />
//                 <i className="ti ti-search fullscreen-search-icon">
//                   <input value="" type="submit" />
//                 </i>
//               </form>
//             </div>
//           </div>
//           <div className="container position-relative">

//             {/* <Link className="navbar-brand d-md-none" href="/">
//               <img
//                 src="/assets/images/website logo-01.png"
//                 className="header-logo_dark"
//                 alt="People Plus"
//               />

//             </Link> */}

//             <button
//               type="button"
//               className="btn btn-search_two  ms-auto ms-md-0 d-lg-none"
//               onClick={handleSearchButtonClick}
//             >
//               <i className="fa fa-search" />
//             </button>
//             <button
//               className={`navbar-toggler ms-1`}
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#navbarSupportedContent"
//               aria-controls="navbarSupportedContent"
//               aria-expanded="false"
//               aria-label="Toggle navigation"
//             >
//               <span className="navbar-toggler-icon" />
//             </button>
//             <div
//               className={`collapse navbar-collapse`}
//               id="navbarSupportedContent"
//             >
//               <div className="align-items-center border-bottom d-flex d-lg-none  justify-content-between mb-3 navbar-collapse__header pb-3">
//                 <div className="collapse-brand flex-shrink-0">

//                   {/* <Link href="/">
//                     <img
//                       src="/assets/images/website logo-01.png"
//                       className="header-logo_dark"
//                       alt=""
//                     />
//                   </Link>
//                   <Link href="/">
//                     <img
//                       src="/assets/images/logo-white.png"
//                       className="header-logo_white"
//                       alt=""
//                     />
//                   </Link> */}

//                 </div>
//                 <div className="flex-grow-1 ms-3 text-end">
//                   <button
//                     type="button"
//                     className="bg-transparent border-0 collapse-close p-0 position-relative"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#navbarSupportedContent"
//                     aria-controls="navbarSupportedContent"
//                     aria-expanded="false"
//                     aria-label="Toggle navigation"
//                   >
//                     <span /> <span />
//                   </button>
//                 </div>
//               </div>

//               <ul className="navbar-nav">
//                 <li>
//                   <Link className="dropdown-item nav-link" href="/">
//                     LatestNews
//                   </Link>

//                   {/* <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
//                                         {HomeLinks.slice(0, 9).map((link, index) => (
//                                             <li key={index}>
//                                                 <Link className={`dropdown-item ${path === link.href ? 'active' : ''}`} href={link.href}>
//                                                     {link.text} {link.badge && <span className="menu-badge">{link.badge}</span>}
//                                                 </Link>
//                                             </li>
//                                         ))}
//                                     </ul> */}
//                 </li>

//                 <li className="nav-item dropdown">
//                   <Link
//                     className="nav-link  "
//                     href={`/india/state/tamilnadu`}
//                   >
//                    {translatedTexts['TAMILNADU']}
//                   </Link>
//                 </li>
//                 <li className="nav-item dropdown">
//                   <Link
//                     className="nav-link  "
//                     href={`/india/state/kerala`}
//                   >
//                    {translatedTexts['KERALA']}
//                   </Link>
//                 </li>
//                 <li className="nav-item dropdown">
//                   <Link
//                     className="nav-link  "
//                     href="/politices/state"
//                   >
//                    {translatedTexts['GOA']}
//                   </Link>
//                 </li>
//                 <li className="nav-item dropdown">
//                   <Link
//                     className="nav-link  "
//                     href="/politices/state"
//                   >
//                    {translatedTexts['ASSAM']}
//                   </Link>
//                 </li>
//                 <li className="nav-item dropdown">
//                   <Link
//                     className="nav-link  "
//                     href="/politices/state"
//                   >
//                    {translatedTexts['GUJARAT']}
//                   </Link>
//                 </li>
//                 <li className="nav-item dropdown">
//                   <Link
//                     className="nav-link  "
//                     href="/politices/state"
//                   >
//                    {translatedTexts['KARNATAKA']}
//                   </Link>
//                 </li>
//                 <li className="nav-item dropdown">
//                   <Link
//                     className="nav-link  "
//                     href="/politices/state"
//                   >
//                    {translatedTexts['MAHARASHTRA']}
//                   </Link>
//                 </li>
//                 <li className="nav-item dropdown">
//                   <Link
//                     className="nav-link  "
//                     href="/politices/state"
//                   >
//                    {translatedTexts['PUNJAB']}
//                   </Link>
//                 </li>

//                 <li className="nav-item dropdown mega-menu-content d-none d-lg-block">
//                                     <Link className="nav-link dropdown-toggle" href="#" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
//                                         More
//                                     </Link>
//                                     {/* Mega Menu */}
//                                     <ul className="dropdown-menu mega-menu p-3 megamenu-content" aria-labelledby="dropdownMenuButton2">
//                                         <li>
//                                             <div className="row">
//                                                 <div className="col-menu col-md-4 ">
//                                                     <div className="content">
//                                                         <ul className="menu-col">
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['KARNATAKA']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['ARUNACHAL_PRADESH']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['CHHATTISGARH']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['HARYANA']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['HIMACHAL_PRADESH']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['JHARKHAND']} </Link>
//                                                             </li>
//                                                         </ul>
//                                                     </div>
//                                                 </div>
//                                                 {/* end col-3 */}
//                                                 <div className="col-menu col-md-4">
//                                                     {/* <h6 className="title">Sports</h6> */}
//                                                     <div className="content">
//                                                     <ul className="menu-col">
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['MADHYA_PRADESH']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['MANIPUR']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['MEGHALAYA']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['MIZORAM']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['NAGALAND']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['ODISHA']} </Link>
//                                                             </li>
//                                                         </ul>
//                                                     </div>
//                                                 </div>
//                                                 {/* end col-3 */}
//                                                 <div className="col-menu col-md-4">
//                                                     {/* <h6 className="title">Tops</h6> */}
//                                                     <div className="content">
//                                                     <ul className="menu-col">
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['RAJASTHAN']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['SIKKIM']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['TELANGANA']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['TRIPURA']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['UTTAR_PRADESH']} </Link>
//                                                             </li>
//                                                             <li>
//                                                             <Link  href="/politices/state"> {translatedTexts['UTTARAKHAND']} </Link>
//                                                             </li>
//                                                         </ul>
//                                                     </div>
//                                                 </div>

//                                                 {/* end col-3 */}
//                                             </div>
//                                             {/* end row */}
//                                         </li>
//                                     </ul>
//                                 </li>
//               </ul>
//             </div>

//           </div>
//         </nav>
//         <nav
//           style={{ backgroundColor: "white" }}
//           id="sidebar"
//           className={isSidebarActive ? "active p-4" : "p-4"}
//         >
//           <div id="dismiss">
//             <i className="fas fa-arrow-left" />
//           </div>
//           <div className="d-flex flex-column h-100">
//             <div className="">

//               {/* <Link href="/" className="d-inline-block my-3">
//                 <img
//                   src="/assets/images/website logo-01.png"
//                   className="header-logo_dark"
//                   alt=""
//                 />
//               </Link> */}

//               <p style={{ color: "black" }}>
//                 Stay updated with People Plus Press, delivering the latest news on politics, sports, education, business, and more. Reliable, timely information.
//               </p>
//             </div>
//             <hr style={{ border: "1px solid black", marginTop: "10px" }} />
//             <div style={{ padding: "15px", color: "black" }}>
//               <ul className="nav d-block flex-column my-4">
//                 {[

//                   { href: "/", text: "Live" },
//                   { href: "/about", text: "About" },
//                   { href: "/contact", text: "Saved" },
//                   { href: "/latestNews", text: "Latest News" },
//                   { href: "/india", text: "India" },
//                   { href: "/politics", text: "Politics" },
//                   { href: "/sports", text: "Sports" },
//                   { href: "/education", text: "Education" },
//                   { href: "/business", text: "Business" },
//                   // { href: "/entertainment", text: "Entertainment" },
//                   { href: "/automobile", text: "Automobile" },
//                   { href: "/video", text: "Video" },
//                   { href: "/health", text: "Health" },
//                   { href: "/stockmarket", text: "Stock Market" },
//                 ].map((item, index) => (
//                   <li
//                     className="nav-item h5"
//                     key={index}
//                     style={{ position: "relative", paddingLeft: "25px" }}
//                   >

//                     <Link
//                       className="nav-link"
//                       href={item.href}
//                       style={{
//                         color: "black",
//                         position: "relative",
//                         textDecoration: "none",
//                       }}
//                       onMouseEnter={(e: any) => {
//                         e.currentTarget.style.color = "#eb0254";
//                         e.currentTarget.children[0].style.transform = "scaleY(1)";
//                       }}
//                       onMouseLeave={(e: any) => {
//                         e.currentTarget.style.color = "black";
//                         e.currentTarget.children[0].style.transform = "scaleY(0)";
//                       }}

//                     >

//                       {item.text}
//                       <span
//                         style={{
//                           content: "",
//                           position: "absolute",
//                           left: "-10px",
//                           top: "0",
//                           height: "100%",
//                           width: "5px",
//                           backgroundColor: "#eb0254",
//                           transform: "scaleY(0)",
//                           transition: "transform 0.3s ease",
//                         }}
//                       ></span>
//                     </Link>
//                   </li>
//                 ))}
//                 <li className="nav-item h5" style={{ position: "relative", paddingLeft: "25px" }}>
//                   <div
//                     className="nav-link"
//                     onClick={() => toggleDropdown("first")}
//                     style={{
//                       color: "black",
//                       cursor: "pointer",
//                       position: "relative",
//                       display: "flex",
//                       alignItems: "center"
//                     }}
//                     onMouseEnter={(e: any) => {
//                       e.currentTarget.style.color = "#eb0254";
//                       e.currentTarget.children[1].style.transform = "scaleY(1)";
//                     }}
//                     onMouseLeave={(e: any) => {
//                       e.currentTarget.style.color = "black";
//                       e.currentTarget.children[1].style.transform = "scaleY(0)";
//                     }}

//                   >

//                     State
//                     <svg style={{ marginLeft: "5px", width: "12px", height: "12px" }} viewBox="0 0 1024 1024">
//                     </svg>
//                     <span
//                       style={{
//                         content: "",
//                         position: "absolute",
//                         left: "-10px",
//                         top: "0",
//                         height: "100%",
//                         width: "5px",
//                         backgroundColor: "#eb0254",
//                         transform: "scaleY(0)",
//                         transition: "transform 0.3s ease",
//                       }}
//                     ></span>
//                   </div>
//                   {/* {openDropdown === "first" && (
//                     <ul style={{ paddingLeft: "20px", color: "black", margin: 0 }}>
//                       <li
//                         style={{
//                           padding: "10px 0",
//                           listStyle: "none",
//                           cursor: "pointer",
//                           paddingLeft: "25px",
//                           position: "relative",
//                         }}
//                         onMouseEnter={(e: any) => {
//                           e.currentTarget.style.color = "#eb0254";
//                           e.currentTarget.children[0].style.transform = "scaleY(1)";
//                         }}
//                         onMouseLeave={(e: any) => {
//                           e.currentTarget.style.color = "black";
//                           e.currentTarget.children[0].style.transform = "scaleY(0)";
//                         }}

//                       >
//                         Tamil Nadu
//                         <span
//                           style={{
//                             content: "",
//                             position: "absolute",
//                             left: "-10px",
//                             top: "0",
//                             height: "100%",
//                             width: "5px",
//                             backgroundColor: "#eb0254",
//                             transform: "scaleY(0)",
//                             transition: "transform 0.3s ease",
//                           }}
//                         ></span>
//                       </li>
//                       <li
//                         style={{
//                           padding: "10px 0",
//                           listStyle: "none",
//                           cursor: "pointer",
//                           paddingLeft: "25px",
//                           position: "relative",
//                         }}
//                         onMouseEnter={(e: any) => {
//                           e.currentTarget.style.color = "#eb0254";
//                           e.currentTarget.children[0].style.transform = "scaleY(1)";
//                         }}
//                         onMouseLeave={(e: any) => {
//                           e.currentTarget.style.color = "black";
//                           e.currentTarget.children[0].style.transform = "scaleY(0)";
//                         }}
//                       >
//                         Kerala
//                         <span
//                           style={{
//                             content: "",
//                             position: "absolute",
//                             left: "-10px",
//                             top: "0",
//                             height: "100%",
//                             width: "5px",
//                             backgroundColor: "#eb0254",
//                             transform: "scaleY(0)",
//                             transition: "transform 0.3s ease",
//                           }}
//                         ></span>
//                       </li>
//                       <li
//                         style={{
//                           padding: "10px 0",
//                           listStyle: "none",
//                           cursor: "pointer",
//                           paddingLeft: "25px",
//                           position: "relative",
//                         }}
//                         onMouseEnter={(e: any) => {
//                           e.currentTarget.style.color = "#eb0254";
//                           e.currentTarget.children[0].style.transform = "scaleY(1)";
//                         }}
//                         onMouseLeave={(e: any) => {
//                           e.currentTarget.style.color = "black";
//                           e.currentTarget.children[0].style.transform = "scaleY(0)";
//                         }}
//                       >
//                         Andhra Pradesh
//                         <span
//                           style={{
//                             content: "",
//                             position: "absolute",
//                             left: "-10px",
//                             top: "0",
//                             height: "100%",
//                             width: "5px",
//                             backgroundColor: "#eb0254",
//                             transform: "scaleY(0)",
//                             transition: "transform 0.3s ease",
//                           }}
//                         ></span>
//                       </li>
//                     </ul>
//                   )} */}
//                 </li>
//                 <hr style={{ border: "1px solid black", marginTop: "70px" }} />
//                 <ul className="nav d-block flex-column my-4">
//                   <li className="nav-item h5" style={{ position: "relative", paddingLeft: "25px" }}>
//                     <Link href="/contact" legacyBehavior>
//                       <a
//                         className="nav-link custom-nav-link"
//                         style={{ color: "black", position: "relative", textDecoration: "none" }}
//                         onMouseEnter={handleMouseEnter}
//                         onMouseLeave={handleMouseLeave}
//                       >
//                         Contact Us
//                         <span
//                           style={{
//                             content: "",
//                             position: "absolute",
//                             left: "-10px",
//                             top: "0",
//                             height: "100%",
//                             width: "5px",
//                             backgroundColor: "#eb0254",
//                             transform: "scaleY(0)",
//                             transition: "transform 0.3s ease",
//                           }}
//                         ></span>
//                       </a>
//                     </Link>
//                   </li>
//                   <li className="nav-item h5" style={{ position: "relative", paddingLeft: "25px" }}>
//                     <Link href="/contact" legacyBehavior>
//                       <a
//                         className="nav-link custom-nav-link"
//                         style={{ color: "black", position: "relative", textDecoration: "none" }}
//                         onMouseEnter={handleMouseEnter}
//                         onMouseLeave={handleMouseLeave}
//                       >
//                         Technical Support
//                         <span
//                           style={{
//                             content: "",
//                             position: "absolute",
//                             left: "-10px",
//                             top: "0",
//                             height: "100%",
//                             width: "5px",
//                             backgroundColor: "#eb0254",
//                             transform: "scaleY(0)",
//                             transition: "transform 0.3s ease",
//                           }}
//                         ></span>
//                       </a>
//                     </Link>
//                   </li>
//                   <li className="nav-item h5" style={{ position: "relative", paddingLeft: "25px" }}>
//                     <Link href="/contact" legacyBehavior>
//                       <a
//                         className="nav-link custom-nav-link"
//                         style={{ color: "black", position: "relative", textDecoration: "none" }}
//                         onMouseEnter={handleMouseEnter}
//                         onMouseLeave={handleMouseLeave}
//                       >
//                         Terms And Condition
//                         <span
//                           style={{
//                             content: "",
//                             position: "absolute",
//                             left: "-10px",
//                             top: "0",
//                             height: "100%",
//                             width: "5px",
//                             backgroundColor: "#eb0254",
//                             transform: "scaleY(0)",
//                             transition: "transform 0.3s ease",
//                           }}
//                         ></span>
//                       </a>
//                     </Link>
//                   </li>
//                   <li className="nav-item h5" style={{ position: "relative", paddingLeft: "25px" }}>
//                     <Link href="/contact" legacyBehavior>
//                       <a
//                         className="nav-link custom-nav-link"
//                         style={{ color: "black", position: "relative", textDecoration: "none" }}
//                         onMouseEnter={handleMouseEnter}
//                         onMouseLeave={handleMouseLeave}
//                       >
//                         Privacy Policy
//                         <span
//                           style={{
//                             content: "",
//                             position: "absolute",
//                             left: "-10px",
//                             top: "0",
//                             height: "100%",
//                             width: "5px",
//                             backgroundColor: "#eb0254",
//                             transform: "scaleY(0)",
//                             transition: "transform 0.3s ease",
//                           }}
//                         ></span>
//                       </a>
//                     </Link>
//                   </li>
//                 </ul>
//               </ul>

//             </div>
//           </div>
//         </nav>
//         <div className={isOverlayActive ? "overlay active" : "overlay"} />
//       </header>
//     </>
//   );
// };

// export default Header;


export function Headd() {
  return (<>
    <div>Header</div>
  </>);
}