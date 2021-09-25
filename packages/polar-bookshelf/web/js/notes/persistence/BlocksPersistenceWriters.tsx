import React from 'react';
import {BlocksPersistenceWriter, FirestoreBlocksStoreMutations} from "./FirestoreBlocksStoreMutations";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {FirestoreBlocks} from "./FirestoreBlocks";
import {Asserts} from "polar-shared/src/Asserts";
import firebase from 'firebase/app';
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {getConfig} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {IBlock, IBlockContent, IBlockLink} from 'polar-blocks/src/blocks/IBlock';
import {DocIDStr, URLStr, UserIDStr} from 'polar-shared/src/util/Strings';
import {ICollectionReference} from 'polar-firestore-like/src/ICollectionReference';
import {IWriteBatch} from 'polar-firestore-like/src/IWriteBatch';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {AnnotationContentType} from 'polar-blocks/src/blocks/content/IAnnotationContent';
import {FirebaseDatastores} from 'polar-shared/src/datastore/FirebaseDatastores';
import {DownloadURLs} from '../../datastore/FirebaseDatastore';
import {IDocumentContent} from 'polar-blocks/src/blocks/content/IDocumentContent';
import {arrayStream} from 'polar-shared/src/util/ArrayStreams';
import {Tag, TagIDStr} from 'polar-shared/src/tags/Tags';
import {useBlocksStoreContext} from '../store/BlockStoreContextProvider';

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
        type: 'added' | 'removed' | 'modified',
        block: IBlock<IDocumentContent>,
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

    function getBlockTags(block: IBlock): Record<TagIDStr, Tag> {
        const toTag = ({ text }: IBlockLink): Tag => {
            const label = text.slice(1);
            return { id: label, label };
        };

        return arrayStream(block.content.links)
            .filter(({ text }) => text.startsWith('#'))
            .map(toTag)
            .toMap(({ id }) => id);
    }

    async function getDocMeta(firestore: IFirestore<unknown>,
                              fingerprint: DocIDStr,
                              uid: UserIDStr): Promise<any | null> {

        const docs = await firestore.collection('doc_meta')
            .where('value.docInfo.fingerprint', '==', fingerprint)
            .where('uid', '==', uid)
            .get();

        if (docs.size === 0) {
            return null;
        }

        const data = docs.docs[0].data();

        return data.value;

    }

    export async function writeDocInfoUpdatesToBatch(uid: UserIDStr,
                                                     firestore: IFirestore<unknown>,
                                                     batch: IWriteBatch<unknown>,
                                                     mutations: ReadonlyArray<IBlocksStoreMutation>) {

        const documentMutations = arrayStream(mutations).map(getDocMutation).filterPresent().collect();
        const docMetaCollection = firestore.collection('doc_meta');
        const docInfoCollection = firestore.collection('doc_info');

        for (let { type, block } of documentMutations) {
            const { fingerprint } = block.content.docInfo;
            const identifier = FirebaseDatastores.computeDocMetaID(fingerprint, block.uid)
            const docMetaDoc = docMetaCollection.doc(identifier);
            const docInfoDoc = docInfoCollection.doc(identifier);

            // Tags are stored in a different way in blocks so we need to sync them manually.
            const tags = getBlockTags(block);

            const docInfo = { ...block.content.docInfo, tags };


            /**
             * So after wondering why my updates weren't reflected in the doc repo, it turned out
             * that `DocInfo` was being stored in 3 different places.
             * 1. The `doc_info` firestore collection (inside of `value`). 
             * 2. The `doc_meta` firestore collection (inside of `value.docInfo`). 
             * 3. The `doc_meta` firestore collection (inside of `value.value`). 
             *
             * Number 3 is where an issue arises. since it contains stringified JSON,
             * we can't update it by using a firestore doc path, we would have to do the following instead.
             * 1. Fetch the old value.
             * 2. JSON.parse it
             * 3. Do the patch (aka update `docInfo`)
             * 4. JSON.stringify it
             * 5. Replace the entire thing with the updated stringified JSON.
             *
             * I absolutely hate this but I don't think there're other solutions for now.
             */
            const { value } = await getDocMeta(firestore, fingerprint, uid);

            const docMetaValue = JSON.stringify({ ...JSON.parse(value), docInfo });

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

        await DocumentDataUpdater.writeDocInfoUpdatesToBatch(uid, firestore, batch, mutations);

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

    return React.useCallback((mutations: ReadonlyArray<IBlocksStoreMutation>) => {

        // TODO use a dialog handler for this...
        FirestoreBlocksPersistenceWriter.doExec(uid, firestore, mutations)
            .catch(err => console.log("Unable to commit mutations: ", err, mutations));

    }, [firestore]);

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
