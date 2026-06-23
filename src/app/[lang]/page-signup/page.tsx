/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Link from "next/link";
import Layout from "@/components/ltr/layout/layout";
import useRegister from "@/hooks/useRegister";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13 and beyond
import axios from "axios";
import { useLanguage } from "@/context/languageContext";
import Image from "next/image";
import { Checkbox, FormControlLabel } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import GoogleSignIn from "@/components/googleSignIn";

interface FormData {
  name: string;
  email: string;
  password: string;
  tac: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  tac?: string;
  signup?: string;
  hasUpperCase?: boolean;
  hasLowerCase?: boolean;
  hasNumber?: boolean;
  hasSpecialChar?: boolean;
  hasValidLength?: boolean;
  hasNoLeadingOrTrailingSpace?: boolean;
  hasNoSpace?: boolean;
}

const SignupForm = ({ params }: any) => {
  const isDarkMode: any = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const { langCode } = useLanguage();
  const lang = langCode;

  const router = useRouter();
  const { register, isEmailRegistered, loading } = useRegister();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    tac: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false); // Added signupLoading state
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);

  const handleGoogleSignUpClick = () => {
    setShowGoogleSignIn(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    // Update formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox state
    }));

    // Validate name input
    if (name === 'name' && type === 'text') {
      if (!value.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: 'Full name is required', // Set error message
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: '', // Clear error message if the name is valid
        }));
      }
    }

    // Validate email input
    if (name === 'email' && type === 'email') {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Email is invalid', // Set error message
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: '', // Clear error message if the email is valid
        }));
      }
    }
  };


  const handleChangeTac = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    // Update tac value in formData
    setFormData((prevData) => ({
      ...prevData,
      tac: checked,
    }));

    // Clear error message if the checkbox is checked
    if (checked) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tac: '', // Clear the error message when checked
      }));
    } else {
      // Optionally, if you want to show an error message when unchecked
      setErrors((prevErrors) => ({
        ...prevErrors,
        tac: 'You must agree to the terms and conditions', // Show error message when unchecked
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const encrypt = (value: string, key: string): string => {
    let encrypted = ''
    for (let i = 0; i < value.length; i++) {
      encrypted += String.fromCharCode(value.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }

    return btoa(encrypted)
  }

  const userSignUp = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const errors = validateForm(formData);
    if (Object.keys(errors).length !== 0) {
      setErrors(errors);
      return;
    }

    setSignupLoading(true); // Set loading to true before making the request

    try {
      const encryptedPassword = encrypt(formData.password, 'people@123plus')
      const response = await axios.get(`/signup?operation=cognito_signup&email=${formData.email}&password=${encodeURIComponent(encryptedPassword)}`);
      if (response.data == 'User is already confirmed.') {
        //setLoading(false);
        setErrors({ email: "You already have an account with us. Please Sign in using your credentials." });
      } else {
        const userSub = response.data.sub;
        if (userSub) {
          const body = {
            city: "",
            country: "",
            district: "",
            dob: 0,
            emailid: "",
            firstname: "",
            gender: "",
            interest: "",
            iseverified: false,
            ismverified: false,
            joindate: 0,
            lastname: "",
            mobileno: 0,
            password: "",
            postcode: 0,
            profileimage: "",
            state: "",
            // // uid: 0,
            // likednews: 0,
            // userid: 1,
            cognitoid: userSub,
          }
          try {
            const response = await axios.post('/api/customer', body, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (response.status === 200) {
              localStorage.setItem("cusId", JSON.stringify(response.data.id));
              toast.success("Registration successful! Redirecting to OTP page...");
              router.push(`/${lang}/otp`);
            }
            else {
              toast.error('Failed to add data.');
            }
          } catch (error: any) {
            console.error('Error adding data:', error);
            toast.error('Failed to add data.');
          }
        }
        localStorage.setItem("formData", JSON.stringify(formData));

      }
      setFormData({
        name: '',
        email: '',
        password: '',
        tac: false,
      });
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Registration failed! Please try again.");
    } finally {
      setSignupLoading(false); // Set loading to false after the request is complete
    }
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      // Create a mock event object to pass to userSignUp
      const mockEvent = {
        preventDefault: () => { }, // Prevent form submission if needed
        currentTarget: {}, // Mock current target if necessary
      } as FormEvent<HTMLButtonElement>;

      userSignUp(mockEvent);
    }
  };

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};
    // Username validation
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }
    // else if (formData.name.length !== 25) {
    //   errors.name = "Username must be exactly 25 characters long";
    // }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      errors.password = "Password must include at least one special character";
    }

    if (!formData.tac) {
      errors.tac = "Please agree to the terms and conditions";
    }
    return errors;
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      password: value,
    }));
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasValidLength = value.length >= 8;
    const hasNoLeadingOrTrailingSpace = value.trim() === value;
    const hasNoSpace = !/\s/.test(value);
    setErrors({
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
      hasValidLength,
      hasNoLeadingOrTrailingSpace,
      hasNoSpace,
    });
  };

  const handleGoogleSignUp = (event: any) => {
    event.preventDefault();
    const signUpUrl = 'https://peopleplus.auth.ap-south-1.amazoncognito.com/oauth2/authorize?client_id=1uneugckgmervl0l0aj5n28pnq&response_type=code&scope=email+openid+phone&redirect_uri=https://peopleplus.press/en&identity_provider=Google';
    const windowFeatures = 'width=600,height=700,resizable=yes,scrollbars=yes,status=yes';
    window.open(signUpUrl, 'GoogleSignUp', windowFeatures);
  };


  // const handleSignIn = async () => {
  //   // Sign in with Google and prevent redirect
  //   const result = await signIn("google", { redirect: false });

  //   if (result) {
  //     // Console log the user data once signed in
  //   } else {
  //   }
  // };


 const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    top: "60px",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "90%",
    objectFit: "cover",
    backgroundPosition: "center top", /* Adjust this to move the image */
    backgroundSize: "cover", /* Ensures the image covers the entire container */
    backgroundRepeat: "no-repeat", /* Prevents image repetition */
    marginTop: "70px", // Added margin-top for spacing
  },

  loginBox: {
    borderRadius: "30px",
    padding: "40px 20px",
    maxWidth: "450px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    position: "relative",
    boxSizing: "border-box",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginTop: "-5%", // Added margin-top for spacing
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "-25px",
    left: "50%",
    transform: "translateX(-50%)",
    border: "1px solid #24252f",
  },
 
  heading: {
    color: "#eb0254",
    marginTop: "8%",
    marginBottom: "8%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
    color: isDarkMode ? '#000' : '#333',
  },
  
  visibilityToggle: {
    position: "absolute",
    right: "10px",
    top: "10px",
    cursor: "pointer",
  },
  checkboxLabel: {
    display: "flex",
      alignItems: "start",
      marginLeft: "2px",
      justifyContent: "start",
    
  },
  tac: {
    backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
    color: isDarkMode ? '#000' : '#333',
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#eb0254",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    position: "relative",
    height: "40px",
    marginTop: "12px",
  },
  buttonContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
  spinner: {
    width: "1rem",
    height: "1rem",
  },
  signUpWith: {
    margin: "20px 0 10px",
    color: "black",
    fontSize: "15px",
  },
  credit: {
    fontSize: "12px",
    color: "#ccc",
  },
  error: {
    fontSize: '13px',
    color: 'red',
    display: 'block', // Ensures each error message is on a new line
    width: '100%', // Ensures error messages take full width of container
    textAlign: 'left' // Aligns text to the left
  },
  passwordRequirements: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: "13px",
    color: "red",
  },
  passwordError: {
    color: "#DF3312",
    fontSize: "13px",
  },
};


  return (
    <Layout>
      <ToastContainer />
      <div style={styles.container}>
        <div style={styles.backgroundOverlay}>
          <img

            src="/assets/images/masonry/sign-01.svg" // Replace with your background image URL
            alt="Background"
            style={styles.backgroundImage}
          />
        </div>
        <div style={styles.loginBox}>
          <div style={styles.iconContainer}>
            <Image
              src="/assets/images/90 size hd-01 1.svg"
              alt="Icon"
              style={styles.icon}
              width={70}
              height={70}
            />
          </div>
          <h2 style={styles.heading}>Sign Up Now </h2>
          <form onKeyDown={handleKeyDown} style={styles.form}>
            <input
              type="text"
              placeholder="Enter your Full name"
              name="name"
              value={formData.name}
              // maxLength={25}
              onChange={handleChange}
              style={styles.input}
              autoComplete='name'
            />
            {errors.name && (
              <span className="form-error-handling" style={styles.error}>
                {errors.name}
              </span>
            )}
            <br />
            <input
              type="email"
              placeholder="Enter your Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              autoComplete='email'
            />
            {errors.email && (
              <span className="form-error-handling" style={styles.error}>
                {errors.email}
              </span>
            )}

            <br />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  handlePasswordChange(e);
                }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                style={styles.input}
                autoComplete='password'
              />

              <span
                style={styles.visibilityToggle as React.CSSProperties}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </span>
              {errors.password && (
                <span className="form-error-handling" style={styles.error}>
                  {errors.password}
                </span>
              )}
              {isPasswordFocused && (
                <div style={styles.passwordRequirements}>
                  {!errors.hasUpperCase && (
                    <p style={styles.passwordError}>
                      ✖ Password must contain an upper case letter
                    </p>
                  )}
                  {!errors.hasLowerCase && (
                    <p style={styles.passwordError}>
                      ✖ Password must contain a lower case letter
                    </p>
                  )}
                  {!errors.hasNumber && (
                    <p style={styles.passwordError}>
                      ✖ Password must contain a number
                    </p>
                  )}
                  {!errors.hasValidLength && (
                    <p style={styles.passwordError}>
                      ✖ Password must contain at least 8 characters
                    </p>
                  )}
                  {!errors.hasSpecialChar && (
                    <p style={styles.passwordError}>
                      ✖ Password must contain a special character
                    </p>
                  )}
                  {!errors.hasNoLeadingOrTrailingSpace && (
                    <p style={styles.passwordError}>
                      ✖ Password must not contain a space
                    </p>
                  )}
                </div>
              )}
            </div>
            <br />
            <div style={styles.checkboxLabel}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="tac" // Link with label
                    name="tac"
                    checked={formData.tac} // Control checkbox state
                    onChange={handleChangeTac} // Handle state change
                    sx={{
                      color: '#000', // Unchecked color
                      '&.Mui-checked': {
                        color: '#000', // Checked color
                      },
                      marginTop: '-7px'
                    }}
                  />
                }
                label="" // Label text
                sx={{ color: '#000' }} // Label color
              />
              <span style={{ color: "black", fontSize: "15px", marginLeft: '-10px' }}>
                I Agree to{" "}
                <Link href="/en/terms-and-condition" legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#eb0254", fontSize: "15px" }}>
                    Terms & Conditions
                  </a>
                </Link>{" "}
                and
                <Link href="/en/privacy-policy" legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#eb0254", fontSize: "15px" }}>
                    {" "}
                    Privacy Policy
                  </a>
                </Link>
              </span>

            </div >
            {errors.tac && (
              <p className="form-error-handling" style={{
                ...styles.error,
                marginTop: '-10px',
              }}>
                {errors.tac}
              </p>
            )}

            <div style={{ textAlign: 'center', margin: '10px 0px 0px 0px' }}>
              <hr style={{ border: "none", borderTop: '1px solid black', margin: '0px' }} />
              <span style={{ position: 'relative', top: '-12px', background: 'white', padding: '0 10px' }}>or</span>
            </div>
<div style={{width:'100%', display:'flex',justifyContent:'center',alignItems:'center'}}>
            <GoogleSignIn />
            </div>
            <button
              type="submit"
              onClick={userSignUp}
              style={styles.button}
              disabled={signupLoading || loading} // Disable the button while loading
            >
              {signupLoading ? (
                <div style={styles.buttonContent}>
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                    style={styles.spinner}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Registering...</span>
                </div>
              ) : (
                <span>Register</span>
              )}
            </button>
            <p style={styles.signUpWith} >
              Already have an account?{" "}
              <Link href="/en/page-login" style={{ textDecoration: "underline", color: "#eb0254", fontSize: "15px" }}>Sign in now</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignupForm;
