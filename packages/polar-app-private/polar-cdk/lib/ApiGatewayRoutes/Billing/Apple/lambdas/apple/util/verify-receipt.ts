import {default as fetch} from "node-fetch";
import {AppleVerifyReceiptResponse} from "./types/AppleVerifyReceiptResponse";

export async function verifyReceipt(
    receiptData: string,
    endpointUrl = 'https://buy.itunes.apple.com/verifyReceipt'
): Promise<AppleVerifyReceiptResponse> {
    console.log('Verifying receipt with Apple endpoint: ', endpointUrl);
    const result = await fetch(endpointUrl, {
        method: "POST",
        body: JSON.stringify({
            password: '7d8689e01af245d0bd2030ba908ecc06', // Taken from Apple Appstoreconnect -> In App Purchases page
            "receipt-data": receiptData,
            // We are interested in only the latest renewal attempt. This forces the response field
            // "latest_receipt_info" to contain only a single element instead of the full history
            // of renewal attempts
            "exclude-old-transactions": true,
        }),
        headers: {'Content-Type': 'application/json'},
    });
    const res: AppleVerifyReceiptResponse = await result.json();

    console.log('Raw response from "verifyReceipt" endpoint:', res);

    // As per Apple documentation on "Validating Receipts":
    // ```
    // Verify your receipt first with the production URL; then verify with the sandbox URL if you
    // receive a 21007 status code. This approach ensures you do not have to switch between URLs while
    // your application is tested, reviewed by App Review, or live in the App Store.
    // ```
    // @see https://developer.apple.com/documentation/storekit/original_api_for_in-app_purchase/validating_receipts_with_the_app_store
    if (res.status === 21007) {
        console.log('Production endpoint returned an error, indicating that the app is in Sandbox mode')
        console.log('Retrying "verifyReceipt" call using Sandbox URL of Apple...')
        return await verifyReceipt(receiptData, 'https://sandbox.itunes.apple.com/verifyReceipt');
    }

    return res;
}
