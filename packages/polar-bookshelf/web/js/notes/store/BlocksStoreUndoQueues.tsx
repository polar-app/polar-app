import {SetArrays} from "polar-shared/src/util/SetArrays";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {BlocksStore, IActiveBlock} from "./BlocksStore";
import {UndoQueues2} from "../../undo/UndoQueues2";
import {Block, IWithMutationOpts} from "./Block";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlocksStoreMutations} from "./BlocksStoreMutations";
import {BlocksPersistenceWriter} from "../persistence/FirestoreBlocksStoreMutations";
import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";
import {IBlocksStore} from "./IBlocksStore";
import {BlockPredicates} from "./BlockPredicates";
import {DocumentContent} from "../content/DocumentContent";
import moment from "moment";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";

export namespace BlocksStoreUndoQueues {

    import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
    import IBlocksStoreMutationUpdated = BlocksStoreMutations.IBlocksStoreMutationModified;
    import IBlocksStoreMutationAdded = BlocksStoreMutations.IBlocksStoreMutationAdded;
    import IBlocksStoreMutationRemoved = BlocksStoreMutations.IBlocksStoreMutationRemoved;
    import computeMutationTargets = BlocksStoreMutations.computeMutationTargets;
    import IItemsPositionPatch = BlocksStoreMutations.IItemsPositionPatch;
    import computeItemPositionPatches = BlocksStoreMutations.computeItemPositionPatches;

    export interface IUndoMutation {
        readonly parent: IBlock | undefined;
        readonly child: IBlock;
    }

    export interface IUndoCapture {

        readonly capture: () => void;

        /**
         * Undo the operations using patches.
         */
        readonly undo: () => void;

        /**
         * Redo the operations using patches.
         */
        readonly redo: () => void;

        readonly persist: () => void;

    }

    export interface IUndoCaptureOpts {
        readonly noExpand?: boolean;
    }

    export function doSave<T>(blocksStore: BlocksStore,
                              identifiers: ReadonlyArray<BlockIDStr>,
                              blocksPersistenceWriter: BlocksPersistenceWriter,
                              redoDelegate: () => T): T {

        const undoCapture = createUndoCapture(blocksStore, identifiers, blocksPersistenceWriter);

        const value = redoDelegate();

        undoCapture.capture();
        undoCapture.persist();

        return value;
    }

