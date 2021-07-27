import getFirebaseAdminApp from "../../../../../shared/getFirebaseAdminApp";

export default async function downgradeToFree(email: any) {
    const firebaseAdminApp = getFirebaseAdminApp();

    // Find the User from the Firebase Authentication service
    const user = await firebaseAdminApp.auth().getUserByEmail(email);

    const ref = firebaseAdminApp.firestore()
        .collection('account')
        .doc(user.uid);

    const deleteResult = await ref.delete();

    return deleteResult.writeTime.toMillis() > 0;
}
