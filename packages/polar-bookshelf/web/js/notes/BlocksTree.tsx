import React from "react";
import {BlocksTreeStore} from "./BlocksTreeStore";
import {useBlocksStore} from "./store/BlocksStore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";


type BlocksTreeContextData = BlocksTreeStore;

const BlocksTreeContext = React.createContext<BlocksTreeContextData | undefined>(undefined);

type IBlocksTreeProviderProps = {
    readonly root: BlockIDStr;
    readonly autoExpandRoot?: boolean;
};

export const BlocksTreeProvider: React.FC<IBlocksTreeProviderProps> = (props) => {
    const { root, children, autoExpandRoot = false } = props;
    const blocksStore = useBlocksStore();
    const blocksTreeStore = React.useMemo(() =>
        new BlocksTreeStore(root, blocksStore, autoExpandRoot), [blocksStore, root, autoExpandRoot]);

    return (
        <BlocksTreeContext.Provider children={children} value={blocksTreeStore} />
    );
};

export const useBlocksTreeStore = (): BlocksTreeContextData => {
    const value = React.useContext(BlocksTreeContext);
    if (! value) {
        throw new Error("useblocksTree must be used within a component that's wrapped with BlocksTreeProvider");
    }
    return value;
};
