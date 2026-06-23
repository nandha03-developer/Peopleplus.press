import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/languageContext";
import { FaUserEdit } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

const HeaderTopRight = ({languageCode, handleLanguageChange, loading, customerData, handleLogoutClick}: any) => {
    const { langCode, setLangCode } = useLanguage();
    const lang = langCode;
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const upperCaseLanguageCode = languageCode.toUpperCase();
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const handleProfileClick = () => {
        setDropdownVisible(!dropdownVisible);
      };
    
      const handleEditProfile = () => {
        router.push(`/${langCode}/profile-edit`);
        setDropdownVisible(false);
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownVisible(false);
        }
      };
    
      useEffect(() => {
        if (dropdownVisible) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [dropdownVisible]);
    
    
    return (
        <div className="header-right-menu">
        <ul className="d-flex justify-content-end" >
          <li className="d-md-block d-block" style={{ marginRight: '-2px' }}>
            <div className="dropdown language-dropdown" style={{ marginTop: "10px" }}>
              <button
                className="btn p-0 dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-solid fa-earth-americas" />

                <div
                  className="fw-semibold"
                  style={{ color: "white" }}
                >
                  {upperCaseLanguageCode}
                </div>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a
                    onClick={() => handleLanguageChange("en")}
                    className={`dropdown-item ${languageCode === "en" ? "active" : ""
                      }`}
                    href="/en"
                    target="_blank"
                  >
                    <Image
                      src="/assets/images/English_icon.png"
                      alt="pp"
                      width={22}
                      height={23}
                    />
                    <span className="language-text">EN</span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => handleLanguageChange("ta")}
                    className={`dropdown-item ${languageCode === "ta" ? "active" : ""
                      }`}
                    href="/ta"
                    target="_blank"
                  >
                    <Image
                      src="/assets/images/Tamil_icon.png"
                      alt="pp"
                      width={25}
                      height={25}
                    />
                    <span className="language-text">TA</span>
                  </a>
                </li>
                <li>
                  <Link
                    // onClick={() => handleLanguageSelect('HI')}
                    className={`dropdown-item ${languageCode === "hi" ? "active" : ""
                      }`}
                    href="/hi"
                    target="_blank"
                  >
                    <Image
                      src="/assets/images/Hindi_icon.png"
                      alt="pp"
                      width={25}
                      height={25}
                    />
                    <span className="language-text">HI</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            {loading ? (
              <div></div> // Optional: Show loading indicator while data is being fetched
            ) : customerData ? (
              <div style={{ position: 'relative' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={handleProfileClick}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#24252f', // Placeholder background color
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '10px',
                  }}>
                    {customerData.profileimage ? (
                     <Image
                     src={customerData.profileimage}
                     alt={`${customerData.firstname}'s profile`}
                     width={45} // Specify the width in pixels
                     height={45} // Specify the height in pixels
                     style={{
                       borderRadius: '50%',
                       objectFit: 'cover',
                     }}
                   />
                    ) : (
                      <div style={{
                        fontSize: '17px',
                        fontWeight: 'bold',
                        color: '#24252f',
                        backgroundColor: 'white', // Background color for initials
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        {customerData.firstname.charAt(0).toUpperCase()}
                        {customerData.lastname.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span style={{ fontWeight: "bold", marginTop: "5px" }}>
                    Welcome, {customerData.firstname}
                  </span>
                </div>
                {dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      backgroundColor: '#fff',
                      border: '2px solid #24252f',
                      borderRadius: '6px',
                      boxShadow: '0 1px 4px #24252f',
                      zIndex: '1000',
                      marginTop: '11px',
                      minWidth: '160px',
                    }}
                  >
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '10px',
                        border: 'none',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        fontSize: '16px',
                        borderBottom: '2px solid #24252f',
                        gap: '10px',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                        color: '#000',
                      }}
                      onClick={handleEditProfile}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#eb0254';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#000';
                      }}
                    >
                      <FaUserEdit style={{ fontSize: '22px' }} />
                      Edit Profile
                    </button>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '10px',
                        border: 'none',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        fontSize: '16px',
                        gap: '10px',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                        color: '#000',
                      }}
                      onClick={handleLogoutClick}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#eb0254';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#000';
                      }}
                    >
                      <IoIosLogOut style={{ fontSize: '22px' }} />
                      Logout
                    </button>
                  </div>
                )}
              </div>

            ) : (
              <div style={{ marginTop: "9px", fontSize: "13px" }}>
                <ul>
                  <li>
                    <Link href={`/${lang}/page-signup`}>
                      <span style={{ color: "white" }}>
                        <i
                          style={{ color: "white" }}
                          className="fa fa-lock"
                        />{" "}
                        Sign Up
                      </span>
                    </Link>
                    <span style={{ fontWeight: "bold" }}> or </span>
                    <Link href={`/${lang}/page-login`}>
                      <span style={{ color: "white" }}>Login</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    )
}
export default HeaderTopRight