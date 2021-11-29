import React from "react";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {BlockTextContentUtils} from "../../NoteUtils";
import {useAnnotationBlockManager} from "../../HighlightBlocksHooks";
import {IBlockPredicates} from "../../store/IBlockPredicates";
import {useBlocksStore} from "../../store/BlocksStore";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";

export const CreateFlashcard: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const { createFlashcard } = useAnnotationBlockManager();
    const blocksStore = useBlocksStore();

    const handleCreateFlashcard = React.useCallback(() => {
        const block = blocksStore.getBlock(id);

        const back = block && IBlockPredicates.isTextBlock(block)
            ? BlockTextContentUtils.getTextContentMarkdown(block.content)
            : '';

        createFlashcard(id, { type: FlashcardType.BASIC_FRONT_BACK, front: '', back });
    }, [id, blocksStore, createFlashcard]);

    return <MUIMenuItem onClick={handleCreateFlashcard}
                        icon={<FlashOnIcon />}
                        text="Create flashcard" />;
};
