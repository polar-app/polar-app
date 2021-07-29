import React from 'react';
import {FirestoreCollections} from "./reviewer/FirestoreCollections";
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {useAsyncWithError} from "../../../web/js/hooks/ReactLifecycleHooks";
import firebase from 'firebase/app'
import {IFirestoreClient} from "polar-firestore-like/src/IFirestore";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/Firebase";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

export interface IFirestoreContext {
    readonly uid: string | undefined;
    readonly user: firebase.User | undefined;
    readonly firestore: IFirestoreClient;
}

// Firestore context which will now ALWAYS be defined anywhere in the app as
// the provider will not call its children if there is no firestore.
const FirestoreContext = React.createContext<IFirestoreContext>(null!);

/**
 * Get the firestore context, or undefined if one is not defined yet.
 */
export function useFirestore() {
    return React.useContext(FirestoreContext);
}

interface IProps {
    readonly children: React.ReactNode;
}

async function doAsync(): Promise<IFirestoreContext> {

    const firestore = await FirestoreBrowserClient.getInstance();

    const user = await FirebaseBrowser.currentUserAsync();

    const uid = user?.uid;

    await FirestoreCollections.configure(firestore);

    return {
        firestore, uid,
        user: user || undefined
    };
}

export const FirestoreProvider = deepMemo(function FirestoreProvider(props: IProps) {

    const data = useAsyncWithError({promiseFn: doAsync});

    if (data) {
        return (
            <FirestoreContext.Provider value={data}>
                {props.children}
            </FirestoreContext.Provider>
        );
    }

    return (
        <div className="no-firestore-provider"/>
    );

});
