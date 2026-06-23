"use client"
import Layout from "@/components/ltr/layout/layout";
import LayoutTwo from "@/components/ltr/layout/layout-two";
import UseRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import CustomTextField from "@/components/mui/text-field";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import DateTimePicker from 'react-datetime-picker';
import { Controller, useForm } from "react-hook-form";
import StickyBox from "react-sticky-box";
import { toast } from "react-toastify";


const Page = () => {

    const [formValues, setFormValues] = useState({
        fullName: '',
        email: '',
        website: '',
        subject: '',
        dateTime: '',
        message: ''
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        website: '',
        subject: '',
        dateTime: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error when user starts typing
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            fullName: '',
            email: '',
            website: '',
            subject: '',
            dateTime: '',
            message: ''
        };

        if (!formValues.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
            valid = false;
        }

        if (!formValues.email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!formValues.subject.trim()) {
            newErrors.subject = 'Subject is required';
            valid = false;
        }

        if (!formValues.message.trim()) {
            newErrors.message = 'Message is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post('/api/contacts', formValues, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status == 200) {
                toast.success('Data added successfully!');
                // Optionally reset form after successful submission
                setFormValues({
                    fullName: '',
                    email: '',
                    website: '',
                    subject: '',
                    dateTime: '',
                    message: ''
                });
            } else {
                toast.error('Failed to add data.');
            }

        } catch (error: any) {
            console.error('Error adding data:', error);
            toast.error('Failed to add data.');
        }
    };
      
    return (
        <Layout>
            {/* START PAGE TITLE */}
            <div className="page-title">
                <div className="container">
                    <div className="align-items-center row">
                        <div className="col">
                            <h1 className="mb-sm-0">
                                <strong>Contact</strong>
                            </h1>
                        </div>
                        <div className="col-12 col-sm-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb d-inline-block">
                                    <li className="breadcrumb-item">
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Contact
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* END OF /. PAGE TITLE */}

            {/* *** START PAGE MAIN CONTENT *** */}
            <main className="page_main_wrapper">
                <div className="container">
                    <div className="row row-m">
                        <div className="col-sm-7 col-md-8 main-content col-p">
                            <StickyBox>
                                {/* START CONTACT FORM AREA */}
                                <div className="contact_form_inner">
                                    <div className="panel_inner">
                                        <div className="panel_header">
                                            <h4>
                                                <strong>WE&apos;D LOVE TO HEAR FROM YOU, GET IN TOUCH WITH US!</strong>
                                                With in Us?{" "}
                                            </h4>
                                        </div>
                                        <div className="panel_body">
                                            <p>
                                                At People Plus Press, we value your feedback and inquiries. Whether you have a question, comment, or suggestion, we`&apos;re here to help. Please fill out the form below, and our team will get back to you as soon as possible.
                                            </p>
                                            <form className="comment-form" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name*</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                name="fullName"
                                placeholder="Your name*"
                                value={formValues.fullName}
                                onChange={handleChange}
                            />
                            {errors.fullName && <span style={{ color: 'red' }}>{errors.fullName}</span>}
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="email">Email*</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Your email address here"
                                value={formValues.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="website">Website</label>
                            <input
                                type="text"
                                className="form-control"
                                id="website"
                                name="website"
                                placeholder="Your website URL"
                                value={formValues.website}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="subject">Subject*</label>
                            <input
                                type="text"
                                className="form-control"
                                id="subject"
                                name="subject"
                                placeholder="Write subject here"
                                value={formValues.subject}
                                onChange={handleChange}
                            />
                            {errors.subject && <span style={{ color: 'red' }}>{errors.subject}</span>}
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="dateTime">Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="dateTime"
                                name="dateTime"
                                value={formValues.dateTime}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="form-group">
                            <label htmlFor="message">Message*</label>
                            <textarea
                                className="form-control"
                                id="message"
                                name="message"
                                rows={5}
                                placeholder="Your Comment*"
                                value={formValues.message}
                                onChange={handleChange}
                            />
                            {errors.message && <span style={{ color: 'red' }}>{errors.message}</span>}
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-news">Submit</button>
            </form>
                                        </div>
                                    </div>
                                </div>
                                {/* END OF CONTACT FORM AREA */}
                            </StickyBox>
                        </div>
                        <div className="col-sm-5 col-md-4 rightSidebar col-p">
                            <StickyBox>
                                {/* START CONTACT INFO */}
                                <div className="panel_inner">
                                    <div className="panel_header">
                                        <h4>
                                            <strong>Contact</strong> Info{" "}
                                        </h4>
                                    </div>
                                    <div className="panel_body">
                                        <address>
                                            {" "}
                                            {/* <strong>People Plus </strong> */}
                                            {/* <br /> 1355 Market Street, Suite 900
                                            <br /> San Francisco, CA 94103
                                            <br /> <abbr title="Phone">P:</abbr> (123) 456-7890{" "} */}
                                        </address>
                                        <address>
                                            {" "}

                                            <strong >People Plus</strong>

                                            <br /> <abbr title="Phone">Address:</abbr> 285, Anna Nagar East Cross Street,Sathamangalam,Priya Complex Opp, Road,Madurai 625 020,Tamil Nadu, India
                                            <br /> <abbr title="Phone">Phone:</abbr>9876543211
                                        </address>

                                    </div>
                                </div>
                                {/* END OF /. CONTACT INFO */}
                                {/* START SOCIAL COUNTER TEXT */}
                                <div className="align-items-center d-flex fs-6 justify-content-center mb-2 text-center social-counter-total">
                                <i className="fa-solid fa-heart text-primary me-1" style={{ fontSize: '1.5rem' , fontWeight: 'bold' }}/> 
                                <span style={{ fontWeight: 'bold' }}>FOLLOW US ON</span>
                                    </div>
                                {/* END OF /. SOCIAL COUNTER TEXT */}
                                {/* START SOCIAL ICON */}
                                <div className="social-media-inner mb-2">
                          <ul className="g-1 row social-media">
                      
                            <li className="col-4">
                              <a target="_blank" href="https://www.facebook.com/profile.php?id=61565107168918&mibextid=ZbWKwL" className="fb">
                                <i className="fab fa-facebook-f" />
                              </a>
                            </li>
                            <li className="col-4">
                              <a target="_blank" href="https://www.instagram.com/peoplepluspress/" className="insta">
                                <i className="fab fa-instagram" />
                              </a>
                            </li>
                            <li className="col-4">
                              <a target="_blank" href="https://youtube.com/@peoplepluspress?si=nW-cBjQmVvVkftnD" className="you_tube">
                                <i className="fab fa-youtube" />
                              </a>
                            </li>
                            <li className="col-4">
                              <a target="_blank" href="https://x.com/peoplepluspress" className="twitter">
                                <i className="fa-brands fa-x-twitter" />
                              </a>
                            </li>
                            <li className="col-4">
                              <a target="_blank" href="https://www.facebook.com/profile.php?id=61565107168918&mibextid=ZbWKwL" className="rss">
                                <i className="fa-brands fa-linkedin" />
                              </a>
                            </li>
                            <li className="col-4">
                              <a target="_blank" href="https://in.pinterest.com/peopleplusp/" className="pint">
                                <i className="fa-brands fa-pinterest" />
                              </a>
                            </li>
                          </ul>{" "}
                          {/* /.social icon */}
                        </div>
                                {/* END OF /. SOCIAL ICON */}
                            </StickyBox>
                        </div>
                    </div>
                
                </div>
            </main>
            {/* *** END OF /. PAGE MAIN CONTENT *** */}
        </Layout>

    );
};

export default Page;