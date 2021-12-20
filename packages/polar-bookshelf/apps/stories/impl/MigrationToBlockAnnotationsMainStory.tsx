import React from 'react';
import {MigrationToBlockAnnotationsDialog} from "../../../web/js/apps/repository/notes_migration/MigrationToBlockAnnotationsDialog";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AdaptiveDialog} from "../../../web/js/mui/AdaptiveDialog";

export const MigrationToBlockAnnotationsMainStory = () => {
    return (
        <AdaptiveDialog>
            <MigrationToBlockAnnotationsDialog
                progress={65}
                onStart={NULL_FUNCTION}
            />
        </AdaptiveDialog>
    );
}
