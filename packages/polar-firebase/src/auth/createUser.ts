import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

export const createUser = async (email: string, password: string) => {
    const auth = FirebaseAdmin.app().auth();
    return await auth.createUser({email, password});
}
