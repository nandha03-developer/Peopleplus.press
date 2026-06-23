"use client"

import React, { useEffect,useRef, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import OtpInputGroup from "../otp/otpInputfield";
import { useRouter,useSearchParams } from "next/navigation";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import Layout from "@/components/ltr/layout/layout";
import { useLanguage } from "@/context/languageContext";
import Lottie from "lottie-react";
import animationData from "../../../../public/assets/animatedJson/Animation - 1726650762123(res).json";
import { ClipLoader } from 'react-spinners'; // Example spinner from react-spinners

const ResetPassword = ({params}:any) => {
    const { langCode } = useLanguage();
  const child=params.headerStyle;
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');
  const [reSendOtpLoading, setReSendOtpLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [inputValues, setInputValues] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });
  const [passwords, setPasswords] = useState<any>({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    otp: "",
    continue: ""
  });
  const toastConfig = {
    position: "top-right",
    autoClose: 2000, // Adjust the time duration here (2000ms = 2 seconds)
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };
  const getOTPValue = () => {
    const otpValuesArray = Object.values(inputValues);
    const otpValue = otpValuesArray.join("");
    return otpValue;
  };

  const handleChange = (e: any) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  
const validateForm = (formData: FormData) => {
  const errors: any = {};
  if (!passwords.confirmPassword.trim()) {
    errors.confirmPassword = "Password is required";
  } else if (passwords.confirmPassword.length < 8) {
    errors.confirmPassword = "Password must be at least 8 characters long";
  } else if (!/[A-Z]/.test(passwords.confirmPassword)) {
    errors.confirmPassword = "Password must include at least one uppercase letter";
  } else if (!/[a-z]/.test(passwords.confirmPassword)) {
    errors.confirmPassword = "Password must include at least one lowercase letter";
  } else if (!/[0-9]/.test(passwords.confirmPassword)) {
    errors.confirmPassword = "Password must include at least one number";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwords.confirmPassword)) {
    errors.confirmPassword = "Password must include at least one special character";
  }
  return errors;
};

const encrypt = (value: string, key: string): string => {
  let encrypted = ''
  for (let i = 0; i < value.length; i++) {
    encrypted += String.fromCharCode(value.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  // Encode the encrypted string using Base64 to make it URL-safe
  return btoa(encrypted)
}

const handleSubmit = async (e: any) => {
    e.preventDefault();
    let isValid = true;
    let newErrors = { ...errors };
    
    if (passwords.newPassword.trim() === "") {
        newErrors.newPassword = "New password is required";
        isValid = false;
    } else {
        newErrors.newPassword = "";
    }

    if (passwords.confirmPassword.trim() === "") {
        newErrors.confirmPassword = "Confirm password is required";
        isValid = false;
    } else if (passwords.newPassword !== passwords.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
    } else {
        newErrors.confirmPassword = "";
    }
    const error = validateForm(passwords);
    if (Object.keys(error).length !== 0) {
      setErrors(error);
      //setLoading(false);
      return;
    }
    if (isValid) {
        const otpValue = getOTPValue();

        try {
          const encryptedOtp = encrypt(otpValue, 'people@123plus')
          const encryptedPassword = encrypt(passwords.newPassword, 'people@123plus')
            const response = await axios.get(`/cognito?operation=cognito_forgotpassword_confirm&email=${email}&confirmation_code=${encodeURIComponent(encryptedOtp)}&new_password=${encodeURIComponent(encryptedPassword)}`);
            if(response.status == 200){
                router.push(`/${langCode}/page-login`)
            }
            // const data = response.data;
            // toast.success("Password Reset Successful");
            // const query = new URLSearchParams({ reset: 'true' }).toString();
            // router.push(`/page-login?${query}`);
        } catch (error :any) {
          if(error.response.data === "An error occurred (ExpiredCodeException) when calling the ConfirmForgotPassword operation: Invalid code provided, please request a code again."){
            let newError = { ...errors };
            newError.otp = "OTP is Expired.please request a code again!";
            newError.confirmPassword = "";
            setErrors(newError);
           // setErrors({confirmPassword });
          }
          else if(error.response.data === "Invalid length for parameter ConfirmationCode, value: 0, valid min length: 1"){
            let newError = { ...errors };
            newError.otp = "OTP is Empty.OTP should not be empty";
            newError.confirmPassword = "";
            setErrors(newError);
          }
          else if(error.response.data === "An error occurred (CodeMismatchException) when calling the ConfirmForgotPassword operation: Invalid verification code provided, please try again."){
            let newError = { ...errors };
            newError.otp = "OTP is Invalid.pls provide valid OTP";
            newError.confirmPassword = "";
            setErrors(newError);
          }
         else{
          let newError = { ...errors };
            newError.confirmPassword = "Failed. Please try again.";
            
            setErrors(newError);
            toast.error("Failed. Please try again.");
         }
        }
    } else {
        setErrors(newErrors);
    }
};

  const handleResendCode = async () =>{
    try {
      setReSendOtpLoading(true);

      const response = await axios.get(`/cognito_forgotpassword?email=${email}`);
      setTimeLeft(120);
      setTimerActive(true);
      setInputValues({
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        input5: "",
        input6: "",
      });
      setReSendOtpLoading(false);

      toast.success("OTP sent to your mail");
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setTimerActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error("OTP Send failed. Please try again.");
    }
  };
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
  }, [timeLeft, timerActive]);
  

  function handleContinueClick(): void {
    throw new Error("Function not implemented.");
  }

  
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const lottieRef = useRef(null);
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current;
    }
  }, []);

  const background: React.CSSProperties = {
    display: "flex",
   }

   const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
