import getFirebaseAdminApp from "../../../../../shared/getFirebaseAdminApp";
import {Account} from "./types/Account";

export default async function changePlanForEmail(changePlanConfig: {
    email: string,
    productId: "plus" | "pro",
    customerId: string,
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

        lastModified: new Date().toISOString()
    };

    const ref = firebaseAdminApp.firestore()
        .collection('account')
        .doc(account.id);

    const writeResult = await ref.set(account);

    return writeResult.writeTime.toMillis() > 0;
}
