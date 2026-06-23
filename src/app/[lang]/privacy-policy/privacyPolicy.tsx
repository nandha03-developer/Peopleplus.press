/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Layout from "@/components/ltr/layout/layout";
import { UseBackgroundImageLoader } from "@/components/ltr/use-background-image/use-background-image";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import Lottie from "lottie-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import animationData from "../../../../public/assets/images/data 11.json";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import Image from "next/image";

const Page = () => {
  //const lang = params.lang
  UseRemoveBodyClass(
    ["None"],
    ["home-seven", "home-nine", "boxed-layout", "home-six", "home-two"]
  );
  UseBackgroundImageLoader();
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

  const [newsItems, setNewsItems] = useState<any>([]);
  const [hover, setHover] = useState(false);
  const [hoveremail, setHoverEmail] = useState(false);
  const [hovertwo, setHoverTwo] = useState(false);

  const fetchDataFromApi = async () => {
    let languageCode = 0; // Default language code

    const pathname = window.location.pathname;
    if (pathname.startsWith("/ta")) {
      languageCode = 1; // Tamil
    } else if (pathname.startsWith("/hi")) {
      languageCode = 2; // Hindi
    } else {
      languageCode = 0; // English
    }

    // Fetch data from API based on language code
    try {
      const response = await axios.get(
        `/List_api_tables?table_name=News&language_contains=${languageCode}`
      );
      const data = response.data.Data.map((row: any, index: number) => ({
        ...row,
        SNo: index + 1,
      }));
      const reverseData = data.reverse();
      setNewsItems(reverseData);
    } catch (error) {
      console.error("There was an error fetching the news data!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const router = useRouter();

  const handleClickRoute = (title: any) => {
    const seoFriendlyTitle = title.replace(/\s+/g, "-");
    const encodedTitle = encodeURIComponent(seoFriendlyTitle);
    // router.push(`/${params.lang}/${encodedTitle}`);
  };
  const latest = newsItems.slice(39);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Logic to calculate current items to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = latest.slice(indexOfFirstItem, indexOfLastItem);
  const [loadingImg, setLoadingImg] = useState(true);

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "100%", // Make the wrapper responsive
    maxWidth: "228px", // Maximum width of the wrapper
    height: "0",
    paddingBottom: "68.8%", // Aspect ratio of 218x150 (150/218*100)
    overflow: "hidden",
  };

  // Inline styles for the image
  const imageStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", // Cover the wrapper area
  };

  const trending = newsItems.slice(0, 4);

  const sendEmail = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const email = "grievance@peopleplus.press";
    const subject = "";
    const body = "";
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const callPhoneNumber = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const phoneNumber = "+914523571170"; // Replace with your mobile number
    const callUrl = `tel:${phoneNumber}`;
    window.open(callUrl); // This will attempt to open the dialer
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Lottie
            animationData={animationData}
            lottieRef={lottieRef}
            loop
            autoplay
            style={{ width: "200px", height: "200px" }} // Adjust width and height as needed
          />
        </div>
      ) : (
        <Layout>
          {/* *** START PAGE MAIN CONTENT *** */}
          <main className="page_main_wrapper">
            {/* START PAGE HEADER */}
            <section
              className="inner-head bg-img"
              data-image-src="/assets/images/privacy-policy.jpg"
            >
              <div className="container position-relative">
                <div className="row">
                  <div className="col-sm-12">
                    <h2 className="entry-title" style={{ fontFamily: "sans-serif" }}>Privacy Policy </h2>
                    <p className="description" style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif" }}>
                      At People Plus Press, we value your privacy above anything
                      else. In accordance with our Privacy Policy, we gather,
                      use, and protect your personal information. This policy
                      explains our procedures for gathering, using, and
                      safeguarding data. See our complete Privacy Policy for
                      more details.
                    </p>
                    <div
                      className="breadcrumb"
                      style={{
                        padding: '10px 15px', // Padding around the breadcrumb
                        borderRadius: '5px', // Rounded corners
                      }}
                    >
                      <ul
                        style={{
                          listStyle: 'none', // Remove default list styles
                          padding: 0, // Remove default padding
                          margin: 0, // Remove default margin
                          display: 'flex', // Use flexbox for horizontal alignment
                          alignItems: 'center', // Center items vertically
                        }}
                      >
                        <li

                        >
                          <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>Home </Link>
                        </li>
                        <li style={{ color: 'white', marginLeft: "-10px" }}>&#x27A4;</li>

                        <li
                          className="ib current-page"
                          style={{
                            color: 'black', // Color for the current page
                            marginLeft: "-10px"
                          }}
                        >
                          Privacy Policy
                        </li>
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
                  <p style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>Effective Date: 01-OCT-2024</p>

                  <div>
                    <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      PeoplePlus Press Private Limited ("we," "our," or "us") is committed to safeguarding the privacy
                      of our users. This Privacy Policy explains how we collect, use, disclose, and protect your
                      personal information when you use our website, <a href="https://www.peopleplus.press/en" target="_blank"
                        style={{ color: "#eb0254", textDecoration: "underline", fontWeight: "bold" }}
                      >
                        https://www.peopleplus.press
                      </a>
                      , our mobile
                      applications, or other services (collectively referred to as the "Services"). By using our Services,
                      you agree to the collection and use of information in accordance with this Privacy Policy. If you
                      do not agree with our practices, please discontinue using our Services.
                    </p>
                  </div>


                </div>

                {/* end row */}
                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>1. Information We Collect </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We collect various types of information in connection with your use of the Services, which may
                    include:
                  </p>
                </div>

                <div>
                  <h6 className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>1.1. Personal Information</h6>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    This includes any information that identifies you personally. You may voluntarily provide
                    personal information when interacting with the Services, such as when registering, subscribing
                    to newsletters, posting comments, or otherwise engaging with our content. This includes:
                  </p>
                  <ul>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Name </p>
                    </li>

                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Mobile Number</p>{" "}
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Email Address</p>
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Home Address</p>
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>IP Address</p>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    1.2. Non-Personal Information
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    Non-personal information refers to data that cannot be used to identify you directly. We may
                    collect information such as:
                  </p>
                  <ul>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Browser type and version </p>
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Operating system and platform</p>{" "}
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Internet Protocol (IP) address</p>{" "}
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Device information (e.g., mobile operating system, device identifiers)</p>
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Referring website URLs</p>
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Pages viewed and actions taken on our Services</p>
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Time and date of your visit, and time spent on each page</p>
                    </li>
                  </ul>

                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>1.3. Location Data</p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    With your consent, we may collect and process your precise geographic location using GPS,
                    Wi-Fi, or cellular triangulation technology. You can enable or disable location services in your
                    mobile device settings.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>1.4. Automatically Collected Data</p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    When you access or use the Services, we may automatically collect information, such as:
                  </p>
                  <ul>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }} >Log files, including your IP address, browser type, referring/exit pages, and clickstream
                        data</p>
                    </li>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Cookies and similar tracking technologies that collect and track information about your
                        interaction with the Services</p>{" "}
                    </li>

                  </ul>

                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>1.5. Facebook Data</p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                  If you interact with our website or services through Facebook (e.g., logging in via Facebook or using Facebook plugins), we may collect your public profile information and other data you have authorized Facebook to share.
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>2. How We Use Your Information </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We use the information we collect for various purposes, including:
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    2.1. Service Delivery</p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    To provide, operate, maintain, and improve our Services.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    2.2. Personalization
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    To customize your user experience and deliver content tailored to your preferences and
                    interests.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    2.3. Communication
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    To send you updates, promotional content, newsletters, or other relevant information based on
                    your preferences.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    2.4. Analytics
                  </p>
                </div>


                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    To analyze how users interact with the Services and improve performance.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    2.5. Security
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    To protect against unauthorized access, fraud, and other security risks.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    2.6. Legal Compliance
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    To comply with legal obligations, such as responding to court orders, legal processes, or
                    government requests.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    2.7. Integration with Facebook
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                  To enable login and authentication through Facebook. To serve personalized ads via Facebook&rsquo;s advertising services (in compliance with Facebook&rsquo;s policies).
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>3. Cookies and Tracking Technologies </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We use cookies and other tracking technologies (such as web beacons and pixel tags) to
                    enhance your experience and gather information about how you use our Services.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    3.1. Types of Cookies</p>
                </div>

                <div>
                  <ul>
                    <li style={{ color: "black" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                        <span style={{ fontWeight: "bold", fontSize: "16.5px", color: "black" }}>Essential Cookies:</span> {""} Necessary for the functionality of the Services. Certain features may
                        not be available without these cookies.
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <ul>
                    <li style={{ color: "black" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                        <span style={{ fontWeight: "bold", fontSize: "16.5px", color: "black" }}>Performance Cookies:</span>{""} These help us understand how users interact with the Services
                        and optimize them for better performance.
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <ul>
                    <li style={{ color: "black" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                        <span style={{ fontWeight: "bold", fontSize: "16.5px", color: "black" }}>Targeting/Advertising Cookies:</span> {""}These track user activities to deliver personalized
                        advertising relevant to your interests.
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    3.2. Managing Cookies
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    You can manage cookies through your browser settings or other tools. Disabling certain cookies
                    may affect the functionality of the Services..
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>4. How We Share Your Information </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We do not sell, rent, or trade your personal information with third parties. However, we may
                    share your data in the following circumstances:
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    4.1. Service Providers</p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We may share your personal information with third-party vendors who provide services such as
                    hosting, analytics, payment processing, or customer support. These vendors have access to
                    personal information necessary to perform their functions but may not use it for other purposes.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    4.2. Affiliates and Business Partners
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We may share your information with affiliated companies or business partners who help us
                    provide our Services.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    4.3. Legal Obligations
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    If required by law, regulation, or legal process, we may share your personal information with law
                    enforcement or government authorities.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    4.4. Business Transfers
                  </p>
                </div>


                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    In the event of a merger, acquisition, or sale of assets, your personal information may be
                    transferred as part of the transaction.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    4.5. Facebook
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                  For analytics, personalized advertising, and to enhance our services in compliance with Facebook’s terms and privacy policy.
                  </p>
                </div>


                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>5. Google Play Store, Google News, and Apple App Store Compliance </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We use the information we collect for various purposes, including:
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    5.1. Google Play Store</p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    Our mobile app complies with Google's Developer Policy and Privacy Requirements. Sensitive
                    information, such as financial details or precise location data, will not be collected without user
                    consent. Notifications will appear before accessing sensitive features like the camera or
                    microphone.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    5.2. Apple App Store
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    Our mobile app complies with Apple’s App Store Review Guidelines, providing full transparency
                    about data collection. Users will be notified when their data is being collected, and no data will
                    be shared with third parties without explicit consent.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    5.3. Google News
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We follow Google News’ publisher policies, adhering to strict user data protection standards.
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>6. Facebook Data Compliance </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                  In compliance with Facebook’s privacy policy requirements:
                  </p>
                </div>

                <div>
                  <ul>
                    <li style={{ color: "black" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                        <span style={{ fontSize: "16.5px", color: "black" }}>We do not store or cache sensitive user data received from Facebook.</span>
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <ul>
                    <li style={{ color: "black" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                        <span style={{ fontSize: "16.5px", color: "black" }}>We will notify Facebook of any data breaches or unauthorized access to their data.</span>
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <ul>
                    <li style={{ color: "black" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                        <span style={{ fontSize: "16.5px", color: "black" }}>We ensure users are informed about how their data is processed when interacting with Facebook services through our platform.</span>
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>7. Data Retention </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We retain your personal information only for as long as necessary to fulfill the purposes outlined
                    in this Privacy Policy, or as required by law. After the retention period, your data will be securely
                    deleted or anonymized.
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>8. Security of Your Information</p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We implement industry-standard security measures to protect your personal data from
                    unauthorized access, disclosure, alteration, or destruction. However, no method of internet
                    transmission or electronic storage is completely secure, and we cannot guarantee its absolute
                    security.
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>9. Your Rights and Choices </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    You have certain rights regarding your personal data:
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    9.1. Access and Correction</p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    You may request access to your personal data and request corrections if it is inaccurate.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    9.2. Deletion
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    You may request the deletion of your personal data, subject to legal obligations that require us
                    to retain certain information.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    9.3. Opt-Out
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    You may opt-out of receiving marketing communications by following the instructions provided in
                    emails or messages.
                  </p>
                </div>

                <div>
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    9.4. Data Portability
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    You can request a copy of your personal data in a structured, commonly used, and
                    machine-readable format.
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>10. Third-Party Links </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    Our Services may include links to third-party websites or applications. This Privacy Policy does
                    not apply to third-party services, and we encourage you to review their respective privacy
                    policies.
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>11. Children’s Privacy</p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    Our Services are not directed at individuals under the age of 13, and we do not knowingly
                    collect personal information from children. If you believe a child has provided us with personal
                    data, please contact us, and we will take steps to delete the information.
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>12. International Data Transfers </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    Your personal information may be transferred to and processed in countries outside of your
                    own. By using our Services, you consent to the transfer of your data to countries that may have
                    different data protection laws than your home country.
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>13. Changes to This Privacy Policy </p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We may update this Privacy Policy from time to time. If we make material changes, we will notify
                    you by email or through a notice on our Services. Your continued use of the Services after such
                    updates constitutes acceptance of the changes.
                  </p>
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>14. Contact Information</p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    If you have any questions or concerns regarding this Privacy Policy or our data practices,
                    please contact us at:
                  </p>
                </div>

                <div>
                  <p style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    PeoplePlus Press Private Limited
                  </p>
                  <p style={{ marginTop: "-20px", fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    Plot No.1, 1st Floor, 5th Street,<br />
                    K.K. Nagar, Managiri,<br />
                    Madurai, Tamil Nadu, India - 625020<br />
                    Ph: {""}
                    <a
                      onClick={callPhoneNumber}
                      onMouseEnter={() => setHoverTwo(true)}
                      onMouseLeave={() => setHoverTwo(false)}
                      style={{
                        color: hovertwo ? "#eb0254" : "black",
                        textDecoration: "none",
                        cursor: "pointer"
                      }}
                    >
                      +91 452 3571170
                    </a><br />
                    Email: {""} <strong
                      onClick={sendEmail}
                      onMouseEnter={() => setHoverEmail(true)}
                      onMouseLeave={() => setHoverEmail(false)}
                      style={{
                        cursor: "pointer",
                        color: hoveremail ? "#eb0254" : "black" // Change hover color here
                      }}
                    >
                      contact@peopleplus.press
                    </strong>
                  </p>

                  <hr style={{ border: "1px solid #000", marginTop: "10px" }} />
                </div>

                <div className="about-title">
                  <p className="text-heading-6" style={{ fontWeight: "bold", fontSize: "18.5px", color: "black" }}>Grievance Redressal</p>
                </div>

                <div style={{ marginTop: "-20px" }}>
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    If you have any complaints or concerns regarding the use, storage, deletion, or disclosure of
                    your personal information, you may contact our designated Grievance Officer. The Grievance
                    Officer appointed by PeoplePlus Press Private Limited is M John, who can be reached at {""}
                    <Link href="" legacyBehavior>
                      <a onClick={sendEmail}>
                        grievance@peopleplus.press
                      </a>
                    </Link>
                  </p>
                </div>


                <div >
                  <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    You may also write to us at:
                  </p>
                </div>

                <div>
                  <p style={{ fontWeight: "bold", fontSize: "18px", color: "black" }}>
                    PeoplePlus Press Private Limited
                  </p>
                  <p style={{ marginTop: "-20px", fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    Plot No.1, 1st Floor, 5th Street,<br />
                    K.K. Nagar, Managiri,<br />
                    Madurai, Tamil Nadu, India - 625020<br />
                    Ph: {""}
                    <a
                      onClick={callPhoneNumber}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                      style={{
                        color: hover ? "#eb0254" : "black",
                        textDecoration: "none",
                        cursor: "pointer"
                      }}
                    >
                      +91 452 3571170
                    </a><br />
                  </p>


                </div>

                <div>
                  <p style={{ fontSize: "17px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    When writing, please include the following information:
                  </p>
                  <ul>
                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Your identification details (Name, PeoplePlus Identification ID, if applicable)</p>
                    </li>

                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Specific details of your concern(s)</p>{" "}
                    </li>

                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>A clear statement indicating whether the information in question is personal or sensitive
                        personal information</p>{" "}
                    </li>

                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>Your address, phone number, or email address</p>{" "}
                    </li>

                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>A statement of good-faith belief that the information has been processed incorrectly or
                        disclosed without authorization</p>{" "}
                    </li>

                    <li style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                      <p style={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>A statement, under penalty of perjury, that the information in your notice is accurate, and
                        that the personal data belongs to you</p>{" "}
                    </li>
                  </ul>

                </div>

                <div>
                  <p style={{ fontSize: "17px", fontFamily: "Montserrat, sans-serif", color: "#2b2121", textAlign: "justify" }}>
                    We may contact you to confirm or discuss certain details related to your complaint.
                  </p>
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
