import {FirebaseAdmin} from "./FirebaseAdmin";

export namespace FirebaseUserCreator {
    export const create = async (email: string, password: string) => {
        const auth = FirebaseAdmin.app().auth();
        return await auth.createUser({email, password});
    }
}
