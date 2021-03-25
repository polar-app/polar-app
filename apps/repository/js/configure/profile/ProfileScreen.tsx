import {DefaultPageLayout} from "../../page_layout/DefaultPageLayout";
import * as React from "react";
import {OccupationProfile, ProfileConfigurator} from "./ProfileConfigurator";
import {ConfigureNavbar} from "../ConfigureNavbar";
import {ConfigureBody} from "../ConfigureBody";

interface IProps {
    readonly onProfile: (profile: OccupationProfile) => void;
}

export const ProfileScreen = React.memo(function ProfileScreen(props: IProps) {

    return (
        <DefaultPageLayout {...props}>

            <ConfigureBody>
                <ConfigureNavbar/>

                {/*<h2>Profile</h2>*/}

                <ProfileConfigurator onProfile={occupationProfile => props.onProfile(occupationProfile)}/>

            </ConfigureBody>
        </DefaultPageLayout>
    );
});
