import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {Logger} from '../../js/logger/Logger';
import {Firebase} from '../../js/firebase/Firebase';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {DocPermissions} from '../../js/datastore/firebase/DocPermissions';

const log = Logger.create();

mocha.setup('bdd');
mocha.timeout(10000);

const FIREBASE_USER = process.env.FIREBASE_USER!;
const FIREBASE_PASS = process.env.FIREBASE_PASS!;

const FIREBASE_USER1 = process.env.FIREBASE_USER1!;
const FIREBASE_PASS1 = process.env.FIREBASE_PASS1!;

SpectronRenderer.run(async (state) => {

    console.log("Running...");

    const app = Firebase.init();

    await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
    console.log("We are authenticated now");

    const datastore = new FirebaseDatastore();
    await datastore.init();
    const firestore = app.firestore();

    const docMeta = MockDocMetas.createMockDocMeta();

    await datastore.writeDocMeta(docMeta);

    // keep the doc ID of the document so we can login with another user to test with.
    const docID = FirebaseDatastore.computeDocMetaID(docMeta.docInfo.fingerprint);

    console.log("Working with docID: " + docID);

    const writeDocPermission = async () => {

        const recipients = [FIREBASE_USER1];
        const fingerprint = docMeta.docInfo.fingerprint;

        await DocPermissions.write(fingerprint, recipients);

        // const ref = firestore.collection("doc_permission").doc(docID);
        //
        // const id = docID;
        // const uid = FirebaseDatastore.getUserID();
        // const fingerprint = docMeta.docInfo.fingerprint;
        // const recipients = [FIREBASE_USER1];
        // const data = {id, uid, fingerprint, recipients};
        //
        // await ref.set(data);

    };

    await writeDocPermission();

    await firestore.collection("doc_meta").doc(docID).get();
    console.log("Got the doc with the primary user");

    await datastore.stop();

    await app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

    console.log("We are authenticated now with the new user.");

    await firestore.collection("doc_meta").doc(docID).get();

    console.log("Got the document!");

    // now try to read directly via the document ID

});

class Maths {

    public static stats(values: readonly number[]): Stats {

        // compute min/max/mean 90 and 95th percentile.
        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = this.mean(values);

        // total duration
        const duration = this.sum(values);
        const percentile90 = this.percentile(90, values);
        const percentile95 = this.percentile(95, values);

        return {min, max, mean, duration, percentile90, percentile95};

    }

    public static percentile(percentile: number,
                             values: readonly number[]) {

        if (values.length === 0) {
            return NaN;
        }

        const cutoff = Math.floor((values.length * (percentile / 100)) - 1);

        if (cutoff < 0 || cutoff >= values.length) {
            throw new Error("Invalid cutoff: " + cutoff);
        }

        const ranked = [...values].sort().reverse();

        return ranked[cutoff];

    }

    public static sum(values: readonly number[]) {

        let result: number = 0;

        for (const value of values) {
            result += value;
        }

        return result;

    }

    public static mean(values: readonly number[]) {

        if (values.length === 0) {
            return NaN;
        }

        const sum = Maths.sum(values);

        return sum / values.length;

    }

}

interface Stats {
    readonly min: number;
    readonly max: number;
    readonly mean: number;
    readonly duration: number;
    readonly percentile90: number;
    readonly percentile95: number;
}
