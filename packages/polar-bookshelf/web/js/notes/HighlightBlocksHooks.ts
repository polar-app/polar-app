import React from "react";
import {AnnotationContentType,} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {
    AnnotationContentTypeMap,
    AnnotationHighlightContent,
    AreaHighlightAnnotationContent,
    FlashcardAnnotationContent
} from "./content/AnnotationContent";
import {DocumentContent} from "./content/DocumentContent";
import {Block} from "./store/Block";
import {BlockPredicates} from "./store/BlockPredicates";
import {useBlocksStore} from "./store/BlocksStore";
import {IBlocksStore} from "./store/IBlocksStore";
import {comparer, reaction} from "mobx";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {FileType} from "../apps/main/file_loaders/FileType";
import {IDocScale, useDocViewerStore} from "../../../apps/doc/src/DocViewerStore";
import {BlockAreaHighlight} from "./BlockAreaHighlight";
import {useFirebaseCloudStorage} from "../datastore/FirebaseCloudStorage";
import {Backend} from "polar-shared/src/datastore/Backend";
import {DocIDStr} from "polar-shared/src/util/Strings";
import {BlockFlashcards} from "polar-blocks/src/annotations/BlockFlashcards";
import {BlockHighlights} from "polar-blocks/src/annotations/BlockHighlights";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

type IHighlightContentType = AnnotationContentType.AREA_HIGHLIGHT | AnnotationContentType.TEXT_HIGHLIGHT;

type IUseHighlightBlocks = {
    /**
     * The ID of the document that the highlights belong to.
     */
    docID: string;

    /**
     * The type of the highlights we want to fetch @see IHighlightContentType
     */
    type?: IHighlightContentType;
};

const isHighlightBlockOfType = <T extends IHighlightContentType>(type?: T) =>
    (item: Block): item is Block<AnnotationContentTypeMap[T]> =>
        type ? item.content.type === type : true

/**
 * Get highlight annotation blocks of a specific type
 *
 * @param opts Options object.
 *
 * @return {ReadonlyArray<BlockIDStr>}
 */
export const useHighlightBlockIDs = (opts: IUseHighlightBlocks): ReadonlyArray<BlockIDStr> => {
    const { docID, type } = opts;
    const [highlights, setHighlights] = React.useState<ReadonlyArray<BlockIDStr>>([]);
    const blocksStore = useBlocksStore();

    React.useEffect(() => {
        if (! docID) {
            return;
        }

        const updateHighlights = (ids: ReadonlyArray<BlockIDStr>) => setHighlights(ids);

        const getHighlights = (): ReadonlyArray<BlockIDStr> => {
            const documentBlock = getBlockForDocument(blocksStore, docID);

            if (! documentBlock) {
                return [];
            }

            return blocksStore
                .idsToBlocks(documentBlock.itemsAsArray)
                .filter(isHighlightBlockOfType(type))
                .map(({ id }) => id);
        };

        updateHighlights(getHighlights());

        return reaction(getHighlights, updateHighlights, { equals: comparer.structural });
    }, [docID, blocksStore, type]);

    return highlights;
};

interface IUseBlockItemsOpts {
    id: BlockIDStr;
}

/**
 * Get the items of a specific block
 *
 * @param opts Options object.
 *
 * @return {ReadonlyArray<BlockIDStr>}
 */
export const useBlockItems = (opts: IUseBlockItemsOpts): ReadonlyArray<BlockIDStr> => {
    const { id } = opts;
    const blocksStore = useBlocksStore();
    const [blockItems, setBlockItems] = React.useState<ReadonlyArray<BlockIDStr>>([]);

    React.useEffect(() => {
        const getBlockItems = () => {
            const block = blocksStore.getBlock(id);   

            return block ? block.itemsAsArray : [];
        };

        const updateBlockItems = (items: ReadonlyArray<BlockIDStr>) => setBlockItems(items);

        updateBlockItems(getBlockItems());
        return reaction(getBlockItems, updateBlockItems, { equals: comparer.structural });
    }, [blocksStore, id]);

    return blockItems;
};

/**
 * Get the document block of a specific document by ID.
 *
 * @param blocksStore BlocksStore instance.
 * @param fingerprint The id of the document.
 *
 * @return {Readonly<Block<DocumentContent>> | undefined}
 */
