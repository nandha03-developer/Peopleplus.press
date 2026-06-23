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


const Page = () => {
  // const lang = params.lang
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

  const latest = newsItems.slice(39);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Logic to calculate current items to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [loadingImg, setLoadingImg] = useState(true);


  // Inline styles for the image



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
              data-image-src="/assets/images/Term-and-conditions.jpg"
            >
              <div className="container position-relative">
                <div className="row">
                  <div className="col-sm-12">
                    <h2
                      className="entry-title"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      Terms And Condition{" "}
                    </h2>
                    <p
                      className="description"
                      style={{
                        fontSize: "16px",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      By using People Plus Press, you agree to our Terms and
                      Conditions, which govern your use of our website and
                      services. These terms outline your rights,
                      responsibilities, and limitations. For complete details,
                      please review our full Terms and Conditions.
                    </p>
                    <div
                      className="breadcrumb"
                      style={{
                        padding: "10px 15px", // Padding around the breadcrumb
                        borderRadius: "5px", // Rounded corners
                      }}
                    >
                      <ul
                        style={{
                          listStyle: "none", // Remove default list styles
                          padding: 0, // Remove default padding
                          margin: 0, // Remove default margin
                          display: "flex", // Use flexbox for horizontal alignment
                          alignItems: "center", // Center items vertically
                        }}
                      >
                        <li>
                          <Link
                            href="/"
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            Home
                          </Link>
                        </li>
                        <li style={{ color: "white", marginLeft: "-10px" }}>
                          &#x27A4;
                        </li>
                        <li
                          className="ib current-page"
                          style={{
                            color: "black", // Color for the current page
                            marginLeft: "-10px",
                          }}
                        >
                          {" "}
                          Terms and Condition
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
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "black",
                    }}
                  >
                    Terms of Use
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    These Terms of Use govern your use of the websites, content,
                    and community services offered through{" "}
                    <a
                      href="https://www.peopleplus.press/en"
                      target="_blank"
                      style={{
                        color: "#eb0254",
                        textDecoration: "underline",
                        fontWeight: "bold",
                      }}
                    >
                      https://www.peopleplus.press
                    </a>{" "}
                    (&apos;Website/Site/Service&apos;). By accessing the Site,
                    you (the user) agree to abide by these terms and conditions
                    of use.
                  </p>
                </div>

                {/* end row */}
                <div className="about-title" style={{ marginTop: "-15px" }}> 
                  <p
                    className="text-heading-6"
                    style={{
                      fontWeight: "bold",
                      fontSize: "18.5px",
                      color: "black",
                    }}
                  >
                    1. Terms of Service (TOS)
                  </p>
                  <div style={{ marginTop: "-4px" }}>
                    <p
                      style={{
                        fontSize: "16px",
                        fontFamily: "Montserrat, sans-serif",
                        color: "#2b2121",
                        textAlign: "justify",
                      }}
                    >
                      These terms constitute a legally binding agreement between
                      you and People Plus Press regarding your use of the
                      website{" "}
                      <a
                        href="https://www.peopleplus.press/en"
                        target="_blank"
                        style={{
                          color: "#eb0254",
                          textDecoration: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        https://www.peopleplus.press
                      </a>
                      (“the Website/Site”) and any services offered by the
                      company, including but not limited to the delivery of
                      content via the Site or any mobile or internet-connected
                      device (“the Service”). “User” or “You” means any person
                      who accesses or avails this Site/Service of the Company
                      for hosting, publishing, sharing, transacting, displaying,
                      or uploading information or views.
                    </p>
                  </div>

                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    By accessing the Site or Service, you agree to be legally
                    bound by these Terms, effective immediately on your first
                    use of the Site/Service. If you do not agree to be legally
                    bound by all the following terms, please do not access
                    and/or use the Site/Service.
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    You hereby represent and warrant to the Company that you are
                    at least eighteen (18) years of age and are capable of
                    entering, performing, and adhering to these Terms. While
                    individuals under the age of 18 may utilize the Service of
                    the site, they shall do so only with the involvement,
                    guidance, and of their parents and/or legal guardians. If
                    required by the Company, you agree to register before
                    uploading any content or comments and provide your details,
                    including but not limited to name, age, email address,
                    residential address, and contact number.
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    People Plus Press may add to or change these Terms of Use at
                    its discretion. You are responsible for checking these Terms
                    of Use periodically to remain in compliance. Your use of the
                    Site after any amendment shall constitute your acceptance of
                    these terms. The Company reserves the right to
                    suspend/cancel or discontinue any or all channels, products,
                    or services at any time without notice and to charge
                    subscription and/or membership fees with reasonable prior
                    notice.{" "}
                  </p>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>Copyright and Trademarks </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    Unless otherwise stated, copyright and all intellectual
                    property rights in all material presented on the Site
                    (including but not limited to text, audio, video, or
                    graphical images), trademarks, and logos appearing on this
                    Site are the property of People Plus Press and are protected
                    under applicable laws. You agree not to use any framing
                    techniques to enclose any trademark or logo or other
                    proprietary information of People Plus Press.
                  </p>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>
                    Limited Permission to Copy{" "}
                  </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    People Plus Press grants you permission to access and make
                    personal use of the Site. You agree not to download, modify,
                    alter, copy, publish, distribute, or disseminate any content
                    on the Site without express consent. However, you may print
                    or download extracts for personal, non-commercial use only.
                    You must not retain copies of these pages except for
                    subsequent viewing purposes.
                  </p>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>
                    Individual Registration, Access, and Exchange of Information
                  </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    Registration may be required for certain services. You agree
                    to provide current, complete, and accurate information
                    during the registration process. You are responsible for
                    maintaining the confidentiality of your password and
                    account. Unauthorized use of your account must be reported
                    immediately.
                  </p>
                </div>
                <div style={{ marginTop: "-15px" }}>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>
                    No Unlawful or Prohibited Use{" "}
                  </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    {" "}
                    You agree not to use the Services for any unlawful or
                    prohibited purposes. You may not use the Services in a
                    manner that could damage, disable, overburden, or impair any
                    People Plus Press server or interfere with any other
                    party&apos;s use and enjoyment of the Services.
                  </p>
                </div>

                <div>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>
                    Material Posted/Transmitted on People Plus Press&apos;s Site{" "}
                  </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    You are solely responsible for the content you post or
                    transmit on the Site. By posting content, you warrant that
                    you have the necessary rights to grant People Plus Press a
                    non-exclusive, royalty-free, perpetual, irrevocable, and
                    sub-licensable right to use, reproduce, modify, publish, and
                    display such content worldwide. People Plus Press is not
                    responsible for the content posted by users but reserves the
                    right to remove any content that violates these Terms.
                  </p>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>Prohibited Activities </h6>

                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    You agree not to engage in prohibited activities, including
                    but not limited to posting defamatory, obscene, or offensive
                    content, infringing on intellectual property rights, and
                    engaging in unlawful activities. Automated data collection,
                    web scraping, and unauthorized access are strictly
                    prohibited.
                  </p>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>Limitation of Liabilities </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    {" "}
                    People Plus Press is not responsible for any transactions or
                    interactions between users. The Company does not assume
                    liability for any content posted by users or for any loss or
                    damage resulting from the use of the Site.
                  </p>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>Termination of Account </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    {" "}
                    People Plus Press reserves the right to terminate or suspend
                    your account for any violation of the Terms of Use. You may
                    also terminate your account, but your information may remain
                    stored on our servers even after termination.
                  </p>
                </div>

                <div style={{ marginTop: "25px" }}>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>
                    User Conduct and Obligations{" "}
                  </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    {" "}
                    You agree to use the Site/Services for lawful purposes only
                    and not to engage in activities that could harm the Site,
                    its users, or violate any applicable laws.
                  </p>
                </div>

                <div style={{ marginTop: "25px" }}>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>Advertising Material </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    {" "}
                    People Plus Press is not responsible for the accuracy or
                    legality of advertising material submitted by third parties.
                    Your dealings with advertisers found on the Site are solely
                    between you and the advertiser.
                  </p>
                </div>

                <div style={{ marginTop: "25px" }}>
                  <h6 className="text-heading-6" style={{fontWeight: "bold", fontSize: "18.5px",color:"black"}}>Data Protection </h6>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    {" "}
                    People Plus Press may collect and use your information by
                    its privacy policy. The Company reserves the right to
                    disclose information as required by law or in response to
                    legal processes.
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    {" "}
                    People Plus Press employs YouTube API services to enhance
                    your experience. Your use of our services, specifically when
                    interacting with YouTube Components, is governed by the
                    YouTube Terms of Service and Google Privacy Policy.
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "Montserrat, sans-serif",
                      color: "#2b2121",
                      textAlign: "justify",
                    }}
                  >
                    By accessing or using People Plus Press in conjunction with
                    YouTube Components, you agree to be bound by the terms and
                    policies outlined in these documents.{" "}
                  </p>
                </div>

                <p
                  style={{
                    fontSize: "16px",
                    fontFamily: "Montserrat, sans-serif",
                    color: "#2b2121",
                    textAlign: "justify",
                  }}
                >
                  If you have any questions or concerns regarding these Terms of
                  Use, please contact us at{" "}
                  <a href="mailto:info@peoplepluspress.com" target="_blank">
                    info@peoplepluspress.com
                  </a>
                </p>
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
