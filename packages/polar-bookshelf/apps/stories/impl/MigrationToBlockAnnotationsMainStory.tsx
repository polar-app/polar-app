import React from 'react';
import {StoryHolder} from "../StoryHolder";
import {MigrationToBlockAnnotationsMain} from "../../../web/js/apps/repository/MigrationToBlockAnnotationsMain";

export const MigrationToBlockAnnotationsMainStory = () => {
    return (
        <StoryHolder>
            <MigrationToBlockAnnotationsMain progress={65}/>
        </StoryHolder>
    )
}