    /**
     * Do an undo operation and push it into the undo queue.
     */
    export function doUndoPush<T>(blocksStore: BlocksStore,
                                  undoQueue: UndoQueues2.UndoQueue,
                                  identifiers: ReadonlyArray<BlockIDStr>,
                                  blocksPersistenceWriter: BlocksPersistenceWriter,
                                  redoDelegate: () => T): T {

        // TODO: dont' allow undo on pages that aren't currently the root because when the user
        // is navigating through different pages they could undo stuff in a previous context
        // but maybe the trick here is to create a new undo context when the route changes.

        // this captures the state before the initial transaction
        const undoCapture = createUndoCapture(blocksStore, identifiers, blocksPersistenceWriter);

        let captured: boolean = false;

        let result: T | undefined;

        /**
         * The redo operation has to execute, capture the graph for a delta
         * operation later,
         */
        const redo = (): T => {

            if (captured) {
                undoCapture.redo();
            } else {
                try {
                    result = redoDelegate();
                } catch (e) {
                    console.error('BlocksUndoQueue: action', e);
                }
                undoCapture.capture();
                captured = true;
            }

            return result!;

        }

        const undo = () => {
            undoCapture.undo();
        };

        try {

            return undoQueue.push({redo, undo}).value;

        } finally {
            undoCapture.persist();
        }

    }
    /**
     * Perform an undo capture for the following identifiers based on their
     * parent
     */
    export function createUndoCapture(blocksStore: BlocksStore,
                                      identifiers: ReadonlyArray<BlockIDStr>, blocksPersistenceWriter: BlocksPersistenceWriter): BlocksStoreUndoQueues.IUndoCapture {

        if (identifiers.length === 0) {
            throw new Error("Not given any identifiers");
        }

        const sideAffectedIdentifiers = getAffectedDocumentBlocksIdentifiers(blocksStore, identifiers);

        const ids = new Set([
            ...expandToParentAndChildren(blocksStore, identifiers),
            ...sideAffectedIdentifiers,
        ]);

        if (ids.size === 0) {
            throw new Error("Expansion failed to identify additional identifiers");
        }

        /**
         * Computes only the blocks that are applicable to this operation.  We
         * have to know all the block IDs that would be involved with this
         * transaction.
         */
        const computeApplicableBlocks = (blocks: ReadonlyArray<IBlock>) => {
            return blocks.filter(block => ids.has(block.id));
        ;}

        const beforeBlocks: ReadonlyArray<IBlock> = computeApplicableBlocks(blocksStore.createSnapshot(Array.from(ids)));
        const oldActive: IActiveBlock | undefined = blocksStore.cursorOffsetCapture();

        let afterBlocks: ReadonlyArray<IBlock> = [];
        let newActive: IActiveBlock | undefined;

        const capture = () => {

            const beforeSideEffectsSnapshot = blocksStore.createSnapshot(Array.from(ids));
            const beforeSideEffectsAfterBlocks = computeApplicableBlocks(beforeSideEffectsSnapshot);
            const beforeSideEffectsMutations = computeMutatedBlocks(beforeBlocks, beforeSideEffectsAfterBlocks);

            performDocumentSideEffects(blocksStore, sideAffectedIdentifiers, beforeSideEffectsMutations);

            const snapshot = blocksStore.createSnapshot(Array.from(ids));

            afterBlocks = computeApplicableBlocks(snapshot);
            newActive = blocksStore.cursorOffsetCapture();

        };

        const undo = () => {
            const mutations = computeMutatedBlocks(beforeBlocks, afterBlocks);
            blocksPersistenceWriter(doMutations(blocksStore, 'undo', mutations));
            if (oldActive) {
                blocksStore.setActiveWithPosition(oldActive.id, oldActive.pos);
            }
        };

        const redo = () => {
            const mutations = computeMutatedBlocks(beforeBlocks, afterBlocks);
            blocksPersistenceWriter(doMutations(blocksStore, 'redo', mutations));
            if (newActive) {
                blocksStore.setActiveWithPosition(newActive.id, newActive.pos);
            }
        };

        const persist = () => {
            const mutations = computeMutatedBlocks(beforeBlocks, afterBlocks);
            blocksPersistenceWriter(mutations);
        };

        return {capture, undo, redo, persist};

    }

    export type UndoMutationType = 'undo' | 'redo';

