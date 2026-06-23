import React, { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";
import "../../../app/page.module.css";
import { useCookies } from "react-cookie";
import CookieConsent from "@/components/cookieConsent";
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [cookies] = useCookies(["cookieConsent"]);
  return (
    <>
      <div>
        <div>
          <Header />
        </div>
        {children}
        {/* {!cookies.cookieConsent && <CookieConsent />} */}
        <div>
          <Footer />
        </div>
      </div>

    </>
  );
}
