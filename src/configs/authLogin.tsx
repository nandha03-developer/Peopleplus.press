//import AWS from 'aws-sdk';
import crypto from 'crypto';
import { useRouter } from 'next/router';

//const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;

// Configure AWS with your credentials and region
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Use environment variables
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  // Use environment variables
//     region: 'ap-south-1'  // Replace with your AWS region
// });

// const cognito = new CognitoIdentityServiceProvider();

// Replace these values with your Cognito User Pool details
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '';
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || '';

const generateSecretHash = (email: string, clientId: string, clientSecret: string): string => {
  return crypto.createHmac('SHA256', clientSecret)
    .update(email + clientId)
    .digest('base64');
};
export const AuthLogin = async (email: any, password: any) => {
const router = useRouter()
  const secretHash = generateSecretHash(email, CLIENT_ID, CLIENT_SECRET);

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash
    }
  };
  try {
    //const response = await cognito.initiateAuth(params).promise();
      router.push('/');

  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};