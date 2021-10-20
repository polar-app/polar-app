import React from 'react';
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IBlockExpand} from './BlockExpandCollectionSnapshots';
import firebase from 'firebase/app';
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

const IS_NODE = typeof window === 'undefined';

export type BlockExpandPersistenceWriter = (mutations: ReadonlyArray<IBlockExpandMutation>) => void;

export type BlockExpandMutationType = 'added' | 'removed';

export interface IBlockExpandMutation {
    readonly type: BlockExpandMutationType;
    readonly id: BlockIDStr;
}

export namespace FirestoreBlockExpandPersistenceWriter {

    export async function doExec(firestore: IFirestore<unknown>,
                                 user: firebase.User,
                                 mutations: ReadonlyArray<IBlockExpandMutation>) {

        const collection = firestore.collection('block_expand');

        const batch = firestore.batch();

        // convert the firestore mutations to a batch...
        for(const mutation of mutations) {

            const doc = collection.doc(mutation.id);

            switch (mutation.type) {

                case "added":

                    const blockExpand: IBlockExpand = {
                        id: mutation.id,
                        uid: user.uid
                    }

                    batch.set(doc, blockExpand);

                    break;
                case "removed":
                    batch.delete(doc);
                    break;

            }

        }

        await batch.commit();

    }

}

export function useFirestoreBlockExpandPersistenceWriter(): BlockExpandPersistenceWriter {

    const {firestore, user} = useFirestore();

    return React.useCallback((mutations: ReadonlyArray<IBlockExpandMutation>) => {

        if (! user) {
            return;
        }

        // // TODO use a dialog handler for this...
        FirestoreBlockExpandPersistenceWriter.doExec(firestore, user, mutations)
            .catch(err => console.log("Unable to commit mutations: ", err, mutations));

    }, [firestore, user]);

}

function createMockBlockExpandPersistenceWriter(): BlockExpandPersistenceWriter {

    return (mutations: ReadonlyArray<IBlockExpandMutation>) => {
        // noop
    }

}

export function useBlockExpandPersistenceWriter(): BlockExpandPersistenceWriter {

    if (IS_NODE) {
        return createMockBlockExpandPersistenceWriter();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreBlockExpandPersistenceWriter();

}
