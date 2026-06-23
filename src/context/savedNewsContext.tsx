"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import axios from 'axios';
import { Dialog } from '@mui/material';
import { IoClose } from "react-icons/io5";
import Image from 'next/image';
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the spinner component
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/languageContext";
import Link from 'next/link';
import LoginModal from '@/components/login-modal/login-modal';

const contentStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '460px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    textAlign: 'center',
    position: 'relative',
    margin: '0 auto',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #c82024',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: 'white',
};

const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '7px',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    position: 'relative' // Correctly typed value
};


const loginButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#c82024',
};

const linkStyle = {
    textDecoration: 'none',
    color: '#007bff',
    cursor: 'pointer',
    transition: 'color 0.2s ease-in-out',
};

const hoverStyle = {
    color: '#c82024',
};

const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '20px',
    cursor: 'pointer',
};

// Define the shape of the context
interface SavedItemsContextType {
    activeItems: { [key: number]: boolean };
    savedItems: any[];
    handleIconClick: (event: React.MouseEvent<HTMLDivElement>, itemId: number) => void;
}

// Create the context
const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

// Define the provider component
export const SavedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { langCode } = useLanguage();
    const [activeItems, setActiveItems] = useState<{ [key: number]: boolean }>({});
    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [errorData, setErrorData] = useState<ErrorData>({});
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // useEffect(() => {
    //     const fetchSavedItems = async () => {
    //         const userId = localStorage.getItem('cusId');
    //         if (!userId) {
    //             return;
    //         }
    //         try {
    //             const response = await axios.get(`/Saved_list/?userid_eq=${userId}`);
    //             const fetchedItems = response.data.Data;

    //             setSavedItems(fetchedItems);

    //             const userSavedItems = fetchedItems.find((item: any) => item.userid == parseInt(userId));
    //             if (userSavedItems) {
    //                 const newsIds = userSavedItems.newsid.split(',').reduce((acc: any, id: any) => {
    //                     acc[id] = true;
    //                     return acc;
    //                 }, {});
    //                 setActiveItems(newsIds);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching saved items:', error);
    //         }
    //     };

    //     fetchSavedItems();
    // }, []);

    useEffect(() => {
        const fetchSavedItems = async () => {
            const userId = localStorage.getItem('cusId');
            if (!userId) {
                // User not logged in
                return;
            }
            try {
                const response = await axios.get(`/Saved_list/?userid_eq=${userId}`);
                const fetchedItems = response.data.Data;
    
                setSavedItems(fetchedItems);
    
                const userSavedItems = fetchedItems.find((item: any) => item.userid === parseInt(userId));
                if (userSavedItems) {
                    // Determine the language from the URL
                    const path = window.location.pathname;
                    const segments = path.split("/").filter(segment => segment.trim() !== "");
                    let newsIds = [];
    
                    // Check the language based on the URL segments
                    if (segments.length >= 2) {
                        const languageCode = segments[0];
    
                        switch (languageCode) {
                            case "ta":
                                newsIds = userSavedItems.tamil_news || [];
                                break;
                            case "hi":
                                newsIds = userSavedItems.hindi_news || [];
                                break;
                            default:
                                newsIds = userSavedItems.english_news || [];
                                break;
                        }
                    }
    
                    // Combine active news IDs for Tamil and English
                    const activeIds = {
                        ...userSavedItems.tamil_news.reduce((acc: any, id: any) => {
                            acc[id] = true;
                            return acc;
                        }, {}),
                        ...userSavedItems.english_news.reduce((acc: any, id: any) => {
                            acc[id] = true;
                            return acc;
                        }, {}),
                    };
    
                    setActiveItems(activeIds);
                }
            } catch (error) {
                console.error('Error fetching saved items:', error);
            }
        };
    
        fetchSavedItems();
    }, []);
    


    const handleClose = () => setOpen(false);

    const handleIconClick = async (event: React.MouseEvent<HTMLDivElement>, itemId: number) => {
        event.preventDefault();

        // const userId = localStorage.getItem('userId');
        const customerId: any = localStorage.getItem('cusId');
        const userId = JSON.parse(customerId)
        if (!userId) {
            setOpen(true);
            return;
        }
        const isActive = activeItems[itemId];
        let updatedNewsIds: number[] = [];

        if (isActive) {
            updatedNewsIds = Object.keys(activeItems)
                .filter(id => id !== itemId.toString() && activeItems[parseInt(id)])
                .map(id => parseInt(id));
        } else {
            updatedNewsIds = [...Object.keys(activeItems)
                .filter(id => activeItems[parseInt(id)])
                .map(id => parseInt(id)), itemId];
        }

        const newsIdsString = updatedNewsIds.join(',');

        const updatedFormData = {
            userid: parseInt(userId),
            newsid: newsIdsString,
            status: isActive ? 0 : 1
        };

        try {
            const userSavedItems: any = savedItems.find((item: any) => item.userid === parseInt(userId));

            if (userSavedItems) {
                // If userSavedItems exists, update the newsid for that user (PUT request)
                const editres = await axios.put(`/api/savedlist/${userSavedItems.id}`, updatedFormData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                toast.success(updatedFormData.status === 1 ? 'News saved successfully' : 'News removed successfully');
            } else {
                // If userSavedItems does not exist, create a new entry (POST request)
                const response = await axios.post('/api/savedlist', updatedFormData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const newItemId = response.data.id;
                toast.success('News saved successfully');

                setSavedItems(prevItems => [
                    ...prevItems,
                    { userid: parseInt(userId), newsid: newsIdsString, id: newItemId }
                ]);
            }

            setActiveItems(prevState => ({
                ...prevState,
                [itemId]: !prevState[itemId],
            }));

        } catch (error) {
            console.error('Error updating items:', error);
            toast.error('Failed to update items');
        }
    };

    interface FormData {
        email: string;
        password: string;
    }

    interface ErrorData {
        email?: string;
        password?: string;
        general?: string;
    }

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({ email: "", password: "" });

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
        email: yup.string().email('Enter a valid email address').required('Email is required'),
        password: yup
            .string()
            .min(5, 'Password must be at least 5 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[\W_]/, 'Password must contain at least one special character')
            .required('Password is required'),
    });

    const defaultValues = {
        email: '',
        password: '',
    };

    const { handleSubmit } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });

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
            const response = await axios.get(`/signin?operation=cognito_signin&email=${formData.email}&password=${encodeURIComponent(encryptedPassword)}`);
            if (response) {
                try {
                    const response = await fetch(`/List_api_tables?table_name=Customer&emailid_contains=${formData.email}`);
                    const data = await response.json();
                    localStorage.setItem("cusId", JSON.stringify(data.Data[0].id));
                } catch (error) {
                    console.error('Error fetching data:', error);
                }

                [];
                // localStorage.setItem('userId', JSON.stringify(response.data.userId));
                toast.success("Sign in successful", toastConfig); // Success message
                setOpen(false)
                window.location.reload();
            } else {
                // console.error('Unexpected response format:', response.data);
                toast.error("Unexpected response format", toastConfig); // Error message
            }
        } catch (error) {
            console.error('Error occurred:', error);
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

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };


    return (
        <>
            <SavedItemsContext.Provider value={{ activeItems, savedItems, handleIconClick }}>
                {children}
            </SavedItemsContext.Provider>

            <Dialog open={open} onClose={handleClose} PaperProps={{
                style: {
                    width: '400px',
                    height: 'auto',
                    borderRadius: '15px',
                },
            }}>
                <LoginModal onClose={handleClose} />
            </Dialog>

            <ToastContainer />
        </>
    );
};

// Custom hook for using the context
export const useSavedItems = () => {
    const context = useContext(SavedItemsContext);
    if (!context) {
        throw new Error('useSavedItems must be used within a SavedItemsProvider');
    }
    return context;
};
