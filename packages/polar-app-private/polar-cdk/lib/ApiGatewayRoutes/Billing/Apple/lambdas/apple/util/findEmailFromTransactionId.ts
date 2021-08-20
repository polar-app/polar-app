import {Firebase} from "polar-admin/Firebase";

export default async function findEmailFromTransactionId(originalTransactionId: string) {
    const ref = Firebase.getApp()
        .firestore()
        .collection('apple_iap_subscription_to_email_map')
        .doc(originalTransactionId);
    const res = await ref.get();
    return res.get('email');
}
