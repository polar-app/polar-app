import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IQueryDocumentSnapshot} from "polar-firestore-like/src/IQueryDocumentSnapshot";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {Texts} from "polar-shared/src/metadata/Texts";
import {TextType} from "polar-shared/src/metadata/TextType";
import {DocMetaBlockContents} from "./DocMetaBlockContents";
import {BlocksSnapshot} from "./BlocksSnapshot";
import {IBlock, INamedContent} from "polar-blocks/src/blocks/IBlock";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {DocMetas} from "polar-shared/src/metadata/DocMetas";
import {DocMetaHolder} from "polar-shared/src/metadata/DocMetaHolder";
import {RecordHolder} from "polar-shared/src/metadata/RecordHolder";
import {IDUser} from "polar-rpc/src/IDUser";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

export namespace MigrationToBlockAnnotations {

    const OLD_DOC_META_COLLECTION_NAME = 'doc_meta';
    const NEW_DOC_META_COLLECTION_NAME = 'doc_meta2';
    const DOC_INFO_COLLECTION_NAME = 'doc_info';
    const BLOCK_COLLECTION_NAME = 'block';

    export type IDocMetaWOriginal = {
        docMeta: IDocMeta;
        original: RecordHolder<DocMetaHolder>;
    }

    export type IRequest = {
        readonly docMetaID?: string;
    };

    export async function exec(idUser: IDUser, request: IRequest): Promise<void> {

        const { docMetaID } = request;

        if (! docMetaID) {
            throw new Error('You must provide a docMetaID that contains the ID of the docMeta object to be migrated');
        }

        const firestore = FirestoreAdmin.getInstance();

        const docMeta = await getDocMetaByID(firestore, idUser, docMetaID);


        if (! docMeta) {
            throw new Error(`A docMeta object with the ID: ${docMetaID} was not found!`);
        }

        const documentBlock = await getDocumentBlockByFingerprint(idUser, firestore, docMeta.value.docInfo.fingerprint);

        if (docMeta.value.ver === 3 || documentBlock) {
            throw new Error(`docMeta object with the ID: ${docMetaID} has already been migrated`);
        }

        await migrateDocMeta(idUser, firestore, docMeta);
    }

    /**
     * Get all docMeta records for a specific user
     *
     * @param firestore Firestore instance
     * @param idUser UserID object that the docMeta belongs to @see IDUser
     * @param docMetaID The id of the docMeta document to be fetched
     */
    async function getDocMetaByID(firestore: IFirestore<unknown>,
                                  idUser: IDUser,
                                  docMetaID: string): Promise<RecordHolder<DocMetaHolder> | undefined> {

        const query = firestore
            .collection(OLD_DOC_META_COLLECTION_NAME)
            .where('id', '==', docMetaID);

        const toDocMeta = (snapshot: IQueryDocumentSnapshot<unknown>): RecordHolder<DocMetaHolder> =>
            snapshot.data() as RecordHolder<DocMetaHolder>;

        const records = await query.get();

        const docMeta = arrayStream(records.docs)
            .map(toDocMeta)
            .filterPresent()
            .first();

        if (docMeta && docMeta.uid === idUser.uid) {
            return docMeta;
        }
        
        return undefined;
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


        await batch.commit();
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

        batch.update(docMetaDoc, { 'value.ver': 3 });
        batch.update(docInfoDoc, { 'value.ver': 3 });
    }

    async function getDocumentBlockByFingerprint(idUser: IDUser,
                                                 firestore: IFirestore<unknown>,
                                                 fingerprint: string): Promise<IBlock<IDocumentContent> | undefined> {
        const query = firestore
            .collection(BLOCK_COLLECTION_NAME)
            .where('uid', '==', idUser.uid)
            .where('content.type', '==', 'document')
            .where('content.docInfo.fingerprint', '==', fingerprint);

        const toDocumentBlock = (snapshot: IQueryDocumentSnapshot<unknown>): IBlock<IDocumentContent> =>
            snapshot.data() as IBlock<IDocumentContent>;

        const records = await query.get();

        return arrayStream(records.docs)
            .map(toDocumentBlock)
            .filterPresent()
            .first();
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

        const newDocMetaCollection = firestore.collection(NEW_DOC_META_COLLECTION_NAME);
        const newDoc = newDocMetaCollection.doc(original.id);

        batch.create(newDoc, original);
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

        const writeToBatch = (block: IBlock) => {
            const data = Dictionaries.onlyDefinedProperties(block);
            batch.set(blockCollection.doc(block.id), data);
        };


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

        const oldDocMetaCollection = firestore.collection(OLD_DOC_META_COLLECTION_NAME);

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

        newDocMeta.pageMetas[1].textHighlights[placeholder.id] = placeholder;

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
            .collection(BLOCK_COLLECTION_NAME)
            .where('uid', '==', userID.uid)
            .where('content.type', 'in', ['name', 'date', 'document'])
            .get()

        const existingNamedBlocks = existingNamedBlocksQuery.docs
            .map(snapshot =>  snapshot.data() as IBlock<INamedContent>);

        return existingNamedBlocks;
    }

}

