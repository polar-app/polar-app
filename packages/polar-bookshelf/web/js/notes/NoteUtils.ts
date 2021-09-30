import React from "react";
import {BlockIDStr, IBlockContent, IBlockContentMap} from "polar-blocks/src/blocks/IBlock";
import {NamedContent, useBlocksStore} from "./store/BlocksStore";
import {IBlocksStore} from "./store/IBlocksStore";
import {autorun} from "mobx";
import equal from "deep-equal";
import {BlockPredicates, EditableContent, TextContent} from "./store/BlockPredicates";
import {DocInfos} from "../metadata/DocInfos";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {Block} from "./store/Block";
import {FlashcardAnnotationContent, TextHighlightAnnotationContent} from "./content/AnnotationContent";
import {DocIDStr, MarkdownStr} from "polar-shared/src/util/Strings";
import {MarkdownContent} from "./content/MarkdownContent";
import {NameContent} from "./content/NameContent";
import {DateContent} from "./content/DateContent";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {IBlockFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {BlockFlashcards} from "polar-blocks/src/annotations/BlockFlashcards";
import {TaggedCallbacks} from "../../../apps/repository/js/annotation_repo/TaggedCallbacks";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {useRefWithUpdates} from "../hooks/ReactHooks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {HasLinks, TAG_IDENTIFIER} from "./content/HasLinks";


/**
 * Get all the named blocks in notes.
 */
export const useNamedBlocks = (): ReadonlyArray<Block<NamedContent>> => {
	const blocksStore = useBlocksStore();
	const [namedBlocks, setNamedBlocks] = React.useState<ReadonlyArray<Block<NamedContent>>>([]);
	const prevNamedBlocksIDsRef = React.useRef<BlockIDStr[] | null>(null);
    
	React.useEffect(() => {
	    const disposer = autorun(() => {
            const namedBlocksIDs = Object.values(blocksStore.indexByName);
            if (! equal(prevNamedBlocksIDsRef.current, namedBlocksIDs)) {
                const namedBlocks = blocksStore.idsToBlocks(namedBlocksIDs) as ReadonlyArray<Block<NamedContent>>;
                setNamedBlocks(namedBlocks);
                prevNamedBlocksIDsRef.current = namedBlocksIDs;
            }
	    });
    
	    return () => disposer();
	}, [blocksStore]);
    
	return namedBlocks;
};

/**
 * Focus the first child of a block and create one if one doesn't already exist.
 *
 * TODO: move this into BlocksStore
 */
export const focusFirstChild = (blocksStore: IBlocksStore, id: BlockIDStr) => {
    const root = blocksStore.getBlock(id);

    if (root) {
        const getFirstChildID = (): BlockIDStr => {

            if (BlockPredicates.isDocumentBlock(root)) {
                return root.itemsAsArray[0];
            }

            return root.itemsAsArray[0] || blocksStore.createNewBlock(root.id, { asChild: true }).id;
        };

        blocksStore.setActiveWithPosition(getFirstChildID(), 'start');
    }
};


export const useBlockTagEditorDialog = () => {
    const blocksStore = useBlocksStore();
    const namedBlocksRef = useRefWithUpdates(useNamedBlocks());
    const dialogs = useDialogManager();

    return React.useCallback((ids: ReadonlyArray<BlockIDStr>) => {
        const blocks = arrayStream(ids)
            .map(id => blocksStore.getBlockForMutation(id))
            .filterPresent()
            .collect();

        if (! blocks.length) {
            return console.error('useBlockTagEditorDialog: Blocks to be edited were not found.');
        }

        type ITaggedBlock = TaggedCallbacks.ITagsHolder & BlockContentUtils.IHasLinksBlockTarget;

        const toTarget = (block: Block): ITaggedBlock => ({
            id: block.id,
            content: block.content,
            tags: block.content.getTagsMap(),
        });

        const opts: TaggedCallbacks.TaggedCallbacksOpts<ITaggedBlock> = {
            targets: () => blocks.map(toTarget),
            tagsProvider: () => namedBlocksRef.current.map(block => ({
                label: BlockTextContentUtils.getTextContentMarkdown(block.content),
                id: block.id,
            })),
            dialogs,
            doTagged: BlockContentUtils.updateTags.bind(null, blocksStore),
        };


        TaggedCallbacks.create(opts)();
    }, [blocksStore, namedBlocksRef, dialogs]);
};



export namespace BlockContentUtils {

    export interface IHasLinksBlockTarget {
        id: BlockIDStr;
        content: HasLinks;
    };

    /**
     * @param blocksStore BlocksStore instance
     * @param targets An array of targets to updated @see IHasLinksBlockTarget
     * @param tags The new tags
     * @param strategy The strategy on how to calculate the new tags for a target @see Tags.ComputeNewTagsStrategy
     */
    export function updateTags(
        blocksStore: IBlocksStore,
        targets: ReadonlyArray<IHasLinksBlockTarget>,
        tags: ReadonlyArray<Tag>,
        strategy: Tags.ComputeNewTagsStrategy = 'set'
    ): void {
        const updateTarget = ({ id, content }: IHasLinksBlockTarget) => {
            const newTags = Tags.computeNewTags(content.getTagsMap(), tags, strategy);

            const newTagLinks = newTags.map(({ label }) => {
                const getBlockID = (): string => {
                    const block = blocksStore.getBlockByName(label);

                    if (block) {
                        return block.id;
                    }

                    const content = new NameContent({ type: 'name', data: label, links: [] });
                    return blocksStore.createNewNamedBlock({ content });
                };

                const blockID = getBlockID();

                return { text: `${TAG_IDENTIFIER}${label}`, id: blockID };
            });

            const block = blocksStore.getBlockForMutation(id);

            if (! block) {
                return;
            }

            const wikiLinks = block.content.wikiLinks;

            const newContent = block.content;
            newContent.updateLinks([...wikiLinks, ...newTagLinks]);

            blocksStore.setBlockContent(id, newContent);
        };

        targets.forEach(updateTarget);
    }

    /**
     * A Generic Utility function to update the content of a block.
     *
     * @param blocksStore BlocksStore instance
     * @param id The id of the block being updated
     * @param type The content type of the block @see IBlockContent
     * @param updater Function Callback function that is used to update the content
     */
    export function updateContent<T extends IBlockContent['type']>(
        blocksStore: IBlocksStore,
        id: BlockIDStr,
        type: T,
        updater: (content: IBlockContentMap[T]) => void,
    ): void {
        const block = blocksStore.getBlockForMutation(id);

        if (! block) {
            return console.error(`Block to be updated was not found (id: ${id})`);
        }

        if (block.content.type !== type) {
            return console.error(`
                Block to updated doesn't have the correct type, skipping...
                Expected: ${type}
                Actual: ${block.content.type}
            `);
        }

        const content = block.content.toJSON() as IBlockContentMap[T];

        updater(content);

        blocksStore.setBlockContent(id, content);
    }

    /**
     * Update the contents of a document block by its document identifier.
     *
     * @param blocksStore BlocksStore instance
     * @param id The id of the block being updated
     * @param updater Function Callback function that is used to update the content
     */
    export function updateDocumentContentByFingerprint(
        blocksStore: IBlocksStore,
        docID: DocIDStr,
        updater: (content: IDocumentContent) => void,
    ): void {
        const id = blocksStore.indexByDocumentID[docID];

        if (! id) {
            return console.error(`Document block to be updated was not found for docID: ${docID}`);
        }

        updateContent(blocksStore, id, 'document', updater);
    }
}

export namespace BlockTextContentUtils {

    /**
     * Update the markdown content of a flashcard given the field.
     *
     * @param content FlashcardAnnotationContent instance
     * @param field The flashcard field to be updated
     * @param markdown The new markdown content
     */
    export function updateFlashcardContentMarkdown<T extends IBlockFlashcard>(
        content: FlashcardAnnotationContent<T>,
        field: keyof T['fields'],
        markdown: MarkdownStr,
    ): FlashcardAnnotationContent {
        const flashcardContent = content.toJSON();

        return new FlashcardAnnotationContent({
            ...flashcardContent,
            value: BlockFlashcards.updateField(flashcardContent.value, field, markdown),
        });
    }

    /**
     * Update the markdown content of an editable text block.
     *
     * @param content An instance of the block's content instance
     * @param markdown The new markdown content
     */
    export function updateTextContentMarkdown(
        content: Exclude<EditableContent, FlashcardAnnotationContent>,
        markdown: MarkdownStr
    ): EditableContent {

        switch(content.type) {
            case "markdown":
                return new MarkdownContent({ ...content.toJSON(), data: markdown });
            case "date":
                return new DateContent({ ...content.toJSON(), data: markdown });
            case "name":
                return new NameContent({ ...content.toJSON(), data: markdown });
            case AnnotationContentType.TEXT_HIGHLIGHT:
                const textHighlightContent = content.toJSON();
                return new TextHighlightAnnotationContent({
                    ...textHighlightContent,
                    value: {
                        ...textHighlightContent.value,
                        revisedText: markdown,
                    }
                });
        }
    };

    /**
     * Get the markdown text of an editable text block
     *
     * @param content An editable text content instance @see TextContent
     */
    export function getTextContentMarkdown(content: TextContent): string {
        switch (content.type) {
            case 'date':
            case 'name':
            case 'markdown':
                return content.data;
            case 'document':
                return DocInfos.bestTitle(content.docInfo);
            case AnnotationContentType.TEXT_HIGHLIGHT:
                return BlockTextHighlights.toText(content.value);
            case AnnotationContentType.FLASHCARD:
                return content.value.type === FlashcardType.CLOZE
                    ? content.value.fields.text
                    : content.value.fields.front;
        }
    }
}
