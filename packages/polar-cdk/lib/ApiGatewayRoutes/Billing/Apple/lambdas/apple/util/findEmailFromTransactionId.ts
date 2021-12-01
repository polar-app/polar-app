import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

const app = FirebaseAdmin.app();

export default async function findEmailFromTransactionId(originalTransactionId: string) {
    const ref = app.firestore()
        .collection('apple_iap_subscription_to_email_map')
        .doc(originalTransactionId);
    const res = await ref.get();
    return res.get('email');
}
