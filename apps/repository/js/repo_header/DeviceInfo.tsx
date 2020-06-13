import * as React from "react";
import {Version} from "polar-shared/src/util/Version";
import {Platforms} from "polar-shared/src/util/Platforms";
import {Devices} from "polar-shared/src/util/Devices";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";

export const DeviceInfo = () => {

    const version = Version.get();
    const device = Devices.get();
    const platform = Platforms.toSymbol(Platforms.get());
    const isElectron = AppRuntime.isElectron();

    return (
        <div>
            <div><b>Version: </b> {version}</div>
            <div><b>Device: </b> {device}</div>
            <div><b>Platform: </b> {platform}</div>
            <div><b>Electron: </b> {'' + isElectron}</div>
            <div><b>Screen width: </b> {window.screen.width}</div>
            <div><b>Screen height: </b> {window.screen.height}</div>
            <div><b>Device pixel ratio: </b> {window.devicePixelRatio}</div>
        </div>
    );

};

export const ExtendedDeviceInfo = () => (
    <div>
        <DeviceInfo/>
        <div>
            <b>User agent: </b>
            <div>
                {navigator.userAgent}
            </div>
        </div>
    </div>
);

