import React from "react";
import {
    BlockIDStr,
    IBlock,
    IBlockContent,
    IBlockContentMap,
    IBlockContentStructure,
    IBlockLink,
    INamedContent
} from "polar-blocks/src/blocks/IBlock";
import {NamedContent, useBlocksStore} from "./store/BlocksStore";
import {IBlocksStore} from "./store/IBlocksStore";
import {BlockPredicates} from "./store/BlockPredicates";
import {Block} from "./store/Block";
import {DocIDStr} from "polar-shared/src/util/Strings";
import {NameContent} from "./content/NameContent";
import {TaggedCallbacks} from "../../../apps/repository/js/annotation_repo/TaggedCallbacks";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {HasLinks, TAG_IDENTIFIER} from "./content/HasLinks";
import {Comparators} from "polar-shared/src/util/Comparators";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {DocMetaBlockContents} from "polar-migration-block-annotations/src/DocMetaBlockContents";
import {useBlocksUserTagsDB} from "../../../apps/repository/js/persistence_layer/BlocksUserTagsDataLoader";
import {INameContent} from "polar-blocks/src/blocks/content/INameContent";
import {ContentEditables} from "./ContentEditables";
import {DOMBlocks} from "./contenteditable/DOMBlocks";
import {BlockContentCanonicalizer} from "./contenteditable/BlockContentCanonicalizer";
import {MarkdownContentConverter} from "./MarkdownContentConverter";
import {BLOCK_LINK_ACTION, useBlockActionTrigger} from "./contenteditable/BlockAction";
import {BlockIDs} from "./store/BlockIDs";
import {BlockTextContentUtils} from "./BlockTextContentUtils";

export const useDocumentBlockFromDocInfoCreator = () => {

    const blocksStore = useBlocksStore();

    return React.useCallback((docInfo: IDocInfo) => {

        const documentBlockExists = !! blocksStore.indexByDocumentID[docInfo.fingerprint];

        if (! documentBlockExists) {
            const cleanDocInfo = Dictionaries.onlyDefinedProperties(docInfo);
            const namedBlocks = blocksStore.namedBlocks.map(block => block.toJSON());

            const { docContentStructure, tagContentsStructure } = DocMetaBlockContents
                .getFromDocInfo(cleanDocInfo, namedBlocks);

            blocksStore.insertFromBlockContentStructure([
                docContentStructure,
                ...tagContentsStructure,
            ], { isUndoable: false });

        }

    }, [blocksStore]);

};

const sortByTypeComparator = (a: Readonly<IBlock<INamedContent>>, b: Readonly<IBlock<INamedContent>>) => {

    function toInt(block: Readonly<IBlock<INamedContent>>) {

        if (block.content.type === 'name' && block.content.data.startsWith("/")) {
            // push this down to the end.
            return 3;
        }

        switch (block.content.type) {

            case "document":
            case "name":
                // documents and named notes have real names
                return 1;
            case "date":
                // then sort by date
                return 2;

        }

    }

    return toInt(a) - toInt(b);

}

const sortByContentComparator = (a: Readonly<IBlock<INamedContent>>, b: Readonly<IBlock<INamedContent>>) => {

    const strA = BlockTextContentUtils.getTextContentMarkdown(a.content);
    const strB = BlockTextContentUtils.getTextContentMarkdown(b.content);

    return strA.localeCompare(strB);

}

export const namedBlocksComparator = Comparators.chain(sortByTypeComparator, sortByContentComparator);

export const sortNamedBlocks = (blocks: ReadonlyArray<Block<NamedContent>>): ReadonlyArray<Block<NamedContent>> => {

    return [...blocks].sort(namedBlocksComparator);
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

            return root.itemsAsArray[0] || blocksStore.createNewBlock(root.id, { unshift: true }).id;
        };

        blocksStore.setActiveWithPosition(getFirstChildID(), 'start');
    }
};


