// import {
//   CognitoIdentityProviderClient,
//   ResendConfirmationCodeCommand,
// } from "@aws-sdk/client-cognito-identity-provider";

// export default async function POST(req: any, res: any) {
  
//   if (req.method !== "POST") return res.status(405).send();

//   const params = {
//     ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
//     Username: req.body.username,
//   };

//   const cognitoClient = new CognitoIdentityProviderClient({
//     region: process.env.NEXT_PUBLIC_COGNITO_REGION,
//   });
//   const resendConfirmationCodeCommand = new ResendConfirmationCodeCommand(
//     params
//   );

//   try {
//     const response = await cognitoClient.send(resendConfirmationCodeCommand)
//     return res.status(response['$metadata'].httpStatusCode).send()
// } catch (err: any) {
//     return res.status(err['$metadata'].httpStatusCode).json({ message: err.toString() })
// }
// }

 import React from 'react'
 
 export default function send() {
   return (
     <div>send</div>
   )
 }
 