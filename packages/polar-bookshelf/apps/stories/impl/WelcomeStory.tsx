import * as React from 'react';
import {WelcomeScreenContent} from "../../../web/js/apps/repository/WelcomeScreenContent";
import {StoryHolder} from "../StoryHolder";

export const WelcomeStory = () => {
    return (
        <StoryHolder>
            <WelcomeScreenContent onProfile={profile => console.log(profile)}/>
        </StoryHolder>
    );
}