export const useBlockTagEditorDialog = () => {
    const blocksStore = useBlocksStore();
    const dialogs = useDialogManager();
    const updateBlockTags = useUpdateBlockTags();
    const blocksUserTagsDB = useBlocksUserTagsDB();

    return React.useCallback((ids: ReadonlyArray<BlockIDStr>) => {
        const blocks = arrayStream(ids)
            .map(id => blocksStore.getBlockForMutation(id))
            .filterPresent()
            .collect();

        if (! blocks.length) {
            return console.error('useBlockTagEditorDialog: Blocks to be edited were not found.');
        }

        type ITaggedBlock = TaggedCallbacks.ITagsHolder & IHasLinksBlockTarget;

        const toTarget = (block: Block): ITaggedBlock => ({
            id: block.id,
            content: block.content,
            tags: Tags.toMap(block.content.getTags()),
        });

        const opts: TaggedCallbacks.TaggedCallbacksOpts<ITaggedBlock> = {
            targets: () => blocks.map(toTarget),
            tagsProvider: () => blocksUserTagsDB.tags(),
            dialogs,
            doTagged: updateBlockTags,
        };


        TaggedCallbacks.create(opts)();
    }, [blocksStore, blocksUserTagsDB, dialogs, updateBlockTags]);
};

export interface IHasLinksBlockTarget {
    readonly id: BlockIDStr;
    readonly content: HasLinks;
};

export const useUpdateBlockTags = () => {
    const blocksStore = useBlocksStore();
    const blocksUserTagsDB = useBlocksUserTagsDB();

    /**
     * @param targets An array of targets to updated
     * @param tags The new tags
     * @param strategy The strategy on how to calculate the new tags for a target
     *
     * TODO: This function is a disaster and needs to be refactored 🤷
     */
    return React.useCallback((targets: ReadonlyArray<IHasLinksBlockTarget>,
                              tags: ReadonlyArray<Tag>,
                              strategy: Tags.ComputeNewTagsStrategy = 'set'): void => {

        const getBlockIDFromTag = (tag: Tag): BlockIDStr | undefined => {
            const block = blocksStore.getBlockByName(tag.label);

            if (! block || ! BlockPredicates.isNamedBlock(block)) {
                return undefined;
            }

            return block.id
        };

        const getNonExistentTagBlocks = (): ReadonlyArray<IBlockContentStructure<INameContent>> => {

            const toContentStructure = ({ label }: Tag): IBlockContentStructure<INameContent> => {
                return {
                    id: BlockIDs.createRandom(),
                    content: new NameContent({ type: 'name', data: label, links: [] }).toJSON(),
                    children: [],
                };
            };

            return tags.filter(tag => ! getBlockIDFromTag(tag)).map(toContentStructure);
        };

        const updateTarget = ({ id, content }: IHasLinksBlockTarget): IHasLinksBlockTarget => {

            const newTags = Tags.computeNewTags(Tags.toMap(content.getTags()), tags, strategy);

            const newTagLinks = newTags.map(({ label }) => {

                const tagBlock = blocksStore.getBlockByName(label);

                if (! tagBlock) {
                    throw new Error('Tag block not found');
                }

                return { text: `${TAG_IDENTIFIER}${label}`, id: tagBlock.id };
            });

            const newContent = new HasLinks({ links: [...content.wikiLinks, ...newTagLinks] });


            return { id, content: newContent };
        };

        const computeTagLinksDelta = (before: HasLinks, after: HasLinks) => {
            const beforeTagLinksIDs = new Set(before.tagLinks.map(({ id }) => id));
            const afterTagLinksIDs = new Set(after.tagLinks.map(({ id }) => id));

            return {
                added: after.tagLinks.filter(({ id }) => ! beforeTagLinksIDs.has(id)),
                removed: before.tagLinks.filter(({ id }) => ! afterTagLinksIDs.has(id)),
            };
        };

        const updatedTargetToBlockContentStructure = (target: IHasLinksBlockTarget): IBlockContentStructure | undefined => {
            const block = blocksStore.getBlockForMutation(target.id);

            if (! block) {
                return undefined;
            }

            const { content } = block;

            const { removed, added } = computeTagLinksDelta(content, target.content);

            if (removed.length === 0 && added.length === 0) {
                return undefined;
            }

            if (BlockPredicates.canHaveLinks(block)) {
                const canHaveLinksContent = block.content;

                const markdown = BlockTextContentUtils.getTextContentMarkdown(canHaveLinksContent);

                const newMarkdown = removed.reduce((acc, item) => {
                    return acc.replace(new RegExp(`\s?\\[\\[${item.text}\\]\\]`), '');
                }, markdown);

                const linksMarkdown = added.map(({ text }) => `[[${text}]]`).join(' ');

                const newContent = BlockTextContentUtils
                    .updateTextContentMarkdown(canHaveLinksContent, `${newMarkdown} ${linksMarkdown}`);

                newContent.updateLinks(target.content.links);

                return {
                    id: target.id,
                    content: newContent,
                    children: [],
                };
            } else {
                content.updateLinks(target.content.links);

                return {
                    id: target.id,
                    content,
                    children: [],
                };
            }

        };

        const nonExistentBlocks = getNonExistentTagBlocks();

        // 1. Create notes for non existent tags
        if (nonExistentBlocks.length > 0) {
            blocksStore.insertFromBlockContentStructure(nonExistentBlocks);
        }

        // 2. Update targets
        const updatedTargets = targets.map(updateTarget);
        const updatedBlocks = arrayStream(updatedTargets)
            .map(updatedTargetToBlockContentStructure)
            .filterPresent()
            .collect();

        if (updatedBlocks.length > 0) {
            blocksStore.setBlockContents(updatedBlocks);
        }

        // 3. Commit new tags to UserTagsDB
        const newUserTags = arrayStream(tags)
            .map((tag) => {
                const blockID = getBlockIDFromTag(tag);

                if (! blockID || blocksUserTagsDB.exists(blockID)) {
                    return undefined;
                }

                return { id: blockID, label: tag.label };
            }).filterPresent()
            .collect();


        if (newUserTags.length > 0) {
            newUserTags.forEach(tag => blocksUserTagsDB.register(tag));
            blocksUserTagsDB.commit().catch(console.error);
        }

        /**
         * TODO: Ideally the above 3 operations should be done in 1 batch
         */

    }, [blocksStore, blocksUserTagsDB]);
};

