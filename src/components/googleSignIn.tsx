import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/languageContext";
import { AnyARecord } from 'dns';


export default function GoogleSignIn() {
    const router = useRouter();
    const { langCode } = useLanguage();

       const handleSuccess = async (credentialResponse : any) => {
           const idToken = credentialResponse.credential;
           const decodedData:any = decodeToken(idToken);
           if(decodedData){
            try{
                const email: any = String(decodedData?.email);
                const response = await fetch(
                    `/List_api_tables?table_name=Customer&emailid_contains=${email}`
                  );
                  const data = await response.json();
                  if(data && data.Data.length > 0){
                    localStorage.setItem("cusId", JSON.stringify(data.Data[0].id));
                    router.push(`/${langCode}`);
                  } else {
                    const body = {
                        city: "",
                        country: "",
                        district: "",
                        dob: 0,
                        emailid: decodedData.email,
                        firstname: decodedData.given_name,
                        gender: "",
                        interest: "",
                        iseverified: decodedData.email_verified,
                        ismverified: false,
                        joindate: 0,
                        lastname: decodedData.family_name,
                        mobileno: 0,
                        password: "",
                        postcode: 0,
                        profileimage: decodedData.picture,
                        state: "",
                        cognitoid: "google",
                    }
                    sendToApi(body);
                  }
            } catch (error){
                console.error("Error fetching or sending data:", error);
            }
           }
       };
    const decodeToken = (credentialResponse : any) => {
        try {
          const decoded = jwt.decode(credentialResponse);

          return decoded; 
        } catch (error) {
          console.error("Failed to decode token:", error);
          return null;
        }
      };

      const sendToApi = async (body: any) => {
        try {
            const response = await axios.post('/api/customer', body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.status === 200) {
                localStorage.setItem("cusId", JSON.stringify(response.data.id));
                router.push(`/${langCode}`);
            } else {
                toast.error('Failed to add data.');
            }

        } catch (error: any) {
            console.error('Error adding data:', error);
            toast.error('Failed to add data.');
        }
      };

    const handleError = () => {
        console.error('Login Failed');
    };

    return (
        <GoogleOAuthProvider clientId="250303656162-b2hcppkfqq8j1ig79bla5b5s6t2oemh4.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap={true}
        theme="outline"
        text="signin"
            />
        </GoogleOAuthProvider>
    );
}