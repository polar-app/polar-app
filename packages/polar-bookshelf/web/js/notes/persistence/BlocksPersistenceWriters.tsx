import React from 'react';
import {BlocksPersistenceWriter, FirestoreBlocksStoreMutations} from "./FirestoreBlocksStoreMutations";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {FirestoreBlocks} from "./FirestoreBlocks";
import {Asserts} from "polar-shared/src/Asserts";
import firebase from 'firebase/app';
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {getConfig} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {IBlock, IBlockContent} from 'polar-blocks/src/blocks/IBlock';
import {URLStr, UserIDStr} from 'polar-shared/src/util/Strings';
import {ICollectionReference} from 'polar-firestore-like/src/ICollectionReference';
import {IWriteBatch} from 'polar-firestore-like/src/IWriteBatch';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {FirebaseDatastores} from 'polar-shared/src/datastore/FirebaseDatastores';
import {IDocumentContent} from 'polar-blocks/src/blocks/content/IDocumentContent';
import {arrayStream} from 'polar-shared/src/util/ArrayStreams';
import {useBlocksStoreContext} from '../store/BlockStoreContextProvider';
import {useRepoDocMetaManager} from '../../../../apps/repository/js/persistence_layer/PersistenceLayerApp';
import {RepoDocInfoDataObjectIndex} from '../../../../apps/repository/js/RepoDocMetaManager';
import {DocumentContent} from '../content/DocumentContent';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {Tag} from 'polar-shared/src/tags/Tags';
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;

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

    export function handleBlockAdded(collection: ICollectionReference<unknown>,
                                     batch: IWriteBatch<unknown>,
                                     block: IBlock<IBlockContent>) {

        const addedFileName = FileTombstone.getFileNameFromBlock(block);

        if (addedFileName) {
            const identifier = Hashcodes.create(addedFileName);
            const doc = collection.doc(identifier);
            batch.delete(doc);
        }

    }

    export function handleBlockRemoved(collection: ICollectionReference<unknown>,
                                       batch: IWriteBatch<unknown>,
                                       block: IBlock<IBlockContent>) {

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

export namespace DocumentDataUpdater {

    type IDocMutation = {
        readonly type: 'added' | 'removed' | 'modified',
        readonly block: IBlock<IDocumentContent>,
    };

    function getDocMutation(mutation: IBlocksStoreMutation): IDocMutation | null {
        const getBlock = () => {
            switch (mutation.type) {
                case 'added':
                    return mutation.added;
                case 'removed':
                    return mutation.removed;
                case 'modified':
                    return mutation.after;
            }
        };

        const block = getBlock();

        if (block.content.type !== 'document') {
            return null;
        }

        return {
            type: mutation.type,
            block: block as IBlock<IDocumentContent>,
        };
    }

    export async function writeDocInfoUpdatesToBatch(firestore: IFirestore<unknown>,
                                                     repoDocInfoDataObjectIndex: RepoDocInfoDataObjectIndex,
                                                     batch: IWriteBatch<unknown>,
                                                     mutations: ReadonlyArray<IBlocksStoreMutation>) {

        const documentMutations = arrayStream(mutations).map(getDocMutation).filterPresent().collect();
        const docMetaCollection = firestore.collection('doc_meta');
        const docInfoCollection = firestore.collection('doc_info');

        for (const { type, block } of documentMutations) {
            const { fingerprint } = block.content.docInfo;
            const identifier = FirebaseDatastores.computeDocMetaID(fingerprint, block.uid)
            const docMetaDoc = docMetaCollection.doc(identifier);
            const docInfoDoc = docInfoCollection.doc(identifier);

            // Tags are stored in a different way in blocks so we need to sync them manually.
            const tags: Record<string, Tag> = arrayStream((new DocumentContent(block.content)).getTags())
                .map(({ label }) => ({ label, id: label }))
                .toMap(({ label }) => label);

            const docInfo: IDocInfo = { ...block.content.docInfo, tags, lastUpdated: ISODateTimeStrings.create() };

            const repoDocInfo = repoDocInfoDataObjectIndex.get(fingerprint);

            if (! repoDocInfo) {
                // This technically should never happen.
                return console.error(`DocMeta record was not found for doc ID: ${fingerprint}. skipping update...`);
            }

            const docMeta = repoDocInfo.docMeta;

            const docMetaValue = JSON.stringify({ ...docMeta, docInfo });

            switch (type) {
                case 'modified':
                    batch.update(docInfoDoc, 'value', docInfo);
                    batch.update(docMetaDoc, 'value.docInfo', docInfo);
                    batch.update(docMetaDoc, 'value.value', docMetaValue);
                    break;
                case 'added':
                    // I think we ignore this for now. because this is done through a migration
                    break;
                case 'removed':
                    // Deleting a document block doesn't necessarily mean that we want to also delete
                    // it from docMeta because the document might still be there.
                    break;
            }
        }
    }
}

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

                case "set-doc":
                    const firestoreBlock = FirestoreBlocks.toFirestoreBlock(firestoreMutation.value);
                    batch.set(doc, firestoreBlock);
                    FileTombstone.handleBlockAdded(tombstoneCollection, batch, firestoreMutation.value);
                    break;

                case "delete-doc":
                    batch.delete(doc)
                    FileTombstone.handleBlockRemoved(tombstoneCollection, batch, firestoreMutation.value);
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

    if (IS_NODE) {
        return createMockBlocksPersistenceWriter();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreBlocksPersistenceWriter();

}
