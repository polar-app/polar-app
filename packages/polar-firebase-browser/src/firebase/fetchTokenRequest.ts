import {
    IVerifyTokenAuthRequest,
    IVerifyTokenAuthResponse
} from "polar-backend-api/src/api/VerifyTokenAuth";
import { Fetches } from "polar-shared/src/util/Fetch";


const DEFAULT_CHALLENGE = "123456";

export default async function fetchTokenRequest(email: string): Promise<string> {

    const url = "https://us-central1-polar-32b0f.cloudfunctions.net/VerifyTokenAuth/";

    const requestBody: IVerifyTokenAuthRequest = {
        email,
        challenge: DEFAULT_CHALLENGE
    }

    const response = await Fetches.fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    const responseBody = <IVerifyTokenAuthResponse>await response.json();

    if (response.status !== 200 || responseBody.code !== 'ok') {
        throw new Error("Failed to verify fixed challenge, no custom token recieved.");
    }

    return responseBody.customToken;
}