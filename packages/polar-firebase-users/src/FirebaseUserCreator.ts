import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {MigrationCollection} from "polar-firebase/src/firebase/om/MigrationCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

export namespace FirebaseUserCreator {

    export async function createMigrationForBlockAnnotations(uid: UserIDStr) {
        const firestore = FirestoreAdmin.getInstance();
        await MigrationCollection.createSnapshotByName(firestore, uid, 'block-annotations')
    }

    export async function create(email: string, password: string) {

        const auth = FirebaseAdmin.app().auth();
        const user = await auth.createUser({email, password});

        const firestore = FirestoreAdmin.getInstance();

        await MigrationCollection.createMigrationForBlockAnnotations(firestore, user.uid);

        return user;

    }

}
