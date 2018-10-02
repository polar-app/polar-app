import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Firebase} from './Firebase';
import {FirebaseUIAuth} from './FirebaseUIAuth';
import * as firebase from './lib/firebase';

// require('firebase');
// import {Firebase} from './Firebase';
// import {FirebaseUIAuth} from './FirebaseUIAuth';
// import {FirebaseUIAuth} from './FirebaseUIAuth';

SpectronRenderer.run(async () => {

    console.log("Running within SpectronRenderer now.");

    Firebase.init();

    if (firebase.auth().currentUser === null) {
        FirebaseUIAuth.login();
    }

    // TODO: I don't like that the second arg here is the error handling.
    const initApp = async () => {

        await firebase.auth().onAuthStateChanged(async (user) => {

            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var uid = user.uid;
                var phoneNumber = user.phoneNumber;
                var providerData = user.providerData;
                user.getIdToken().then((accessToken) => {
                    document.getElementById('sign-in-status')!.textContent = 'Signed in';
                    document.getElementById('sign-in')!.textContent = 'Sign in';
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
                });
            } else {
                // User is signed out or there is no user.
                document.getElementById('sign-in-status')!.textContent = 'Signed out';
                document.getElementById('sign-in')!.textContent = 'Sign out';
                document.getElementById('account-details')!.textContent = 'null';
            }

            const firestore = firebase.firestore();

            const settings = {timestampsInSnapshots: true};
            firestore.settings(settings);

            await firestore
                .collection('shoutouts')
                .doc(user!.email!)
                .set({'message': 'sup'});

            console.log("wrote data!");

        }, (error) => {
            console.log(error);
        });

    };

    window.addEventListener('load', async () => {
        return initApp();
    });

});

