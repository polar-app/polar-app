import React from "react";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {observer} from "mobx-react-lite";
import {Block} from "./Block";
import {BlockItems} from "./BlockItems";
import {useBlocksStore} from "./store/BlocksStore";
import {Box} from "@material-ui/core";

interface IProps {
    id: BlockIDStr;
    parent: BlockIDStr;
}

export const HighlightBlock: React.FC<IProps> = observer((props) => {
    const { id, parent } = props;

    const blocksStore = useBlocksStore();
    const block = blocksStore.getBlock(id);

    if (! block) {
        return null;
    }

    return (
        <Box display="flex" flexDirection="column">
            <Block
                parent={parent}
                id={id}
                alwaysExpanded
                dontRenderChildren
                noBullet
            />
            <BlockItems
                blockIDs={block.itemsAsArray}
                indent={false}
                parent={block.id} />
        </Box>
    );
});