    /**
     *
     */
    export function doMutations(blocksStore: BlocksStore,
                                mutationType: UndoMutationType,
                                mutations: ReadonlyArray<IBlocksStoreMutation>): ReadonlyArray<IBlocksStoreMutation> {

        const createWithMutationOpts =  (mutation: IBlocksStoreMutation): IWithMutationOpts => {

            const blockMutation = blocksStore.getBlock(mutation.id)?.mutation;
            const newMutationNumber = blockMutation === undefined ? 0 : blockMutation + 1;

            switch (mutationType) {

                case "undo":

                    switch (mutation.type) {

                        case "added":
                            return {
                                updated: mutation.added.updated,
                                mutation: newMutationNumber,
                            };
                        case "removed":
                            return {
                                updated: mutation.removed.updated,
                                mutation: newMutationNumber,
                            };
                        case "modified":
                            return {
                                updated: mutation.before.updated,
                                mutation: newMutationNumber,
                            };

                    }

                case "redo":

                    const updated = ISODateTimeStrings.create();

                    switch (mutation.type) {

                        case "added":
                            return {
                                updated,
                                mutation: newMutationNumber,
                            }
                        case "removed":
                            return {
                                updated,
                                mutation: newMutationNumber,
                            }
                        case "modified":
                            return {
                                updated,
                                mutation: newMutationNumber,
                            }

                    }

            }

        }

        const handleModified = (mutation: IBlocksStoreMutationUpdated) => {

            // updated means we need to restore it to the older version.

            const block = blocksStore.getBlockForMutation(mutation.id);

            if (! block) {
                throw new Error("Could not find updated block: " + mutation.id);
            }

            console.log(`Handling 'updated' mutation for block ${block.id}: `, mutation);

            const mutationTargets = computeMutationTargets(mutation.before, mutation.after);

            const computeComparisonBlock = (): IBlock => {

                switch (mutationType) {
                    case "undo":
                        return mutation.before;
                    case "redo":
                        return mutation.after;

                }

            }

            const computeTransformedItemPositionPatches = () => {

                const transformItemPositionPatch = (itemsPositionPatch: IItemsPositionPatch): IItemsPositionPatch => {

                    const computeUndoType = () => {
                        return itemsPositionPatch.type === 'remove' ? 'insert' : 'remove';
                    }

                    const computeRedoType = () => {
                        return itemsPositionPatch.type;
                    }

                    const newType = mutationType === 'undo' ? computeUndoType() : computeRedoType();

                    console.log(`Transform item patch from ${itemsPositionPatch.type} to ${newType}`);

                    return {
                        type: newType,
                        key: itemsPositionPatch.key,
                        id: itemsPositionPatch.id
                    }

                }

                return computeItemPositionPatches(mutation.before.items, mutation.after.items)
                           .map(current => transformItemPositionPatch(current));


            }

            //
            // Bob: block0 : v0 => San Francisco
            //
            // # Bob creates block0 at v0 (version 0) and sets the value to "San Francisco"
            //
            // Alice: block0 : v1 => Germany
            //
            // # Alice edits block0, changes the version number to v1, and sets the value to "Germany"
            // #
            // # Alice has an undo queue entry here that can properly restore the block0 edit
            // # from v1 to v0 but ONLY if block0 is at v1.
            // #
            // # right now she can undo if she wants.
            //
            // Bob: block0 : v2 => San Francisco
            //
            // # Bob sets the content of block0 back to San Francisco, and the version is
            // # automatically set to v2.
            // #
            // # Now Alice is prevented from doing an undo because when she reads the current
            // # version, she sees that it's not compatible with her undo so it's silently
            // # aborted.

            const withMutationComparison = (action: (comparisonBlock: IBlock) => void) => {

                const comparisonBlock = computeComparisonBlock();

                const currentVersion = blocksStore.getBlock(mutation.id);

                if (currentVersion && currentVersion.content.mutator === mutation.after.content.mutator) {

                    action(comparisonBlock);

                    return true;

                } else {
                    console.log(`WARN: Skipping update because the mutator is different`, mutation);
                    return false;
                }

            }

            const doHandleUpdated = () => {

                const comparisonBlock = computeComparisonBlock();

                const opts = createWithMutationOpts(mutation);

                block.withMutation(() => {

                    if (mutationTargets.includes('content')) {

                        withMutationComparison(() => {
                            block.setContent(comparisonBlock.content);
                        });

                    }

                    if (mutationTargets.includes('items')) {
                        block.setItemsUsingPatches(computeTransformedItemPositionPatches());
                    }

                    if (mutationTargets.includes('parent')) {
                        block.setParent(comparisonBlock.parent);
                    }

                    if (mutationTargets.includes('parents')) {
                        block.setParents(comparisonBlock.parents);
                    }

                }, opts);

                blocksStore.doPut([block]);
            }

            doHandleUpdated();

        }


        const handleDelete = (mutation: IBlocksStoreMutationAdded | IBlocksStoreMutationRemoved) => {

            if (blocksStore.containsBlock(mutation.id)) {
                blocksStore.doDelete([mutation.id], {noDeleteItems: true});
            } else {
                throw new Error("Block missing: " + mutation.id)
            }

        }

        const handlePut = (mutation: IBlocksStoreMutationAdded | IBlocksStoreMutationRemoved) => {

            const block = mutation.type === 'added' ? mutation.added : mutation.removed;

            if (! blocksStore.containsBlock(mutation.id)) {
                blocksStore.doPut([block]);
            } else {
                throw new Error("Block missing: " + mutation.id)
            }

        }

        const handleAdded = (mutation: IBlocksStoreMutationAdded) => {

            console.log("Handling 'added' mutation: ", mutation);

            switch (mutationType) {

                case "undo":
                    handleDelete(mutation);
                    break;

                case "redo":
                    handlePut(mutation);
                    break;

            }

        }

        const handleRemoved = (mutation: IBlocksStoreMutationRemoved) => {

            console.log("Handling 'removed' mutation: ", mutation);

            // added means we have to remove it now...

            switch (mutationType) {

                case "undo":
                    handlePut(mutation);
                    break;

                case "redo":
                    handleDelete(mutation);
                    break;

            }

        }

        console.log(`Executing undo with ${mutations.length} mutations`, JSON.stringify(mutations, null, '  '));

        const handleMutation = (mutation: IBlocksStoreMutation) => {

            const toNewMutation = (beforeBlock: IBlock | undefined, afterBlock: IBlock | undefined): IBlocksStoreMutation | undefined => {

                if (beforeBlock && ! afterBlock) {
                    return {
                        id: mutation.id,
                        type: 'removed',
                        removed: beforeBlock
                    }
                }

                if (! beforeBlock && afterBlock) {
                    return {
                        id: mutation.id,
                        type: 'added',
                        added: afterBlock
                    }
                }

                if (beforeBlock && afterBlock) {

                    if (beforeBlock.mutation !== afterBlock.mutation) {

                        return {
                            id: mutation.id,
                            type: 'modified',
                            before: beforeBlock,
                            after: afterBlock
                        }

                    }

                }

                return undefined;

            }

            const beforeBlock = blocksStore.getBlockForMutation(mutation.id)?.toJSON();

            switch (mutation.type) {

                case "modified":
                    handleModified(mutation);
                    break;

                case "added":
                    handleAdded(mutation);
                    break;

                case "removed":
                    handleRemoved(mutation);
                    break;

            }

            const afterBlock = blocksStore.getBlockForMutation(mutation.id)?.toJSON();

            return toNewMutation(beforeBlock, afterBlock);

        }

        return arrayStream([
            ...mutations.filter(current => current.type === 'modified')
                        .map(handleMutation),
            ...mutations.filter(current => current.type !== 'modified')
                        .map(handleMutation)])
            .filterPresent()
            .collect();

    }


