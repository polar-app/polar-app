/* eslint-disable camelcase */
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

interface AppleVerifyReceiptResponse {
    status?: number, // returned only on error
    environment: "Sandbox",
    receipt: {
        [key: string]: string | number | unknown[],
    },
    latest_receipt_info: {
        product_id: "plan_plus" | "plan_pro",
        transaction_id: string,
        original_transaction_id: string,
        purchase_date_ms: string,
        expire_date_ms: string,
        in_app_ownership_type: "PURCHASED",
    }[],
}

export async function verifyReceipt(receiptData: string): Promise<AppleVerifyReceiptResponse> {
    // @TODO Apple documentation states: "Verify your receipt first with the production URL; then verify with the sandbox URL if you receive a 21007 status code. This approach ensures you do not have to switch between URLs while your application is tested, reviewed by App Review, or live in the App Store."
    // @TODO Implement that 2 phase API call mechanism here
    const result = await fetch('https://sandbox.itunes.apple.com/verifyReceipt', {
        method: "POST",
        body: JSON.stringify({
            password: '7d8689e01af245d0bd2030ba908ecc06', // Taken from Apple Appstoreconnect -> In App Purchases page
            "receipt-data": receiptData,
            // We are interested in only the latest renewal attempt
            // In other words, this forces the response field "latest_receipt_info" to contain
            // only a single element instead of the full history of renewal attempts by Apple
            "exclude-old-transactions": true,
        }),
        headers: {'Content-Type': 'application/json'},
    });
    return result.json();
}

export const AppleIapCallback = ExpressFunctions.createHookAsync('AppleIapCallback', async (req, res) => {

    const request: Request = req.body;

    // console.log("Handling request: ", typeof request, JSON.stringify(request, null, 2));

    if (!request.email) {
        ExpressFunctions.sendError(res, Error('Invalid "email" provided'));
        return;
    }

    const email = request.email;

    const result = await verifyReceipt(request.receipt);

    if (!result.receipt || result.status === 21002) {
        ExpressFunctions.sendError(res, Error('Failed to validate the receipt with Apple'));
        return;
    }

    // console.log("Response from Apple verifyReceipt(): ", JSON.stringify(result, null, 2));

    console.log('latest_receipt_info->sorted', result.latest_receipt_info);

    // Get latest receipt
    const latestActiveReceipt = result.latest_receipt_info.find(receipt => {
        console.log('Evaluating if receipt with Transaction ID ' + receipt.transaction_id + ' is still valid');
        console.log(receipt);
        return parseInt(receipt.expire_date_ms) > new Date().getTime();
    });

    console.log('latestActiveReceipt', latestActiveReceipt);

    if (!latestActiveReceipt) {
        ExpressFunctions.sendError(res, Error('Failed to find an active receipt from Apple verifyReceipt call'));
        return;
    }

    // Commented because moving this code to AppstoreServerNotification.ts, which
    // is called by Apple Server-To-Server
    // const customer: Accounts.Customer = {
    //     type: "apple_iap",
    //     customerID: latestActiveReceipt.original_transaction_id,
    // }; // @TODO this is Stripe customer, work around this because this callback is from Apple not Stripe
    //
    // const plan: Billing.Plan = {
    //     ver: "v2",
    //     level: latestActiveReceipt.product_id.replace('plan_', '') as Billing.V2PlanLevel, // remove the "plan_" prefix
    // };
    // const interval = 'month';
    //
    // await Accounts.changePlanViaEmail(email, customer, plan, interval);

    const response: Response = {
        code: 'ok',
        success: true,
    };

    ExpressFunctions.sendResponse(res, response);

});
