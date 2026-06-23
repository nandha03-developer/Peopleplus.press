"use client";
import { Padding } from "@mui/icons-material";
import { backdropClasses, colors } from "@mui/material";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useLanguage } from "@/context/languageContext";

const CookieConsent = () => {
  const { langCode, setLangCode } = useLanguage();
  const [cookies, setCookie] = useCookies(["cookieConsent"]);
  const giveCookieConsent = () => {
    setCookie("cookieConsent", true, { path: "/" });
  };

  const consentStyle: any = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#24252f",
    borderTop: "1px solid black",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    fontSize: "16px",
  };

  const acceptButton: any = {
    backgroundColor: "#eb0254",
    color: "white",
    border: "none",
    marginLeft: "10px",
    padding: "5px 10px",
    borderRadius: "5px",
  };

  return (
    <div style={consentStyle}>
      <div style={{ color: 'white' }}>
        <div>
          This website uses cookies to improve functionality and enhance services. By clicking &quot;Accept,&quot; you consent to our use of cookies.{" "} Read more about our
          <a style={{ color: '#eb0254' }} href={`/${langCode}/privacy-policy`}> policy.</a>
        </div>
      </div>
      <button style={acceptButton} onClick={giveCookieConsent}>
        Accept
      </button>
    </div>
  );
};

export default CookieConsent;
