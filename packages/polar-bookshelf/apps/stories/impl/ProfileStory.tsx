import * as React from 'react';
import {ProfileScreen} from "../../repository/js/configure/profile/ProfileScreen";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const ProfileStory = () => {
    return (
        <div>
            <ProfileScreen onProfile={profile => console.log(profile)}/>
        </div>
    );
}