export const getBlockForDocument = (blocksStore: IBlocksStore, fingerprint: DocIDStr): Readonly<Block<DocumentContent>> | undefined => {
    const documentBlockID = blocksStore.indexByDocumentID[fingerprint];
    const block = blocksStore.getBlock(documentBlockID);
    if (! block || ! BlockPredicates.isDocumentBlock(block)) {
        return undefined;
    }

    return block;
};

export const useAnnotationBlockManager = () => {
    const blocksStore = useBlocksStore();
    const {docMeta} = useDocViewerStore(['docMeta']);

    const doMutation = React.useCallback(<T>(fingerprint: string, handler: (block: Block<DocumentContent>) => T): T | undefined => {
        const block = getBlockForDocument(blocksStore, fingerprint);

        if (block) {
            return handler(block as Block<DocumentContent>);
        } else {
            console.error(`Document with fingerprint ${fingerprint} was not found. Annotation block could not be created`);
            return undefined;
        }
    }, [blocksStore]);

    const getBlock = React.useCallback(<T extends AnnotationContentType = AnnotationContentType>(id: BlockIDStr, type?: T): Block<AnnotationContentTypeMap[T]> | undefined => {
        const block = blocksStore.getBlockForMutation(id);

        if (! block || ! BlockPredicates.isAnnotationBlock(block)) {
            console.log(`Could not find annotation block with the ID ${id}`);
            return undefined;
        }

        if (type && type !== block.content.type) {
            console.log(`Could not find ${type} block with the ID ${id}`);
            return undefined;
        }

        return block as Block<AnnotationContentTypeMap[T]>;
    }, [blocksStore]);

    // IMPORTANT: this function is only meant to be used within the doc reader, because it requires docMeta
    const create = React.useCallback((fingerprint: DocIDStr, content: AnnotationHighlightContent): BlockIDStr | undefined => {

        if (! docMeta) {
            console.error('Annotation block cannot be created due to docMeta not being available');
            return;
        }

        const createdBlock = doMutation(fingerprint, (block) => {
            const annotations = blocksStore
                .idsToBlocks(block.itemsAsArray)
                .filter(BlockPredicates.isAnnotationHighlightBlock);

            const position = BlockHighlights.calculateHighlightBlockPosition(annotations, { id: Hashcodes.createRandomID(), content }, docMeta);

            if (position === 'unshift') {
                return blocksStore.createNewBlock(block.id, { content: content, unshift: true });
            }

            return blocksStore.createNewBlock(block.id, { content: content, newChildPos: position });
        });

        return createdBlock ? createdBlock.id : undefined;
    }, [blocksStore, doMutation, docMeta]);


    const updateHighlight = React.useCallback((id: BlockIDStr, annotation: AnnotationHighlightContent) => {
        if (! docMeta) {
            console.error('Annotation block cannot be updated due to docMeta not being available');
            return;
        }

        blocksStore.setHighlightAnnotationBlockContent(id, annotation, docMeta);

    }, [blocksStore, docMeta]);

    const remove = React.useCallback((id: BlockIDStr) => {
        const block = getBlock(id);

        if (block) {
            blocksStore.deleteBlocks([id]);
        }
    }, [blocksStore, getBlock]);

    type FrontBackFlashcardContent = {
        type: FlashcardType.BASIC_FRONT_BACK,
        front: string,
        back: string,
    };

    type ClozeFlashcardContent = {
        type: FlashcardType.CLOZE,
        text: string,
    };

    type FlashcardContent = FrontBackFlashcardContent | ClozeFlashcardContent;

    const createFlashcard = React.useCallback((highlightID: BlockIDStr, flashcard: FlashcardContent) => {
        const highlightBlock = getBlock(highlightID);

        if (highlightBlock && BlockPredicates.isAnnotationHighlightBlock(highlightBlock)) {
            const getFlashcard = () => {
                if (flashcard.type === FlashcardType.BASIC_FRONT_BACK) {
                    return BlockFlashcards.createFrontBack(
                        flashcard.front,
                        flashcard.back,
                    );
                } else {
                    return BlockFlashcards.createCloze(
                        flashcard.text,
                    );
                }
            };

            const content = new FlashcardAnnotationContent({
                type: AnnotationContentType.FLASHCARD,
                docID: highlightBlock.content.docID,
                pageNum: highlightBlock.content.pageNum,
                links: highlightBlock.content.tagLinks,
                value: getFlashcard(),
            });

            blocksStore.createNewBlock(highlightBlock.id, { unshift: true, content });
        }
    }, [blocksStore, getBlock]);

    return { create, updateHighlight, remove, getBlock, createFlashcard };
};

