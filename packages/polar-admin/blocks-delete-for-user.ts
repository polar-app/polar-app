import {FirestoreAdmin} from 'polar-firebase-admin/src/FirestoreAdmin';
import {ProgressTracker} from "polar-shared/src/util/ProgressTracker";

async function main() {

    const firestore = FirestoreAdmin.getInstance()
    const collection = firestore.collection('doc_info');

    console.log("Getting snapshot...");

    // FIXME: this uid is wrong.
    const snapshot = await collection.where("uid", '==', 'xxx')
                                     .get();

    console.log("Getting snapshot...done");

    const progressTracker = new ProgressTracker({total: snapshot.size, id: 'purge-blocks'});

    for(const doc of snapshot.docs) {
        const docRef = collection.doc(doc.id);
        console.log("Deleting doc... " + progressTracker.peek().progress);
        await docRef.delete();
        progressTracker.incr();
    }
}

main().catch(err => console.error(err));
