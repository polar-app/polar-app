import * as React from 'react';
import {Firestore} from "../../../web/js/firebase/Firestore";
import {useComponentDidMount} from "../../../web/js/hooks/ReactLifecycleHooks";
import firebase from 'firebase/app'

export const FirestoreInitStory = React.memo(function FirestoreInitStory() {

    const [init, setInit] = React.useState(false);

    const doAsyncRaw = React.useCallback(async () => {

        const app = firebase.initializeApp({
            apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
            authDomain: "polar-32b0f.firebaseapp.com",
            databaseURL: "https://polar-32b0f.firebaseio.com",
            projectId: "polar-32b0f",
            storageBucket: "polar-32b0f.appspot.com",
            messagingSenderId: "919499255851",
            // timestampsInSnapshots: true
        })

        firebase.firestore.setLogLevel("debug");
        const firestore = firebase.firestore(app);

        const settings = {
            // timestampsInSnapshots: true
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        };

        firestore.settings(settings);

        console.log("Enabling firestore persistence....");
        await firestore.enablePersistence({synchronizeTabs: true});
        console.log("Enabling firestore persistence....done");

        setInit(true);

    }, []);


    const doAsync = React.useCallback(async () => {

        await Firestore.init();
        setInit(true);

    }, []);

    useComponentDidMount(() => {
        doAsyncRaw()
            .catch(err => console.error(err));
    })

    return (
        <div>
            {init ? "Initialized" : "Loading..."}
        </div>
    );

});
