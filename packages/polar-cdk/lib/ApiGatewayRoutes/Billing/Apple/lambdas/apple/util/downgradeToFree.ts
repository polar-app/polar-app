import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

export default async function downgradeToFree(email: any) {

    // Find the User from the Firebase Authentication service
    const user = await FirebaseAdmin.app().auth().getUserByEmail(email);

    const ref = FirebaseAdmin.app().firestore()
        .collection('account')
        .doc(user.uid);

    const deleteResult = await ref.delete();

    return deleteResult.writeTime.toMillis() > 0;
}
