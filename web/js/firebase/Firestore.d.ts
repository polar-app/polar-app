import * as firebase from 'firebase/app';
import 'firebase/firestore';
export declare namespace Firestore {
    function init(opts?: FirestoreOptions): Promise<firebase.firestore.Firestore | undefined>;
    function getInstance(): Promise<firebase.firestore.Firestore>;
}
export interface FirestoreOptions {
    readonly enablePersistence?: boolean;
}
