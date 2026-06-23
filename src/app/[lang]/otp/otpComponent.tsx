"use client";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import OtpInputGroup from "./otpInputfield";
import Lottie from "lottie-react";
import axios from "axios";
import animationData from "../../../../public/assets/animatedJson/Animation - 1722075853821 (1).json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRegister from "@/hooks/useRegister";
import AlarmIcon from '@mui/icons-material/Alarm';
import { useLanguage } from "@/context/languageContext";

interface FormData {
  email: string;
  password: string;
  name: string;
}

interface InputValues {
  input1: string;
  input2: string;
  input3: string;
  input4: string;
  input5: string;
  input6: string;
}

const Otp = () => {
  const { langCode } = useLanguage();
  const router = useRouter();
  const { confirm, resendOtp, loading } = useRegister();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '', name: '' });
  const [cusId, setCusId] = useState()
  const [inputValues, setInputValues] = useState<InputValues>({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });
  const [verifyLoading, setVerifyLoading] = useState(false); // Added loading state
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
    const customerId = localStorage.getItem('cusId');
        if (customerId) {
            setCusId(JSON.parse(customerId));  
        }
  }, []);
  

  const username = localStorage.getItem('signupemail') || '';

  const encrypt = (value: string, key: string): string => {
    let encrypted = ''
    for (let i = 0; i < value.length; i++) {
      encrypted += String.fromCharCode(value.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
  
    return btoa(encrypted)
  }

  const handleContinueClick = async () => {
    const otpValue = getOTPValue();
    const { email, password, name } = formData;
    setVerifyLoading(true); // Set loading to true
    try {
      const encryptedOtp = encrypt(otpValue, 'people@123plus')
      const otpVerificationResponse = await axios.get(`/cognito?operation=cognito_verify_otp&email=${email}&confirmation_code=${encodeURIComponent(encryptedOtp)}`);
      if (otpVerificationResponse.status === 200) {
        if (cusId) {
          const updateResponse = await axios.put(`/api/customer/${cusId}`, {
            iseverified: true
          });
          if (updateResponse.status === 200) {
            localStorage.setItem("iseverified", "true");
            toast.success("Success");
              router.push(`/${langCode}/profile`);
          } else {
              toast.error("Failed to update customer information");
          }
      } else {
          console.error("Customer ID not found in local storage");
      }
      } else {
        toast.error("OTP Verification failed. Please try again later");
      }
    } catch (error: any) {
      console.error('Error occurred:', error);
      toast.error(error.response.data);
    } finally {
      setVerifyLoading(false); // Set loading to false
    }
  };

  const getOTPValue = () => Object.values(inputValues).join("");

  const handleResendCode = async () => {
    if (!canResend) return;
    setSeconds(130); // Reset to initial time
    setIsActive(true); // Start the timer again
    setCanResend(false);
    try {
      const encryptedPassword = encrypt(formData.password, 'people@123plus')
      const response = await axios.get(`/signup?operation=cognito_signup&email=${formData.email}&password=${encodeURIComponent(encryptedPassword)}`);
      if(response.status === 200){
        toast.success("OTP sent to your mail. Please check.");
      }
    } catch (error: unknown) {
      console.error("Error occurred:", error);
  
      if (error instanceof Error) {
        if (axios.isAxiosError(error)) {
          toast.error(`Axios Error: ${error.response?.data?.message || "Please try again later"}`);
        } else {
          toast.error(`Error: ${error.message || "Please try again later"}`);
        }
      } else {
        toast.error("An unknown error occurred. Please try again later.");
      }
    }
  };  
  
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.8);
    }
  }, []);

  const backgroundOverlayStyles: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };    

  const [seconds, setSeconds] = useState(130); // Initial timer value
  const [isActive, setIsActive] = useState(true); // Timer active state
  const [canResend, setCanResend] = useState(false); // Button enabled state

  useEffect(() => {
    if (seconds <= 0) {
      setIsActive(false);
      setCanResend(true); // Enable resend button when timer runs out
      return;
    }

    const interval = setInterval(() => {
      if (isActive) {
        setSeconds(prevSeconds => prevSeconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, isActive]);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <>
      <section style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ display: "flex" }}>
          <div className="login-left" style={{ width: "100%", height: "50%" }}>
            <Lottie
              animationData={animationData}
              lottieRef={lottieRef}
              loop
              autoplay
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="pt-70" style={{}}>
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="box-signup" style={{ width: "80%", textAlign: "center", marginTop: "80px", backgroundColor: "#f4d5e0", borderRadius: "10px", marginLeft: "auto", marginRight: "auto", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <h1 className="text-heading-3 mb-20" style={{ fontSize: "24px", fontWeight: "bold" }}>
                  Verify Your Account
                </h1>
                <p style={{ fontSize: "16px", marginBottom: "30px" }}>
                  We have sent your verification link to <span style={{ fontWeight: "bold" }}>{formData.email}</span>
                </p>
                <p style={{ fontSize: "16px", marginBottom: "10px" }}>Enter Code</p>
                <div className="form-field mb-50" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <OtpInputGroup
                    setInputValues={setInputValues}
                    inputValues={inputValues}
                    style={{ width: "70%" }}
                    inputStyle={{
                      border: "1px solid red",
                      borderRadius: "4px",
                      padding: "10px",
                      margin: "5px",
                    }}
                  />
                </div>
                {/* <AlarmIcon style={{ marginRight: '8px', color: '#333' }} /> */}
                <p>Time left: {formatTime(seconds)}</p>
                <p
                  className="text-heading-6 mb-20"
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Didn&apos;t receive the OTP?
                  <span
                    onClick={handleResendCode}
                    style={{
                      fontSize: '14px',
                      cursor: canResend ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      color: canResend ? '#eb0254' : 'grey',
                      marginLeft: '5px',
                    }}
                  >
                    Resend
                  </span>
                </p>
                <div className="form-group" style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    className="btn btn-square verify-button"
                    onClick={handleContinueClick}
                    style={{ padding: "10px 20px", fontSize: "16px", fontWeight: "bold", color: "#fff", backgroundColor: "#eb0254", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    disabled={verifyLoading} // Disable button when loading
                  >
                    {verifyLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm" role="status" style={{ marginRight: "8px" }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Otp;