    /**
     *
     * For a given ID, compute all the blocks that could be involved in a
     * mutation including the immediate parents and all the children, the
     * identifiers, themselves, and all the descendants.
     */
    export function expandToParentAndChildren(blocksStore: BlocksStore,
                                              identifiers: ReadonlyArray<BlockIDStr>): ReadonlyArray<BlockIDStr> {

        const computeChildren = (identifiers: ReadonlyArray<BlockIDStr>) => {

            const computeChildrenForBlock = (id: BlockIDStr): ReadonlyArray<BlockIDStr> => {

                const items = blocksStore.getBlockForMutation(id)?.itemsAsArray || [];

                const descendants = arrayStream(items)
                    .map(current => computeChildrenForBlock(current))
                    .flatMap(current => current)
                    .collect();

                return [
                    ...items,
                    ...descendants
                ];

            }

            return arrayStream(identifiers)
                .map(current => computeChildrenForBlock(current))
                .flatMap(current => current)
                .unique()
                .collect();
        }

        const children = computeChildren(identifiers);

        const computeParents = (identifiers: ReadonlyArray<BlockIDStr>): ReadonlyArray<BlockIDStr> => {

            const getParent = (id: BlockIDStr): BlockIDStr | undefined => {
                return blocksStore.getBlockForMutation(id)?.parent;
            }

            return arrayStream(identifiers)
                .map(current => getParent(current))
                .filterPresent()
                .collect();

        }

        const primaryBlockIdentifiers
            = arrayStream([...identifiers, ...children])
            .unique()
            .collect();

        const parents = computeParents(primaryBlockIdentifiers);

        return arrayStream([...identifiers, ...children, ...parents])
            .unique()
            .collect();

    }

