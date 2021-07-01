import React from "react";
import {BlocksTreeStore} from "./BlocksTreeStore";
import {useBlocksStore} from "./store/BlocksStore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";


type BlocksTreeContextData = BlocksTreeStore;

const BlocksTreeContext = React.createContext<BlocksTreeContextData | undefined>(undefined);

type IBlocksTreeProviderProps = {
    root: BlockIDStr;
};

export const BlocksTreeProvider: React.FC<IBlocksTreeProviderProps> = ({ root, children }) => {
    const blocksStore = useBlocksStore();
    const blocks = new BlocksTreeStore(root, blocksStore);

    return (
        <BlocksTreeContext.Provider children={children} value={blocks} />
    );
};

export const useBlocksTreeStore = (): BlocksTreeContextData => {
    const value = React.useContext(BlocksTreeContext);
    if (! value) {
        throw new Error("useblocksTree must be used within a component that's wrapped with BlocksTreeProvider");
    }
    return value;
};
