import React from "react";
import {AnnotationContentType, IAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {AnnotationContentBase, AnnotationContentTypeMap, FlashcardAnnotationContent} from "./content/AnnotationContent";
import {DocumentContent} from "./content/DocumentContent";
import {Block} from "./store/Block";
import {BlockPredicates} from "./store/BlockPredicates";
import {useBlocksStore} from "./store/BlocksStore";
import {IBlocksStore} from "./store/IBlocksStore";
import {autorun} from "mobx";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {Flashcards} from "../metadata/Flashcards";
import {Refs} from "polar-shared/src/metadata/Refs";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";

type IHighlightContentType = AnnotationContentType.AREA_HIGHLIGHT | AnnotationContentType.TEXT_HIGHLIGHT;

type IUseHighlightBlocks<T extends IHighlightContentType> = {
    docID: string;
    type?: T;
};

const isHighlightBlockOfType = <T extends IHighlightContentType>(type?: T) =>
    (item: Block): item is Block<AnnotationContentTypeMap[T]> =>
        type ? item.content.type === type : true

export const useHighlightBlocks = <T extends IHighlightContentType>(opts: IUseHighlightBlocks<T>) => {
    const { docID, type } = opts;
    const [areaHighlights, setAreaHighlights] = React.useState<ReadonlyArray<Block<AnnotationContentTypeMap[T]>>>([]);
    const blocksStore = useBlocksStore();

    React.useEffect(() => {
        if (! docID) {
            return;
        }

        const updateHighlights = () => {
            const documentBlock = blocksStore.getBlock(blocksStore.indexByDocumentID[docID]);
            if (! documentBlock) {
                return;
            }
            const blocks = blocksStore
                .idsToBlocks(documentBlock.itemsAsArray)
                .filter(isHighlightBlockOfType(type))
            setAreaHighlights(blocks);
        };

        return autorun(updateHighlights);
    }, [docID, blocksStore, type]);

    return areaHighlights
};


export const getBlockForDocument = (blocksStore: IBlocksStore, fingerprint: string) => {
    const documentBlockID = blocksStore.indexByDocumentID[fingerprint];
    const block = blocksStore.getBlock(documentBlockID);
    return block;
};

export const useAnnotationBlockManager = () => {
    const blocksStore = useBlocksStore();

    const doMutation = React.useCallback(<T>(fingerprint: string, handler: (block: Block<DocumentContent>) => T): T | undefined => {
        const block = getBlockForDocument(blocksStore, fingerprint);

        if (block && block.content.type === "document") {
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

    const updateMetadata = React.useCallback(<T extends IAnnotationContent>(annotation: T): T => {
        return {
            ...annotation,
            value: {
                ...annotation.value,
                lastUpdated: ISODateTimeStrings.create(),
            },
        };
    }, []);

    const create = React.useCallback((fingerprint: string, annotation: IAnnotationContent): BlockIDStr | undefined => {
        const annotationJSON = annotation instanceof AnnotationContentBase
            ? annotation.toJSON()
            : annotation;
        const createdBlock = doMutation(fingerprint, (block) =>
            blocksStore.createNewBlock(block.id, { content: updateMetadata(annotationJSON) })
        );
        return createdBlock ? createdBlock.id : undefined;
    }, [blocksStore, updateMetadata, doMutation]);

    const update = React.useCallback((id: BlockIDStr, annotation: IAnnotationContent) => {
        const annotationJSON = annotation instanceof AnnotationContentBase
            ? annotation.toJSON()
            : annotation;
        blocksStore.setBlockContent(id, updateMetadata(annotationJSON));
    }, [blocksStore, updateMetadata]);

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
                const ref = Refs.createFromAnnotationType(
                    highlightBlock.content.value.id,
                    AnnotationContentType.TEXT_HIGHLIGHT === highlightBlock.content.type
                        ? AnnotationType.TEXT_HIGHLIGHT
                        : AnnotationType.AREA_HIGHLIGHT
                );

                if (flashcard.type === FlashcardType.BASIC_FRONT_BACK) {
                    return Flashcards.createFrontBack(
                        flashcard.front,
                        flashcard.back,
                        ref,
                        'MARKDOWN',
                    )
                } else {
                    return Flashcards.createCloze(
                        flashcard.text,
                        ref,
                        'MARKDOWN'
                    );
                }
            };

            const content = new FlashcardAnnotationContent({
                type: AnnotationContentType.FLASHCARD,
                docID: highlightBlock.content.docID,
                pageNum: highlightBlock.content.pageNum,
                value: getFlashcard(),
            });

            blocksStore.createNewBlock(highlightBlock.id, { asChild: true, content });
        }
    }, [blocksStore, getBlock]);

    return { create, update, remove, getBlock, createFlashcard };
};
