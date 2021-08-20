import {Firebase} from "polar-admin/Firebase";
import {AppleVerifyReceiptResponse} from "./types/AppleVerifyReceiptResponse";

export async function linkEmailToReceipt(email: string, result: AppleVerifyReceiptResponse) {
    const transactionId = result.latest_receipt_info.find(value => true)!.original_transaction_id;

    // Store a mapping of this subscription ID and the email that purchased it, for easier retrieval later
    const ref = Firebase.getApp()
        .firestore()
        .collection('apple_iap_subscription_to_email_map')
        .doc(transactionId);

    await ref.set({
        originalTransactionId: transactionId,
        email,
        // Keep it for future usage
        originalReceipt: result,
    });
}
