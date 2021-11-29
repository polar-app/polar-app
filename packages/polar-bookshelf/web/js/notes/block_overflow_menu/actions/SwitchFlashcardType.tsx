import React from "react";
import CachedIcon from "@material-ui/icons/Cached";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {useFlashcardTypeChanger} from "../../AnnotationBlockUtils";

export const SwitchFlashcardType: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const flashcardTypeChanger = useFlashcardTypeChanger();

    return (
        <MUIMenuItem icon={<CachedIcon />}
                     text="Switch Type"
                     onClick={() => flashcardTypeChanger(id)} />
    );
};
