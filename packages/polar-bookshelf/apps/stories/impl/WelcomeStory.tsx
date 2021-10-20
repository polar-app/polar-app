import * as React from 'react';
import {WelcomeScreenContent} from "../../../web/js/apps/repository/WelcomeScreenContent";

export const WelcomeStory = () => {
    return (
        <div>
            <WelcomeScreenContent onProfile={profile => console.log(profile)}/>
        </div>
    );
}
