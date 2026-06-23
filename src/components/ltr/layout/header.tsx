/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import sports from "/public/assets/images/masonry/people-plus-poster-_s.png";
import { Autocomplete, IconButton, InputAdornment, Paper, TextField, } from "@mui/material";
import { useLanguage } from "@/context/languageContext";
import SearchNews from "@/components/searchNews";
import SideBar from "@/components/HeaderComponent/sideBar";
import HeaderTop from "@/components/HeaderComponent/headerTop";
import HeaderTopRight from "@/components/HeaderComponent/headerTopRight";
import Searchmodal from "@/components/HeaderComponent/searchmodal";

const Header = () => {
  const { langCode, setLangCode } = useLanguage();
  const lang = langCode;
  const pathname = usePathname();
  const [isSidebarActive, setSidebarActive] = useState(false);
  const [isOverlayActive, setOverlayActive] = useState(false);
  const [loadingImg, setLoadingImg] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { allGroups, allsubGroups, allInnerSubGroups, metroCities, allStates } = useContext(GroupSubGroupContext);
  const [showMoreNav, setShowMoreNav] = useState<any>(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [weatherIcon, setWeatherIcon] = useState();
  const [aqiIcon, setAQIIcon] = useState<any>();
  const [airPollution, setAirPollution] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  //const [stateName, setStateName] = useState([]);
  const [logo, setLogo] = useState("/path/to/default-logo.png");
  const [customerData, setCustomerData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState(false);
  const [searchValue, setSearchValue] = useState(""); // Search value
  const [data, setData] = useState([]); // to store the filtered data to display in options
  const [dloading, setdLoading] = useState(false);
  const [searchData, setSearchData] = useState([]); // to store searched data
  const router = useRouter();

  const handleLanguageChange = (lang: any) => {
    setLangCode(lang); // Update the language state
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleSidebar = () => {
    setSidebarActive(!isSidebarActive);
    setOverlayActive(!isOverlayActive);
  };

  const closeSidebar = () => {
    setSidebarActive(false);
    setOverlayActive(false);
  };

  useEffect(() => {
    const dismissOverlay = document.querySelector("#dismiss");
    const overlay = document.querySelector(".overlay");
    const navIcon = document.querySelector("#nav-icon");

    if (dismissOverlay && overlay) {
      dismissOverlay.addEventListener("click", closeSidebar);
      overlay.addEventListener("click", closeSidebar);
    }

    if (navIcon) {
      navIcon.addEventListener("click", toggleSidebar);
    }

    return () => {
      if (dismissOverlay && overlay) {
        dismissOverlay.removeEventListener("click", closeSidebar);
        overlay.removeEventListener("click", closeSidebar);
      }
      if (navIcon) {
        navIcon.removeEventListener("click", toggleSidebar);
      }
    };
  }, [isSidebarActive, isOverlayActive, toggleSidebar]);

  useEffect(() => {
    const fullSkinSearch = () => {
      let wHeight = window.innerHeight;

      const fullscreenSearchform = document.getElementById(
        "fullscreen-searchform"
      );
      if (fullscreenSearchform) {
        fullscreenSearchform.style.top = `${wHeight / 2}px`;

        window.addEventListener("resize", () => {
          wHeight = window.innerHeight;
          fullscreenSearchform.style.top = `${wHeight / 2}px`;
        });
      }
    };

    fullSkinSearch();

    return () => {
      window.removeEventListener("resize", () => {
        // Cleanup function if needed
      });
    };
  }, []);

  const handleSearchButtonClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleCloseButtonClick = () => {
    setIsSearchOpen(false);
  };

  const handleButtonClick = () => {
    // Navigate to another page
    router.push(`/${lang}/search`);
  };

  const weatherRef = useRef(false);
  useEffect(() => {
    if (!weatherRef.current) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        setError("Geolocation is not supported by this browser.");
      }
      weatherRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPosition = async (position: any) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    await getLocation(lat, lon);
    await getWeather(lat, lon);
  };

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

  const getLocation = async (latitude: any, longitude: any) => {
    const apiKey = `AIzaSyDbpm5vXbVRqlLB_d5BhInZ01MqhQtMQs4`;
    const apiEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    try {
      const response = await axios.get(apiEndpoint);
      const results = response.data.results;
      if (results.length > 0) {
        const city = results[0].address_components.find((component: any) =>
          component.types.includes("locality")
        );
        // setLocation(results[0].formatted_address);
        if (city) {
          setLocation(city.long_name); // or city.short_name depending on your preference
        } else {
          setError("City not found in the location data.");
        }
      } else {
        setError("Location not found.");
      }
    } catch (error) {
      setError("Error fetching location data.");
    }
  };
  const AQI_ICONS = {
    1: "😊 Good", // Good
    2: "😊 Fair", // Fair
    3: "😐 Moderate", // Moderate
    4: "😷 Poor", // Poor
    5: "🤢 Very Poor", // Very Poor
  };

  const getAQIIcon: any = (aqi: any) => {
    if (aqi >= 0 && aqi <= 50) {
      return AQI_ICONS[1]; // Good
    } else if (aqi > 50 && aqi <= 100) {
      return AQI_ICONS[2]; // Fair
    } else if (aqi > 100 && aqi <= 150) {
      return AQI_ICONS[3]; // Moderate
    } else if (aqi > 150 && aqi <= 200) {
      return AQI_ICONS[4]; // Poor
    } else {
      return AQI_ICONS[5]; // Very Poor
    }
  };

  const getWeather = async (latitude: any, longitude: any) => {
    const storedLocation = sessionStorage.getItem('location');
    const storedWeatherData = sessionStorage.getItem('weatherData');
    const storedAQIIcon = sessionStorage.getItem('AQIIcon');
    
    // If data exists in sessionStorage, set it to state
    if (storedLocation && storedWeatherData && storedAQIIcon) {
      setLocation(storedLocation);  // Location data
      setWeatherData(JSON.parse(storedWeatherData));  // Weather data
      setAQIIcon(storedAQIIcon);  // AQI Icon data
    } else {
      // Fetch weather data from API if not in sessionStorage
      const apiKey = "64ee8b17eb8f34f8e9e8b408354edafa"; // Your API key
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      
      try {
        // Fetch the weather data and air pollution data
        const response = await axios.get(url);
        const airResponse = await axios.get(pollutionUrl);
        
        // Process weather data
        const mainWeatherData = response.data.weather.map((weather: any) => weather.main);
        setWeatherIcon(mainWeatherData[0]);  // Assuming you have a function to set weather icon
        const airQualityIndex = airResponse.data.list[0].main.aqi;
        setAQIIcon(getAQIIcon(airQualityIndex));  // Assuming you have a function for AQI icon
        setAirPollution(airQualityIndex);  // Set air pollution index
  
        // Set state with the data
        setLocation(response.data.name);  // Location
        setWeatherData(response.data.main.temp);  // Weather data
  
        // Store in sessionStorage
        sessionStorage.setItem('location', response.data.name);
        sessionStorage.setItem('weatherData', JSON.stringify(response.data.main.temp));
        sessionStorage.setItem('AQIIcon', getAQIIcon(airQualityIndex));  // Store AQI icon as a string
  
      } catch (error) {
        setError("Error fetching weather data.");
      }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(
      window.location.href.split("#")[1] || ""
    ); // Get parameters after #
    const langParam = urlParams.get("lang");

    if (langParam) {
      setSelectedLanguage(langParam);
    }
  }, []);

  const [langParam, setLangParam] = useState("ENG"); // Default language param

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("?lang=")) {
      const newLangParam = hash.split("?lang=")[1];
      setLangParam(newLangParam);
    }
  }, []); // Run useEffect only once on mount to initialize langParam

  const [languageCode, setLanguageCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const supportedLangs = ["ta", "en", "hi"];

      // Check if the current path starts with a supported language
      const langMatch = supportedLangs.find((lang) =>
        currentPath.startsWith(`/${lang}`)
      );
      if (!langMatch) {
        router.push("/en" + currentPath);
      } else {
        setLanguageCode(langMatch);
      }
    }
  }, [router]);

  const [showNavBar, setShowNavBar] = useState(false);

  const handleStateClick = (e: any) => {
    e.preventDefault();
    setShowNavBar(true);
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNavBar]);
  const handleOutsideClick = (e: any) => {
    if (!e.target.closest(".navbar") && showNavBar) {
      setShowNavBar(false);
    }
  };

  const fetchDataFromApi = async () => {
    // axios
    //   .get("/List_api_tables?table_name=State&sort_by=state&order=ASC")
    //   .then((response) => {
    //     const newsDatas = response.data.Data;
    //     const datarev = newsDatas.reverse();
    //     const data = datarev.map((row: any, index: number) => ({
    //       ...row,
    //       SNo: index + 1,
    //     }));
    //    // setStateName(data.reverse());
    //   })
    //   .catch((error) => {
    //     console.error("There was an error fetching the order data!", error);
    //   });
    let languageCode = 0; // Default language code
    let logo = ""; // State for the logo URL
    const pathname = window.location.pathname;
    if (pathname.startsWith("/ta")) {
      languageCode = 1; // Tamil
      logo = "/assets/images/website logo-01.png"; // Path to Tamil logo
    } else if (pathname.startsWith("/hi")) {
      languageCode = 2; // Hindi
      logo = "/assets/images/website logo-03.png"; // Path to Hindi logo
    } else {
      languageCode = 0; // English
      logo = "/assets/images/website logo-02.png"; // Path to English logo
    }
    setLogo(logo);
  };

  const stateRef = useRef(false);
  useEffect(() => {
    // Check if the function has already been called
    if (!stateRef.current) {
      fetchDataFromApi();
      stateRef.current = true; // Mark as submitted
    }
  }, []);

  useEffect(() => {
    const fetchCustomerData = async () => {
      // Get userId from localStorage and ensure it's not null
      const userIdString = localStorage.getItem("cusId");
      const userId = userIdString ? JSON.parse(userIdString) : null;

      if (userId === null) {
        // console.error("No userId found in localStorage");
        setLoading(false); // Set loading to false if no userId
        return;
      }

      try {
        const response = await axios.get(
          "/List_api_tables?table_name=Customer"
        );
        const fetchedData = response.data.Data;

        // Find the customer that matches the userId
        const customerObject =
          fetchedData.find((customer: any) => customer.id == userId) || null;

        // Update state with the single customer object or null
        setCustomerData(customerObject);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false); // Ensure loading is set to false once data fetching is complete
      }
    };

    fetchCustomerData();
  }, []);

  useEffect(() => {
    const fetchCustomerData = async () => {
      // Get userId from localStorage and ensure it's not null
      const userIdString = localStorage.getItem("cusId");
      const userId = userIdString ? JSON.parse(userIdString) : null;

      if (userId === null) {
        // console.error("No userId found in localStorage");
        setLoading(false); // Set loading to false if no userId
        return;
      }

      try {
        const response = await axios.get(
          "/List_api_tables?table_name=Customer"
        );
        const fetchedData = response.data.Data;

        // Find the customer that matches the userId
        const customerObject =
          fetchedData.find((customer: any) => customer.id == userId) || null;

        // Update state with the single customer object or null
        setCustomerData(customerObject);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false); // Ensure loading is set to false once data fetching is complete
      }
    };

    fetchCustomerData();
  }, []);

  const handleLogoutClick = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const searchOnChange = async (e: any) => {
    const newSearchValue = e.target.value;
    setSearchValue(newSearchValue);
    if (newSearchValue.trim() === "") {
      setData([]);
      return;
    }
    setdLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/List_api_tables?table_name=News&Searchparms=${newSearchValue}&limit=800&language_contains=0`
      );
      const result = await response.json();
      setData(result.Data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: any, value: any) => {
    setSearchValue(value);
    if (value) {
      searchOnChange({ target: { value } });
    }
  };

  const handleSearchSubmit = async (event: any) => {
    event.preventDefault(); // Prevent the default form submission
    try {
      const response = await fetch(
        `/List_api_tables?table_name=News&Searchparms=${searchValue}&language_contains=0`
      );
      const result = await response.json();

      setSearchData(result.Data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {  //To close when click esc key
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <header>
        <div className="header-top">
          <div className="container">
            <div className="row">
              <div className="col">
                <HeaderTop weatherData={weatherData} aqiIcon={aqiIcon} weatherIcon={weatherIcon} location={location} />
              </div>
              <div className="col-auto ms-auto">
                <HeaderTopRight languageCode={languageCode} handleLanguageChange={handleLanguageChange} loading={loading} customerData={customerData} handleLogoutClick={handleLogoutClick} />
              </div>
            </div>
          </div>
        </div>
        <div className="d-md-block d-none header-mid">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col d-flex align-items-center w-100">
                <div className="d-flex align-items-center">
                  <div id="nav-icon" className={isSidebarActive ? "open" : ""} style={{ marginRight: "10px" }}> <span /><span /><span />
                  </div>
                  <Searchmodal />
                </div>
                <div className="align-items-center d-flex justify-content-center">
                  <Link href={`/${lang}`} className="header-logo">
                    <Image src={logo} alt="PeoplePlus" width={206} height={67} />
                  </Link>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12" style={{ marginLeft: '-27%' }}>
                  <Image src={sports} alt="Sports" layout="responsive" height={90} onLoadingComplete={() => setLoadingImg(false)} className="img-fluid" style={{ width: "100%", height: "100%", marginLeft: pathname === `/${lang}` ? '-8%' : '-45%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="custom-navbar navbar navbar-expand-lg sticky-top flex-column no-logo no-logo" style={{ zIndex: 900 }}>
          {/* <div className={`fullscreen-search-overlay ${isSearchOpen ? "fullscreen-search-overlay-show" : ""}`} >
            <Link href="#" className="fullscreen-close" onClick={handleCloseButtonClick} id="fullscreen-close-button" >
              <i className="ti ti-close" />
            </Link>
            <div id="fullscreen-search-wrapper" style={{ position: "relative" }}>
              <form method="get" id="fullscreen-searchform" onSubmit={handleSearchSubmit}>
                <Autocomplete disablePortal options={data} loading={dloading} getOptionLabel={(option: any) => option.title || ""} onInputChange={handleInputChange}
                  PaperComponent={(props) => (
                    <Paper
                      {...props}
                      style={{ backgroundColor: "white", zIndex: 1000 }}
                    />
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton type="submit" aria-label="search" edge="end">
                              <i className="ti ti-search fullscreen-search-icon" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </form>
             
            </div>
          </div> */}
          <div className="container position-relative">
            <Link className="navbar-brand d-md-none" href="/">
              <Image src={logo} className="header-logo_dark" alt="People Plus" width={206} height={67} priority />
            </Link>
            <div className="btn btn-search_two  ms-auto ms-md-0 d-lg-none">
              <Searchmodal />
            </div>
            <button className={`navbar-toggler ms-1`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className={`collapse navbar-collapse`} id="navbarSupportedContent">
              <div className="align-items-center border-bottom d-flex d-lg-none  justify-content-between mb-3 navbar-collapse__header pb-3">
                <div className="collapse-brand flex-shrink-0">
                  <Link href={`/${lang}`}>
                    <Image src={logo} className="header-logo_dark" alt="" width={206} height={67} />
                  </Link>
                  <Link href={`/${lang}`}>
                    <Image src={logo} className="header-logo_white" alt="" width={206} height={67} />
                  </Link>
                </div>
                <div className="flex-grow-1 ms-3 text-end">
                  <button type="button" className="bg-transparent border-0 collapse-close p-0 position-relative" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span /> <span />
                  </button>
                </div>
              </div>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {allGroups?.slice(0, pathname === `/${lang}` ? 9 : 7).map((group: any) =>
                  group.uid == 23 ? (
                    <ul key={group.id || `${group.id}-${group.groupname.toLowerCase().replace(/\s+/g, "-")}`} className="navbar-nav">
                      <li key={group.id || `${group.id}-${group.groupname.toLowerCase().replace(/\s+/g, "-")}`} className="nav-item dropdown">
                        <Link className="nav-link dropdown-toggle " href={`/${lang}/india`}>INDIA</Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link className="dropdown-item" href="" onClick={handleStateClick}>STATE</Link>
                          </li>
                          <li className="nav-item dropdown dropend">
                            <Link className="dropdown-item dropdown-toggle" href={`/${lang}/india/metrocities`}>METROCITIES</Link>
                            <ul className="dropdown-menu">
                              {metroCities.map((metroCity: any) => (
                                <li key={metroCity.district_id}>
                                  <Link className="dropdown-item" href={`/${lang}/india/metrocities/${metroCity.district_name.toLowerCase().replace(/\s+/g, "-")}`}>
                                    {metroCity.district_name.toUpperCase()}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>

                        </ul>
                      </li>
                    </ul>
                  ) : (
                    <li key={group.uid} className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        href={`/${lang}/${group.groupname
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        id={`dropdownMenuButton-${group.uid}`}
                      >
                        {group.groupname.toUpperCase()}
                      </Link>
                      {allsubGroups.filter(
                        (itm: any) => itm.groupid == group.uid
                      ).length != 0 && (
                          <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${group.uid}`}>
                            {allsubGroups
                              .filter((itm: any) => itm.groupid == group.uid)
                              .map((subgroup: any) => (
                                <li className="nav-item dropdown dropend"
                                  key={subgroup.id || `${subgroup.groupid}-${subgroup.subgroupname.toLowerCase().replace(/\s+/g, "-")}`}>
                                  <Link className="dropdown-item"
                                    href={`/${lang}/${group.groupname
                                      .toLowerCase()
                                      .replace(
                                        /\s+/g,
                                        "-"
                                      )}/${subgroup.subgroupname
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                  >
                                    {subgroup.subgroupname.toUpperCase()}
                                  </Link>
                                  {allInnerSubGroups?.filter(
                                    (itm: any) => itm.subgroupid == subgroup.uid
                                  ).length != 0 && (
                                      <ul className="dropdown-menu">
                                        {allInnerSubGroups
                                          ?.filter(
                                            (itm: any) =>
                                              itm.subgroupid == subgroup.uid
                                          )
                                          .map((innerSubGroup: any) => (
                                            <li key={innerSubGroup.id || `${innerSubGroup.groupid}-${innerSubGroup.innersubgroupname.toLowerCase().replace(/\s+/g, "-")}`}>
                                              <Link className="dropdown-item"
                                                href={`/${lang}/${group.groupname.toLowerCase()
                                                  .replace(/\s+/g, "-")}/${subgroup.subgroupname.toLowerCase().replace(/\s+/g, "-")}/${innerSubGroup.innersubgroupname.toLowerCase().replace(/\s+/g, "-")}`}
                                              >
                                                {innerSubGroup.innersubgroupname.toUpperCase()}
                                              </Link>
                                            </li>
                                          ))}
                                      </ul>
                                    )}
                                </li>
                              ))}
                          </ul>
                        )}
                    </li>

                  )
                )}
                {allGroups?.length > (pathname === `/${lang}` ? 9 : 7) && (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link"
                        href={`/${lang}/videos`}
                      >
                        Videos
                      </Link>

                    </li>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default link behavior
                          setShowMoreNav(!showMoreNav); // Toggle state
                        }}
                        href=""
                      >
                        More
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {showMoreNav && (
          <nav className="custom-navbar navbar navbar-expand-lg sticky-top flex-column no-logo no-logo">
            <div className="container position-relative">
              <div className={`collapse navbar-collapse`}>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <ul className="navbar-nav">
                    {allGroups.slice(pathname === `/${lang}` ? 9 : 7).map((group: any) => (
                      <li key={group.uid} className="nav-item dropdown">
                        <Link className="nav-link dropdown-toggle"
                          href={`/${lang}/${group.groupname
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          id={`dropdownMenuButton-${group.uid}`}
                        >
                          {group.groupname}
                        </Link>
                        {allsubGroups.filter(
                          (itm: any) => itm.groupid == group.uid
                        ).length != 0 && (
                            <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${group.uid}`}>
                              {allsubGroups
                                .filter((itm: any) => itm.groupid == group.uid)
                                .map((subgroup: any) => (
                                  <li key={subgroup.id} className="nav-item dropdown dropend">
                                    <Link className="dropdown-item"
                                      href={`/${lang}/${group.groupname
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}/${subgroup.subgroupname
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`}
                                    >
                                      {subgroup.subgroupname.toUpperCase()}
                                    </Link>
                                    {allInnerSubGroups.filter(
                                      (itm: any) => itm.subgroupid == subgroup.uid
                                    ).length != 0 && (
                                        <ul className="dropdown-menu">
                                          {allInnerSubGroups
                                            .filter(
                                              (itm: any) =>
                                                itm.subgroupid == subgroup.uid
                                            )
                                            .map((innerSubGroup: any) => (
                                              <li key={innerSubGroup.id}>
                                                <Link
                                                  className="dropdown-item"
                                                  href={`/${lang}/${group.groupname}/${subgroup.subgroupname}/${innerSubGroup.innersubgroupname}`}
                                                >
                                                  {innerSubGroup.innersubgroupname.toUpperCase()}
                                                </Link>
                                              </li>
                                            ))}
                                        </ul>
                                      )}
                                  </li>

                                ))}
                            </ul>
                          )}
                      </li>
                    ))}
                  </ul>
                </ul>
              </div>
            </div>
          </nav>
        )
        }
        {showNavBar && (
          <nav className="custom-navbar navbar navbar-expand-lg sticky-top flex-column no-logo no-logo">
            <div className={`fullscreen-search-overlay ${isSearchOpen ? "fullscreen-search-overlay-show" : ""}`} ></div>
            <div className="container position-relative">
              <div className={`collapse navbar-collapse`} id="navbarSupportedContent">
                <ul className="stateBar">
                  {allStates.map((state: any, index: any) => (
                    <li key={index}>
                      <Link
                        href={`/${lang}/india/${state.state
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {state.state}
                        <span className="hover-line"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        )}
        <style jsx>{`
          .stateBar {
            display: flex;
            list-style-type: none;
            padding: 0;
            margin: 0;
            flex-wrap: wrap; /* Allow wrapping to new lines */
          }
          .stateBar li {
            margin: 7px; /* Add space between items */
            flex: 0 1 auto; /* Allow items to shrink and grow */
            position: relative; /* Position relative for absolute child */
          }
          .stateBar li:last-child {
            margin-right: 0; /* Remove margin from the last item if needed */
          }
          /* Adjust the Link styles */
          .stateBar li a {
            text-decoration: none;
            color: #333; /* Adjust color as needed */
            padding: 5px 10px; /* Add padding to the links */
            display: inline-block; /* Ensure links behave as blocks within flex container */
            position: relative; /* Position relative for absolute child */
          }
          /* Hover line style */
          .stateBar li .hover-line {
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background-color: #eb0254; /* Color of the hover line */
            transition: width 0.3s ease; /* Transition for width */
          }
          .stateBar li:hover .hover-line {
            width: 100%; /* Full width on hover */
          }
        `}</style>
        <SideBar isSidebarActive={isSidebarActive} logo={logo} customerData={customerData} handleLogoutClick={handleLogoutClick} showPopup={showPopup} setShowPopup={setShowPopup} />
        <div className={isOverlayActive ? "overlay active" : "overlay"} />
      </header>
    </>
  );
};
export default Header;