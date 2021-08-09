import {default as fetch} from "node-fetch";
import getFirebaseAdminApp from "../../../../../shared/getFirebaseAdminApp";

interface VerifyReceiptRequest {
    email: string,
    receipt: string,
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

        /**
         * A unique identifier for purchase events across devices, including subscription-renewal events.
         * This value is the primary key to identify subscription purchases.
         */
        web_order_line_item_id: string,
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

export const handler = async (event: {
    body: string,
}) => {

    const verifyReceiptRequest: VerifyReceiptRequest = JSON.parse(event.body);

    console.log(verifyReceiptRequest);

    const email = verifyReceiptRequest.email;

    if (!email) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Email is a required parameter",
            })
        }
    }
    if (!verifyReceiptRequest.receipt) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Receipt is a required parameter",
            })
        }
    }

    const result = await verifyReceipt(verifyReceiptRequest.receipt);

    if (!result.receipt || result.status === 21002) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Failed to validate the receipt with Apple',
            })
        }
    }

    const latestTransaction = result.latest_receipt_info.find(value => true);

    if (!latestTransaction) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Can not find a Transaction within the Receipt',
            })
        }
    }

    const originalTransactionId = latestTransaction.original_transaction_id;

    // Store a mapping of this subscription ID and the email that purchased it, for easier retrieval later
    const ref = getFirebaseAdminApp()
        .firestore()
        .collection('apple_iap_subscription_to_email_map')
        .doc(originalTransactionId);

    await ref.set({
        originalTransactionId,
        email,

        // Keep it for potential future usage
        originalReceipt: result,
    });

    console.log(result);

    return {
        statusCode: 200,
        body: JSON.stringify({
            result,
        })
    }

}
