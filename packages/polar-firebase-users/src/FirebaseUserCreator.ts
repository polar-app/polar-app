import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {MigrationCollection} from "polar-firebase/src/firebase/om/MigrationCollection";

export namespace FirebaseUserCreator {

    export async function create(email: string, password: string) {

        const auth = FirebaseAdmin.app().auth();
        const user = await auth.createUser({email, password});

        await MigrationCollection.createMigrationForBlockAnnotations(user.uid);

        return user;

    }

}
