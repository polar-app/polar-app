import {DefaultPageLayout} from "../../page_layout/DefaultPageLayout";
import * as React from "react";
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";
import {PersistenceLayerController} from "../../../../../web/js/datastore/PersistenceLayerManager";
import {OccupationProfile, ProfileConfigurator} from "./ProfileConfigurator";
import {ConfigureNavbar} from "../ConfigureNavbar";
import {ConfigureBody} from "../ConfigureBody";

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
}

export const ProfileScreen = (props: IProps) => {

    const onProfile = (profile: OccupationProfile) => {
        // noop
    };

    return (
        <DefaultPageLayout {...props}>

            <ConfigureBody>
                <ConfigureNavbar/>

                {/*<h2>Profile</h2>*/}

                <ProfileConfigurator onOccupationProfile={occupationProfile => onProfile(occupationProfile)}/>

            </ConfigureBody>
        </DefaultPageLayout>
    );
};
