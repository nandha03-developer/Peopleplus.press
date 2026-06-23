import Link from "next/link"
import { IoLogoFacebook } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaPinterest } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from "react";
import {WiDaySunny,WiDayCloudy,WiDayRain,WiDaySnow,WiNightClear,WiNightAltCloudy, WiNightAltRain,WiNightAltSnow, WiNightAltThunderstorm,WiDayThunderstorm,
} from "weather-icons-react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa6";

const HeaderTop = ({weatherData, aqiIcon, weatherIcon, location}: any) => {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const formattedDate = date.toLocaleDateString(undefined, options);
        setCurrentDate(formattedDate);
      }, []);

      const getWeatherIcon = (weatherCondition: any) => {
        const isDayTime = () => {
          const currentHour = new Date().getHours();
          return currentHour >= 6 && currentHour < 18; // Day time is between 6 AM and 6 PM
        };
    
        const dayIcons: any = {
          Clear: <WiDaySunny size={30} />,
          Clouds: <WiDayCloudy size={30} />,
          Rain: <WiDayRain size={30} />,
          Snow: <WiDaySnow size={30} />,
          Thunderstorm: <WiDayThunderstorm size={30} />,
          Default: <WiDayCloudy size={30} />,
        };
    
        const nightIcons: any = {
          Clear: <WiNightClear size={30} />,
          Clouds: <WiNightAltCloudy size={30} />,
          Rain: <WiNightAltRain size={30} />,
          Snow: <WiNightAltSnow size={30} />,
          Thunderstorm: <WiNightAltThunderstorm size={30} />,
          Default: <WiNightAltCloudy size={30} />,
        };
    
        const icon = isDayTime()
          ? dayIcons[weatherCondition]
          : nightIcons[weatherCondition];
    
        return icon || (isDayTime() ? dayIcons["Default"] : nightIcons["Default"]);
      };

      const [mobileScreen, setMobileScreen] = useState(false);
      window.addEventListener('resize', function () {
        const mobile = window.innerWidth <= 768;
        setMobileScreen(mobile)
      });

    return (
        <div className="d-flex top-left-menu">
        <ul className="align-items-center d-flex flex-wrap">
          <li>
            <div className="header-social" style={{ marginTop: "5px" }}>
              <ul className="align-items-center d-flex gap-3">
                <li style={{}}>
                  <Link
                    target="_blank"
                    href="https://www.facebook.com/profile.php?id=61569346928265&mibextid=ZbWKwL"
                  >
                    <div style={{ marginBottom: "3px" }}>
                      <IoLogoFacebook />
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    target="_blank"
                    href="https://www.instagram.com/peoplepluspress_news/profilecard/?igsh=MWdyMW9mc2lxOXlieg"
                  >
                    <div style={{ marginBottom: "3px" }}>
                      <FaInstagram />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://youtube.com/@peoplepluspress?si=nW-cBjQmVvVkftnD"
                  >
                    <div style={{ marginBottom: "3px" }}>
                      <FaYoutube />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://x.com/Peoplepluspres?t=RSgtZa3rJ4ZksyPXvwt5Ig&s=09"
                  >
                    <div style={{ marginBottom: "3px" }}>
                      <BsTwitterX />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://in.linkedin.com/"
                  >
                    <div style={{ marginBottom: "3px" }}>
                      <FaLinkedin />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://in.pinterest.com/peopleplusp/"
                  >
                    <div style={{ marginBottom: "3px" }}>
                      <FaPinterest />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://whatsapp.com/channel/0029Vax7KlR11ulIc4MrKK25"
                  >
                    <div style={{ marginBottom: "3px" }}>
                      <FaWhatsapp />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://t.me/peoplepluspress"
                  >
                    <div style={{ marginBottom: "3px" }}>
                      <FaTelegram />
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </li>

{mobileScreen ? ("") : (
 <div
 style={{
   display: "flex",
   alignItems: "center",
   fontWeight: "600",
   textTransform: "uppercase",
   marginTop: "5px",
 }}
>
 <div
   style={{
     width: "2px",
     height: "15px",
     borderLeft: "1px solid white",
   }}
 />
 <span
   style={{
     color: "white",
     marginLeft: "5px",
     fontSize: "13px ",
   }}
 >
   {currentDate}
 </span>
 <div
   style={{
     width: "2px",
     height: "15px",
     borderLeft: "1px solid white",
     marginLeft: "10px",
   }}
 />
 <div
   style={{
     display: "flex",
     alignItems: "center",
     fontWeight: "600",
     textTransform: "uppercase",
     marginLeft: "10px",
     color: "white",
     fontSize: "13px ",
   }}
 >
   {getWeatherIcon(weatherIcon)}
   <span>
     {location}&nbsp;{weatherData}&deg;C
   </span>
   <div
     style={{
       marginLeft: "10px",
       width: "2px",
       height: "15px",
       borderLeft: "1px solid white",
     }}
   />
   <span style={{ marginLeft: "5px" }}>
     Air: {aqiIcon}
   </span>
 </div>
</div>
)}
         

        </ul>
      </div>
    )
}
export default HeaderTop