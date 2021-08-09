import React from "react";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {NamedBlock, useBlocksStore} from "./store/BlocksStore";
import {IBlocksStore} from "./store/IBlocksStore";
import {autorun} from "mobx";
import equal from "deep-equal";

export const focusFirstChild = (blocksStore: IBlocksStore, id: BlockIDStr) => {
    const root = blocksStore.getBlock(id);
    if (root) {
        const firstChildID = root.itemsAsArray[0] || blocksStore.createNewBlock(root.id, { asChild: true }).id;
        blocksStore.setActiveWithPosition(firstChildID, 'start');
    }
};

export const useNamedBlocks = () => {
    const blocksStore = useBlocksStore();
    const [namedBlocks, setNamedBlocks] = React.useState<ReadonlyArray<NamedBlock>>([]);
    const prevNamedBlocksIDsRef = React.useRef<BlockIDStr[] | null>(null);

    React.useEffect(() => {
        const disposer = autorun(() => {
            const namedBlocksIDs = Object.values(blocksStore.indexByName);
            if (! equal(prevNamedBlocksIDsRef.current, namedBlocksIDs)) {
                const namedBlocks = blocksStore.idsToBlocks(namedBlocksIDs) as ReadonlyArray<NamedBlock>;
                setNamedBlocks(namedBlocks);
                prevNamedBlocksIDsRef.current = namedBlocksIDs;
            }
        });

        return () => disposer();
    }, [blocksStore]);

    return namedBlocks;
};
