import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Firebase} from '../../js/firestore/Firebase';
import {FirebaseUIAuth} from '../../js/firestore/FirebaseUIAuth';
import * as firebase from '../../js/firestore/lib/firebase';
import {Elements} from '../../js/util/Elements';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {MockDocMetas} from '../../js/metadata/DocMetas';

// require('firebase');
// import {Firebase} from './Firebase';
// import {FirebaseUIAuth} from './FirebaseUIAuth';
// import {FirebaseUIAuth} from './FirebaseUIAuth';

let docID = 0;

// let firestore: firebase.firestore.Firestore;
let currentUser: firebase.User | null = null;

async function onAuth(user: firebase.User | null) {

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
        // await firestore.enablePersistence({experimentalTabSynchronization: true});

        const diskDatastore = new DiskDatastore();
        const firebaseDatastore = new FirebaseDatastore(diskDatastore);

        await firebaseDatastore.init();
        console.log("Firebase datastore initialized");

        const persistenceLayer = new DefaultPersistenceLayer(firebaseDatastore);
        const fingerprint = "0x001";

        const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
        await persistenceLayer.sync(fingerprint, docMeta);

        // FIXME: delete the data and test that this works too.

        // await persistenceLayer.delete()

        console.log("Wrote docMeta");


    } else {
        // User is signed out or there is no user.
        document.getElementById('sign-in-status')!.textContent = 'Signed out';
        document.getElementById('sign-in')!.textContent = 'Sign out';
        document.getElementById('account-details')!.textContent = 'null';
    }

}

function onAuthError(err: firebase.auth.Error) {
    console.log(err);
}

SpectronRenderer.run(async () => {

    console.log("Running within SpectronRenderer now.");

    Firebase.init();

    if (firebase.auth().currentUser === null) {
        FirebaseUIAuth.login();
    }

    // TODO: I don't like that the second arg here is the error handling.
    const initApp = async () => {

        // authState(firebase.auth())
        //     .pipe(filter(user => user !== null))
        //     .subscribe(user => console.log('the logged in user', user))

        await firebase.auth()
            .onAuthStateChanged(async (user) => await onAuth(user), (err) => onAuthError(err));

    };

    window.addEventListener('load', async () => {

        return initApp();
    });


});



