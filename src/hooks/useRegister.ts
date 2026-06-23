import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
//import { CognitoIdentityServiceProvider } from "aws-sdk";
import crypto from 'crypto';
//import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

interface RegisterHook {
  register: (email: string, password: string, username: string) => void;
  isEmailRegistered: (email: string) => Promise<boolean>;
  loading: boolean;
  registrationData: string | null;
  confirm: (otpValue: string, username: string) => void;
  resendOtp: (username: string) => void;
}

const useRegister = (): RegisterHook => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [registrationData, setRegistrationData] = useState<string | null>("");

  const register = async (email: string, password: string, username: string) => {
    // setLoading(true);
    // const cognito = new CognitoIdentityServiceProvider({
    //   region: "ap-south-1",
    // });

    // const generateSecretHash = (username: string, clientId: string, clientSecret: string) => {
    //   return crypto.createHmac('SHA256', clientSecret)
    //     .update(username + clientId)
    //     .digest('base64');
    // };

    // const clientId = '2if2nj26og5j95248oj8h2oj2u';
    // const clientSecret = 'ko78b7een9nc9smr7prqplqr0s77s4tbvodk2b4qh4rdlt3vkt6';
    // const secretHash = generateSecretHash(email, clientId, clientSecret);

    // try {
    //   const params = {
    //     ClientId: clientId,
    //     Username: email,
    //     Password: password,
    //     SecretHash: secretHash,
    //     UserAttributes: [
    //       { Name: "email", Value: email },
    //       { Name: "preferred_username", Value: username },
    //     ],
    //   };

   
    //   const data = await cognito.signUp(params).promise();

    //   toast.success("Sign up successful");

    //   localStorage.setItem('signupemail', username);
    //   const userSub = data.UserSub;
    //   const userEmail = data.CodeDeliveryDetails?.Destination;
    //   const userConfirmed = data.UserConfirmed || false;

    //   toast.success('OTP sent to your email');
    //   localStorage.setItem("userName", username);
    //   localStorage.setItem("password", password);
    //   localStorage.setItem("userConfirmed", data.UserConfirmed.toString());
    //   localStorage.setItem("userEmail", email);
    //   localStorage.setItem("usersubToken", data.UserSub);

    //   setRegistrationData(userSub);

    //   router.push('/otp');
    // } catch (error: any) {
    //   console.error("Registration error:", error);
    //   if (error.code === 'UsernameExistsException') {
    //     toast.error("User is already registered with this Email id");
    //   } else if (error.code === 'CredentialsError') {
    //     toast.error("Authentication error: Please check your credentials.");
    //   } else if (error.code === 'NetworkError') {
    //     toast.error("Please check your internet connection. Unable to reach AWS services due to Network error.");
    //   } else {
    //     toast.error("Registration failed. Please try again.");
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  const isEmailRegistered = async (email: string): Promise<any> => {
    try {
      // const cognito = new CognitoIdentityServiceProvider({
      //   region: "ap-south-1",
      // });

      const params = {
        UserPoolId: "ap-south-1_SAtVEwSm7",
        Filter: `email = "${email}"`,
        Limit: 1,
      };

return
      //const data = await cognito.listUsers(params).promise();

     // return (data.Users?.length || 0) > 0;
    } catch (error: any) {
      console.error("Error fetching user information:", error);
      if (error.code === "CredentialsError") {
        toast.error("Authentication error: Please check your credentials.");
      } else if (error.code === "NetworkError") {
        toast.error("Network error: Unable to reach AWS services. Please check your internet connection.");
      } else {
        toast.error("Error fetching user information.");
      }
      throw error;
    }
  };

  const confirm = async (otpValue: string, username: string) => {
    // setLoading(true);
    // const generateSecretHash = (username: string, clientId: string, clientSecret: string) => {
    //   return crypto.createHmac('SHA256', clientSecret)
    //     .update(username + clientId)
    //     .digest('base64');
    // };

    // const clientId = '2if2nj26og5j95248oj8h2oj2u';
    // const clientSecret = 'ko78b7een9nc9smr7prqplqr0s77s4tbvodk2b4qh4rdlt3vkt6';
    // const secretHash = generateSecretHash(username, clientId, clientSecret);
    // try {
    //   // AWS Cognito parameters
    //   const params = {
    //     ClientId: "2if2nj26og5j95248oj8h2oj2u",
    //     ConfirmationCode: otpValue,
    //     Username: username,
    //     SecretHash: secretHash,
    //   };
    //   // Initialize Cognito client
    //   const cognitoClient = new CognitoIdentityProviderClient({
    //     region: "ap-south-1",
    //   });

    //   // Create ConfirmSignUpCommand with the parameters
    //   const confirmSignUpCommand = new ConfirmSignUpCommand(params);

    //   // Send the command to Cognito
    //   const response = await cognitoClient.send(confirmSignUpCommand);
    //   router.push("/")
    //   setLoading(false);
    // } catch (error) {
    //   console.error("Error verifying OTP:", error);
    //   setLoading(false);
    // }
    // try {
    //   const res = await fetch("/api/confirm", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ otpValue, username }), // Corrected line
    //   });

    //   if (!res.ok) {
    //     const errorData = await res.json();
    //     toast.error(errorData.message || "Enter the OTP");
    //     throw new Error("Failed to verify OTP");
    //   }

    //   const data = await res.json();
    //   toast.success("Verified Successfully");
    //   router.push("/");
    // } catch (err) {
    //   console.error("Error verifying OTP:", err);
    //   toast.error("OTP verification failed. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  const resendOtp = async (username: string) => {
    try {
      const res = await fetch("/api/confirm/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to resend OTP");
        return;
      }

      toast.success("OTP has been resent successfully!");
    } catch (err) {
      console.error("Error resending OTP:", err);
      toast.error("Resend OTP failed. Please try again.");
    }
  };

  return {
    register,
    isEmailRegistered,
    confirm,
    resendOtp,
    loading,
    registrationData,
  };
};

export default useRegister;
