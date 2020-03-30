import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import * as React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {DeviceInfo} from "./DeviceInfo";

export class AboutDialogs {

    public static create() {

        const body = <DeviceInfo/>;

        Dialogs.alert({
            title: 'About',
            body,
            type: 'info',
            onConfirm: NULL_FUNCTION
        });

    }

}
