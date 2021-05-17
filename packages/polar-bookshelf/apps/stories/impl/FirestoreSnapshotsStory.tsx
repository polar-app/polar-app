import * as React from 'react';
import {Firestore} from "../../../web/js/firebase/Firestore";
import {Firebase} from "../../../web/js/firebase/Firebase";
import firebase from 'firebase/app'

export type FirestoreSnapshot = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>

export const FirestoreSnapshotsStory = () => {

    const [snapshot, setSnapshot] = React.useState<FirestoreSnapshot | undefined>();
    const [error, setError] = React.useState<Error | undefined>();

    const handleSnapshot = React.useCallback((snapshot: FirestoreSnapshot) => {
        setSnapshot(snapshot);
        setError(undefined);
    }, []);

    const handleError = React.useCallback((err: Error) => {
        setSnapshot(undefined);
        setError(err);
    }, []);


    const doAsync = React.useCallback(async () => {

        // console.log("doAsync")
        //
        // const firestore = await Firestore.getInstance();
        //
        // const uid = await Firebase.currentUserID();
        // const ref = firestore.collection('user_pref').doc(uid);
        //
        // ref.onSnapshot(handleSnapshot, handleError);

    }, []);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    React.useMemo(() => doAsync().catch(err => console.error(err)), [doAsync]);

    return (
        <div>
            <h1>
                snapshot data:
            </h1>

            <div>
                <h2>snapshot:</h2>

                <b>uid:</b> {snapshot?.data()?.uid} <br/>
                <b>fromCache:</b> {snapshot?.metadata.fromCache ? 'true' : 'false'} <br/>
            </div>
            <div>
                <b>error:</b> {error?.message}
            </div>

        </div>
    );

}
