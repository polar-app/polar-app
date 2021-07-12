import {ExpressFunctions} from "../util/ExpressFunctions";
import {Lazy} from "../util/Lazy";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {default as fetch} from "node-fetch";
import {Accounts} from "../stripe/Accounts";
import {Billing} from "polar-accounts/src/Billing";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

interface Response {
    code: string,
    success: boolean,
}

interface Request {
    // Base64 encoded Receipt, as received by Apple's In App Purchasing mechanism
    receipt: string,

    // User's email
    email: string,
}

export async function validateReceipt(receiptData: string) {
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

    if (!request.email) {
        ExpressFunctions.sendError(res, Error('Failed to validate the receipt with Apple'));
        return;
    }

    const result = await validateReceipt(request.receipt);

    if (!result.receipt || result.status === 21002) {
        ExpressFunctions.sendError(res, Error('Failed to validate the receipt with Apple'));
        return;
    }

    console.log("Response from Apple validateReceipt(): ", JSON.stringify(result, null, 2));

    const email = request.email;
    const customerId = '999999'; // @TODO this is Stripe customer, work around this because this callback is from Apple not Stripe
    const plan: Billing.Plan = {
        ver: "v2",
        level: result.product_id.replace('plan_', ''), // remove the "plan_" prefix
    };
    const interval = 'month';

    await Accounts.changePlanViaEmail(email, customerId, plan, interval);

    const response: Response = {
        code: 'ok',
        success: true,
    };

    ExpressFunctions.sendResponse(res, response);

});