export namespace BlockContentUtils {

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

export namespace BlockLinksMatcher {

    export function filter<T extends IBlock>(list: ReadonlyArray<T>,
                                             filterLinks: ReadonlyArray<IBlockLink>): ReadonlyArray<T> {

        const filterLinksMap = arrayStream(filterLinks).toMap(({ id }) => id);

        function predicate(item: IBlock): boolean {

            const itemLinks = item.content.links;

            for (const itemLink of itemLinks) {
                if (filterLinksMap[itemLink.id]) {
                    return true;
                }
            }

            return false;

        }

        return list.filter(predicate);
    }

}

export const useCreateBacklinkFromSelection = () => {
    const blocksStore = useBlocksStore();
    const blockActionTrigger = useBlockActionTrigger();

    return React.useCallback((id: BlockIDStr) => {
        const range = ContentEditables.currentRange();
        const block = blocksStore.getBlock(id);

        if (! range || ! block || ! BlockPredicates.canHaveLinks(block)) {
            return;
        }

        const blockElement = DOMBlocks.findBlockParent(range.startContainer);

        if (! blockElement) {
            return;
        }

        if (range.collapsed) {
            blockActionTrigger(id, blockElement, BLOCK_LINK_ACTION);
        } else {

            const target = range.toString().trim();

            if (target.length === 0) {
                return;
            }

            range.deleteContents();
            const wikiLinkAnchor = DOMBlocks.createWikiLinkAnchorElement('link', target)
            range.insertNode(wikiLinkAnchor);
            range.setStartAfter(wikiLinkAnchor);

            const html = BlockContentCanonicalizer.canonicalizeElement(blockElement).innerHTML;

            const markdown = MarkdownContentConverter.toMarkdown(html);

            blocksStore.createLinkToBlock(id, target, markdown);
        }
    }, [blocksStore, blockActionTrigger]);
};
