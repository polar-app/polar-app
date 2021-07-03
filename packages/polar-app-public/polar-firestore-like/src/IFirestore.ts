import { ICollectionReference } from "./ICollectionReference";
import { IWriteBatch } from "./IWriteBatch";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

// import the client SDK
import firebase from 'firebase/app';

// import the admin SDK
import * as admin from '@google-cloud/firestore';

/**
 * Easy type reference for the client SDK
 */
export type FirestoreClient = firebase.firestore.Firestore;

/**
 * Easy type reference for the admin SDK
 */
export type FirestoreAdmin = admin.Firestore;

/**
 * A firestore UID type.
 */
export type UserIDStr = string;

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

/**
 * Extra methods needed to use Firestore that are part of the lib but not the
 * main interface but still need to be abstracted.
 */
export interface IFirestoreLib {

    readonly FieldPath: (...fields: string[]) => IFieldPath;

    readonly FieldValue: IFieldValueFactory;

}

export interface IFieldPath {

}

export interface IFieldValueFactory {

    arrayUnion(...elements: any[]): IFieldValue;
    arrayRemove(...elements: any[]): IFieldValue;
    delete(): IFieldValue;

}

export interface IFieldValue {


}
