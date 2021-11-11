import React from 'react';
import {StoryHolder} from "../StoryHolder";
import {MigrationToBlockAnnotationsMain} from "../../../web/js/apps/repository/MigrationToBlockAnnotationsMain";
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';

export const MigrationToBlockAnnotationsMainStory = () => {
    return (
        <StoryHolder>
            <MigrationToBlockAnnotationsMain
                progress={65}
                onSkip={NULL_FUNCTION}
                onStart={NULL_FUNCTION}
                skippable
            />
        </StoryHolder>
    )
}
