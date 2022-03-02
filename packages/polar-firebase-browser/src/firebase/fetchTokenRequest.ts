import { IVerifyTokenAuthRequest, IVerifyTokenAuthResponse } from "polar-backend-api/src/api/VerifyTokenAuth";

export default async function fetchTokenRequest(email: string): Promise<string> {

    const url = `https://us-central1-polar-32b0f.cloudfunctions.net/VerifyTokenAuth/`;

    const requestBody: IVerifyTokenAuthRequest = {
        email,
        challenge: "123456"
    }

    const response = await fetch(url, {
        method: 'POST',
        // credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    const responseBody = <IVerifyTokenAuthResponse>await response.json();

    if (response.status !== 200 || responseBody.code !== 'ok') {
        throw new Error("Failed to verify fetch token");
    }

    return responseBody.customToken;
}