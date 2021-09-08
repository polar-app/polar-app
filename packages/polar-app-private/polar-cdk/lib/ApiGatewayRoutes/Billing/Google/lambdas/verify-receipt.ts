import {APIGatewayProxyHandler} from 'aws-lambda';
import {Firebase} from "polar-admin/Firebase";

interface GoogleReceipt {
    orderId: string,
    packageName: "io.getpolarized.polar",
    productId: "subscription_plan_plus" | "subscription_plan_pro",
    purchaseTime: number, // unix timestamp
    purchaseToken: string, // stays the same through lifetime of Subscription
}

interface VerifyReceiptRequest {
    email: string,
    receipt: string, // JSON encoded object
}

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(event);
    const body: VerifyReceiptRequest = JSON.parse(event.body || "{}");

    if (!body.email || !body.receipt) {
        // Payload didn't match the structure documented here:
        // @see https://developer.android.com/google/play/billing/rtdn-reference
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Invalid receipt or email",
            })
        }
    }

    const receipt: GoogleReceipt = JSON.parse(body.receipt);

    console.log('receipt', JSON.stringify(receipt, null, 2));
    console.log('orderId', receipt.orderId);

    // Store a mapping of this subscription ID and the email that purchased it, for easier retrieval later
    // When Google keeps calling the RTDN endpoint in the background as subscriptions' lifecycle
    // changes in the future (paused, renewed, cancelled, renewed, etc)
    const ref = Firebase.getApp()
        .firestore()
        .collection('android_iap_map')
        .doc(receipt.purchaseToken);

    await ref.set({
        email: body.email,
        originalReceipt: receipt,
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Receipt is now connected to this email",
        })
    }
}
