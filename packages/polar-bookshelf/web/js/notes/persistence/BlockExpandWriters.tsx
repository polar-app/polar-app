import React from 'react';
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {IFirestore} from "polar-snapshot-cache/src/store/IFirestore";
import { IBlockExpand } from './BlockExpandSnapshots';

const IS_NODE = typeof window === 'undefined';

export type BlockExpandPersistenceWriter = (mutation: IBlockExpand) => void;

export namespace FirestoreBlockExpandPersistenceWriter {

    export async function doExec(firestore: IFirestore,
                                 mutation: IBlockExpand) {

        const collection = firestore.collection('block_expand');

        const doc = collection.doc(mutation.id);

        await doc.set(mutation);

    }

}

export function useFirestoreBlockExpandWriter(): BlockExpandPersistenceWriter {

    const {firestore} = useFirestore();

    return React.useCallback((mutation: IBlockExpand) => {

        // // TODO use a dialog handler for this...
        FirestoreBlockExpandPersistenceWriter.doExec(firestore, mutation)
            .catch(err => console.log("Unable to commit mutations: ", err, mutation));

    }, [firestore]);

}

function createMockBlockExpandWriter(): BlockExpandPersistenceWriter {

    return (mutation: IBlockExpand) => {
        // noop
    }

}

export function useBlockExpandWriter(): BlockExpandPersistenceWriter {

    if (IS_NODE) {
        return createMockBlockExpandWriter();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreBlockExpandWriter();

}
