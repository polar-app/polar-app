import {Firebase} from "polar-admin/Firebase";

export default async function downgradeToFree(email: any) {

    // Find the User from the Firebase Authentication service
    const user = await Firebase.getApp().auth().getUserByEmail(email);

    const ref = Firebase.getApp().firestore()
        .collection('account')
        .doc(user.uid);

    const deleteResult = await ref.delete();

    return deleteResult.writeTime.toMillis() > 0;
}
