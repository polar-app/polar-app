import React from 'react';
import {MigrationToBlockAnnotationsMainContent} from "./MigrationToBlockAnnotations";
import {StoryHolder} from "../StoryHolder";
import {AdaptivePageLayout} from "../../repository/js/page_layout/AdaptivePageLayout";

export const MigrationToBlockAnnotationsMainContentStory = () => {
    return (
        <AdaptivePageLayout title="Story">
            <MigrationToBlockAnnotationsMainContent progress={55}/>
        </AdaptivePageLayout>
    );
}
