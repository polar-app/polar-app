import {UserIDStr} from "polar-shared/src/util/Strings";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {RepoDocInfoDataObjectIndex} from "../../../../apps/repository/js/RepoDocMetaManager";
import {FirestoreBlocksStoreMutations} from "./FirestoreBlocksStoreMutations";
import {FirestoreBlocks} from "./FirestoreBlocks";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {Asserts} from "polar-shared/src/Asserts";
import firebase from "firebase";
import {DocumentDataUpdater} from "./DocumentDataUpdater";
import {IBlocksStoreMutation} from "../store/IBlocksStoreMutation";
import {FileTombstones} from "./FileTombstones";

export namespace FirestoreBlocksPersistenceWriter {

    export async function doExec(uid: UserIDStr,
                                 firestore: IFirestore<unknown>,
                                 repoDocInfoDataObjectIndex: RepoDocInfoDataObjectIndex,
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

        await DocumentDataUpdater.writeDocInfoUpdatesToBatch(
            firestore,
            repoDocInfoDataObjectIndex,
            batch,
            mutations
        );

        // convert the firestore mutations to a batch...
        for (const firestoreMutation of firestoreMutations) {

            const doc = collection.doc(firestoreMutation.id);

            switch (firestoreMutation.type) {

                case "set-block":
                    const firestoreBlock = FirestoreBlocks.toFirestoreBlock(firestoreMutation.value);

                    // DESIGN NOTE:
                    //
                    // We have to merge here so that we don't overwrite an existing block with the same ID.
                    // Otherwise, the entire batch will overwrite the existing block data which is not
                    // what we want.

                    const mergeFields: ReadonlyArray<keyof IBlock> = [];

                    batch.set(doc, firestoreBlock, {
                        mergeFields: [...mergeFields]
                    });

                    FileTombstones.handleBlockAdded(tombstoneCollection, batch, firestoreMutation.value);
                    break;

                case "delete-block":
                    batch.delete(doc)
                    FileTombstones.handleBlockRemoved(tombstoneCollection, batch, firestoreMutation.value);
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
