import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IQueryDocumentSnapshot} from "polar-firestore-like/src/IQueryDocumentSnapshot";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {RecordHolder} from "polar-hooks-functions/impl/groups/db/doc_annotations/DocAnnotations";
import {IDUser} from "polar-hooks-functions/impl/util/IDUsers";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {Texts} from "polar-shared/src/metadata/Texts";
import {TextType} from "polar-shared/src/metadata/TextType";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {DocMetaBlockContents} from "./DocMetaBlockContents";
import {BlocksSnapshot} from "./BlocksSnapshot";
import {IBlock, INamedContent} from "polar-blocks/src/blocks/IBlock";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {DocMetas} from "polar-shared/src/metadata/DocMetas";
import {DocMetaHolder} from "polar-shared/src/metadata/DocMetaHolder";

export namespace MigrationToBlockAnnotations {

    const OLD_DOC_META_COLLECTION_NAME = 'doc_meta';
    const NEW_DOC_META_COLLECTION_NAME = 'doc_meta2';
    const DOC_INFO_COLLECTION_NAME = 'doc_info';
    const BLOCK_COLLECTION_NAME = 'block';

    export type IDocMetaWOriginal = {
        docMeta: IDocMeta;
        original: RecordHolder<DocMetaHolder>;
    }

    export async function exec(userID: IDUser): Promise<void> {
        const admin = FirebaseAdmin.app();
        const firebase = FirebaseBrowser.init();
        const userToken = await admin.auth().createCustomToken(userID.uid);

        await firebase.auth().signInWithCustomToken(userToken);

        const firestore = await FirestoreBrowserClient.getInstance();

        const docMetas = await getDocMetas(firestore, userID);

        // TODO: We're probably gonna change this to migrate one docMeta at a time per function call
        await docMetas.reduce((promise, docMeta) => promise.then(() => migrateDocMeta(userID, firestore, docMeta)), Promise.resolve());
    }

    /**
     * Get all docMeta records for a specific user
     *
     * @param firestore Firestore instance
     * @param userID UserID object @see IDUser
     */
    async function getDocMetas(firestore: IFirestore<unknown>,
                               userID: IDUser): Promise<ReadonlyArray<RecordHolder<DocMetaHolder>>> {

        const query = firestore
            .collection(OLD_DOC_META_COLLECTION_NAME)
            .where('uid', '==', userID.uid)
            .where('ver', '!=', 2);

        const toDocMeta = (snapshot: IQueryDocumentSnapshot<unknown>): RecordHolder<DocMetaHolder> =>
            snapshot.data() as RecordHolder<DocMetaHolder>;

        const records = await query.get();
        return arrayStream(records.docs)
            .map(toDocMeta)
            .filterPresent()
            .collect();
    }

    /**
     * Migrate a docMeta document to the new blocks system
     *
     * @param userID UserID object @see IDUser
     * @param firestore Firestore instance
     * @param docMetaRecord The docMetaRecord to be migrated
     */
    async function migrateDocMeta(userID: IDUser,
                                  firestore: IFirestore<unknown>,
                                  docMetaRecord: RecordHolder<DocMetaHolder>): Promise<void> {

        const batch = firestore.batch();

        const createDocMetaClone = (docMetaRecord: RecordHolder<DocMetaHolder>): IDocMetaWOriginal => {
            const { value: { value, docInfo: { fingerprint } } } = docMetaRecord;

            return { docMeta: DocMetas.deserialize(value, fingerprint), original: docMetaRecord };
        };

        await backupDocMeta(userID, firestore, batch, createDocMetaClone(docMetaRecord));
        await purgeAnnotations(userID, firestore, batch, createDocMetaClone(docMetaRecord));
        await migrateAnnotationsToBlocks(userID, firestore, batch, createDocMetaClone(docMetaRecord));
        await bumpVersions(userID, firestore, batch, createDocMetaClone(docMetaRecord));


        // await batch.commit();
    }

    /**
     * Bump the old documents' versions so that we don't migrate them again
     *
     * @param userID UserID object @see IDUser
     * @param firestore Firestore instance
     * @param batch Firestore batch instance
     * @param data IDocMeta related data @see IDocMetaWOriginal
     */
    async function bumpVersions(_: IDUser,
                                firestore: IFirestore<unknown>,
                                batch: IWriteBatch<unknown>,
                                data: IDocMetaWOriginal): Promise<void> {

        const docMetaCollection = firestore.collection(OLD_DOC_META_COLLECTION_NAME);
        const docInfoCollection = firestore.collection(DOC_INFO_COLLECTION_NAME);

        const docMetaDoc = docMetaCollection.doc(data.original.id);
        const docInfoDoc = docInfoCollection.doc(data.original.id);

        batch.update(docMetaDoc, { ver: 2 });
        batch.update(docInfoDoc, { ver: 2 });
    }

