import { ICollectionReference } from "./ICollectionReference";
import { IWriteBatch } from "./IWriteBatch";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

// import the client SDK
import firebase from 'firebase/app';

// import the admin SDK
import * as admin from '@google-cloud/firestore';

/**
 * FirestoreLike which contains just the basic functionality of the min of the client SDK and admin SDK.
 */
// export type FirestoreLike = firebase.firestore.Firestore | admin.Firestore;
// export type WriteBatchLike = firebase.firestore.WriteBatch | admin.WriteBatch;
// export type CollectionReferenceLike = firebase.firestore.CollectionReference | admin.CollectionReference;
// export type QueryLike = firebase.firestore.Query | admin.Query;
// export type DocumentReferenceLike = firebase.firestore.DocumentReference | admin.DocumentReference;
// export type DocumentSnapshotLike = firebase.firestore.DocumentSnapshot | admin.DocumentSnapshot;
// export type DocumentChangeLike = firebase.firestore.DocumentChange | admin.DocumentChange;
// export type QueryDocumentSnapshotLike = firebase.firestore.QueryDocumentSnapshot | admin.QueryDocumentSnapshot;

/**
 * Easy type reference for the client SDK
 */
export type FirestoreClient = firebase.firestore.Firestore;

/**
 * Easy type reference for the admin SDK
 */
export type FirestoreAdmin = admin.Firestore;

/**
 * Firestore mimic interface so that the firestore client SDK and admin SDK can
 * both be used with the same code.
 */
export interface IFirestore<SM> {

    readonly collection: (collectionName: string) => ICollectionReference<SM>;

    readonly batch: () => IWriteBatch<SM>;

    readonly terminate: () => Promise<void>;

}

/**
 * Specific behavior for the client interface.
 */
export interface IFirestoreAdmin extends IFirestore<unknown> {

}

/**
 * Specific behavior for the client interface.
 */
export interface IFirestoreClient extends IFirestore<ISnapshotMetadata> {

    readonly clearPersistence: () => Promise<void>;

}
