import {FirestoreAdmin} from 'polar-firebase-admin/src/FirestoreAdmin';
import {ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

async function main() {

    async function deleteUserDataForCollection(collectionName: string, uid: string) {

        const firestore = FirestoreAdmin.getInstance()
        const collection = firestore.collection(collectionName);
        const snapshot = await collection.where("uid", '==', uid)
            .get();

        console.log("Deleting data in collection: " + collectionName);

        const progressTracker = new ProgressTracker({total: snapshot.size, id: 'delete'});

        for(const doc of snapshot.docs) {
            const docRef = collection.doc(doc.id);
            console.log("Deleting doc... " + progressTracker.peek().progress);
            await docRef.delete();
            progressTracker.incr();
        }

    }

    async function getUserID(email: string) {
        const admin = FirebaseAdmin.app();
        const auth = admin.auth();
        const user = await auth.getUserByEmail(email);
        if (! user) {
            throw new Error("No user for email: " + email);
        }

        return user.uid;

    }

    const uid = await getUserID('getpolarized.test+test@gmail.com');

    const collectionNames = ['block', 'doc_info', 'doc_meta'];

    for (const collectionName of collectionNames) {
        await deleteUserDataForCollection(collectionName, uid)
    }

}

main().catch(err => console.error(err));
