import React from "react";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {CircularProgress} from "@material-ui/core";
import {useAutoClozeDeletionBlock} from "../../../annotation_sidebar/AutoClozeDeletionHook";
import {usePremiumFeatureCallback} from "../../../../../apps/repository/js/ui/usePremiumFeatureCallback";
import {AutoClozeDeletionIcon} from "../../../icons/AutoClozeDeletionIcon";
import {FeatureEnabled} from "../../../features/FeaturesRegistry";

export const CreateAIClozeFlashcard: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const [aiClozeDeletionState, aiClozeDeletionHandler] = useAutoClozeDeletionBlock();

    const handleAutoCloze = React.useCallback(() => {
        if (aiClozeDeletionState === 'waiting') {
            return;
        }

        aiClozeDeletionHandler(id)
            .catch(e => console.error("Could not handle verified action: ", e));
    }, [aiClozeDeletionHandler, aiClozeDeletionState, id]);

    const triggerAutoCloze = usePremiumFeatureCallback(handleAutoCloze);

    return (
        <FeatureEnabled feature="ai-cloze-deletions">
            <>
                <MUIMenuItem onClick={triggerAutoCloze}
                             disabled={aiClozeDeletionState === 'waiting'}
                             icon={aiClozeDeletionState === 'waiting'
                                ? <CircularProgress size="1.8rem" color="secondary" /> 
                                : <AutoClozeDeletionIcon />}
                             text="Create AI cloze flashcard" />
            </>
        </FeatureEnabled>
    );
};
