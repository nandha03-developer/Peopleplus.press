/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    InputAdornment,
    IconButton,
} from "@mui/material";
import Lottie from "lottie-react";
import { useLanguage } from "@/context/languageContext";
import { IoClose } from "react-icons/io5";
import { BorderAll } from "@mui/icons-material";
interface FormData {
    email: string;
    password: string;
}

interface ErrorData {
    email?: string;
    password?: string;
    general?: string;
}

interface LoginModalProps {
    onClose: () => void;
  }

const LoginModal: React.FC<LoginModalProps> = ({ onClose }: any) => {
    
    const { langCode } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [errorData, setErrorData] = useState<ErrorData>({});
    const [rememberMe, setRememberMe] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const toastConfig: ToastOptions = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    const schema = yup.object().shape({
        email: yup
            .string()
            .email("Enter a valid email address")
            .required("Email is required"),
        password: yup
            .string()
            .min(5, "Password must be at least 5 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[\W_]/, "Password must contain at least one special character")
            .required("Password is required"),
    });

    const defaultValues = {
        password: "",
        email: "",
    };

    const {
        control,
        formState: { errors },
        setValue,
        handleSubmit,
    } = useForm({
        defaultValues,
        mode: "onBlur",
        resolver: yupResolver(schema),
    });

    const handleOnChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setValue(name, value, { shouldValidate: true });
    };

    const encrypt = (value: string, key: string): string => {
        let encrypted = ''
        for (let i = 0; i < value.length; i++) {
            encrypted += String.fromCharCode(value.charCodeAt(i) ^ key.charCodeAt(i % key.length))
        }

        return btoa(encrypted)
    }

    const handleLogin = async () => {
        setLoading(true); // Start loading

        const formError = validateForm();
        if (Object.keys(formError).length !== 0) {
            setErrorData(formError);
            setLoading(false);
            toast.error(Object.values(formError).join("\n"), toastConfig);
            return;
        } else {
            setErrorData({});
        }

        try {
            const encryptedPassword = encrypt(formData.password, 'people@123plus')
            const response = await axios.get(
                `/signin?operation=cognito_signin&email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(encryptedPassword)}`
            );
            if (response) {
                try {
                    const response = await fetch(
                        `/List_api_tables?table_name=Customer&emailid_contains=${formData.email}`
                    );
                    const data = await response.json();
                    localStorage.setItem("cusId", JSON.stringify(data.Data[0].id));
                } catch (error) {
                    console.error("Error fetching data:", error);
                }

                [];
                // localStorage.setItem('userId', JSON.stringify(response.data.userId));
                toast.success("Sign in successful", toastConfig); // Success message
                window.location.reload();
            } else {
                // console.error('Unexpected response format:', response.data);
                toast.error("Unexpected response format", toastConfig); // Error message
            }
        } catch (error) {
            console.error("Error occurred:", error);
            toast.error("Error occurred during sign in", toastConfig); // Error message
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const validateForm = (): ErrorData => {
        const formError: ErrorData = {};
        if (!formData.email.trim()) {
            formError.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formError.email = "Email is invalid";
        }
        if (!formData.password.trim()) {
            formError.password = "Password is required";
        } else if (formData.password.length < 6) {
            formError.password = "Password must be at least 6 characters long";
        }
        return formError;
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);

        const { email, password } = data;

        try {
            await handleLogin();
        } catch (error) {
            setErrorData({ general: "Login failed. Please try again." });
            toast.error("Login failed. Please try again.", toastConfig);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            onSubmit(formData); // Call onSubmit with the current form data
        }
    };

    const lottieRef = useRef(null);
    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current;
        }
    }, []);

    const closeButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '20px',
        left: '10px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '20px',
        cursor: 'pointer',
    };

    return (
        <>
            <Container sx={styles.container}>
            <button onClick={onClose} style={closeButtonStyle}><IoClose /></button>
                    <Image 
                        src="/assets/images/website logo-02.png" 
                        alt="Company Logo" 
                        width={160} 
                        height={60}
                        style={{ marginTop: '-10px' }} 
                    />
                    <div style={{fontWeight:'bold', fontSize:'16px', marginTop:'10px', color:'black'}}>
                    It looks like you’re not logged in. To enhance your experience and access exclusive features, please log in to your account.
                    </div>
                <Box sx={styles.formGroup}>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="email"
                                placeholder="Email"
                                variant="outlined"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email ? errors.email.message : ""}
                                InputProps={{ sx: styles.inputField }}
                                onChange={handleOnChange}
                                onKeyDown={handleKeyDown}
                            />
                        )}
                    />
                </Box>
                <Box sx={styles.formGroup}>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                variant="outlined"
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ""}
                                onKeyDown={handleKeyDown}
                                InputProps={{
                                    sx: styles.inputField,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <MdVisibility />
                                                ) : (
                                                    <MdVisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={handleOnChange}
                            />
                        )}
                    />
                </Box>
                {errorData.general && (
                    <Typography color="error">{errorData.general}</Typography>
                )}
                <div>
                    <span className="text-body-text color-gray-500" style={{color:'black'}}>
                        Don’t have an account?&nbsp;
                    </span>
                    <Link href="/en/page-signup" legacyBehavior>
                        <a onClick={onClose}
                            className="text-body-text color-green-900"
                            style={{ color: "#eb0254" }}
                        >
                            Sign up
                        </a>
                    </Link>
                    <br />

                    <Link href="/en/forgot-password" legacyBehavior>
                        <a onClick={onClose}
                            className="text-body-text color-gray-500"
                            style={{ color: "#eb0254" }}
                        >
                            Forgot password?
                        </a>
                    </Link>
                </div>
                <div className="form-group">
                    <button
                        style={styles.buttonPrimary}
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                        onFocus={(e) => {
                            e.currentTarget.style.backgroundColor = "#e8f0fe";
                            e.currentTarget.style.color = "#eb0254";
                            e.currentTarget.style.outline = "none";
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {loading ? (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <div
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    style={{ marginRight: "5px" }}
                                ></div>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <div>
                                <span>Continue</span>
                            </div>
                        )}
                    </button>
                </div>
            </Container>
            <ToastContainer {...toastConfig} />
        </>
    );
};

const styles = {
    background: {
        display: "flex",
    },
    container: {
        backgroundColor: "white",
        padding: "20px",
        width: "400px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
         color: "#ffffff",
       // height: "auto",
        //marginTop: "5%",
    },
    subHeader: {
        margin: "0",
        fontSize: "12px",
        color: "#b1b1b1",
    },
    header: {
        margin: "5px 0",
        fontSize: "24px",
        color: "black",
    },
    text: {
        margin: "10px 0",
        color: "#b1b1b1",
    },
    link: {
        color: "#4a90e2",
        textDecoration: "none",
    },
    formGroup: {
        margin: "20px 0",
    },
    inputField: {
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        color: "white",
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
    },
    buttonPrimary: {
        width: "350px",
        height: "55px",
        padding: "10px",
        margin: "20px 0",
        borderRadius: "10px",
        backgroundColor: "#eb0254",
        color: "white",
        fontSize: "17px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.3s, color 0.3s",
        border:'none'
    },
    closeButtonStyle: {
        position: 'absolute',
        top: '20px',
        left: '10px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '20px',
        cursor: 'pointer',
    },
};

export default LoginModal;