    /**
     * Get the ids of the side affected blocks when given a set of blocks.
     *
     * Updating some types of blocks should also update the 'updated' field of their root block.
     * Here we get the ids of the side affected blocks.
     *
     * eg: Updating a nested child of a document block should also update the 'updated' timestamp
     * of that document block.
     */
    export function getAffectedDocumentBlocksIdentifiers(blocksStore: IBlocksStore,
                                                         identifiers: ReadonlyArray<BlockIDStr>): ReadonlyArray<BlockIDStr> {

        const getDocumentRootID = (block: Block): BlockIDStr | null => {
            const rootBlock = blocksStore.getBlock(block.root);

            if (
                rootBlock
                && block.id !== block.root
                && BlockPredicates.isDocumentBlock(rootBlock)
            ) {
                return rootBlock.id;
            }

            return null;
        };

        return arrayStream(blocksStore.idsToBlocks(identifiers))
            .map(getDocumentRootID)
            .filterPresent()
            .unique(x => x)
            .collect();
    }

    /**
     * Update the 'updated' field & annotation counters for a specific set of blocks.
     *
     * @see getAffectedDocumentBlocksIdentifiers for more info
     */
    export function performDocumentSideEffects(blocksStore: IBlocksStore,
                                               identifiers: ReadonlyArray<BlockIDStr>,
                                               mutations: ReadonlyArray<IBlocksStoreMutation>): void {

        /**
         * This function goes through all the mutations and computes a delta (number of blocks removed/added)
         * for each document block that is involved with this mutation.
         *
         * They're stored in the following way
         * ```
         * {
         *     'block-id': {
         *         'other': 0,
         *         'text-highlight': 0,
         *         'area-highlight': 0,
         *         'flashcard': 0,
         *     }
         * }
         * ```
         * The numbers represent the change of the counter (the delta) depending on whether
         * a child gets added or removed.
         *
         * Note: Blocks are only counted if their root block is of type 'document'
         */
        const computeDeltas = () => {
            const deltaMap = new Map<BlockIDStr, Record<AnnotationContentType | 'other', number>>();
            const idsSet = new Set(identifiers);

            mutations.forEach((mutation) => {
                const getMutatedBlock = () => {
                    switch (mutation.type) {
                        case 'added':
                            return mutation.added;
                        case 'removed':
                            return mutation.removed;
                        default:
                            return null;
                    }
                };

                const getDeltaRecordForID = (id: BlockIDStr) => {
                    const data = deltaMap.get(id);

                    if (data) {
                        return data;
                    }

                    const newData: Record<AnnotationContentType | 'other', number> = {
                        [AnnotationContentType.FLASHCARD]: 0,
                        [AnnotationContentType.AREA_HIGHLIGHT]: 0,
                        [AnnotationContentType.TEXT_HIGHLIGHT]: 0,
                        'other': 0,
                    };

                    deltaMap.set(id, newData);

                    return newData;
                };

                const getDeltaType = (block: IBlock) => {
                    switch (block.content.type) {
                        case AnnotationContentType.TEXT_HIGHLIGHT:
                        case AnnotationContentType.AREA_HIGHLIGHT:
                        case AnnotationContentType.FLASHCARD:
                            return block.content.type;
                        default:
                            return 'other';
                    }
                };

                const block = getMutatedBlock();

                if (! block || ! idsSet.has(block.root) && block.content.type !== 'document') {
                    return;
                }

                const ownerDocumentID = block.root;

                const record = getDeltaRecordForID(ownerDocumentID);

                const deltaType = getDeltaType(block);

                const getDelta = () => mutation.type === 'added' ? 1 : mutation.type === 'removed' ? -1 : 0;

                deltaMap.set(ownerDocumentID, { ...record, [deltaType]: record[deltaType] + getDelta() });
            }, 0);

            return deltaMap;
        };

        const deltaMap = computeDeltas();

        /**
         * Reflect the change in counters on the root document block.
         *
         * @see computeDeltas for more info
         */
        const update = (block: Block<DocumentContent>) => {
            const opts = { updated: ISODateTimeStrings.create(), mutation: block.mutation + 1 };

            
            const getUpdatedDocumentContent = (): IDocumentContent | null => {
                const deltaRecord = deltaMap.get(block.id);
                const content = block.content.toJSON();
                let updated = false;

                if (! deltaRecord) {
                    return null;
                }


                type IDocInfoCounter = 'nrFlashcards' | 'nrTextHighlights' | 'nrAreaHighlights' | 'nrComments';

                const updateCounter = (deltaKey: AnnotationContentType | 'other', counterKey: IDocInfoCounter) => {
                    const delta = deltaRecord[deltaKey];

                    if (delta !== 0) {
                        content.docInfo[counterKey] = Math.max((content.docInfo[counterKey] || 0) + delta, 0);
                        updated = true;
                    }
                };

                updateCounter(AnnotationContentType.FLASHCARD, 'nrFlashcards');
                updateCounter(AnnotationContentType.TEXT_HIGHLIGHT, 'nrTextHighlights');
                updateCounter(AnnotationContentType.AREA_HIGHLIGHT, 'nrAreaHighlights');
                updateCounter('other', 'nrComments');

                if (! updated) {
                    return null;
                }

                const deltaTotal = Object.values(deltaRecord).reduce((a, b) => a + b, 0);

                content.docInfo.nrAnnotations = Math.max((content.docInfo.nrAnnotations || 0) + deltaTotal, 0);

                return content;
            };


            const shouldUpdateTimestamps = moment(opts.updated).diff(block.updated, 'minutes') >= 1; // Check if 1 minute had passed since the last update
            const updatedDocumentContent = getUpdatedDocumentContent();

            if (shouldUpdateTimestamps || updatedDocumentContent) {
                block.withMutation(() => {
                    if (updatedDocumentContent) {
                        block.setContent(updatedDocumentContent);
                    }
                }, opts);

                blocksStore.doPut([block]);
            }

        };

        blocksStore.idsToBlocks(identifiers).filter(BlockPredicates.isDocumentBlock).forEach(update);

    }

