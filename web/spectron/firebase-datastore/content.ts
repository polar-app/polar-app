import {SpectronRenderer, SpectronRendererState} from '../../js/test/SpectronRenderer';
import {Firebase} from '../../js/firestore/Firebase';
import {FirebaseUIAuth} from '../../js/firestore/FirebaseUIAuth';
import * as firebase from '../../js/firestore/lib/firebase';
import {Elements} from '../../js/util/Elements';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {CompositeFirebaseDatastore} from '../../js/datastore/CompositeFirebaseDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {assert} from "chai";
import {DatastoreTester} from '../../js/datastore/DatastoreTester';
import {Firestore} from '../../js/firestore/Firestore';
import {Hashcodes} from '../../js/Hashcodes';
import {Promises} from '../../js/util/Promises';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';

mocha.setup('bdd');


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

            await this.showUser(user!);

            const firebaseDatastore = new FirebaseDatastore();

            await firebaseDatastore.init();

            DatastoreTester.test(() => firebaseDatastore, false);

            mocha.run((nrFailures: number) => {

                // DatastoreTester.test(() => firebaseDatastore, false);

                this.state.testResultWriter.write(nrFailures === 0)
                    .catch(err => console.error("Unable to write results: ", err));

            });

        } else {

            this.showNoUser();

            // in automated testing we have to fail here because no cookies are
            // present to run this test and someone needs to run the test
            // manually to login to store data
            this.state.testResultWriter.write(false);

        }

    }


    public onAuthError(err: firebase.auth.Error) {
        console.log(err);
        this.state.testResultWriter.write(false);
    }

    private async showUser(user: firebase.User) {

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

    }

    private async showNoUser() {

        // User is signed out or there is no user.
        document.getElementById('sign-in-status')!.textContent = 'Signed out';
        document.getElementById('sign-in')!.textContent = 'Sign out';
        document.getElementById('account-details')!.textContent = 'null';

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



