import React from "react";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import MenuIcon from "@material-ui/icons/Menu";
import {NoteButton} from "../NoteButton";
import {useBlockOverflowMenuStore} from "./BlockOverflowMenu";
import {useBlocksStore} from "../store/BlocksStore";
import {BLOCK_ACTIONS_BY_TYPE} from "./BlockOverflowMenuPopper";

interface IProps {
    readonly id: BlockIDStr;
}

export const BlockOverflowMenuButton: React.FC<IProps> = (props) => {
    const { id } = props;
    const blockOverflowMenuStore = useBlockOverflowMenuStore();
    const blocksStore = useBlocksStore();
    const block = React.useMemo(() => blocksStore.getBlock(id), [id, blocksStore]);

    const handleClick = React.useCallback((event: React.MouseEvent) => {
        const target = event.target;

        if (! (target instanceof Element)) {
            return;
        }

        blockOverflowMenuStore.setState({
            id,
            elem: target,
        });

    }, [id, blockOverflowMenuStore]);

    if (! block) {
        return null;
    }

    const actions = BLOCK_ACTIONS_BY_TYPE[block.content.type];

    if (actions.length === 0) {
        return null;
    }

    return (
        <NoteButton onClick={handleClick}>
            <MenuIcon fontSize="small" />
        </NoteButton>
    );
};
