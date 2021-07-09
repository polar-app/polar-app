import {ExpressFunctions} from "../util/ExpressFunctions";
import {IVerifyTokenAuthRequest} from "../token_auth/VerifyTokenAuthentication";
import {Lazy} from "../util/Lazy";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {default as fetch} from "node-fetch";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

interface Response {
    code: string,
    success: boolean,
}

interface Request {

}

export async function validateReceipt(receiptData: string,) {
    // @TODO Apple documentation states:
    //  "Verify your receipt first with the production URL; then verify with the sandbox URL if you receive a 21007 status code. This approach ensures you do not have to switch between URLs while your application is tested, reviewed by App Review, or live in the App Store."
    // @TODO Implement that 2 phase API call mechanism here
    const result = await fetch('https://sandbox.itunes.apple.com/verifyReceipt', {
        method: "POST",
        body: JSON.stringify({
            password: '7d8689e01af245d0bd2030ba908ecc06',
            "receipt-data": receiptData,
        }),
        headers: {'Content-Type': 'application/json'},
    });
    return result.json();
}

export const AppleIapCallback = ExpressFunctions.createHookAsync('AppleIapCallback', async (req, res) => {

    const request: Request = req.body;

    console.log("Handling request: ", typeof request, request);


    const response: Response = {
        code: 'ok',
        success: true,
    };

    ExpressFunctions.sendResponse(res, response);

});
