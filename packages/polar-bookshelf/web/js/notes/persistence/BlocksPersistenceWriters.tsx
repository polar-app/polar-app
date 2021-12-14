import React from 'react';
import {BlocksPersistenceWriter} from "./FirestoreBlocksStoreMutations";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {useBlocksStoreContext} from '../store/BlockStoreContextProvider';
import {useRepoDocMetaManager} from '../../../../apps/repository/js/persistence_layer/PersistenceLayerApp';
import {Testing} from "polar-shared/src/util/Testing";
import {FirestoreBlocksPersistenceWriter} from "./FirestoreBlocksPersistenceWriter";
import {IBlocksStoreMutation} from '../store/IBlocksStoreMutation';

const IS_NODE = typeof window === 'undefined';

export function useFirestoreBlocksPersistenceWriter(): BlocksPersistenceWriter {

    const {firestore} = useFirestore();
    const {uid} = useBlocksStoreContext();
    const repoDocMetaManager = useRepoDocMetaManager();

    return React.useCallback((mutations: ReadonlyArray<IBlocksStoreMutation>) => {

        // TODO use a dialog handler for this for when we get an error.
        FirestoreBlocksPersistenceWriter.doExec(
            uid,
            firestore,
            repoDocMetaManager.repoDocInfoIndex,
            mutations
        ).catch(err => console.log("Unable to commit mutations: ", err, mutations));

    }, [firestore, repoDocMetaManager.repoDocInfoIndex, uid]);

}

function createMockBlocksPersistenceWriter(): BlocksPersistenceWriter {

    return async (_: ReadonlyArray<IBlocksStoreMutation>) => {
        // noop
    }

}

export function useBlocksPersistenceWriter(): BlocksPersistenceWriter {

    if (IS_NODE || Testing.isTestingRuntime()) {
        return createMockBlocksPersistenceWriter();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreBlocksPersistenceWriter();

}
