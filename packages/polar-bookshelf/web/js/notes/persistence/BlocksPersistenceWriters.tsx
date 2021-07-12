import React from 'react';
import {BlocksPersistenceWriter, FirestoreBlocksStoreMutations} from "./FirestoreBlocksStoreMutations";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {FirestoreBlocks} from "./FirestoreBlocks";
import {Asserts} from "polar-shared/src/Asserts";
import firebase from 'firebase';
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IBlock, IBlockContent} from '../../../../../polar-app-public/polar-blocks/src/blocks/IBlock';
import {URLStr} from '../../../../../polar-app-public/polar-shared/src/util/Strings';
import {getConfig} from '../../firebase/Firebase';
import {ISODateTimeStrings} from '../../../../../polar-app-public/polar-shared/src/metadata/ISODateTimeStrings';

const IS_NODE = typeof window === 'undefined';


export namespace FileTombstone {
    const STORAGE_BUCKET = getConfig().storageBucket;

    export function getFileNameFromBlock(block: IBlock<IBlockContent>) {
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
}


export namespace FirestoreBlocksPersistenceWriter {

    export async function doExec(firestore: IFirestore<unknown>,
                                 mutations: ReadonlyArray<IBlocksStoreMutation>) {

        // console.log("Writing mutations to firestore: ", mutations);

        const firestoreMutations = FirestoreBlocksStoreMutations.convertToFirestoreMutations(mutations);

        if (firestoreMutations.length === 0) {
            // nothing to do
            return;
        }

        // console.log("Writing firestoreMutations to firestore: ", firestoreMutations);

        const collection = firestore.collection('block');
        const tombstoneCollection = firestore.collection('cloud_storage_tombstone');
        const batch = firestore.batch();

        // convert the firestore mutations to a batch...
        for(const firestoreMutation of firestoreMutations) {

            const doc = collection.doc(firestoreMutation.id);

            switch (firestoreMutation.type) {

                case "set-doc":
                    const firestoreBlock = FirestoreBlocks.toFirestoreBlock(firestoreMutation.value);
                    batch.set(doc, firestoreBlock);

                    const addedFileName = FileTombstone.getFileNameFromBlock(firestoreMutation.value);
                    if (addedFileName) {
                        const doc = tombstoneCollection.doc(addedFileName);
                        batch.delete(doc);
                    }
                    break;

                case "delete-doc":
                    batch.delete(doc)

                    const deletedFileName = FileTombstone.getFileNameFromBlock(firestoreMutation.value);
                    if (deletedFileName) {
                        const doc = collection.doc(deletedFileName);
                        batch.delete(doc);
                    }
                    break;

                case "update-path-number":
                    Asserts.assertNumber(firestoreMutation.value);
                    batch.update(doc, new firebase.firestore.FieldPath(...firestoreMutation.path), firestoreMutation.value);
                    break;
                case "update-path-string":
                    Asserts.assertString(firestoreMutation.value);
                    batch.update(doc, new firebase.firestore.FieldPath(...firestoreMutation.path), firestoreMutation.value);
                    break;
                case "update-path-object":
                    Asserts.assertObject(firestoreMutation.value);
                    batch.update(doc, new firebase.firestore.FieldPath(...firestoreMutation.path), firestoreMutation.value);
                    break;
                case "update-path-string-array":
                    batch.update(doc, new firebase.firestore.FieldPath(...firestoreMutation.path), firestoreMutation.value);
                    break;
                case "update-delete-field-value":
                    batch.update(doc, new firebase.firestore.FieldPath(...firestoreMutation.path), firebase.firestore.FieldValue.delete())
                    break;

            }

        }

        await batch.commit();

    }

}

export function useFirestoreBlocksPersistenceWriter(): BlocksPersistenceWriter {

    const {firestore} = useFirestore();

    return React.useCallback((mutations: ReadonlyArray<IBlocksStoreMutation>) => {

        // TODO use a dialog handler for this...
        FirestoreBlocksPersistenceWriter.doExec(firestore, mutations)
            .catch(err => console.log("Unable to commit mutations: ", err, mutations));

    }, [firestore]);

}

function createMockBlocksPersistenceWriter(): BlocksPersistenceWriter {

    return async (mutations: ReadonlyArray<IBlocksStoreMutation>) => {
        // noop
    }

}

export function useBlocksPersistenceWriter(): BlocksPersistenceWriter {

    if (IS_NODE) {
        return createMockBlocksPersistenceWriter();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreBlocksPersistenceWriter();

}
