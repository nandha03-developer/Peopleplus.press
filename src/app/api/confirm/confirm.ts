import { NextRequest, NextResponse } from 'next/server';
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ExpiredCodeException,
} from "@aws-sdk/client-cognito-identity-provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { otpValue, username } = body;

    if (!otpValue || !username) {
      return NextResponse.json({ message: "OTP and username are required" }, { status: 400 });
    }

    const params = {
      ClientId: "2if2nj26og5j95248oj8h2oj2u",
      ConfirmationCode: otpValue,
      Username: username,
    };

    const cognitoClient = new CognitoIdentityProviderClient({
      region: "ap-south-1",
    });
    const confirmSignUpCommand = new ConfirmSignUpCommand(params);

    const response = await cognitoClient.send(confirmSignUpCommand);

    return NextResponse.json(null, { status: response.$metadata.httpStatusCode });
  } catch (err) {
    if (err instanceof ExpiredCodeException) {
      return NextResponse.json({
        message: "Confirmation code has expired. Please request a new one.",
      }, { status: 400 });
    } else {
      return NextResponse.json({ message: "An error occurred while confirming the sign up." }, { status: 500 });
    }
  }
}
