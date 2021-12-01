import React from "react";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {useBlockTagEditorDialog} from "../../NoteUtils";
import {useBlockOverflowMenuStore} from "../BlockOverflowMenu";

export const EditTags: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const editTags = useBlockTagEditorDialog();
    const blockOverflowMenuStore = useBlockOverflowMenuStore();

    const handleClick = React.useCallback(() => {
        editTags([id]);
        blockOverflowMenuStore.clearState();
    }, [id, blockOverflowMenuStore, editTags]);

    return <MUIMenuItem onClick={handleClick}
                        icon={<LocalOfferIcon />}
                        text="Edit tags" />;
};
