import React from 'react';
import {Firestore} from "../../../web/js/firebase/Firestore";
import {FirestoreCollections} from "./reviewer/FirestoreCollections";
import {Firebase} from "../../../web/js/firebase/Firebase";

interface IFirestoreInitialized {
    readonly uid: string | undefined;
    readonly firestore: firebase.firestore.Firestore;
}

interface IFirestoreError {
    readonly err: Error;
}

export type IFirestore = IFirestoreError | IFirestoreInitialized | undefined;

const FirestoreContext = React.createContext<IFirestore>(undefined);

export function useFirestore() {
    return React.useContext(FirestoreContext);
}

interface IProps {
    readonly children: React.ReactNode;
}

export const FirestoreProvider = (props: IProps) => {

    const [context, setContext] = React.useState<IFirestore>(undefined);

    async function doAsync() {

        try {
            const firestore = await Firestore.getInstance();
            const uid = await Firebase.currentUserID();

            await FirestoreCollections.configure(firestore);

            setContext({firestore, uid: uid!});

        } catch (err) {
            setContext({err})
        }
    }

    doAsync()
        .catch(err => console.error(err));

    return (
        <FirestoreContext.Provider value={context}>
            {props.children}
        </FirestoreContext.Provider>
    );

}
