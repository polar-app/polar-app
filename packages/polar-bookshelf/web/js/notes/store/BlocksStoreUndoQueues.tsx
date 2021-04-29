import {IBlock} from "./IBlock";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {BlockIDStr, BlocksStore} from "./BlocksStore";
import deepEqual from "deep-equal";
import {UndoQueues2} from "../../undo/UndoQueues2";
import {PositionalArrays} from "./PositionalArrays";

export namespace BlocksStoreUndoQueues {

    // FIXME: have tests for this... that uses the BlocksStore directly..

    import PositionalArray = PositionalArrays.PositionalArray;
    import PositionalArrayPositionStr = PositionalArrays.PositionalArrayPositionStr;

    export interface IUndoMutation {
        readonly parent: IBlock | undefined;
        readonly child: IBlock;
    }

    export type BlockUpdateMutationType = 'added' | 'removed' | 'updated';

    export interface IBlocksStoreMutationAdded {
        readonly id: BlockIDStr;
        readonly type: 'added';
        readonly block: IBlock;
    }

    export interface IBlocksStoreMutationRemoved {
        readonly id: BlockIDStr;
        readonly type: 'removed';
        readonly block: IBlock;
    }
    export interface IBlocksStoreMutationUpdated {
        readonly id: BlockIDStr;
        readonly type: 'updated';
        readonly before: IBlock;
        readonly after: IBlock;
    }

    export type IBlocksStoreMutation = IBlocksStoreMutationAdded | IBlocksStoreMutationRemoved | IBlocksStoreMutationUpdated;

    export interface IUndoCapture {
        readonly capture: () => void;
        readonly undo: () => void;
    }

    export interface IUndoCaptureOpts {
        readonly noExpand?: boolean;
    }

    /**
     * Do an undo operation and push it into the undo queue.
     * @param blocksStore
     * @param undoQueue
     * @param identifiers
     * @param redoDelegate
     */
    export function doUndoPush<T>(blocksStore: BlocksStore,
                                  undoQueue: UndoQueues2.UndoQueue,
                                  identifiers: ReadonlyArray<BlockIDStr>,
                                  redoDelegate: () => T): T {

        // FIXME: dont' allow undo on pages that aren't currently the root ...

        // this captures the state before the initial transaction
        const undoCapture = createUndoCapture(blocksStore, identifiers);

        let captured: boolean = false;

        /**
         * The redo operation has to execute, capture the graph for a delta
         * operation later,
         */
        const redo = (): T => {

            const result = redoDelegate();

            if (! captured) {
                undoCapture.capture();
                captured = true;
            }

            return result;

        }

        const undo = () => {
            undoCapture.undo();
        }

        return undoQueue.push({redo, undo}).value;


    }
    /**
     * Perform an undo capture for the following identifiers based on their
     * parent
     */
    export function createUndoCapture(blocksStore: BlocksStore,
                                      identifiers: ReadonlyArray<BlockIDStr>): IUndoCapture {

        identifiers = expandToParentAndChildren(blocksStore, identifiers);

        /**
         * Computes only the blocks that are applicable to this operation.  We
         * have to know all the block IDs that would be involved with this
         * transaction.
         */
        const computeApplicableBlocks = (blocks: ReadonlyArray<IBlock>) => {
            return blocks.filter(block => identifiers.includes(block.id));
        }


        const beforeBlocks: ReadonlyArray<IBlock> = computeApplicableBlocks(blocksStore.createSnapshot(identifiers));

        let afterBlocks: ReadonlyArray<IBlock> = [];

        const capture = () => {

            const snapshot = blocksStore.createSnapshot(identifiers);

            afterBlocks = computeApplicableBlocks(snapshot);

        }

        const undo = () => {
            const mutations = computeMutatedBlocks(beforeBlocks, afterBlocks);
            doMutations(blocksStore, mutations);
        }

        return {capture, undo};

    }