type IBlockAreaHighlightOpts = {
    /**
     * The position of the area highlight within the page @see ILTRect
     */
    rect: ILTRect,

    /**
     * The page that the highlight was created under.
     */
    pageNum: number,

    /**
     * The root element of the document viewer.
     */
    docViewerElement: HTMLElement,

    /**
     * The file type of the document that the highlight belongs to @see FileType
     */
    fileType: FileType,

    /**
     * The current scale (zoom) level of the document @see IDocScale
     */
    docScale: IDocScale,
};

type ICreateBlockAreaHighlightOpts = IBlockAreaHighlightOpts & {
    type: 'create',

    /**
     * The ID of the document that the created areahighlight will belong to.
     */
    docID: DocIDStr,
};

type IUpdateBlockAreaHighlightOpts = IBlockAreaHighlightOpts & {
    type: 'update',

    /**
     * The id of the block to be updated
     */
    blockID: BlockIDStr,
};

export const useBlockAreaHighlight = () => {
    const {create: createAnnotationBlock, getBlock, updateHighlight} = useAnnotationBlockManager();
    const cloudStorage = useFirebaseCloudStorage();
    const blocksStore = useBlocksStore();

    const save = React.useCallback(async (opts: ICreateBlockAreaHighlightOpts | IUpdateBlockAreaHighlightOpts): Promise<string | undefined> => {
        const {
            rect,
            docScale,
            docViewerElement,
            pageNum,
            fileType,
        } = opts;

        const getFingerprint = (): string | null => {
            if (opts.type === 'create') {
                return opts.docID;
            } else {
                const block = getBlock(opts.blockID, AnnotationContentType.AREA_HIGHLIGHT);

                if (! block ) {
                    return null;
                }

                const root = blocksStore.getBlock(block.root);

                if (root && root.content.type === 'document') {
                    return root.content.docInfo.fingerprint;
                }
            }

            return null;
        };

        const getBlockID = (fingerprint: DocIDStr, content: AreaHighlightAnnotationContent): string | undefined => {
            if (opts.type === 'create') {
                return createAnnotationBlock(fingerprint, content);
            } else {
                return opts.blockID;
            }
        };

        const fingerprint = getFingerprint();

        if (! fingerprint) {
            return;
        }

        const { content, screenshot } = await BlockAreaHighlight.create({
            fingerprint,
            docScale,
            fileType,
            rect,
            pageNum,
            docViewerElement,
        });


        const blockID = getBlockID(fingerprint, content);

        if (blockID) {
            const { id, ext } = await BlockAreaHighlight.persistScreenshot(cloudStorage, screenshot);
            const name = `${id}.${ext}`;

            const block = getBlock(blockID, AnnotationContentType.AREA_HIGHLIGHT);
            if (! block) {
                return;
            }

            const contentJSON = block.content.toJSON();
            const { rects, order, position } = content.value;

            const newContent = new AreaHighlightAnnotationContent({
                ...contentJSON,
                value: {
                    ...contentJSON.value,
                    rects,
                    order,
                    position,
                    image: {
                        type: screenshot.type,
                        width: screenshot.width,
                        height: screenshot.height,
                        src: { name: name, backend: Backend.IMAGE },
                        id,
                    },
                },
            });

            updateHighlight(blockID, newContent);

            return blockID;
        }

        return undefined;
    }, [
        createAnnotationBlock,
        updateHighlight,
        getBlock,
        cloudStorage,
        blocksStore
    ]);

    const create = React.useCallback((docID: DocIDStr, opts: IBlockAreaHighlightOpts) => {
        return save({
            ...opts,
            docID,
            type: 'create',
        });
    }, [save]);

    const update = React.useCallback((blockID: BlockIDStr, opts: IBlockAreaHighlightOpts) => {
        return save({
            ...opts,
            blockID,
            type: 'update',
        });
    }, [save]);

    return { create, update };
};
