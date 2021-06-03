import React from 'react';
import {BlocksPersistenceWriter, FirestoreBlocksStoreMutations} from "./FirestoreBlocksStoreMutations";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {FirestoreBlocks} from "./FirestoreBlocks";
import {Asserts} from "polar-shared/src/Asserts";
import {IFirestore} from "polar-snapshot-cache/src/store/IFirestore";
import firebase from 'firebase';

const IS_NODE = typeof window === 'undefined';

export namespace FirestoreBlocksPersistenceWriter {

    export async function doExec(firestore: IFirestore,
                                 mutations: ReadonlyArray<IBlocksStoreMutation>) {

        // console.log("Writing mutations to firestore: ", mutations);

        const firestoreMutations = FirestoreBlocksStoreMutations.convertToFirestoreMutations(mutations);

        if (firestoreMutations.length === 0) {
            // nothing to do
            return;
        }

        // console.log("Writing firestoreMutations to firestore: ", firestoreMutations);

        const collection = firestore.collection('block');
        const batch = firestore.batch();

        // convert the firestore mutations to a batch...
        for(const firestoreMutation of firestoreMutations) {

            const doc = collection.doc(firestoreMutation.id);

            switch (firestoreMutation.type) {

                case "set-doc":
                    const firestoreBlock = FirestoreBlocks.toFirestoreBlock(firestoreMutation.value);
                    batch.set(doc, firestoreBlock);
                    break;

                case "delete-doc":
                    batch.delete(doc)
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
