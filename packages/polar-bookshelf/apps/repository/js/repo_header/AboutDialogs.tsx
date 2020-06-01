import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import * as React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {DeviceInfo} from "./DeviceInfo";

export class AboutDialogs {

    public static create() {

        // FIXME: need to figure out how to inject this... dialogManager
        //  could/should have a dedicated Dialog method to display a raw
        // dialog

        const body = <DeviceInfo/>;

        Dialogs.alert({
            title: 'About',
            body,
            type: 'info',
            onConfirm: NULL_FUNCTION
        });

    }

}