    /**
     * Backup the old docMeta document before performing the migration
     *
     * @param userID UserID object @see IDUser
     * @param firestore Firestore instance
     * @param batch Firestore batch instance
     * @param data IDocMeta related data @see IDocMetaWOriginal
     */
    async function backupDocMeta(_: IDUser,
                                 firestore: IFirestore<unknown>,
                                 batch: IWriteBatch<unknown>,
                                 data: IDocMetaWOriginal): Promise<void> {

        const { original } = data;

        const newDocMetaCollection = firestore.collection(OLD_DOC_META_COLLECTION_NAME);
        const newDoc = newDocMetaCollection.doc(original.id);

        batch.set(newDoc, original);
    }

    /**
     * Migrate the annotations of a docMeta record to the new blocks system
     *
     * @param userID UserID object @see IDUser
     * @param firestore Firestore instance
     * @param batch Firestore batch instance
     * @param data IDocMeta related data @see IDocMetaWOriginal
     */
    async function migrateAnnotationsToBlocks(userID: IDUser,
                                              firestore: IFirestore<unknown>,
                                              batch: IWriteBatch<unknown>,
                                              data: IDocMetaWOriginal): Promise<void> {

        const blockCollection = firestore.collection(BLOCK_COLLECTION_NAME);

        const existingNamedBlocks = await getExistingNamedBlocks(userID, firestore);

        const { tagContentsStructure, docContentStructure } = DocMetaBlockContents
            .getFromDocMeta(data.docMeta, existingNamedBlocks);

        const documentBlocksSnapshot = BlocksSnapshot
            .blockContentStructureToBlockSnapshot(userID.uid, [docContentStructure]);


        const namedBlocksSnapshots = BlocksSnapshot
            .blockContentStructureToBlockSnapshot(userID.uid, tagContentsStructure);


        const writeToBatch = (block: IBlock) =>
            batch.set(blockCollection.doc(block.id), block);

        documentBlocksSnapshot.map(writeToBatch);
        namedBlocksSnapshots.map(writeToBatch);

    }

    /**
     * Remove all the annotations from the migrated docMeta record & add a placeholder
     * annotation that indicates that the migration had happened
     *
     * @param userID UserID object @see IDUser
     * @param firestore Firestore instance
     * @param batch Firestore batch instance
     * @param data IDocMeta related data @see IDocMetaWOriginal
     */
    async function purgeAnnotations(_: IDUser,
                                    firestore: IFirestore<unknown>,
                                    batch: IWriteBatch<unknown>,
                                    data: IDocMetaWOriginal): Promise<void> {

        const { docMeta, original } = data;

        const oldDocMetaCollection = firestore.collection(NEW_DOC_META_COLLECTION_NAME);

        const oldDoc = oldDocMetaCollection.doc(original.id);

        const newDocMeta: IDocMeta = {
            ...docMeta,
            pageMetas: Object.entries(docMeta.pageMetas).reduce((dict, [pageNum, pageMeta]) => {
                const newPageMeta: IPageMeta = {
                    ...pageMeta,
                    textHighlights: {},
                    areaHighlights: {},
                };

                return {
                    ...dict,
                    [pageNum]: newPageMeta,
                };
            }, {}),
        };

        const placeholder = createPlaceholderTextHighlight();

        newDocMeta.pageMetas[0].textHighlights[placeholder.id] = placeholder;

        batch.update(oldDoc, 'value.value', DocMetas.serialize(newDocMeta));
    }

    /**
     * Create a placeholder text annotation that will replace the migrated annotations
     */
    function createPlaceholderTextHighlight(): ITextHighlight {
        const text = Texts.create('Your annotations have been migrated to Polar 3.0 and are no longer visible in your older client. Please upgrade', TextType.TEXT);
        const id = Hashcodes.createRandomID();
        const now = ISODateTimeStrings.create();

        return {
            id,
            guid: id,
            created: now,
            lastUpdated: now,
            rects: {},
            textSelections: {},
            text,
            images: {},
            notes: {},
            questions: {},
            flashcards: {},
            color: 'red',
        };
    }

    /**
     * Get the existing named blocks in the blocks sytem
     *
     * This fetches all the named notes in the blocks system to prevent having duplicates when migrating annotation tags
     *
     * @param userID UserID object @see IDUser
     * @param firestore Firestore instance
     */
    async function getExistingNamedBlocks(userID: IDUser,
                                          firestore: IFirestore<unknown>): Promise<ReadonlyArray<IBlock<INamedContent>>> {

        const existingNamedBlocksQuery = await firestore
            .collection(OLD_DOC_META_COLLECTION_NAME)
            .where('uid', '==', userID.uid)
            .where('content.type', 'in', ['name', 'date', 'document'])
            .get()

        const existingNamedBlocks = existingNamedBlocksQuery.docs
            .map(snapshot =>  snapshot.data() as IBlock<INamedContent>);

        return existingNamedBlocks;
    }
}

