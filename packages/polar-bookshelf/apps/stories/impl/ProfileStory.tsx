import * as React from 'react';
import {ProfileScreen} from "../../repository/js/configure/profile/ProfileScreen";

export const ProfileStory = () => {
    return (
        <div>
            <ProfileScreen onProfile={profile => console.log(profile)}/>
        </div>
    );
}
