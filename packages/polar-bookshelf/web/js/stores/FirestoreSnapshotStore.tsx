import React from 'react';
import {useFirestore} from "../../../apps/repository/js/FirestoreProvider";
import {createSnapshotStore, ISnapshot, SnapshotSubscriber} from "./SnapshotStore";
import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {TDocumentChangeType} from "polar-firestore-like/src/IDocumentChange";
import {profiled} from "../profiler/ProfiledComponents";
import {TDocumentData} from "polar-firestore-like/src/TDocumentData";

type QuerySnapshotSubscriber<SM = unknown, D = TDocumentData> = SnapshotSubscriber<IQuerySnapshot<SM, D>>;

interface FirestoreSnapshotProps {
    readonly fallback: JSX.Element;
    readonly children: JSX.Element;
}

export interface ITypedDocumentChange<D> {

    /**
     * The ID of the document.
     */
    readonly id: string;

    /** The type of change ('added', 'modified', or 'removed'). */
    readonly type: TDocumentChangeType;

    /** The document affected by this change. */
    readonly doc: D;

}

export interface ITypedDocument<D> {

    /**
     * The ID of the document.
     */
    readonly id: string;

    /** The document affected by this change. */
    readonly doc: D;

}

export interface IDocumentChangeIndex<D> {
    readonly docs: ReadonlyArray<ITypedDocument<D>>;
    // readonly index: ReadonlyArray<ITypedDocumentChangeWithKey<D>>;
    readonly update: (docChanges: ReadonlyArray<ITypedDocumentChange<D>>) => void;
}

function createDocumentChangeIndex<D>(): IDocumentChangeIndex<D> {

    // eslint-disable-next-line functional/prefer-readonly-type
    const docs: ITypedDocument<D>[] = []

    // eslint-disable-next-line functional/prefer-readonly-type
    const idx: {[id: string]: number} = {};

    // TODO: we CAN maintain these sorted but we're going to have to have a
    // custom merge function that keeps track of the index as it changes. We're
    // also going to need the ability to change the comparator at runtime as the
    // underlying structure of a table changes when the user is sorting it.

    function doAdded(docChange: ITypedDocumentChange<D>) {
        const ptr = docs.length;
        docs.push({
            id: docChange.id,
            doc: docChange.doc
        })
        idx[docChange.id] = ptr;
    }

    function doModified(docChange: ITypedDocumentChange<D>) {
        const ptr = idx[docChange.id];
        docs[ptr] = {
            id: docChange.id,
            doc: docChange.doc
        }
    }

    function doRemoved(docChange: ITypedDocumentChange<D>) {
        const ptr = idx[docChange.id];
        delete idx[docChange.id];
        docs.splice(ptr, 1);
    }

    function update(docChanges: ReadonlyArray<ITypedDocumentChange<D>>) {
        for (const docChange of docChanges) {

            switch (docChange.type) {
                case "added":
                    doAdded(docChange);
                    break;

                case "modified":
                    doModified(docChange);
                    break;
                case "removed":
                    doRemoved(docChange);
                    break;
            }
        }
    }

    return {docs, update};

}

// function convertQuerySnapshotToTypedDocumentChanges<D, SM = unknown>(snapshot: IQuerySnapshot<SM>): ReadonlyArray<ITypedDocumentChange<D>> {
//
//     return snapshot.docChanges().map((current): ITypedDocumentChange<D> => {
//         return {
//             id: current.id,
//             type: current.type,
//             doc: current.doc.data() as D
//         }
//     })
//
// }

// TODO: we need to include the metadata from the server including whether it
// came from the cache or not.

export type FirestoreSnapshotStoreProvider = React.FC<FirestoreSnapshotProps>;

export type UseFirestoreSnapshotStore<D = TDocumentData> = () => ISnapshot<IQuerySnapshot<ISnapshotMetadata, D>>;

export type FirestoreSnapshotStoreTuple<D = TDocumentData> = readonly [
    FirestoreSnapshotStoreProvider,
    UseFirestoreSnapshotStore<D>
];

/**
 * Perform a query over a given collection which has a 'uid' for all the users
 * data.
 * @param id The ID of this snapshot used for logging / tracing.
 * @param collectionName The collection to read for the snapshot.
 */
export function createFirestoreSnapshotForUserCollection<D = TDocumentData>(id: string, collectionName: string): FirestoreSnapshotStoreTuple<D> {

    const [SnapshotStoreProvider, useSnapshotStore] = createSnapshotStore<IQuerySnapshot<ISnapshotMetadata, D>>(id);

    const FirestoreSnapshotProvider = React.memo(profiled(function FirestoreSnapshotProvider(props: FirestoreSnapshotProps) {

        const {firestore, uid} = useFirestore();

        const subscriber = React.useMemo<QuerySnapshotSubscriber<ISnapshotMetadata, D>>(() => {

            if (uid === null || uid === undefined) {
                return () => {
                    return NULL_FUNCTION;
                };
            }

            return (onNext, onError) => {

                return firestore.collection(collectionName)
                                .where('uid', '==', uid)
                                .onSnapshot<D>(next => onNext(next), err => onError(err));

            }

        }, [firestore, uid]);

        return (
            <SnapshotStoreProvider subscriber={subscriber} fallback={props.fallback}>
                {props.children}
            </SnapshotStoreProvider>
        );

    }));

    return [FirestoreSnapshotProvider, useSnapshotStore];

}
