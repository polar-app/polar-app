import * as React from 'react';
import {
    OccupationProfile,
    ProfileConfigurator
} from "../../../../apps/repository/js/configure/profile/ProfileConfigurator";

interface IProps {
    readonly onProfile: (occupationProfile: OccupationProfile) => void;
}

export const WelcomeScreenContent = React.memo(function WelcomeScreenContent(props: IProps) {

    return (
        <>
            <ProfileConfigurator onProfile={props.onProfile}/>
        </>
    );

})
