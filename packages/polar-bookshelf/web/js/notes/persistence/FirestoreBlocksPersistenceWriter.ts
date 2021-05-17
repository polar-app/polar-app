import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import {FirestoreBlocksStoreMutations, BlocksPersistenceWriter} from "./FirestoreBlocksStoreMutations";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {FirestoreBlocks} from "./FirestoreBlocks";
import {Asserts} from "polar-shared/src/Asserts";
import {IFirestore} from "polar-snapshot-cache/src/store/IFirestore";
import firebase from 'firebase';

export namespace FirestoreBlocksPersistenceWriter {

    export async function doExec(firestore: IFirestore,
                                 mutations: ReadonlyArray<IBlocksStoreMutation>) {

        // console.log("Writing mutations to firestore: ", mutations);

        const firestoreMutations = FirestoreBlocksStoreMutations.convertToFirestoreMutations(mutations);

        // console.log("Writing firestoreMutations to firestore: ", firestoreMutations);

        const collection = firestore.collection('block');
        const batch = firestore.batch();

        // convert the firestore mutations to a batch...
        for(const firestoreMutation of firestoreMutations) {

            const doc = collection.doc(firestoreMutation.id);

            switch (firestoreMutation.type) {

                case "set-doc":
                    batch.set(doc, FirestoreBlocks.toFirestoreBlock(firestoreMutation.value));
                    break;

                case "delete-doc":
                    batch.delete(doc)
                    break;

                case "update-path-number":
                    Asserts.assertNumber(firestoreMutation.value);
                    batch.update(doc, firestoreMutation.path, firestoreMutation.value);
                    break;
                case "update-path-string":
                    Asserts.assertString(firestoreMutation.value);
                    batch.update(doc, firestoreMutation.path, firestoreMutation.value);
                    break;
                case "update-path-object":
                    Asserts.assertObject(firestoreMutation.value);
                    batch.update(doc, firestoreMutation.path, firestoreMutation.value);
                    break;
                case "update-path-string-array":
                    batch.update(doc, firestoreMutation.path, firestoreMutation.value);
                    break;
                case "update-delete-field-value":
                    batch.update(doc, firestoreMutation.path, firebase.firestore.FieldValue.delete())
                    break;

            }

        }

        // TODO use a dialog handler for this...
        await batch.commit();

    }

}

export function useFirestoreBlocksPersistenceWriter(): BlocksPersistenceWriter {

    const {firestore} = useFirestore();

    return React.useCallback((mutations: ReadonlyArray<IBlocksStoreMutation>) => {

        FirestoreBlocksPersistenceWriter.doExec(firestore, mutations)
            .catch(err => console.log("Unable to commit mutations: ", err, mutations));

    }, [firestore]);

}
