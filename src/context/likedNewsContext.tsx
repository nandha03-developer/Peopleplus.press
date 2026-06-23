"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import * as yup from 'yup';
import { Dialog } from '@mui/material';
import { IoClose } from "react-icons/io5";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the spinner component
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/languageContext";
import Image from 'next/image';
import Link from 'next/link';
import LoginModal from '@/components/login-modal/login-modal';

const contentStyle: React.CSSProperties =  {
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
    backgroundColor: '#fafafa',
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


const loginButtonStyle: React.CSSProperties =  {
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
interface LikedItemsContextType {
    activeLikeItems: { [key: number]: boolean };
    likedItems: any[];
    handleLikeClick: (event: React.MouseEvent<HTMLDivElement>, itemId: number) => void;
}

// Create the context
const LikedItemsContext = createContext<LikedItemsContextType | undefined>(undefined);

// Define the provider component
export const LikedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { langCode } = useLanguage();
    const [activeLikeItems, setActiveLikeItems] = useState<{ [key: number]: boolean }>({});
    const [likedItems, setLikedItems] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [errorData, setErrorData] = useState<ErrorData>({});
    const router = useRouter();

    useEffect(() => {
        const fetchLikedItems = async () => {
            const userId = localStorage.getItem("cusId");
            if (!userId) {
              
                return;
            }

            try {
                const response = await axios.get(`/List_api_tables?table_name=Customer`);
                const fetchedItems = response.data.Data;

                setLikedItems(fetchedItems);

                const userLikedItems = fetchedItems.find((item: any) => item.id === parseInt(userId)); 
                if (userLikedItems.likednews != null) {
                    const newsIds = userLikedItems.likednews
                        .split(",")
                        .reduce((acc: any, id: any) => {
                            acc[id] = true;
                            return acc;
                        }, {});
                    setActiveLikeItems(newsIds);
                }
            } catch (error) {
                console.error("Error fetching liked items:", error);
            }
        };

        fetchLikedItems();
    }, []);

    const handleLikeClick = async (event: React.MouseEvent<HTMLDivElement>, itemId: number) => {
        event.stopPropagation();
        event.preventDefault();

        const userId = localStorage.getItem("cusId");
        if (!userId) {
            setOpen(true);
            return;
        }

        const isActive = activeLikeItems[itemId];
        let updatedNewsIds: string[] = [];

        if (isActive) {
            updatedNewsIds = Object.keys(activeLikeItems)
                .filter(id => id !== itemId.toString() && activeLikeItems[parseInt(id)]);
        } else {
            updatedNewsIds = [...Object.keys(activeLikeItems)
                .filter(id => activeLikeItems[parseInt(id)]), itemId.toString()];
        }

        const newsIdsString = updatedNewsIds.join(",");

        const updatedFormData = {
            likednews: newsIdsString,
        };

        try {
           // const userLikedItems: any = likedItems.find((item: any) => item.uid === parseInt(userId));

            // if (userLikedItems) {
                // Update the liked news for that user (PUT request)

                
                await axios.put(`/Likes?news_id=${itemId}&customer_id=${userId}`)
                   
               // toast.success(isActive ? 'Item removed successfully' : 'Item liked successfully');
            // } else {
            // }

            setActiveLikeItems(prevState => ({
                ...prevState,
                [itemId]: !prevState[itemId],
            }));

        } catch (error) {
            console.error('Error updating liked items:', error);
           // toast.error('Failed to update liked items');
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
    const handleClose = () => setOpen(false);

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

    return (
        <>
        <LikedItemsContext.Provider value={{ activeLikeItems, likedItems, handleLikeClick }}>
            {children}
           
        </LikedItemsContext.Provider>

        <Dialog open={open} onClose={handleClose} PaperProps={{
      style: {
        width: '400px',
        height: 'auto',
      },
    }}>
                <LoginModal onClose={handleClose} />
            </Dialog>

        <ToastContainer />
        </>
    );
};

// Custom hook for using the context
export const useLikedItems = () => {
    const context = useContext(LikedItemsContext);
    if (!context) {
        throw new Error('useLikedItems must be used within a LikedItemsProvider');
    }
    return context;
};