    export function doMutations(blocksStore: BlocksStore,
                                mutations: ReadonlyArray<IBlocksStoreMutation>) {

        const handleUpdated = (mutation: IBlocksStoreMutationUpdated) => {

            console.log("Handling 'updated' mutation: ", mutation);

            // updated means we need to restore it to the older version.

            const block = blocksStore.getBlock(mutation.id);

            if (! block) {
                throw new Error("Could not find updated block: " + mutation.id);
            }

            const mutationType = computeMutationType(mutation.before, mutation.after);

            const handleUpdatedItems= () => {

                const handleItemsPatch = (itemsPatch: IItemsPatch) => {

                    switch (itemsPatch.type) {

                        case "remove":
                            console.log("Handling undo patch for items: remove: (transformed to put)" + itemsPatch.id);
                            block.putItem(itemsPatch.key, itemsPatch.id);
                            break;
                        case "insert":
                            console.log("Handling undo patch for items: insert (transformed to remove): ", itemsPatch.id);
                            block.removeItem(itemsPatch.id);
                            break;

                    }

                }

                const itemsPatches = computeItemsPatches(mutation.before.items, mutation.after.items);
                itemsPatches.map(handleItemsPatch);

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
            const handleUpdatedContent = (): boolean => {

                console.log("Handling undo patch for content: ", mutation.before.content);

                if (block.mutation === mutation.after.mutation) {
                    block.setContent(mutation.before.content);
                    return true;
                } else {
                    console.log(`Skipping update as the mutation number is invalid expected: ${mutation.after.mutation} but was ${block.mutation}`);
                    return false;
                }

            }

            switch (mutationType) {

                case "items":
                    handleUpdatedItems();
                    break;
                case "content":
                    handleUpdatedContent();
                    break;
                case "items-and-content":
                    handleUpdatedItems();
                    handleUpdatedContent();
                    break;

            }

        }

        const handleAdded = (mutation: IBlocksStoreMutationAdded) => {

            console.log("Handling 'added' mutation: ", mutation);

            // added means we have to remove it now...

            if (blocksStore.containsBlock(mutation.block.id)) {
                blocksStore.doDelete([mutation.block.id]);
            } else {
                throw new Error("Block missing: " + mutation.block.id)
            }

        }

        const handleRemoved = (mutation: IBlocksStoreMutationRemoved) => {

            console.log("Handling 'removed' mutation: ", mutation);

            // added means we have to remove it now...

            if (! blocksStore.containsBlock(mutation.block.id)) {
                blocksStore.doPut([mutation.block]);
            } else {
                throw new Error("Block already exists: " + mutation.block.id)
            }

        }

        console.log(`Executing undo with ${mutations.length} mutations`);

        for(const mutation of mutations) {

            switch (mutation.type) {

                case "updated":
                    handleUpdated(mutation);
                    break;

                case "added":
                    handleAdded(mutation);
                    break;

                case "removed":
                    handleRemoved(mutation);
                    break;

            }

        }

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

                const items = blocksStore.getBlock(id)?.itemsAsArray || [];

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
                return blocksStore.getBlock(id)?.parent;
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
                if ( afterBlock) {
                    if (afterBlock.mutation !== beforeBlock.mutation || afterBlock.updated !== beforeBlock.updated) {
                        return {
                            id: beforeBlock.id,
                            type: 'updated',
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
            return {
                id: block.id,
                block,
                type
            };

        }

        return [
            ...added.map(current => toMutation(current, 'added')),
            ...removed.map(current => toMutation(current, 'removed')),
            ...updated,
        ];

    }

    /**
     *
     * The mutation types:
     *
     * - items: the items were changes which means that we have to issue a patch
     *          to undo it to avoid conflicting with another users edits on the
     *          children.
     *
     * - content: the content was changed.
     *
     * - items-and-content: both the items and content were changed.
     *
     */
    export type MutationType = 'items' | 'content' | 'items-and-content';

    /**
     * Given a before block, and an after block, compute the mutations that were
     * performed on the content.
     */
    export function computeMutationType(before: IBlock, after: IBlock): MutationType | undefined {

        // FIXME for 'items' we also have to compute a diff and a before / after
        // mutation set including 'remove' and 'insert'

        const itemsMuted = ! deepEqual(before.items, after.items);
        const contentMuted = ! deepEqual(before.content, after.content);

        if (itemsMuted && contentMuted) {
            return 'items-and-content';
        } else if (itemsMuted) {
            return 'items';
        } else if (contentMuted) {
            return 'content';
        }

        return undefined;

    }

    /**
     * Instruction to remove and item from the items.
     */
    export interface IItemsPatchRemove {
        readonly type: 'remove';
        readonly key: PositionalArrayPositionStr;
        readonly id: BlockIDStr;
    }

    export interface IItemsPatchInsert {
        readonly type: 'insert';
        readonly key: PositionalArrayPositionStr;
        readonly id: BlockIDStr
    }

    export type IItemsPatch = IItemsPatchRemove | IItemsPatchInsert;

    export function computeItemsPatches(before: PositionalArray<BlockIDStr>,
                                        after: PositionalArray<BlockIDStr>): ReadonlyArray<IItemsPatch> {

        const removed = SetArrays.difference(PositionalArrays.toArray(before), PositionalArrays.toArray(after));
        const added = SetArrays.difference(PositionalArrays.toArray(after), PositionalArrays.toArray(before));

        const toRemoved = (id: BlockIDStr): IItemsPatchRemove => {

            const key = PositionalArrays.keyForValue(before, id);

            if (key === undefined) {
                throw new Error("Could know find key for value: " + id);
            }

            return {
                type: 'remove',
                key,
                id
            };
        }

        const toAdded = (id: BlockIDStr): IItemsPatchInsert => {

            const key = PositionalArrays.keyForValue(after, id);

            if (key === undefined) {
                throw new Error("Could know find key for value: " + id);
            }

            return {
                type: 'insert',
                key,
                id
            }

        }

        return [
            ...removed.map(toRemoved),
            ...added.map(toAdded)
        ];

    }

}
