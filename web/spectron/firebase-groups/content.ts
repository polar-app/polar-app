import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {Logger} from '../../js/logger/Logger';
import {Firebase} from '../../js/firebase/Firebase';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {DocPermissions} from '../../js/datastore/firebase/DocPermissions';
import {RecipientTokenMap} from '../../js/datastore/firebase/DocPermissions';
import {DocTokens} from '../../js/datastore/firebase/DocTokens';
import {DocPeerPendings} from '../../js/datastore/firebase/DocPeerPendings';
import {assert} from 'chai';
import {Backend} from '../../js/datastore/Backend';
import {FilePaths} from '../../js/util/FilePaths';
import {FileRef} from '../../js/datastore/Datastore';
import {FirebaseDatastores} from '../../js/datastore/FirebaseDatastores';
import {DocPeer} from '../../js/datastore/firebase/DocPeers';
import {GroupProvisionRequest} from '../../js/datastore/sharing/GroupProvisions';
import {GroupProvisions} from '../../js/datastore/sharing/GroupProvisions';

const log = Logger.create();

mocha.setup('bdd');
mocha.timeout(10000);

const FIREBASE_USER = process.env.FIREBASE_USER!;
const FIREBASE_PASS = process.env.FIREBASE_PASS!;

const FIREBASE_USER1 = process.env.FIREBASE_USER1!;
const FIREBASE_PASS1 = process.env.FIREBASE_PASS1!;

async function verifyFailed(delegate: () => Promise<any>) {

    let failed: boolean;

    try {

        await delegate();
        failed = false;

    } catch (e) {
        failed = true;
    }

    if (! failed) {
        throw new Error("Did not fail as expected");
    }

}

SpectronRenderer.run(async (state) => {

    describe("firebase-groups", async function() {

        it("group provision", async function() {

            const app = Firebase.init();

            await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

            const user = app.auth().currentUser;

            const idToken = await user!.getIdToken();

            const request: GroupProvisionRequest = {
                idToken,
                docs: [],
                invitations: {
                    message: "Private invite to my special group",
                    to: [
                        'getpolarized.test+test1@gmail.com'
                    ]
                },
                visibility: 'private'
            };

            await GroupProvisions.exec(request);

        });

    });

    mocha.run((nrFailures: number) => {

        state.testResultWriter.write(nrFailures === 0)
            .catch(err => console.error("Unable to write results: ", err));

    });

});
