import React from "react";
import FlashAutoIcon from "@material-ui/icons/FlashAuto";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {useBlocksStore} from "../../store/BlocksStore";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {IBlockPredicates} from "../../store/IBlockPredicates";
import {useAIFlashcardVerifiedAction} from "../../../../../apps/repository/js/ui/AIFlashcardVerifiedAction";
import {useAutoFlashcardBlockCreator} from "../../../annotation_sidebar/AutoFlashcardHook";
import {CircularProgress} from "@material-ui/core";
import {useBlockOverflowMenuStore} from "../BlockOverflowMenu";

export const CreateAIFlashcard: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const verifiedAction = useAIFlashcardVerifiedAction();
    const [aiFlashcardCreatorState, aiFlashcardCreatorHandler] = useAutoFlashcardBlockCreator();
    const blocksStore = useBlocksStore();
    const blockOverflowMenuStore = useBlockOverflowMenuStore();

    const handleCreateAIFlashcard = React.useCallback(() => {
        if (aiFlashcardCreatorState === 'waiting') {
            return;
        }

        const block = blocksStore.getBlock(id);

        if (! block || ! IBlockPredicates.isAnnotationTextHighlightBlock(block)) {
            return console.error("AI flashcards can only be created under text highlights!");
        }

        verifiedAction(() => {
            aiFlashcardCreatorHandler(id, BlockTextHighlights.toText(block.content.value))
                .then(() => blockOverflowMenuStore.clearState())
                .catch(e => console.error("Could not handle verified action: ", e));
        });
    }, [
        blockOverflowMenuStore,
        blocksStore,
        id,
        verifiedAction,
        aiFlashcardCreatorHandler,
        aiFlashcardCreatorState
    ]);

    return <MUIMenuItem onClick={handleCreateAIFlashcard}
                        disabled={aiFlashcardCreatorState === 'waiting'}
                        icon={aiFlashcardCreatorState === 'waiting'
                                ? <CircularProgress size="1.8rem" color="secondary" /> 
                                : <FlashAutoIcon />}
                        text="Create AI flashcard" />;
};
