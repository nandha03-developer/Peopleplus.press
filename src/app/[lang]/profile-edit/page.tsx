"use client";
import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState, ChangeEvent, useEffect, useRef } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useRouter } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import { Console } from 'console';
import { useLanguage } from "@/context/languageContext";
import Layout from "@/components/ltr/layout/layout";
import Lottie from "lottie-react";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import animationData from "../../../../public/assets/animatedJson/Animation   1726740101328 (1) (4).json";
import Image from 'next/image';
interface FormData {
    city: string;
    country: string;
    dob: string;
    district: string;
    emailid: string;
    firstname: string;
    gender: string;
    interest: string;
    iseverified: any;
    ismverified: any;
    joindate: string;
    lastname: string;
    mobileno: string;
    password: string;
    postcode: string;
    profileimage: string | null; // Allow null;
    state: string;
}


const ProfileEditPage = () => {
    const { langCode } = useLanguage();
    const router = useRouter();
    const [ProfileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<any>({});
    const [userId, setUserId] = useState<any>('');
    const [emailVerified, setEmailVerified] = useState<any>();
    const [customerDetails, setCustomerDetails] = useState<any>([]);

    const [formData, setFormData] = useState({
         firstname: "",
        lastname:"",
        mobileno: "",
        emailid: "",
        country: "",
        state: "",
        district: "",
        city: "",
        postcode: "",
        joindate: "",
        dob: "",
        gender: "",
        password: "",
        interest: "",
        iseverified: false,
        ismverified: false,
        profileimage: null,
    });

    const [loading, setLoading] = useState(false); // Added loading state

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            const userId = localStorage.getItem("cusId");
            try {
                const response = await axios.get(`/List_api_tables?table_name=Customer&id_eq=${userId}`);
                const fetchedItems = response.data.Data[0];
                const { id, ...remainingData } = fetchedItems;
                setFormData(remainingData);
    
            } catch (error) {
                console.error("Error fetching customer details:", error);
            }
        };
    
        fetchCustomerDetails();
    }, []);
    

    useEffect(() => {
        const storedFormData = localStorage.getItem('formData');
        if (storedFormData) {
            setUserDetails(JSON.parse(storedFormData));
        }
        const customerId = localStorage.getItem('cusId');
        if (customerId) {
            setUserId(JSON.parse(customerId));  
        }
        const iseverified = localStorage.getItem('iseverified');
        if (iseverified) {
            setEmailVerified(JSON.parse(iseverified));  
            
        }
    }, []);

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            emailid: userDetails.email || prevFormData.emailid,
            password: userDetails.password || prevFormData.password,
            firstname: userDetails.name || prevFormData.firstname,
        }));
    }, [userDetails, userId]);

    // const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value, type, checked } = e.target as HTMLInputElement;
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [name]: type === 'checkbox' ? checked : value,
    //     }));
    // }

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
    
        if (type === 'checkbox') {
            setFormData((prevState) => ({
                ...prevState,
                [name]: checked,
            }));
        } else if (type === 'radio') {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            if (name === 'mobileno') {
                const numericValue = value.replace(/\D/g, ''); 
                if (numericValue.length <= 10) {
                    setFormData((prevState) => ({
                        ...prevState,
                        [name]: numericValue,
                    }));
                }
            } else if (name === 'postcode') {
                const numericValue = value.replace(/[^0-9]/g, ''); 
                if (numericValue.length <= 6) { 
                    setFormData((prevState) => ({
                        ...prevState,
                        [name]: numericValue,
                    }));
                }
            } else if (name === 'dob') {
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDifference = today.getMonth() - birthDate.getMonth();
    
                if (age < 18 || (age === 18 && monthDifference < 0)) {
                    setErrorMessage('You must be at least 18 years old');
                } else {
                    setErrorMessage('');
                }
    
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                }));
            } else if (name === 'firstname' || name === 'lastname') {
                // Allow only alphabetic characters for both firstname and lastname
                const alphabeticValue = value.replace(/[^a-zA-Z]/g, ''); 
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: alphabeticValue,
                }));
            } else {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
    };
    

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            city: '',
            country: '',
            dob: '',
            district: '',
            emailid: '',
            firstname: '',
            gender: '',
            interest: '',
            iseverified: '',
            ismverified: '',
            joindate: '',
            lastname: '',
            mobileno: '',
            password: '',
            postcode: '',
            profileimage: '',
            state: ''
            
        };

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
            valid = false;
        }
        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
            valid = false;
        }
        if (!formData.dob.trim()) {
            newErrors.dob = 'Date of Birth is required';
            valid = false;
        }
        if (!formData.district.trim()) {
            newErrors.district = 'District is required';
            valid = false;
        }
        if (!formData.emailid.trim()) {
            newErrors.emailid = 'Email ID is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.emailid)) {
            newErrors.emailid = 'Email ID is invalid';
            valid = false;
        }
        if (!formData.firstname.trim()) {
            newErrors.firstname = 'First Name is required';
            valid = false;
        } else if (!/^[a-zA-Z]+$/.test(formData.firstname.trim())) {
            newErrors.firstname = 'First Name must contain only letters';
            valid = false;
        }
        if (!formData.gender.trim()) {
            newErrors.gender = 'Gender is required';
            valid = false;
        }
        if (!formData.interest.trim()) {
            newErrors.interest = 'Interest is required';
            valid = false;
        }

        if (!formData.joindate.trim()) {
            newErrors.joindate = 'Join Date is required';
            valid = false;
        }
        if (!formData.lastname.trim()) {
            newErrors.lastname = 'Last Name is required';
            valid = false;
        } else if (!/^[a-zA-Z]+$/.test(formData.lastname.trim())) {
            newErrors.lastname = 'Last Name must contain only letters';
            valid = false;
        }
        if (!formData.mobileno.trim() && !/^\d{10}$/.test(formData.mobileno.trim())) {
            newErrors.mobileno = !formData.mobileno.trim() 
                ? 'Mobile Number is required' 
                : 'Please enter a valid 10-digit mobile number';
            valid = false;
        }
        

        
        
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
            valid = false;
        }
       
        const postcodePattern = /^[0-9]{6}$/; // Example pattern for a 5-digit postcode

        if (!formData.postcode.trim() && !postcodePattern.test(formData.postcode.trim())) {
            newErrors.postcode = !formData.postcode.trim()
                ? 'Postcode is required'
                : 'Invalid postcode format';
            valid = false;
        }
        
        
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
            valid = false;
        }

        return valid;
    };

    const handleDropMain = async (acceptedFiles: any) => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                const apiUrl =
                    "https://wzow2wvq3ow47ezk6kwfva6w3i0ccabi.lambda-url.ap-south-1.on.aws/upload"; // Update this to your actual API endpoint
                const formData = new FormData();
                formData.append("files", file);
                formData.append("subfolder", "peoplepluspress");

                const requestOptions: any = {
                    method: "POST",
                    body: formData,
                    redirect: "follow",
                };

                const response = await fetch(apiUrl, requestOptions);
                if (response.ok) {
                    const result = await response.json();
                    const image = result.imageUrl || URL.createObjectURL(file);
                    setProfileImageUrl(image);
                    setFormData((prevData) => ({
                        ...prevData,
                        profileimage: image, // Update formData with image URL
                    }));
                    toast.success("Profile Photo Uploaded");
                } else {
                    const errorResult = await response.json();
                    throw new Error(
                        "Failed to upload file. Server responded with status: " +
                        response.status +
                        " " +
                        errorResult.message
                    );
                }
            } catch (error: any) {
                console.error("Error:", error);
                if (axios.isAxiosError(error)) {
                    toast.error(
                        "Error uploading file: " +
                        (error.response?.data?.message || error.message)
                    );
                } else {
                    toast.error("An unexpected error occurred: " + error.message);
                }
            }
        } else {
            toast.error("No file selected for upload");
        }
    };

    const { getRootProps: getRootPropsMainImage, getInputProps: getInputPropsMainImage } = useDropzone({
        onDrop: handleDropMain
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // if (!validateForm()) {
        //     return; // Stop submission if validation fails
        // }

        setLoading(true); // Set loading to true before making the request

        try {
            const response = await axios.put(`/api/customer/${userId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                toast.success('Profile Updated successfully!');
                router.push(`/${langCode}/`)
            } else {
                toast.error('Failed to add data.');
            }

        } catch (error: any) {
            console.error('Error adding data:', error);
            toast.error('Failed to add data.');
        } finally {
            setLoading(false); // Set loading to false after the request is complete
        }
    };

    const lottieRef = useRef(null);
    useEffect(() => {
      if (lottieRef.current) {
        lottieRef.current;
      }
    }, []);
    const styles = {
        background: {
          display: "flex",
          backgroundColor: "white",
        },
    }

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;


    return (
        <Layout>
        <div style={styles.background}>
     <div
      className="login-left"
      style={{
        width: "50%",
        height: "30%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie
        animationData={animationData}
        lottieRef={lottieRef}
        loop
        autoplay
        style={{ width: "70%", height: "60%", marginTop: "-3%" }} // Adjust marginTop to move the animation up
      />
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px',marginTop: '2.4%' }}>
        <div style={{ width: '100%', maxWidth: '700px',backgroundColor: '#fff',  padding: '20px', border: '1px solid #ccc', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', overflowY: 'auto', maxHeight: '600px', scrollbarWidth: 'thin', scrollbarColor: '#dc3545 #F5F5F5',marginLeft: '10%' }} id="style-8">
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Profile Edit</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {/* First Name */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="firstname" style={{ fontWeight: 'bold', color: '#555' }}>First Name<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Last Name */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="lastname" style={{ fontWeight: 'bold', color: '#555' }}>Last Name<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Email Id */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="emailid" style={{ fontWeight: 'bold', color: '#555' }}>Email Id<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="email"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                                cursor: 'not-allowed', // Change the cursor type here

                            }}
                            id="emailid"
                            name="emailid"
                            value={formData.emailid}
                            readOnly // Prevents editing
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Mobile No */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="mobileno" style={{ fontWeight: 'bold', color: '#555' }}>Mobile No<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="tel"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="mobileno"
                            name="mobileno"
                            value={formData.mobileno}
                            onChange={handleChange}
                            maxLength={10}
                            required
                        />
                    </div>
                    {/* DOB */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="dob" style={{ fontWeight: 'bold', color: '#555' }}>DOB<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="date"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Gender */}
                    <div style={{ flex: '1 1 45%' }}>
                            <label style={{ fontWeight: 'bold', color: '#555' }}>Gender <span style={{ color: 'red' }}>*</span></label>
                            <RadioGroup
    row
    value={formData.gender}
    onChange={handleChange} // This will now handle the radio button change
    style={{ display: 'flex', alignItems: 'center' }}
>
<FormControlLabel
                value="Male"
                control={
                    <Radio
                        id="GenderMale"
                        name="gender"
                        sx={{
                            color: isDarkMode ? 'black' : '#f0f0f0',
                            '&.Mui-checked': {
                                color: '#eb0254', // Change the color when checked
                            },
                        }}
                    />
                }
                label="Male"
                style={{ marginRight: '15px', fontWeight: 'bold' }}
            />
    <FormControlLabel
                value="Female"
                control={
                    <Radio
                        id="GenderFemale"
                        name="gender"
                        sx={{
                            color: isDarkMode ? 'black' : '#f0f0f0',
                            '&.Mui-checked': {
                                color: '#eb0254', // Change the color when checked
                            },
                        }}
                    />
                }
                label="Female"
                style={{ fontWeight: 'bold' }}
            />
</RadioGroup>


                        </div>
                    {/* Interest */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="interest" style={{ fontWeight: 'bold', color: '#555' }}>Interest<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="interest"
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Join Date */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="joindate" style={{ fontWeight: 'bold', color: '#555' }}>Join Date<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="date"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="joindate"
                            name="joindate"
                            value={formData.joindate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="country" style={{ fontWeight: 'bold', color: '#555' }}>Country<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* City */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="city" style={{ fontWeight: 'bold', color: '#555' }}>City<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* District */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="district" style={{ fontWeight: 'bold', color: '#555' }}>District<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="district"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* State */}
                    <div style={{ flex: '1 1 45%' }}>
                        <label htmlFor="state" style={{ fontWeight: 'bold', color: '#555' }}>State<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '5px',
                                border: '1px solid #007bff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                                backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
                                color: isDarkMode ? '#000' : '#333',
                            }}
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
    <label htmlFor="postcode" className="form-label" style={{ fontWeight: 'bold', color: '#555' }}>PostCode<span style={{ color: 'red' }}>*</span></label>
    <input
        type="tel"
        className="form-control form-control-sm"
        id="postcode"
        name="postcode"
        value={formData.postcode}
        maxLength={6} // Ensure input length does not exceed 6 digits
        onChange={handleChange}
        required
        style={{
            
            padding: '12px',
            border: '1px solid #007bff',
            borderRadius: '8px',
            width: '65%',
            boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
            outline: 'none',
            transition: 'border-color 0.3s',
            backgroundColor: isDarkMode ? '#fff' : '#f0f0f0',
            color: isDarkMode ? '#000' : '#333',
        }}
    />
</div>


{/* Email Verified and Mobile Verified Fields in One Line */}

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', gap: '120px' }}>
    <div style={{ display: 'flex',alignItems: 'start', gap: '10px' }}>
            <label htmlFor="iseverified" className="form-label" style={{ fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Email</label>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="iseverified"
                    name="iseverified"
                    checked={emailVerified ? true : false}
                    onChange={handleChange}
                />
                <label htmlFor="iseverified" className="form-check-label" style={{ marginBottom: '0' }}>Verified</label>
        
        
    </div>

{/* 
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <label htmlFor="ismverified" className="form-label" style={{ fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Mobile</label>
            <div className="form-check" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="ismverified"
                    name="ismverified"
                    checked={formData.ismverified}
                    onChange={handleChange}
                />
                <label htmlFor="ismverified" className="form-check-label">Verified</label>
            </div>
        </div>
    </div> */}

</div>





                    
<div style={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box
                sx={{
                    border: '1px dashed #aaa',
                    padding: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    backgroundColor: '#f0f0f0',
                    outline: 'none',
                    width: '100%',
                    margin: 'auto',
                    marginTop: '4px',
                }}
                {...getRootPropsMainImage()}
            >
                <input {...getInputPropsMainImage()} />
                {!formData.profileimage && !ProfileImageUrl && ( // Show upload icon and text only if there's no image
                    <>
                        <CloudUploadIcon />
                        <Typography variant="body1">
                            Upload Profile Image
                        </Typography>
                    </>
                )}
                {(formData.profileimage || ProfileImageUrl) && ( // Show the image and delete button if an image is uploaded
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Image
                            src={ProfileImageUrl || formData.profileimage || '/path/to/default/image.png'} // Default image path
                            alt="Uploaded"
                            width={100}
                            height={100}
                            style={{ borderRadius: '50%', marginTop: '10px' }}
                        />
                        <IconButton
                            onClick={() => {
                                // Function to handle image deletion
                                setFormData(prev => ({ ...prev, profileimage: null })); // Clear the profile image
                            }}
                            style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                padding: '2px',
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                )}
            </Box>
        </div>

                </div>
                <button
            type="submit"
            style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                marginTop: '20px',
                cursor: 'pointer',
            }}
            disabled={loading}
        >
            {loading ? (
                <>
                    <div className="spinner-border spinner-border-sm" role="status" style={{ marginRight: "10px" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    Submitting...
                </>
            ) : (
                "Submit"
            )}
        </button>
  

            </form>
        </div>
        <style>
            {`
            #style-8::-webkit-scrollbar-track {
                border: 1px solid black;
                background-color: #dc3545;
            }

            #style-8::-webkit-scrollbar {
                width: 6px;
                background-color: #dc3545;
            }

            #style-8::-webkit-scrollbar-thumb {
                background-color: #000000;	
            }
            `}
        </style>
    </div>
    </div>
        
        <ToastContainer />
    </Layout>
    );
};

export default ProfileEditPage;
