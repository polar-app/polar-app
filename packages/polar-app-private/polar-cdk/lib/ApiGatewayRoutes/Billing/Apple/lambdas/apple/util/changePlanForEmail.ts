import getFirebaseAdminApp from "../../../../../../shared/getFirebaseAdminApp";
import {Account} from "./types/Account";

export default async function changePlanForEmail(changePlanConfig: {
    // Email of the customer
    email: string,

    // The original transaction ID, which doesn't change across monthly billings for the same plan
    customerId: string,

    // The plan code that was purchased
    productId: "plus" | "pro",

    // Unix timestamp after which the Plan should be no longer considered active
    expiresAt: number,
}) {
    const firebaseAdminApp = getFirebaseAdminApp();

    const email = changePlanConfig.email;

    // Find the User from the Firebase Authentication service
    const user = await firebaseAdminApp.auth().getUserByEmail(email);

    const account: Account = {
        id: user.uid,
        uid: user.uid,
        email,
        plan: {
            level: changePlanConfig.productId,
            ver: "v2",
        },

        // Interval is fixed to "monthly" because it's configured on the App Store
        // and can't be changed through parameters
        interval: 'month',

        customer: {
            type: 'apple_iap',
            customerID: changePlanConfig.customerId,
        },

        lastModified: new Date().toISOString(),
        expiresAt: new Date(changePlanConfig.expiresAt * 1000).toISOString(),
    };

    const ref = firebaseAdminApp.firestore()
        .collection('account')
        .doc(account.id);

    const writeResult = await ref.set(account);

    return writeResult.writeTime.toMillis() > 0;
}
