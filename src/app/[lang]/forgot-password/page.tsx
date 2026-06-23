"use client";
import React, {useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import { useLanguage } from "@/context/languageContext";
import Layout from "@/components/ltr/layout/layout";
import Lottie from "lottie-react";
import animationData from "../../../../public/assets/animatedJson/Animation - 1726299423214(for).json";
import { Container } from "@mui/material";
import { ClipLoader } from 'react-spinners'; // Example spinner from react-spinners

const StepperForm = () => {
  const router = useRouter();
  const { langCode } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleContinue = async () => {
    const otpCode = otp.join("");
    try {
      const response = await axios.get(
        `/cognito?operation=cognito_forgotpassword_confirm&email=${email}&confirmation_code=${otpCode}&new_password=${confirmPassword}`
      );
      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      toast.error("Unexpected error. Please try again later."); // Use toast.error for errors
    }
  };

  const handleRecoverPassword = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateEmail()) return;
    try {
      const response = await axios.get(
        `/List_api_tables?table_name=Customer&emailid_contains=${email}`
      );
      fetchForgetPassword(email);
    } catch (error) {
      setEmailError("Enter valid email address associated with account.");
    }
    setIsLoading(false);
    };

  const fetchForgetPassword = async (email: string) => {
    try {
      const response = await axios.get(
        `/cognito?operation=cognito_forgotpassword&email=${email}`
      );
      if (response.status === 200) {
        toast.success("OTP Sent successfully");
        router.push(`/${langCode}/reset-password/?email=${email}`);
        if (currentStep === 0 && !validateEmail()) return;
        setCurrentStep((prevStep) => prevStep + 1);
      }
    } catch (error) {
      toast.error("OTP not sent. Please try again."); // Use toast.error for errors
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleOtpChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    const { length, uppercase, lowercase, number, specialChar } = passwordStrength;
    if (!length || !uppercase || !lowercase || !number || !specialChar) {
      setPasswordError("Password does not meet all requirements.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[@$!%*?&]/.test(value),
    });
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

 const background: React.CSSProperties = {
  display: "flex",
 }

  // const cardStyle: React.CSSProperties = {
  //   backgroundColor: "#24252f",
  //   padding: "20px",
  //   borderRadius: "10px",
  //   width: "auto",
  //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  //   textAlign: "center",
  //   color: "#ffffff",
  //   height: "400px",
  //   marginLeft: "auto",
  //   marginRight: "10%",
  // };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "#24252f",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    color: "#ffffff",
    height: "350px",
    marginTop: "5%",
  };

  const inputField = {
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "black",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#333",
      },
      "&:hover fieldset": {
        borderColor: "#4a90e2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#4a90e2",
      },
    },
    "& .MuiInputBase-input": {
      color: "black",
    },

  };

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

      <ToastContainer /> {/* Add this line */}
      <Container style={containerStyle}>
        <div>
          <div className="card-body">
            <form>
              <div className="text-center" style={{ marginTop: "12%" }}>
                <h3 style={{ fontSize: "1.5rem", marginTop: "1rem", color: "white" }}>Forget Password</h3>
                <p style={{ marginBottom: "2rem" }}>Enter the email address associated with your account.</p>
                <div className="mb-4">
                  <input
                    style={inputField}
                    type="email"
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    placeholder="Email"
                    value={email}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) {
                        validateEmail();
                      }
                    }}
                    required
                  />
                  {emailError && <div style={{ color: "#dc3545" }}>{emailError}</div>}
                </div>
                <button
      style={{
        backgroundColor: "#eb0254",
        borderColor: "#1a73e8",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
        width: "100%", // Make the button full width
        margin: "0 auto", // Center the button
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={handleRecoverPassword}
      disabled={isLoading} // Disable button when loading
    >
      {isLoading ? (
        <ClipLoader size={20} color="#fff" /> // Spinner
      ) : (
        'Forget Password'
      )}
    </button>
              </div>
            </form>
          </div>
        </div>
      
      </Container>
      </div>
    </Layout>
  );
};

export default StepperForm;
