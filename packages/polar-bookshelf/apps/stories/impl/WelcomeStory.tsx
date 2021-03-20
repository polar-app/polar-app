import * as React from 'react';
import {ProfileScreen} from "../../repository/js/configure/profile/ProfileScreen";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {WelcomeScreenContent} from "../../../web/js/apps/repository/WelcomeScreenContent";

export const WelcomeStory = () => {
    return (
        <div>
            <WelcomeScreenContent onProfile={profile => console.log(profile)}/>
        </div>
    );
}