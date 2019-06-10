import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {Logger} from '../../js/logger/Logger';
import {Firebase} from '../../js/firebase/Firebase';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {DocPermissions} from '../../js/datastore/firebase/DocPermissions';
import {DocTokens} from '../../js/datastore/firebase/DocTokens';
import {DocPeerPending} from '../../js/datastore/firebase/DocPeerPendings';
import {DocPeerPendings} from '../../js/datastore/firebase/DocPeerPendings';
import {assert} from 'chai';
import {RecipientTokenMap} from '../../js/datastore/firebase/DocPermissions';
import {Sender} from '../../js/datastore/firebase/DocPeerPendings';
import {DocPeer} from '../../js/datastore/firebase/DocPeers';

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
    const firestore = app.firestore();

    const docMeta = MockDocMetas.createMockDocMeta();

    async function writeInitialData() {

        await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
        console.log("We are authenticated now");

        const datastore = new FirebaseDatastore();
        await datastore.init();

        await datastore.writeDocMeta(docMeta);

        // keep the doc ID of the document so we can login with another user to test with.
        const docID = FirebaseDatastore.computeDocMetaID(docMeta.docInfo.fingerprint);

        console.log("Working with docID: " + docID);

        async function writeDocPermission() {

            const recipientTokens: RecipientTokenMap = {};
            recipientTokens[FIREBASE_USER1] = DocTokens.create();
            const fingerprint = docMeta.docInfo.fingerprint;

            await DocPermissions.write(fingerprint, recipientTokens);

        }

        async function writeDocPeerPending() {

            await DocPeerPendings.write({
                to: FIREBASE_USER1,
                message: 'here is your doc yo',
                reciprocal: false,
                token: DocTokens.create(),
                docID
            });

        }

        await writeDocPermission();
        await writeDocPeerPending();

        await firestore.collection("doc_meta").doc(docID).get();
        console.log("Got the doc with the primary user");

        await datastore.stop();

        return docID;

    }

    async function verifyAccessToDocs() {

        console.log("Verifying access to docs");

        await app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

        console.log("Getting doc peer pendings");
        const docPeerPendings = await DocPeerPendings.get();

        assert.isTrue(docPeerPendings.length >= 1);

        // verify that at least ONE of these is the doc we're looking for

        assert.isTrue(docPeerPendings.filter(current => current.docID === docID).length >= 1);

        const docPeerPending = docPeerPendings.filter(current => current.docID === docID)[0];

        await DocPeerPendings.accept(docPeerPending);

        console.log("We are authenticated now with the new user.");

        await firestore.collection("doc_meta").doc(docID).get();

        console.log("Got the document!");

    }

    async function revokeAccessToDocs() {

        await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

        async function writeDocPermission() {

            const recipientTokens: RecipientTokenMap = {};

            const fingerprint = docMeta.docInfo.fingerprint;

            await DocPermissions.write(fingerprint, recipientTokens);

        }

        await writeDocPermission();

        await firestore.collection("doc_meta").doc(docID).get();

        console.log("We have now revoked access to the docs");

    }

    async function verifyAccessDeniedToDocs() {

        await app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

        try {
            await firestore.collection("doc_meta").doc(docID).get();
            throw new Error("Access was NOT denied");
        } catch (e) {
            console.log("Verified that we no longer have access to the docs");
        }

    }

    const docID = await writeInitialData();
    await verifyAccessToDocs();
    await revokeAccessToDocs();
    await verifyAccessDeniedToDocs();

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
