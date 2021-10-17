import {UserIDStr} from "polar-shared/src/util/Strings";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {MigrationCollection} from "polar-firebase/src/firebase/om/MigrationCollection";

export namespace FirebaseUserCreator {

    export async function createMigrationForBlockAnnotations(uid: UserIDStr) {
        const firestore = FirestoreAdmin.getInstance();
        await MigrationCollection.createByName(firestore, uid, 'block-annotations')
    }

    export async function create(email: string, password: string) {

        const auth = FirebaseAdmin.app().auth();
        const user = await auth.createUser({email, password});

        await createMigrationForBlockAnnotations(user.uid);

        return user;

    }

}
