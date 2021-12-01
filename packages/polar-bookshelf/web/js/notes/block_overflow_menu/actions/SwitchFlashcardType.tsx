import React from "react";
import CachedIcon from "@material-ui/icons/Cached";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {useFlashcardTypeChanger} from "../../AnnotationBlockUtils";
import {useBlockOverflowMenuStore} from "../BlockOverflowMenu";

export const SwitchFlashcardType: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const flashcardTypeChanger = useFlashcardTypeChanger();
    const blockOverflowMenuStore = useBlockOverflowMenuStore();
    
    const handleClick = React.useCallback(() => {
        flashcardTypeChanger(id);
        blockOverflowMenuStore.clear();
    }, [id, blockOverflowMenuStore, flashcardTypeChanger]);

    return (
        <MUIMenuItem icon={<CachedIcon />}
                     text="Switch Type"
                     onClick={handleClick} />
    );
};
