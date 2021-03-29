import React from 'react';
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {Platforms} from "polar-shared/src/util/Platforms";
import {MobileGatewayDialog} from "./MobileGatewayDialog";
import {Devices} from "polar-shared/src/util/Devices";

interface IProps {

    readonly children: React.ReactElement;

}

export const MobileGateway = deepMemo(function MobileGateway(props: IProps) {

    function isMobile() {

        if (Platforms.isMobile()) {
            return true;
        }

        if (Devices.isPhone()) {
            return true;
        }

        if (Devices.isTablet()) {
            return true;
        }

        return false;

    }

    if (isMobile()) {
        return (
            <MobileGatewayDialog/>
        );
    } else {
        return props.children;
    }

});
