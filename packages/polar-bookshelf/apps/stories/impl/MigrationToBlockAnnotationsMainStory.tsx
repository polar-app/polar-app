import React from 'react';
import {MigrationToBlockAnnotationsMain} from "../../../web/js/apps/repository/MigrationToBlockAnnotationsMain";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AdaptiveDialog} from "../../../web/js/mui/AdaptiveDialog";

export const MigrationToBlockAnnotationsMainStory = () => {
    return (
            <AdaptiveDialog>
                <MigrationToBlockAnnotationsMain
                    progress={65}
                    onSkip={NULL_FUNCTION}
                    onStart={NULL_FUNCTION}
                    skippable
                />
            </AdaptiveDialog>
    )
}
