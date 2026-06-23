"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
//import { CognitoIdentityServiceProvider } from 'aws-sdk';
import axios from "axios";
import crypto from 'crypto'


const CLIENT_ID = '2if2nj26og5j95248oj8h2oj2u' // Replace with your Cognito App Client ID
const CLIENT_SECRET = 'ko78b7een9nc9smr7prqplqr0s77s4tbvodk2b4qh4rdlt3vkt6'

const generateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
    return crypto
        .createHmac('SHA256', clientSecret)
        .update(username + clientId)
        .digest('base64')
}

interface LoginHook {
    login: (email: any, password: any) => void;
    resetPassword: (otpValue: any, email: any, cPassword: any) => void;
    resetPasswordRequest: (username: string) => void;
    loading: boolean;
    userPoolId: string | null;
}

const useAuth = (): LoginHook => {
    const router = useRouter();
    const [loading, setLoading] = useState<any>(false);
    const [userPoolId, setUserPoolId] = useState<string | null>(null);

    const fetchUserPoolId = async () => {
        try {
            const response = await fetch('https://your-lambda-authorizer-endpoint-url', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ${accessToken}',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch User Pool ID');
            }

            const data = await response.json();
            const poolId = data.userPoolId;

            if (poolId) {
                setUserPoolId(poolId);
            } else {
                console.error("User Pool ID not found in the response");
            }
        } catch (error) {
            console.error('Error fetching User Pool ID:', error);
        }
    };

    useEffect(() => {
        fetchUserPoolId();
    }, []);

   // const cognito = new CognitoIdentityServiceProvider({ region: 'ap-south-1' });

    const login = async (email: any, password: any) => {
        setLoading(true);
        const secretHash = generateSecretHash(email, CLIENT_ID, CLIENT_SECRET)
        try {
            // const data = await cognito.initiateAuth({
            //     AuthFlow: 'USER_PASSWORD_AUTH',
            //     AuthParameters: {
            //         USERNAME: email,
            //         PASSWORD: password,
            //         SECRET_HASH: secretHash,
            //     },
            //     ClientId: '2if2nj26og5j95248oj8h2oj2u', // Replace with your actual Cognito User Pool
            // })
            //     .promise();
            // toast.success("Login successful!");
            // router.push('/')
            // setTimeout(() => {
            //     fetchData(email);
            // }, 100);
            // localStorage.setItem('signdata', JSON.stringify(data));
        } catch (error) {
            console.error('Authentication error:', error);
            toast.error("Authentication error: " + error);
        } finally {
            setLoading(false);
        }
    };
    const [userValue, setUserValue] = useState({});

    // const fetchData = async (email: any) => {
    //     const query = `
    //   query MyQuery {
    //     listLobslogindata(filter: {email: {eq: "${email}"}}) {
    //       items {
    //         address
    //         cognito_id
    //         date
    //         dealer_name
    //         dob
    //         email
    //         email_status
    //         firstname
    //         id
    //         lastname
    //         phonenumber
    //         profile_image
    //         refernce_id
    //       }
    //     }
    //   }
    // `;

    //     const headers = {
    //         'x-api-key': 'da2-tsnyse7bfna23kep4wrsfi5etu',
    //         'Content-Type': 'application/json',
    //     };

    //     const endPoint = "https://cewwkawyyzaqdd4mkuwtmikhca.appsync-api.ap-south-1.amazonaws.com/graphql";

    //     try {
    //         const res = await axios.post(endPoint, { query }, { headers });

    //         if (res.data.errors) {
    //             console.error("GraphQL errors:", res.data.errors);
    //             toast.error("Error fetching data: " + res.data.errors[0].message);
    //             return;
    //         }

    //         const items = res.data.data.listLobslogindata?.items || [];
    //         if (items.length === 0) {
    //             console.warn("No data found for the provided email:", email);
    //         }

    //         const dataWithSerialNumber = items.map((row: any, index: any) => ({
    //             ...row,
    //             'S.No': index + 1,
    //         }));

    //         localStorage.setItem('signuserData', JSON.stringify(dataWithSerialNumber));
    //         const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
    //         if (redirectAfterLogin) {
    //             localStorage.getItem("redirectAfterLogin");
    //             const userDetailsJson = localStorage.getItem("signuserData");
    //             if (userDetailsJson) {
    //                 const userDetails = JSON.parse(userDetailsJson);
    //                 userDetails.map((user: any) => {
    //                     localStorage.setItem('userloginemail', JSON.stringify(user.email));
    //                     //setUserValue(user);
    //                 });
    //             }
    //             router.push(redirectAfterLogin);

    //         } else {
    //             router.push("/dashboard");
    //         }
    //     } catch (err) {
    //         console.error('Error fetching data:', err);
    //         toast.error("Error fetching data: " + err);
    //     }
    // };

    const resetPasswordRequest = (username: string) => {
        setLoading(true)
        fetch('/api/password/reset_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(username)
        }).then(res => {
            if (!res.ok) throw res;
        })
        // .then(data => {
        //     router.push({
        //         pathname: '/reset-password',
        //         query: { email: username }
        //     });
        //     toast.success("Otp sent to your mail");
        // }).catch((err) => {
        //     if (err instanceof Response) {
        //         err
        //             .json()
        //             .then((data) => {
        //                 toast.error(data.message);
        //             })
        //             .catch(() => {
        //                 toast.error("Resend OTP failed. Please try again.");
        //             });
        //     }
        // })
        // .finally(() => {
        //     setLoading(false);
        // });
    }

    const resetPassword = (otpValue: any, email: any, cPassword: any) => {
        fetch('/api/password/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otpValue, email, cPassword })
        })
            .then(res => {
                if (!res.ok) throw res
                toast.success("Password Reset Successfull");
                // router.push({
                //     pathname: '/page-login',
                //     query: { reset: true }
                // },
                //     "/page-login")
            })
            .catch((err) => {
                if (err instanceof Response) {
                    err
                        .json()
                        .then((data) => {
                            toast.error(data.message);
                        })
                        .catch(() => {
                            toast.error("Failed. Please try again.");
                        });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }
    return {
        login,
        resetPasswordRequest,
        resetPassword,
        loading,
        userPoolId // Return User Pool ID from the hook
    }
}

export default useAuth;