<Layout>

<div style={background}>
       <div
      className="login-left"
      style={{
        width: "50%",
        height: "30%",
        display: isMobile ? 'none' : 'flex',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie
        animationData={animationData}
        lottieRef={lottieRef}
        loop
        autoplay
        style={{ width: "80%", height: "80%", marginTop: "5%" }} // Adjust marginTop to move the animation up
      />
    </div>

  <section className="section-box">
    <div className="bg-6-opacity-30" style={{ marginTop: "-15%" }}>
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
          }}
        >
          <div
                       style={{
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        backgroundColor: '#24252f',
                        width: '100%',
                        maxWidth: '480px',
                        margin: '0 auto',
                        boxSizing: 'border-box',
                        height: 'auto',
                      }}
          
          >
            <h1
              className="text-heading-3 mb-50 text-center"
              style={{ color: '#fff' }}
            >
              Change Password
            </h1>
            <div className="box-form-signup" style={{ padding: '20px' }}>
              <div className="form-group">
                <span style={{ color: 'white', fontSize: '15px' }}>
                  OTP verification code sent to &nbsp;
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 'bold',
                      color: '#eb0254',
                    }}
                  >
                    {email}
                  </span>
                </span>

                <div className="form-group text-center">
                  <span
                    style={{
                      color: 'white',
                      display: 'block',
                      marginBottom: '10px',
                      fontSize: '20px',
                      marginTop: '5px',
                    }}
                  >
                    Enter code
                  </span>
                  <OtpInputGroup
                    setInputValues={setInputValues}
                    inputValues={inputValues}
                    handleContinueClick={handleContinueClick}
                    ststyle={{
                      border: '3px solid #eb0254',
                      width: '100%',
                      marginTop: '20px',
                      backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                      color: isDarkMode ? '#000' : '#333',
                    }}
                  />
                  {errors.otp && (
                    <span className="form-error-handling">
                      {errors.otp}
                    </span>
                  )}
                  <p
                    className="text-heading-6 mb-20"
                    style={{
                      fontSize: '14px',
                      display: 'flex',
                      justifyContent: 'left',
                      alignItems: 'center',
                      color: 'white',
                    }}
                  >
                    Didn&apos;t receive the OTP?
                    <span
                      onClick={
                        reSendOtpLoading || timerActive
                          ? undefined
                          : handleResendCode
                      }
                      style={{
                        fontSize: '14px',
                        cursor: reSendOtpLoading || timerActive ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        color: '#eb0254',
                        marginLeft: '5px',
                      }}
                    >
                      {reSendOtpLoading ? (
                        'sending...'
                      ) : timerActive ? (
                        <strong>
                          {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                            .toString()
                            .padStart(2, '0')}`}
                        </strong>
                      ) : (
                        'Resend'
                      )}
                    </span>
                  </p>
                </div>

                <div
                  style={{
                    position: 'relative',
                    marginBottom: '20px', // Space between input fields
                  }}
                >
                  <input
                    className="form-control input-green-bd input-with-icon"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    style={{
                      border: '1px solid #eb0254',
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      paddingRight: '40px', // Space for the icon
                      backgroundColor: isDarkMode ? '#fff' : '#fff', // White background in dark mode
          color: isDarkMode ? '#000' : '#000', // Black text in dark mode
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '10px', // Adjust this value as needed
                      top: '50%',
                      transform: 'translateY(-50%)', // Center the icon vertically
                      cursor: 'pointer',
                      zIndex: 1, // Ensure the icon appears above the input field
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                </div>

                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <input
                    className="form-control input-green-bd input-with-icon"
                    type={confirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    style={{
                      border: '1px solid #eb0254',
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      paddingRight: '40px', // Space for the icon
                      backgroundColor: isDarkMode ? '#fff' : '#fff', // White background in dark mode
          color: isDarkMode ? '#000' : '#000', // Black text in dark mode
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '10px', // Adjust this value as needed
                      top: '50%',
                      transform: 'translateY(-50%)', // Center the icon vertically
                      cursor: 'pointer',
                      zIndex: 1, // Ensure the icon appears above the input field
                    }}
                    onClick={() => setConfirmPassword(!confirmPassword)}
                  >
                    {confirmPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                </div>

                <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      <button
        onClick={handleSubmit}
        className="btn btn-green-full text-heading-6"
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#eb0254',
          color: '#fff',
          fontSize: '16px',
          width: '100%',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s ease',
        }}
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? (
        <ClipLoader size={20} color="#fff" /> // Spinner
      ) : (
        'Reset Password'
      )}
      </button>
    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
</Layout>



  );
};

export default ResetPassword;