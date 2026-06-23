import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/context/languageContext";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SideBar = ({isSidebarActive, logo, customerData, handleLogoutClick, showPopup, setShowPopup}: any) => {
    const { langCode, setLangCode } = useLanguage();
  const lang = langCode;
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const router = useRouter();

  const navItems = [
    { href: `/${lang}/about`, text: "About" },
    { href: `/${lang}/saved`, text: "Saved" },
    { href: `/${lang}/`, text: "Latest News" },
    { href: `/${lang}/india`, text: "India" },
    { href: `/${lang}/world`, text: "World" },
    { href: `/${lang}/politics`, text: "Politics" },
    { href: `/${lang}/sports`, text: "Sports" },
    { href: `/${lang}/education`, text: "Education" },
    { href: `/${lang}/business`, text: "Business" },
    { href: `/${lang}/entertainment`, text: "Entertainment" },
    { href: `/${lang}/automobile`, text: "Automobile" },
    { href: `/${lang}/lifestyle/health`, text: "Health" },
    { href: `/${lang}/lifestyle`, text: "Lifestyle" },
    { href: `/${lang}/business/stock-market`, text: "Stock Market" },
    { href: `/${lang}/business/economy`, text: "Economy" },
    { href: `/${lang}/technology`, text: "Technology" },
    { href: `/${lang}/union-territories`, text: "Union-Territories" },
    { href: `/${lang}/videos`, text: "Videos" },
  ];

   // Function to handle mouse enter event
   const onMouseEnterHandler: any = (e: {
    currentTarget: {
      style: { color: string };
      children: { style: { transform: string } }[];
    };
  }) => {
    e.currentTarget.style.color = "#eb0254";
    e.currentTarget.children[0].style.transform = "scaleY(1)";
  };

  // Function to handle mouse leave event
  const onMouseLeaveHandler: any = (e: {
    currentTarget: {
      style: { color: string };
      children: { style: { transform: string } }[];
    };
  }) => {
    e.currentTarget.style.color = "black";
    e.currentTarget.children[0].style.transform = "scaleY(0)";
  };

  const handleMouseEnter = () => {
    if (linkRef.current) {
      linkRef.current.style.color = "#eb0254";
      const span = linkRef.current.querySelector("span");
      if (span && span instanceof HTMLElement) {
        span.style.transform = "scaleY(1)";
      }
    }
  };

  const handleMouseLeave = () => {
    if (linkRef.current) {
      linkRef.current.style.color = "black";
      const span = linkRef.current.querySelector("span");
      if (span && span instanceof HTMLElement) {
        span.style.transform = "scaleY(0)";
      }
    }
  };

  const handleConfirm = () => {
    localStorage.removeItem('cusId');
    toast.success("You have been logged out successfully!");
    setShowPopup(false);
    router.replace(`/${lang}`);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const navItemStyle: React.CSSProperties = {
    position: "relative",
    paddingLeft: "25px",
  };

  const linkStyle: React.CSSProperties = {
    cursor: "pointer", // Add cursor pointer for the link
    textDecoration: "none",
    color: "#333",
    fontSize: "17px",
    fontWeight: "bold",
  };

  const logoutIndicatorStyle: React.CSSProperties = {
    content: "",
    position: "absolute",
    left: "-15px",
    top: "50%",
    height: "50%",
    width: "5px",
    backgroundColor: "#eb0254",
    transform: "translateY(-50%) scaleY(0)",
    transition: "transform 0.3s ease",
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const popupStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "90%",
    maxWidth: "500px",
    height: "auto",
    maxHeight: "80vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const headerStyle: React.CSSProperties = {
    margin: "0",
    fontSize: "20px",
    color: "#333",
  };

  const messageStyle: React.CSSProperties = {
    margin: "15px 0",
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.5",
  };

  const buttonContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  };

  const cancelButtonStyle: React.CSSProperties = {
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "none",
    padding: "12px 24px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  const confirmButtonStyle: React.CSSProperties = {
    backgroundColor: "#eb0254",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };
  
    return (
        <nav
        style={{ backgroundColor: "white" }}
        id="sidebar"
        className={isSidebarActive ? "active p-4" : "p-4"}
      >
        <div id="dismiss">
          <i className="fas fa-arrow-left" />
        </div>
        <div className="d-flex flex-column h-100">
          <div className="">
            <Link href={`/${lang}`} className="header-logo" style={{ marginTop: "10px" }}>
              <Image
                src={logo}
                alt="PeoplePlus"
                width={206}
                height={67}
              />
            </Link>
            <p style={{ color: "black", marginTop: "10px" }}>
              Stay updated with People Plus Press, delivering the latest news
              on politics, sports, education, business, and more. Reliable,
              timely information.
            </p>
          </div>
          <hr style={{ border: "1px solid black", marginTop: "10px" }} />
          <div style={{ padding: "0px 15px", color: "black" }}>
            <ul className="nav d-block flex-column">
              {navItems.map((item, index) => (
                <li
                  className="nav-item h5"
                  key={index}
                  style={{ position: "relative", paddingLeft: "25px" }}
                >
                  <Link
                    href={item.href}
                    className="nav-link"
                    style={{
                      color: "black",
                      position: "relative",
                      textDecoration: "none",
                    }}
                    onMouseEnter={onMouseEnterHandler}
                    onMouseLeave={onMouseLeaveHandler}
                  >
                    {item.text}
                    <span
                      style={{
                        content: "",
                        position: "absolute",
                        left: "-10px",
                        top: "0",
                        height: "100%",
                        width: "5px",
                        backgroundColor: "#eb0254",
                        transform: "scaleY(0)",
                        transition: "transform 0.3s ease",
                      }}
                    ></span>
                  </Link>
                </li>
              ))}
              <hr style={{ border: "1px solid black", marginTop: "20px" }} />
              <ul className="nav d-block flex-column">
                <li
                  className="nav-item h5"
                  style={{ position: "relative", paddingLeft: "25px" }}
                >
                  <Link href={`/${lang}/contact`} legacyBehavior>
                    <a
                      className="nav-link custom-nav-link"
                      style={{
                        color: "black",
                        position: "relative",
                        textDecoration: "none",
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      Contact Us
                      <span
                        style={{
                          content: "",
                          position: "absolute",
                          left: "-10px",
                          top: "0",
                          height: "100%",
                          width: "5px",
                          backgroundColor: "#eb0254",
                          transform: "scaleY(0)",
                          transition: "transform 0.3s ease",
                        }}
                      ></span>
                    </a>
                  </Link>
                </li>
                <li
                  className="nav-item h5"
                  style={{ position: "relative", paddingLeft: "25px" }}
                >
                  <Link href={`/${lang}/terms-and-condition`} legacyBehavior>
                    <a
                      className="nav-link custom-nav-link"
                      style={{
                        color: "black",
                        position: "relative",
                        textDecoration: "none",
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      Terms And Condition
                      <span
                        style={{
                          content: "",
                          position: "absolute",
                          left: "-10px",
                          top: "0",
                          height: "100%",
                          width: "5px",
                          backgroundColor: "#eb0254",
                          transform: "scaleY(0)",
                          transition: "transform 0.3s ease",
                        }}
                      ></span>
                    </a>
                  </Link>
                </li>
                <li
                  className="nav-item h5"
                  style={{ position: "relative", paddingLeft: "25px" }}
                >
                  <Link href={`/${lang}/privacy-policy`} legacyBehavior>
                    <a
                      className="nav-link custom-nav-link"
                      style={{
                        color: "black",
                        position: "relative",
                        textDecoration: "none",
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      Privacy Policy
                      <span
                        style={{
                          content: "",
                          position: "absolute",
                          left: "-10px",
                          top: "0",
                          height: "100%",
                          width: "5px",
                          backgroundColor: "#eb0254",
                          transform: "scaleY(0)",
                          transition: "transform 0.3s ease",
                        }}
                      ></span>
                    </a>
                  </Link>
                </li>
                <div>
                  {customerData ? (
                    <div className="nav-item h5" style={navItemStyle}>
                      <a
                        onClick={handleLogoutClick}
                        style={linkStyle}
                        className="nav-link custom-nav-link"
                      >
                        Logout
                        <span style={logoutIndicatorStyle}></span>
                      </a>
                    </div>
                  ) : (
                    <div>
                    </div>
                  )}
                  {showPopup && (
                    <div style={overlayStyle}>
                      <div style={popupStyle}>
                        <h2 style={headerStyle}>Confirm Logout</h2>
                        <p style={messageStyle}>
                          Are you sure you want to log out?
                        </p>
                        <div style={buttonContainerStyle}>
                          <button
                            style={cancelButtonStyle}
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                          <button
                            style={confirmButtonStyle}
                            onClick={handleConfirm}
                          >
                            Yes, Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ul>
            </ul>
          </div>
        </div>
      </nav>
    )
}
export default SideBar