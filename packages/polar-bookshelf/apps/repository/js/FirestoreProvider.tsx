import React from 'react';
import {Firestore} from "../../../web/js/firebase/Firestore";
import {FirestoreCollections} from "./reviewer/FirestoreCollections";
import {Firebase} from "../../../web/js/firebase/Firebase";
import {useAsyncWithError} from "./reviewer/ReviewerScreen";
import isEqual from "react-fast-compare";

export interface IFirestore {
    readonly uid: string | undefined;
    readonly user: firebase.User | undefined;
    readonly firestore: firebase.firestore.Firestore;
}

const FirestoreContext = React.createContext<IFirestore>(null!);

export function useFirestore() {
    return React.useContext(FirestoreContext);
}

interface IProps {
    readonly children: React.ReactNode;
}

async function doAsync(): Promise<IFirestore> {

    const firestore = await Firestore.getInstance();
    const user = await Firebase.currentUserAsync();
    const uid = user?.uid;

    await FirestoreCollections.configure(firestore);

    return {
        firestore, uid,
        user: user || undefined
    };
}

export const FirestoreProvider = React.memo((props: IProps) => {

    const data = useAsyncWithError({promiseFn: doAsync});

    if (data) {
        return (
            <FirestoreContext.Provider value={data}>
                {props.children}
            </FirestoreContext.Provider>
        );
    }

    return null;

}, isEqual);
