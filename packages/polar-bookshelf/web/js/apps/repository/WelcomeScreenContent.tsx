import * as React from 'react';
import {
    OccupationProfile,
    ProfileConfigurator
} from "../../../../apps/repository/js/configure/profile/ProfileConfigurator";
import {PolarLogoImage} from "../../../../apps/repository/js/nav/PolarLogoImage";
import {PolarLogoText} from "../../../../apps/repository/js/nav/PolarLogoText";

interface IProps {
    readonly onProfile: (occupationProfile: OccupationProfile) => void;
}

export const WelcomeScreenContent = React.memo((props: IProps) => {

    return (
        <>
            <ProfileConfigurator onProfile={props.onProfile}/>
        </>
    );

})