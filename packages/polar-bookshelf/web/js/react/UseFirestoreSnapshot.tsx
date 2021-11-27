import React from 'react';
import {useFirestore} from "../../../apps/repository/js/FirestoreProvider";
import {createSnapshotStore, SnapshotSubscriber} from "./UseSnapshot";
import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

type QuerySnapshotSubscriber<SM = unknown> = SnapshotSubscriber<IQuerySnapshot<SM>>;

interface FirestoreSnapshotProps {
    readonly fallback: JSX.Element;
    readonly children: JSX.Element;
}

/**
 * Perform a query over a given collection which has a 'uid' for all the users
 * data.
 */
export function createFirestoreSnapshotForUserCollection(collectionName: string) {

    const [SnapshotStoreProvider, useSnapshotStore] = createSnapshotStore();

    const {firestore, uid} = useFirestore();

    const subscriber = React.useMemo<QuerySnapshotSubscriber<ISnapshotMetadata>>(() => {

        if (uid === null || uid === undefined) {
            return (o) => {
                return NULL_FUNCTION;
            };
        }

        return (onNext, onError) => {

            return firestore.collection(collectionName)
                            .where('uid', '==', uid)
                            .onSnapshot(next => onNext(next), err => onError(err));

        }

    }, [collectionName, uid]);

    const FirestoreSnapshotProvider = React.memo((props: FirestoreSnapshotProps) => {
        return (
            <SnapshotStoreProvider subscriber={subscriber} fallback={props.fallback}>
                {props.children}
            </SnapshotStoreProvider>
        );
    });

    return [FirestoreSnapshotProvider, useSnapshotStore];

}
