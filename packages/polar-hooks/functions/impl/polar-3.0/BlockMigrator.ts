import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {Polar3DocMetaMigrator} from "./Migrator";
import {DocAnnotationLoader2} from "polar-bookshelf/web/js/annotation_sidebar/DocAnnotationLoader2";
import {DocFileResolver} from "polar-bookshelf/web/js/datastore/DocFileResolvers";
import {DocAnnotations} from "polar-bookshelf/web/js/annotation_sidebar/DocAnnotations";
import {Backend} from "polar-shared/src/datastore/Backend";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {BlockContentStructure} from "polar-bookshelf/web/js/notes/HTMLToBlocks";
import {BlocksStore} from "polar-bookshelf/web/js/notes/store/BlocksStore";
import {UndoQueues2} from "polar-bookshelf/web/js/undo/UndoQueues2";
import {AnnotationBlockMigrator} from "polar-bookshelf/apps/doc/src/AnnotationBlockMigrator";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {AnnotationHighlightContent} from "polar-bookshelf/web/js/notes/content/AnnotationContent";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockHighlights} from "polar-bookshelf/web/js/notes/BlockHighlights";
import {IDUser} from "../../impl/util/IDUsers";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {INameContent} from "polar-blocks/src/blocks/content/INameContent";
import {IQueryDocumentSnapshot} from "polar-firestore-like/src/IQueryDocumentSnapshot";
import {BlockTextContentUtils} from "polar-bookshelf/web/js/notes/NoteUtils";

const mockDocFileResolver: DocFileResolver = () => ({
    ref: { name: 'mock' },
    backend: Backend.IMAGE,
    url: 'http://foo.bar.com',
});

export namespace BlockMigrator {
    import IDocMetaWOriginal = Polar3DocMetaMigrator.IDocMetaWOriginal;

    const BLOCKS_COLLECTION_NAME = 'block';

    export async function migrateDocMeta(userID: IDUser,
                                         firestore: IFirestore<unknown>,
                                         batch: IWriteBatch<unknown>,
                                         data: IDocMetaWOriginal): Promise<void> {

        
        const blocksCollection = firestore.collection(BLOCKS_COLLECTION_NAME);

        const existingBlocks = await getExistingNameBlocks(userID, firestore)
        const existingBlocksNames = existingBlocks.map(({ content }) => BlockTextContentUtils.getTextContentMarkdown(content).toLowerCase());
        const existingBlocksNamesSet = new Set(existingBlocksNames);

        const blocks = getMigratedBlocksSnapshot(userID, data.docMeta);

        const removeExisting = (block: IBlock) =>
            block.content.type !== 'name' || ! existingBlocksNamesSet.has(block.content.data.toLowerCase());

        const writeToBatch = (block: IBlock) => {
            const doc = blocksCollection.doc(block.id);
            batch.set(doc, block);
        };

        blocks.filter(removeExisting).forEach(writeToBatch);
    }

    async function getExistingNameBlocks(userID: IDUser,
                                         firestore: IFirestore<unknown>): Promise<ReadonlyArray<IBlock<INameContent>>> {
        const query = firestore
            .collection(BLOCKS_COLLECTION_NAME)
            .where('uid', '==', userID.uid)
            .where('content.type', '==', 'name');

        const snapshots = await query.get();

        const toBlock = (snapshot: IQueryDocumentSnapshot<unknown>): IBlock<INameContent> =>
            snapshot.data() as IBlock<INameContent>;

        return snapshots.docs.map(toBlock);
    }

    function getMigratedBlocksSnapshot(userID: IDUser, docMeta: IDocMeta) {
        const annotations = DocAnnotationLoader2
            // The resolved URL is not being used, that's why we're using a mock function for the URL resolver
            .load(docMeta, mockDocFileResolver)
            .map(DocAnnotations.toRef);

        const { docInfo, docInfo: { fingerprint } } = docMeta;

        const store = new BlocksStore(userID.uid, UndoQueues2.create({ limit: 50 }));

        const documentBlockID = AnnotationBlockMigrator.createDocumentBlock(store, docInfo);

        const contentStructure = AnnotationBlockMigrator
            .annotationsToBlockContentStructure(store, fingerprint, annotations)
            .filter((data): data is BlockContentStructure<AnnotationHighlightContent> => (
                data.content.type === AnnotationContentType.AREA_HIGHLIGHT
                || data.content.type === AnnotationContentType.TEXT_HIGHLIGHT
            ))
            .map(data => ({ ...data, id: Hashcodes.createRandomID() }));

        const sorted = BlockHighlights.sortByPositionInDocument(docMeta, contentStructure);
        
        store.insertFromBlockContentStructure(sorted, { ref: documentBlockID });

        return store.createSnapshot(Object.keys(store.index));
    }
}
