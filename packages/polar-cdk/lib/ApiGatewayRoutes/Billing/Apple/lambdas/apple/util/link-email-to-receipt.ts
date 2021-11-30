import {AppleVerifyReceiptResponse} from "./types/AppleVerifyReceiptResponse";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

const app = FirebaseAdmin.app();

export async function linkEmailToReceipt(email: string, result: AppleVerifyReceiptResponse) {
    const originalTransactionId = result.latest_receipt_info.find(value => true)!.original_transaction_id;

    console.log(`Linking email to receipt: ${email} ${originalTransactionId}`);

    // Store a mapping of this subscription ID and the email that purchased it, for easier retrieval later

    const ref = app
        .firestore()
        .collection('apple_iap_subscription_to_email_map')
        .doc(originalTransactionId);

    await ref.set({
        originalTransactionId: originalTransactionId,
        email,
        // Keep it for future usage
        originalReceipt: result,
    });
}
