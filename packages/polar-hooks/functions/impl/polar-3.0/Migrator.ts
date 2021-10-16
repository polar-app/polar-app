import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IQueryDocumentSnapshot} from "polar-firestore-like/src/IQueryDocumentSnapshot";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {DocMetaHolder, RecordHolder} from "../groups/db/doc_annotations/DocAnnotations";
import {IDUser} from "../util/IDUsers";
import {DocMetas} from "polar-bookshelf/web/js/metadata/DocMetas";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {TextHighlightRecords} from "polar-bookshelf/web/js/metadata/TextHighlightRecords";
import {Texts} from "polar-shared/src/metadata/Texts";
import {TextType} from "polar-shared/src/metadata/TextType";
import {BlockMigrator} from "./BlockMigrator";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

export namespace Polar3DocMetaMigrator {

    const OLD_DOC_META_COLLECTION_NAME = 'doc_meta';
    const NEW_DOC_META_COLLECTION_NAME = 'doc_meta2';
    const DOC_INFO_COLLECTION_NAME = 'doc_info';

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

        docMetas.forEach(migrateDocMeta.bind(null, userID, firestore));
    }

    async function getDocMetas(firestore: IFirestore<unknown>, userID: IDUser): Promise<ReadonlyArray<RecordHolder<DocMetaHolder>>> {

        const query = firestore
            .collection(OLD_DOC_META_COLLECTION_NAME)
            .where('uid', '==', userID.uid);

        const toDocMeta = (snapshot: IQueryDocumentSnapshot<unknown>): RecordHolder<DocMetaHolder> =>
            snapshot.data() as RecordHolder<DocMetaHolder>;

        const records = await query.get();
        return arrayStream(records.docs)
            .map(toDocMeta)
            .filterPresent()
            .collect();
    }

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

    async function backupDocMeta(_: IDUser,
                                 firestore: IFirestore<unknown>,
                                 batch: IWriteBatch<unknown>,
                                 data: IDocMetaWOriginal): Promise<void> {

        const { original } = data;

        const newDocMetaCollection = firestore.collection(OLD_DOC_META_COLLECTION_NAME);
        const newDoc = newDocMetaCollection.doc(original.id);

        batch.set(newDoc, original);
    }

    async function migrateAnnotationsToBlocks(userID: IDUser,
                                              firestore: IFirestore<unknown>,
                                              batch: IWriteBatch<unknown>,
                                              data: IDocMetaWOriginal): Promise<void> {

        BlockMigrator.migrateDocMeta(userID, firestore, batch, data);

    }

    async function purgeAnnotations(_: IDUser,
                                    firestore: IFirestore<unknown>,
                                    batch: IWriteBatch<unknown>,
                                    data: IDocMetaWOriginal): Promise<void> {

        const { docMeta, original } = data;

        const oldDocMetaCollection = firestore.collection(NEW_DOC_META_COLLECTION_NAME);

        const oldDoc = oldDocMetaCollection.doc(original.id);

        DocMetas.withSkippedMutations(docMeta, () => {
            const deleteValues = (obj: any) => Object.keys(obj).forEach(key => delete obj[key]);

            // Delete all highlights
            Object.values(docMeta.pageMetas).forEach((pageMeta) => {
                deleteValues(pageMeta.textHighlights);
                deleteValues(pageMeta.areaHighlights);
            });

            // Add placeholder
            const placeholder = createPlaceholderTextHighlight();

            docMeta.pageMetas[0].textHighlights[placeholder.id] = placeholder;
        });

        batch.update(oldDoc, 'value.value', DocMetas.serialize(docMeta));
    }

    function createPlaceholderTextHighlight(): ITextHighlight {
        const text = Texts.create('Your annotations have been migrated to Polar 3.0 and are no longer visible in your older client. Please upgrade', TextType.TEXT);

        return TextHighlightRecords.create([], [], text, 'red').value;
    }
}

