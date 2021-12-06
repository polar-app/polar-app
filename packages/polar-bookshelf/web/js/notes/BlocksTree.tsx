import React from "react";
import {BlocksTreeStore} from "./BlocksTreeStore";
import {useBlocksStore} from "./store/BlocksStore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {DOMBlocks} from "./contenteditable/DOMBlocks";


type BlocksTreeContextData = BlocksTreeStore;

const BlocksTreeContext = React.createContext<BlocksTreeContextData | undefined>(undefined);

type IBlocksTreeProviderProps = {
    readonly root: BlockIDStr;
    readonly autoExpandRoot?: boolean;
    readonly className?: string;
    readonly style?: React.CSSProperties;
};

export const BlocksTreeProvider: React.FC<IBlocksTreeProviderProps> = (props) => {
    const { root, children, style, className, autoExpandRoot = false } = props;
    const blocksStore = useBlocksStore();
    const blocksTreeStore = React.useMemo(() =>
        new BlocksTreeStore(root, blocksStore, autoExpandRoot), [blocksStore, root, autoExpandRoot]);

    return (
        <div style={style} className={className} id={DOMBlocks.NOTE_TREE_ID} data-root={root}>
            <BlocksTreeContext.Provider children={children} value={blocksTreeStore} />
        </div>
    );
};

export const useBlocksTreeStore = (): BlocksTreeContextData => {
    const value = React.useContext(BlocksTreeContext);
    if (! value) {
        throw new Error("useBlocksTreeStore must be used within a component that's wrapped with BlocksTreeProvider");
    }
    return value;
};
