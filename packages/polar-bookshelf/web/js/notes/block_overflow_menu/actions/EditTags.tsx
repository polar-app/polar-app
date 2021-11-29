import React from "react";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {useBlockTagEditorDialog} from "../../NoteUtils";

export const EditTags: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const editTags = useBlockTagEditorDialog();

    return <MUIMenuItem onClick={() => editTags([id])}
                        icon={<LocalOfferIcon />}
                        text="Edit tags" />;
};
