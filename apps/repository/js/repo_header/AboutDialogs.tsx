import {Devices} from "../../../../web/js/util/Devices";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import * as React from "react";
import {Version} from "polar-shared/src/util/Version";
import {Platforms} from "polar-shared/src/util/Platforms";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export class AboutDialogs {

    public static create() {
        const version = Version.get();
        const device = Devices.get();
        const platform = Platforms.toSymbol(Platforms.get());

        const body = <div>

            <b>Version: </b> {version}<br/>
            <b>Device: </b> {device}<br/>
            <b>Platform: </b> {platform}
            <b>Screen width: </b> {window.screen.width}
            <b>Screen height: </b> {window.screen.height}

        </div>;

        Dialogs.alert({
            title: 'About',
            body,
            type: 'info',
            onConfirm: NULL_FUNCTION
        });

    }

}
