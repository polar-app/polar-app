import React from 'react';
import {BlocksPersistenceWriter} from "./FirestoreBlocksStoreMutations";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {getConfig} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {IBlock} from 'polar-blocks/src/blocks/IBlock';
import {URLStr} from 'polar-shared/src/util/Strings';
import {ICollectionReference} from 'polar-firestore-like/src/ICollectionReference';
import {IWriteBatch} from 'polar-firestore-like/src/IWriteBatch';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {useBlocksStoreContext} from '../store/BlockStoreContextProvider';
import {useRepoDocMetaManager} from '../../../../apps/repository/js/persistence_layer/PersistenceLayerApp';
import {Testing} from "polar-shared/src/util/Testing";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirestoreBlocksPersistenceWriter} from "./FirestoreBlocksPersistenceWriter";
import {IBlocksStoreMutation} from '../store/IBlocksStoreMutation';

const IS_NODE = typeof window === 'undefined';

export namespace FileTombstone {
    const STORAGE_BUCKET = getConfig().storageBucket;

    export function getFileNameFromBlock(block: IBlock) {
        switch (block.content.type) {
            case 'image':
                return getFileNameFromStorageURL(block.content.src);
        }

        return undefined;
    }

    export function isCloudStorageURL(url: URLStr): boolean {
        return url.indexOf(STORAGE_BUCKET) > -1;
    }

    export function getFileNameFromStorageURL(url: URLStr): string | undefined {
        if (! isCloudStorageURL(url)) {
            return undefined;
        }
        const { pathname } = new URL(url);
        const pathnameParts = pathname.split('/');
        return pathnameParts[pathnameParts.length - 1];
    }

    export function handleBlockAdded(collection: ICollectionReference<unknown>,
                                     batch: IWriteBatch<unknown>,
                                     block: IBlock) {

        const addedFileName = FileTombstone.getFileNameFromBlock(block);

        if (addedFileName) {
            const identifier = Hashcodes.create(addedFileName);
            const doc = collection.doc(identifier);
            batch.delete(doc);
        }

    }

    export function handleBlockRemoved(collection: ICollectionReference<unknown>,
                                       batch: IWriteBatch<unknown>,
                                       block: IBlock) {

        const deletedFileName = FileTombstone.getFileNameFromBlock(block);

        if (deletedFileName) {
            const identifier = Hashcodes.create(deletedFileName);
            const doc = collection.doc(identifier);

            batch.set(doc, {
                created: ISODateTimeStrings.create(),
                uid: block.uid,
                filename: deletedFileName,
            });
        }

    }
}

export function useFirestoreBlocksPersistenceWriter(): BlocksPersistenceWriter {

    const {firestore} = useFirestore();
    const {uid} = useBlocksStoreContext();
    const repoDocMetaManager = useRepoDocMetaManager();

    return React.useCallback((mutations: ReadonlyArray<IBlocksStoreMutation>) => {

        // TODO use a dialog handler for this...
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
