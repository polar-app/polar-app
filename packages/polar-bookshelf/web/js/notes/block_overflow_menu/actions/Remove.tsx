import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {useBlocksStore} from "../../store/BlocksStore";
import {useBlockOverflowMenuStore} from "../BlockOverflowMenu";

export const Remove: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const blocksStore = useBlocksStore();
    const blockOverflowMenuStore = useBlockOverflowMenuStore();

    const handleDelete = React.useCallback(() => {
        blocksStore.deleteBlocks([id])
        blockOverflowMenuStore.clear();
    }, [blocksStore, blockOverflowMenuStore, id]);

    return <MUIMenuItem onClick={handleDelete}
                        icon={<DeleteIcon />}
                        text="Delete" />;
};
