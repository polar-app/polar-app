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

        // console.log("Writing firestoreMutations to firestore: ", JSON.stringify(firestoreMutations, null, '  '));

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

                    const mergeFields: ReadonlyArray<keyof IBlock> = [
                        'id',
                        'nspace',
                        'uid',
                        'root',
                        'parent',
                        'parents',
                        'created',
                        'updated',
                        'content',
                        'mutation',
                    ];

                    // TODO: there's a bug here that we need to fix in the future. If the user updates the
                    // same block twice (probably due to an offline-operation), then what happens is that
                    // the last writer wins and overwrites the created and updated fields.
                    //
                    // The only way I can think of fixing this would be to:
                    //
                    // - Have Firestore handle this no the client which isn't supported yet because it doesn't
                    //   properly support UPSERTs, ON DUPLUCATE KEY UPDATE semantics, or any type of CAS operations
                    //   that would support this.
                    //
                    // - Implement a trigger on the backend to detect this and then now allow created to be changed.
                    //

                    batch.set(doc, firestoreBlock, {
                        mergeFields: [...mergeFields]
                    });

                    const itemsKeys = Object.keys(firestoreBlock.items);

                    if (itemsKeys.length > 0) {

                        // If the user is adding more items, we will just set
                        // them into the items array rather than overwriting the
                        // items array as this is probably what the user intends
                        // but I think we need to tighten up the mutations here
                        // because there are too many edge cases and if we reduce
                        // the operations there will be less to test.

                        for (const itemKey of itemsKeys) {
                            const itemValue = firestoreBlock.items[itemKey];
                            batch.update(doc, `items.${itemKey}`, itemValue);
                        }

                    } else {

                        // HACK: this is a bit of a hack to get Firestore to create an empty items
                        // object / array rather than overwrite.  It handles the following scenarios:
                        //
                        // - When there is no existing record in the DB, it will create an empty items
                        //   array.
                        //
                        // - When a record ALREADY exists in the DB, it doesn't overwrite it and this
                        //   is a noop.  Whatever 'items' already exist are never modified.
                        batch.update(doc, 'items.0', '');
                        batch.update(doc, 'items.0', firebase.firestore.FieldValue.delete());

                    }

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