    /**
     * Compute just the mutated blocks so that we can figure out which ones need
     * to be patched.
     */
    export function computeMutatedBlocks(beforeBlocks: ReadonlyArray<IBlock>,
                                         afterBlocks: ReadonlyArray<IBlock>): ReadonlyArray<IBlocksStoreMutation> {

        const afterBlockIndex = arrayStream(afterBlocks).toMap(current => current.id);
        const beforeBlockIndex = arrayStream(beforeBlocks).toMap(current => current.id);

        const beforeBlockIDs = beforeBlocks.map(current => current.id);
        const afterBlockIDs = afterBlocks.map(current => current.id);

        const added = SetArrays.difference(afterBlockIDs, beforeBlockIDs)
                               .map(id => afterBlockIndex[id]);

        const removed = SetArrays.difference(beforeBlockIDs, afterBlockIDs)
                                 .map(id => beforeBlockIndex[id]);

        const computeUpdated = (): ReadonlyArray<IBlocksStoreMutationUpdated> => {

            const toUpdated = (beforeBlock: IBlock): IBlocksStoreMutationUpdated | undefined => {

                const afterBlock = afterBlockIndex[beforeBlock.id];
                if (afterBlock) {
                    if (afterBlock.mutation !== beforeBlock.mutation || afterBlock.updated !== beforeBlock.updated) {
                        return {
                            id: beforeBlock.id,
                            type: 'modified',
                            before: beforeBlock,
                            after: afterBlock
                        };
                    }

                }

                return undefined;

            }

            return arrayStream(beforeBlocks)
                        .map(toUpdated)
                        .filterPresent()
                        .collect();

        }

        const updated = computeUpdated();

        const toMutation = (block: IBlock, type: 'added' | 'removed'): IBlocksStoreMutationAdded | IBlocksStoreMutationRemoved=> {

            switch (type) {

                case "added":
                    return {
                        id: block.id,
                        type,
                        added: block
                    }
                case "removed":
                    return {
                        id: block.id,
                        type,
                        removed: block,
                    }

            }

        }

        return [
            ...added.map(current => toMutation(current, 'added')),
            ...removed.map(current => toMutation(current, 'removed')),
            ...updated,
        ];

    }


}
