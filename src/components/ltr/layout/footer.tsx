/* eslint-disable @next/next/no-img-element */
"use client"
import { FaTelegram, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import ScrollToTopUI from "../scroll-to-top/scroll-to-top";
import { UseBackgroundImageLoader } from "../use-background-image/use-background-image";
import { CircularProgress, Dialog, Typography, styled } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";
import { SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { GroupSubGroupContext } from "@/context/allGroupContext";
import { useLanguage } from "@/context/languageContext";
import { FaLinkedin, FaPinterest } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

const Footer = () => {
  const { langCode } = useLanguage();
  const { allGroups, allsubGroups,metroCities } = useContext(GroupSubGroupContext);
  const [logo, setLogo] = useState("/path/to/default-logo.png"); // Default logo path
  const [topTrends, setTopTrends] = useState<any>([])
  const [capKey, setCapKey] = useState(null); // Google reCAPTCHA key
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
const [metro, setMetro] = useState<any>([])
  const StyledCompanyName = styled(Link)(({ theme }) => ({
    fontWeight: 500,
    textDecoration: "none",
    color: "#47cce8",
  }));
  const StyledName = styled(Link)(({ theme }) => ({
    fontWeight: 500,
    textDecoration: "none",
    color: "#eb0254",
  }));
  UseBackgroundImageLoader();

  interface topics {
    group: string;
    href: string;
  }

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index: any) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const links = [
    { href: `/${langCode}/privacy-policy`, text: 'Privacy Policy' },
    { href: `/${langCode}/terms-and-condition`, text: 'Terms & Condition' },
    { href: `/${langCode}/contact`, text: 'Contact' },
    { href: `/${langCode}/about`, text: 'About' },
    { href: `/${langCode}/faq`, text: 'FAQ' },
    { href: `/${langCode}/rssfeed`, text: 'RSS' },
  ];

  const fetchDataFromApi = async () => {
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

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const hasFetched = useRef(false);
  useEffect(() => {
    const fetchTopTrends = async () => {
      try {
        const topTrendsData = await axios.get('/List_api_tables?table_name=Search_Index&sort_by=Count&order=desc&limit=35');
        const topTrends = topTrendsData.data.Data;
        localStorage.setItem('topTrends', JSON.stringify(topTrends));
        setTopTrends(topTrends);
      } catch (error) {
        console.error("Error fetching top trends:", error);
      }
    };
    const storedTopTrends = localStorage.getItem('topTrends');
    if (storedTopTrends) {
      setTopTrends(JSON.parse(storedTopTrends));  // Parse and set from localStorage
    } else if (!hasFetched.current) {
      fetchTopTrends();
      hasFetched.current = true;
      const intervalId = setInterval(fetchTopTrends, 7200000);
      return () => clearInterval(intervalId);
    }
  }, []);

  const router = useRouter();

  const [formValues, setFormValues] = useState({
    emailid: "",
    status: "true",
  });

  const [errors, setErrors] = useState({
    emailid: "",
    status: "true",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when user starts typing
    if (name === "emailid") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Please enter a valid email address.",
        }));
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      emailid: "",
      status: "true",
    };

    if (!formValues.emailid.trim()) {
      newErrors.emailid = "Full Name is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    //  recaptchaRef.current?.execute();
    try {
      const response = await axios.post(
        "/api/newslettersubscription",
        formValues,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 200) {
        toast.success("Subscribed Successfully!");
        // Optionally reset form after successful submission
        setFormValues({
          emailid: "",
          status: "true",
        });
      } else {
        toast.error("Failed to add data.");
      }
    } catch (error: any) {
      console.error("Error adding data:", error);
      toast.error("Failed to add data.");
    }
  };

const handleRouteList = (subgroup: any) => {
  let grname = allGroups.find((group: any) => group.uid == subgroup.groupid).groupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
  let subgrname = allsubGroups.find((group: any) => group.uid == subgroup.uid).subgroupname.trim().toLowerCase().replace(/\s+/g, '-') || '';
  let cityname = metroCities.find((group: any) => group.uid === subgroup.uid).city_name.trim().toLowerCase().replace(/\s+/g, '-') || '';
  router.push(`/${langCode}/${grname}/${subgrname}/${cityname}`);
}

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };



  return (
    <>
      <div>
        <div>
          <ScrollToTopUI />
        </div>
        {/* *** START FOOTER *** */}
        <footer
          className="main-footer bg-img"
          data-image-src="/assets/images/footerbackground.jpg"
        >
          <div className="container position-relative z-1">
            <div className="row no-gutters">
              <div className="col-md-2 col-12 px-0  ">
                <Link href={`/en`}>
                  <img
                    src={logo}
                    alt="Logo"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "5px",
                      padding: "10px 10px 20px 10px",
                      width: "100%",
                    }}
                  />
                </Link>
              </div>
              <div className="col-md-6 col-12 px-2">
                <p
                  className="text-white"
                  style={{
                    textAlign: "justify",
                    margin: 0,
                    width: "100%",
                    marginLeft: "3%",
                  }}
                >
                  Welcome to People Plus Press, your go-to source for the latest
                  news and updates across various categories. From breaking news
                  and business insights to lifestyle trends and entertainment
                  buzz, we cover it all. Our dedicated team of journalists and
                  editors work tirelessly to bring you accurate and timely
                  information, ensuring you stay informed and ahead of the
                  curve.
                </p>
              </div>
              <div className="col-md-4 col-12 px-2">
                {/* Form */}
                <form
                  className="row row-cols-lg-auto g-2 align-items-center"
                  style={{ marginLeft: "6%" }}
                  onSubmit={handleSubmit}
                >
                  <div className="col-12 px-0">
                    <input
                      required
                      id="emailid"
                      name="emailid"
                      type="email"
                      className="form-control"
                      placeholder="Enter your email address"
                      style={{ margin: 0 }}
                      value={formValues.emailid}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 px-0">
                    <button
                      type="submit"
                      className="btn btn-news"
                      style={{ margin: 0 }}
                    >
                      Subscribe
                    </button>
                  </div>
                  {errors.emailid && (
                    <div
                      style={{ color: "red", fontSize: "12px" }}
                      className="error-message"
                    >
                      {errors.emailid}
                    </div>
                  )}
                  <div
                    className="form-text mt-2 text-white"
                    style={{ margin: 0,marginLeft: "-2px" }}
                  >
                    By subscribing you agree to our {""}
                    <a
                      href={`/${langCode}/privacy-policy`}
                      className="text-decoration-underline text-primary"
                    >
                      Privacy Policy
                    </a>
                  </div>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LdcJGMqAAAAAKlGl1L6Lp2Fb5PCrhW8oQ_w_Lwl"
                    size="invisible"
                    onChange={(value: any) => setCapKey(value)}
                  />
                </form>
              </div>
            </div>

            <hr className="mb-4" />
            <div className="row">
              <h5 className="wiget-title">Top Trends</h5>

              <ul className="lh-lg list-inline mb-0 text-primary-hover hot-topics">
                {topTrends.map((group: any, index: any) => (
                  <li className="list-inline-item" key={group.uid || index}>
                    <Link
                      href={`/${langCode}/search/${group.s_name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      legacyBehavior
                    >
                      <a
                        style={{ textDecoration: "none", position: "relative", cursor: 'pointer' }}
                      >
                        {group.s_name.charAt(0).toUpperCase() + group.s_name.slice(1).toLowerCase()}
                        <span className="hover-line"></span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>

            <div style={{ marginTop: "20px" }}>
  <h5 className="wiget-title">Categories</h5>
  <ul className="lh-lg list-inline mb-0 text-primary-hover hot-topics" style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
    {allGroups.map((group: any) => {
      const filteredSubgroups = allsubGroups.filter((subgroup: any) => subgroup.groupid === group.uid && subgroup.groupid !== 23);
      const groupedSubgroups = filteredSubgroups.reduce((acc: any[], subgroup: any) => {
        const lastGroup = acc[acc.length - 1];
        if (!lastGroup || lastGroup.groupId !== subgroup.groupid) {
          acc.push({ groupId: subgroup.groupid, items: [subgroup] });
        } else {
          lastGroup.items.push(subgroup);
        }
        return acc;
      }, []);
      
      return (
        <li className="list-inline-item" key={group.uid} style={{ flex: '0 1 auto', margin: '10px' }}>
          <Link
            href={`/${langCode}/${group.groupname.toLowerCase().replace(/\s+/g, "-")}`}
            legacyBehavior
          >
            <a style={{ textDecoration: "none", position: "relative", fontSize: "14px", fontWeight: "bold" }}>
              {group.groupname}
              <span className="hover-line"></span>
            </a>
          </Link>

          <div style={{ marginTop: "10px" }}>
            <ul style={{
              display: 'flex',
              flexDirection: 'row',
              listStyleType: 'none',
              paddingLeft: '0',
              marginBottom: '0',
              overflow: 'hidden',
            }}>
              {groupedSubgroups.map(({ groupId, items }: any) => (
                <li key={groupId} style={{ margin: '0' }}>
                  <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0', textAlign: 'left', marginTop: '3px' }}>
                    {items.map((subgroup: any) => (
                      <li key={subgroup.uid} style={{ margin: '0', cursor: 'pointer', position: 'relative', top: '0px' }}>
                        <a
                          onClick={() => handleRouteList(subgroup)}
                          style={{ textDecoration: 'none' }}
                        >
                          {subgroup.uid === 21 || subgroup.uid === 20
                            ? subgroup.subgroupname.toUpperCase()
                            : capitalizeFirstLetter(subgroup.subgroupname)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {group.uid === 23 && (
              <li style={{ margin: '0' }}>
                <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0', textAlign: 'left' }}>
                  <li style={{ marginBottom: '5px', cursor: 'pointer' }}>
                    <a href={`/${langCode}/india/metrocities`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      Metro Cities
                    </a>
                    {metroCities.map((city: any) => (
                      <li style={{ marginBottom: '5px', cursor: 'pointer' }} key={city.uid || city.city_name}>
                        <a href={`/${langCode}/india/metrocities/${city.city_name.toLowerCase().replace(/\s+/g, "-")}`}>
                          {city.city_name}
                        </a>
                      </li>
                    ))}
                  </li>
                </ul>
              </li>
            )}

            <style>
              {`
                @media (max-width: 768px) {
                  .hot-topics {
                    flex-direction: row;
                  }
                }
              `}
            </style>
          </div>
        </li>
      );
    })}
  </ul>
</div>


              <style jsx>{`
                .hover-line {
                  position: absolute;
                  bottom: -2px;
                  left: 0;
                  width: 0;
                  height: 2px;
                  background-color: #eb0254; /* Or any other color you prefer */
                  transition: width 0.3s ease;
                }

                .hot-topics a:hover .hover-line {
                  width: 100%;
                }
              `}</style>

              <div className="container">
                <div
                  className="row"
                  style={{ display: "flex", marginTop: "20px" }}
                >
                  {/* Company Section */}
                  <div className="col-12 col-md-6 ">
                    <h5 className="widget-title" style={{ color: "white" }}>
                      Company
                    </h5>
                    <ul className="lh-lg list-inline mb-0 text-primary-hover hot-topics">
                      {links.map((link, index) => (
                        <li key={index} className="list-inline-item">
                          <a
                            href={link.href}
                            style={{
                              position: "relative",
                              textDecoration: "none",
                              color:
                                hoveredIndex === index ? "#eb0254" : "white",
                              display: "inline-block",
                              transition: "color 0.25s ease-out",
                            }}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                          >
                            {link.text}
                            <span
                              style={{
                                display: "block",
                                height: "2px",
                                backgroundColor: "#eb0254",
                                transform:
                                  hoveredIndex === index
                                    ? "scaleX(1)"
                                    : "scaleX(0)",
                                transition: "transform 0.25s ease-out",
                                transformOrigin: "bottom left",
                              }}
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Social Media Section */}
                  <div className="col-sm-6 col-lg-6 col-12 footer-box">
                    <div className="footer-box-content">
                      <h5
                        className="widget-title"
                        style={{ color: "white", textAlign: "center" }}
                      >
                        Social Media
                      </h5>
                      <ul
                        style={{
                          listStyleType: "none",
                          padding: 0,
                          margin: 0,
                          textAlign: "center",
                        }}
                      >
                        <li
                          style={{
                            display: "inline-block",
                            marginBottom: "15px",
                            marginRight: "20px",
                          }}
                        >
                          <a
                            target="_blank"
                            href="https://x.com/Peoplepluspres?t=RSgtZa3rJ4ZksyPXvwt5Ig&s=09"
                            rel="noopener noreferrer"
                          >
                            <FaSquareXTwitter
                              style={{
                                color: "#eb0254",
                                fontSize: "1.5rem",
                                transition: "transform 0.3s, color 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.color = "black")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.color = "#eb0254")
                              }
                            />
                          </a>
                        </li>

                        <li
                          style={{
                            display: "inline-block",
                            marginBottom: "15px",
                            marginRight: "20px",
                          }}
                        >
                          <a
                            target="_blank"
                            href="https://youtube.com/@peoplepluspress?si=nW-cBjQmVvVkftnD"
                            rel="noopener noreferrer"
                          >
                            <FaYoutube
                              style={{
                                color: "#eb0254",
                                fontSize: "1.5rem",
                                transition: "transform 0.3s, color 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.color = "#f70000")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.color = "#eb0254")
                              }
                            />
                          </a>
                        </li>

                        <li
                          style={{
                            display: "inline-block",
                            marginBottom: "15px",
                            marginRight: "20px",
                          }}
                        >
                          <a
                            target="_blank"
                            href="https://www.instagram.com/peoplepluspress_news/profilecard/?igsh=MWdyMW9mc2lxOXlieg"
                            rel="noopener noreferrer"
                          >
                            <FaInstagram
                              style={{
                                color: "#eb0254",
                                fontSize: "1.5rem",
                                transition: "transform 0.3s, color 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.color = "#f46c01")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.color = "#eb0254")
                              }
                            />
                          </a>
                        </li>

                        <li
                          style={{
                            display: "inline-block",
                            marginBottom: "15px",
                            marginRight: "20px",
                          }}
                        >
                          <a
                            target="_blank"
                            href="https://www.facebook.com/profile.php?id=61569346928265&mibextid=ZbWKwL"
                            rel="noopener noreferrer"
                          >
                            <FaFacebook
                              style={{
                                color: "#eb0254",
                                fontSize: "1.5rem",
                                transition: "transform 0.3s, color 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.color = "#0570e0")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.color = "#eb0254")
                              }
                            />
                          </a>
                        </li>

                        <li
                          style={{
                            display: "inline-block",
                            marginBottom: "15px",
                            marginRight: "20px",
                          }}
                        >
                          <a
                            target="_blank"
                            href="https://in.linkedin.com/"
                            rel="noopener noreferrer"
                          >
                            <FaLinkedin
                              style={{
                                color: "#eb0254",
                                fontSize: "1.5rem",
                                transition: "transform 0.3s, color 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.color = "#0a66c2")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.color = "#eb0254")
                              }
                            />
                          </a>
                        </li>

                        <li
                          style={{
                            display: "inline-block",
                            marginBottom: "15px",
                          }}
                        >
                          <a
                            target="_blank"
                            href="https://in.pinterest.com/peopleplusp/"
                            rel="noopener noreferrer"
                          >
                            <FaPinterest
                              style={{
                                color: "#eb0254",
                                fontSize: "1.5rem",
                                transition: "transform 0.3s, color 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.color = "#e60124")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.color = "#eb0254")
                              }
                            />
                          </a>
                        </li>

                        <li
                          style={{
                            display: "inline-block",
                            marginBottom: "15px",
                            marginRight: "20px",
                            marginLeft: "20px",
                          }}
                        >
                          <a
                            target="_blank"
                            href="https://whatsapp.com/channel/0029Vax7KlR11ulIc4MrKK25"
                            rel="noopener noreferrer"
                          >
                            <FaWhatsapp
                              style={{
                                color: "#eb0254",
                                fontSize: "1.5rem",
                                transition: "transform 0.3s, color 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.color = "#58cf63")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.color = "#eb0254")
                              }
                            />
                          </a>
                        </li>

                        <li
                          style={{
                            display: "inline-block",
                            marginBottom: "15px",
                            marginRight: "20px",
                         
                          }}
                        >
                          <a
                            target="_blank"
                            href="https://t.me/peoplepluspress"
                            rel="noopener noreferrer"
                          >
                            <FaTelegram
                              style={{
                                color: "#eb0254",
                                fontSize: "1.5rem",
                                transition: "transform 0.3s, color 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.color = "#2fabea")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.color = "#eb0254")
                              }
                            />
                          </a>
                        </li>

                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* *** END OF /. FOOTER *** */}

        {/* *** START SUB FOOTER *** */}
        <div
          className="sub-footer"
          style={{ backgroundColor: "#333", padding: "10px 0" }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{ color: "white", display: "flex", alignItems: "center" }}
            >
              {`Copyright © ${new Date().getFullYear()} `}
              <Typography
                sx={{ ml: 1 }}
                target="_blank"
                href="https://www.laabamone.com/"
                component={StyledName}
              >
                PeoplePlus Press
              </Typography>
              {` [P] Ltd. All Rights Reserved`}
            </Typography>
            <div className="col-sm-auto">
              <ul
                className="footer-nav list-unstyled mb-0"
                style={{
                  display: "flex",
                  gap: "15px",
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                }}
              >
                <Typography
                  sx={{ color: "white", display: "flex", alignItems: "center" }}
                >
                  {` Powered By`}
                  <Typography
                    sx={{ ml: 1 }}
                    target="_blank"
                    href="https://www.laabamone.com/"
                    component={StyledCompanyName}
                  >
                    LaabamOne.
                  </Typography>
                </Typography>
              </ul>
            </div>
          </div>
        </div>
      </div>
    
    </>
  );
};

export default Footer;
