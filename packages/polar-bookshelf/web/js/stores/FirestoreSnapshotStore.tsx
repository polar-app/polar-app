import React from 'react';
import {useFirestore} from "../../../apps/repository/js/FirestoreProvider";
import {createSnapshotStore, ISnapshot, SnapshotStoreLatchProps, SnapshotSubscriber} from "./SnapshotStore";
import {IQuerySnapshot} from "polar-firestore-like/src/IQuerySnapshot";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {TDocumentChangeType} from "polar-firestore-like/src/IDocumentChange";
import {profiled} from "../profiler/ProfiledComponents";
import {TDocumentData} from "polar-firestore-like/src/TDocumentData";
import {TWhereFilterOp} from "polar-firestore-like/src/ICollectionReference";

type QuerySnapshotSubscriber<SM = unknown, D = TDocumentData> = SnapshotSubscriber<IQuerySnapshot<SM, D>>;

interface FirestoreSnapshotProps {
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

// TODO: we need to include the metadata from the server including whether it
// came from the cache or not.

export type FirestoreSnapshotStoreProvider = React.FC<FirestoreSnapshotProps>;

export type UseFirestoreSnapshotStore<D = TDocumentData> = () => ISnapshot<IQuerySnapshot<ISnapshotMetadata, D>>;

interface FirestoreSnapshotLoaderProps {
    // no props are needed as the subscriber is created directly and no children
    // are used either.
}

export type FirestoreSnapshotStoreLoader = React.FC<FirestoreSnapshotLoaderProps>;

export type FirestoreSnapshotStoreLatch = React.FC<SnapshotStoreLatchProps>;

export type FirestoreSnapshotStoreTuple<D = TDocumentData> = readonly [
    FirestoreSnapshotStoreProvider,
    UseFirestoreSnapshotStore<D>,
    FirestoreSnapshotStoreLoader,
    FirestoreSnapshotStoreLatch
];


interface FirestoreSnapshotForUserCollectionOpts {

    /**
     *  Fire an initial empty snapshot RIGHT at the beginning to work around a
     *  bug with Firestore where it can't cache empty snapshots, and we have to
     *  wait for a server snapshot.
     */
    readonly initialEmpty?: boolean;

}

/**
 * Perform a query over a given collection which has a 'uid' for all the users
 * data.
 *
 * @param collectionName The collection to read for the snapshot.
 * @param opts The options used to create snapshots.
 */
export function createFirestoreSnapshotForUserCollection<D = TDocumentData>(collectionName: string,
                                                                            opts: FirestoreSnapshotForUserCollectionOpts): FirestoreSnapshotStoreTuple<D> {

    const [SnapshotStoreProvider, useSnapshotStore, SnapshotStoreLoader, SnapshotStoreLatch] = createSnapshotStore<IQuerySnapshot<ISnapshotMetadata, D>>(collectionName);

    function useSubscriber() {

        const {firestore, uid} = useFirestore();

        return React.useMemo<QuerySnapshotSubscriber<ISnapshotMetadata, D>>(() => {

            if (uid === null || uid === undefined) {
                return () => {
                    return NULL_FUNCTION;
                };
            }

            let logged = false;

            return (onNext, onError) => {

                const snapshotHandler = (snapshot: IQuerySnapshot<ISnapshotMetadata, D>) => {

                    if (! logged) {
                        console.log(`Snapshot from cache for ${collectionName}: ${snapshot.metadata.fromCache}`);
                        logged = true;
                    }
                    onNext(snapshot);
                }

                if (opts.initialEmpty) {
                    onNext(createEmptyQuerySnapshot());
                }

                return firestore.collection(collectionName)
                    .where('uid', '==', uid)
                    .onSnapshot<D>({includeMetadataChanges: true}, next => snapshotHandler(next), err => onError(err));

            }

        }, [firestore, uid]);

    }

    const Provider: FirestoreSnapshotStoreProvider = React.memo(profiled(function FirestoreSnapshotProvider(props) {

        return (
            <SnapshotStoreProvider>
                {props.children}
            </SnapshotStoreProvider>
        );

    }));

    const Loader: FirestoreSnapshotStoreLoader = React.memo(profiled(function FirestoreSnapshotLoader(props) {

        const subscriber = useSubscriber()

        return (
            <SnapshotStoreLoader subscriber={subscriber}>
                {props.children}
            </SnapshotStoreLoader>
        );

    }));

    return [Provider, useSnapshotStore, Loader, SnapshotStoreLatch];

}

export type GenericFirestoreClause = readonly [string, TWhereFilterOp, any];

interface FirestoreSnapshotLoaderWithSubscriberProps<D> {
    readonly subscriber: QuerySnapshotSubscriber<ISnapshotMetadata, D>;
}

export type FirestoreSnapshotStoreLoaderWithSubscriber<D> = React.FC<FirestoreSnapshotLoaderWithSubscriberProps<D>>;

export type FirestoreSnapshotStoreTupleWithSubscriber<D = TDocumentData> = readonly [
    FirestoreSnapshotStoreProvider,
    UseFirestoreSnapshotStore<D>,
    FirestoreSnapshotStoreLoaderWithSubscriber<D>,
    FirestoreSnapshotStoreLatch
];

export function createFirestoreSnapshotWithSubscriber<D = TDocumentData>(collectionName: string): FirestoreSnapshotStoreTupleWithSubscriber<D> {

    const [SnapshotStoreProvider, useSnapshotStore, SnapshotStoreLoader, SnapshotStoreLatch] = createSnapshotStore<IQuerySnapshot<ISnapshotMetadata, D>>(collectionName);

    const Provider: FirestoreSnapshotStoreProvider = React.memo(profiled(function FirestoreSnapshotStoreProvider(props) {

        return (
            <SnapshotStoreProvider>
                {props.children}
            </SnapshotStoreProvider>
        );

    }));

    const Loader: FirestoreSnapshotStoreLoaderWithSubscriber<D> = React.memo(profiled(function FirestoreSnapshotStoreLoaderWithSubscriber(props) {

        return (
            <SnapshotStoreLoader subscriber={props.subscriber}>
                {props.children}
            </SnapshotStoreLoader>
        );

    }));

    return [Provider, useSnapshotStore, Loader, SnapshotStoreLatch];

}

function createEmptyQuerySnapshot<D>(): IQuerySnapshot<ISnapshotMetadata, D> {
    return {
        empty: true,
        size: 0,
        metadata: {
            hasPendingWrites: false,
            fromCache: true
        },
        docs: [],
        docChanges: () => []
    }
}
