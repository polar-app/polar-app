import React from 'react';
import firebase from 'firebase/app'
import 'firebase/firestore';

/**
 * Firestore connectivity.  Undefined by default when we don't know the status.
 */
export type FirestoreConnectivity = | 'connected' | 'disconnected';

export function useFirestoreConnectivity(): FirestoreConnectivity | undefined {

    const [connectivity, setConnectivity] = React.useState<FirestoreConnectivity | undefined>(undefined);

    const connectedRef = firebase.database().ref(".info/connected");

    // TODO: this code doesn't work because it relies on relatime database

    //
    // connectedRef.on(function(snap) {
    //
    //     if (snap.val() === true) {
    //         setConnectivity("connected");
    //     } else {
    //         setConnectivity("disconnected");
    //     }
    //
    // });

    return connectivity;

}
