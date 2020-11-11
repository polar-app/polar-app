import React from 'react';
export interface IFirestore {
    readonly uid: string | undefined;
    readonly user: firebase.User | undefined;
    readonly firestore: firebase.firestore.Firestore;
}
export declare function useFirestore(): IFirestore;
interface IProps {
    readonly children: React.ReactNode;
}
export declare const FirestoreProvider: React.MemoExoticComponent<(props: IProps) => JSX.Element | null>;
export {};
