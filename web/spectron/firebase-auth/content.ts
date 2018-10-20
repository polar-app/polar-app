import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Firebase} from '../../js/firestore/Firebase';
import {FirebaseUIAuth} from '../../js/firestore/FirebaseUIAuth';
import * as firebase from '../../js/firestore/lib/firebase';
import {Elements} from '../../js/util/Elements';

// require('firebase');
// import {Firebase} from './Firebase';
// import {FirebaseUIAuth} from './FirebaseUIAuth';
// import {FirebaseUIAuth} from './FirebaseUIAuth';

let docID = 0;

function onData(snapshot: firebase.firestore.QuerySnapshot) {
    console.log("got some data");

    const messagesElement = document.getElementById('messages')!;

    // messagesElement.innerHTML = '';



    for (const docChange of snapshot.docChanges()) {

        if(docChange.type === 'added') {
            const doc = docChange.doc;

            const data = JSON.stringify(doc.data());
            const id = ++docID;
            messagesElement.appendChild(Elements.createElementHTML(`<div>${id}. ${data}</div>`));
        }

    }
}

let firestore: firebase.firestore.Firestore;
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

    } else {
        // User is signed out or there is no user.
        document.getElementById('sign-in-status')!.textContent = 'Signed out';
        document.getElementById('sign-in')!.textContent = 'Sign out';
        document.getElementById('account-details')!.textContent = 'null';
    }

    firestore = firebase.firestore();

    const settings = {timestampsInSnapshots: true};
    firestore.settings(settings);

    await firestore.enablePersistence({experimentalTabSynchronization: true});

    await firestore
        .collection('shoutouts')
        .doc()
        .set({
            from: user!.email!,
            message: 'sup dawg from on Auth' + new Date().toISOString()
        });

    const isPrimary = document.location.href.endsWith("?primary=true");

    if(isPrimary) {

        setTimeout(() => {

            firestore
                .collection('shoutouts')
                .doc()
                .set({
                         from: user!.email!,
                         message: 'sup dawg from on Auth with timeout' + new Date().toISOString()
                     })
                .then(() => console.log("wrote from timeout"))
                .catch(err => console.error(err));

        }, 1500)

    }


    await firestore
        .collection('shoutouts')
        .where('from', '==', user!.email!)
        .onSnapshot(snapshot => onData(snapshot), err => console.log(err));

    console.log("wrote data!");

}

async function createRecord() {

    console.log("Creating record...")

    await firestore
        .collection('shoutouts')
        .doc()
        .set({
             from: currentUser!.email!,
             message: 'sup dawg from create record' + new Date().toISOString()
         }).catch(err => console.error(err));

    console.log("Creating record...done")
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
            .onAuthStateChanged(async (user) => await onAuth(user),
                                (err) => onAuthError(err));

        document.getElementById('create-record')!
            .addEventListener('click', () => createRecord().catch(err => console.error('failed: ', err)));

    };

    window.addEventListener('load', async () => {

        return initApp();
    });


});

