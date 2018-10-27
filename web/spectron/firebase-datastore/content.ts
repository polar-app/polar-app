import {SpectronRenderer, SpectronRendererState} from '../../js/test/SpectronRenderer';
import {Firebase} from '../../js/firestore/Firebase';
import {FirebaseUIAuth} from '../../js/firestore/FirebaseUIAuth';
import * as firebase from '../../js/firestore/lib/firebase';
import {Elements} from '../../js/util/Elements';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {assert} from "chai";

mocha.setup('bdd');

let docID = 0;

// let firestore: firebase.firestore.Firestore;
let currentUser: firebase.User | null = null;


export class Tester {

    private readonly state: SpectronRendererState;

    constructor(state: SpectronRendererState) {
        this.state = state;
    }

    public async init() {

        await firebase.auth()
            .onAuthStateChanged((user) => this.onAuth(user),
                                (err) => this.onAuthError(err));

    }

    public async onAuth(user: firebase.User | null) {

        currentUser = user!;

        if (user) {

            // User is signed in.
            const displayName = user.displayName;
            const email = user.email;
            const emailVerified = user.emailVerified;
            const photoURL = user.photoURL;
            const uid = user.uid;
            const phoneNumber = user.phoneNumber;
            const providerData = user.providerData;

            const accessToken = await user.getIdToken();

            console.log("user: ", user);

            document.getElementById('sign-in-status')!.textContent = 'Signed in';
            document.getElementById('sign-in')!.textContent = 'Sign in';

            // noinspection TsLint
            document.getElementById('account-details')!.textContent = JSON.stringify({
                 displayName: displayName,
                 email: email,
                 emailVerified: emailVerified,
                 phoneNumber: phoneNumber,
                 photoURL: photoURL,
                 uid: uid,
                 accessToken: accessToken,
                 providerData: providerData
             }, null, '  ');

            // firestore = firebase.firestore();
            //
            // const settings = {timestampsInSnapshots: true};
            // firestore.settings(settings);
            //
            // await firestore.enablePersistence({experimentalTabSynchronization:
            // true});



            //


            const diskDatastore = new DiskDatastore();
            const firebaseDatastore = new FirebaseDatastore(diskDatastore);

            await firebaseDatastore.init();
            console.log("Firebase datastore initialized");

            const persistenceLayer = new DefaultPersistenceLayer(firebaseDatastore);
            const fingerprint = "0x001";

            // FIXME: delete the data and test that this works too.


            describe('Basic Test', async function() {

                it("write basic document", async function () {
                    const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                    await persistenceLayer.sync(fingerprint, docMeta);
                });

                it("delete the document now", async function () {
                    // FIXME: we need a real datastore here...

                    //await persistenceLayer.delete({})
                });

            });

            mocha.run((nrFailures: number) => {

                this.state.testResultWriter.write(nrFailures == 0)
                    .catch(err => console.error("Unable to write results: ", err));

            });

        } else {

            // User is signed out or there is no user.
            document.getElementById('sign-in-status')!.textContent = 'Signed out';
            document.getElementById('sign-in')!.textContent = 'Sign out';
            document.getElementById('account-details')!.textContent = 'null';

            // in automated testing we have to fail here because no cookies are
            // present to run this test and someone needs to run the test manually
            // to login to store data
            this.state.testResultWriter.write(false);

        }

    }


    public onAuthError(err: firebase.auth.Error) {
        console.log(err);
        this.state.testResultWriter.write(false);
    }

}

SpectronRenderer.run(async (state) => {

    console.log("Running within SpectronRenderer now.");

    Firebase.init();

    if (firebase.auth().currentUser === null) {

        // bring up the UI so that we can login.
        FirebaseUIAuth.login();

    }

    window.addEventListener('load', async () => {
        new Tester(state).init();
    });

});



