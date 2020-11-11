import * as firebase from 'firebase/app';
import DocumentReference = firebase.firestore.DocumentReference;
export declare class DocumentReferences {
    static get(ref: DocumentReference, opts?: GetOptions): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>;
    private static getWithOrder;
}
export interface GetOptions {
    readonly source?: GetSource;
}
export declare type DirectSource = 'server' | 'cache';
export declare type GetSource = 'default' | DirectSource | 'cache-then-server' | 'server-then-cache';
export declare class CacheFirstThenServerGetOptions implements GetOptions {
    readonly source: GetSource;
}
