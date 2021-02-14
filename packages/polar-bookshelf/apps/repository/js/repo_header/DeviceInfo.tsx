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
            <h2>Device: </h2>
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

interface FmtProps {
    readonly children: number | undefined;
}
const Fmt = (props: FmtProps) => {

    if (! props.children) {
        return null;
    }

    return (
        <span>
            {Number(props.children).toLocaleString()}
        </span>
    );

}

export function useStorageEstimate() {

    const [storageEstimate, setStorageEstimate] = React.useState<StorageEstimate | undefined>();

    if (navigator && navigator.storage) {

        async function doAsync() {

            const estimate = await navigator.storage.estimate();

            if (! storageEstimate) {
                setStorageEstimate(estimate);
            }

        }

        doAsync()
            .catch(err => console.error(err));

    }

    return storageEstimate;

}


export const StorageInfo = () => {

    const storageEstimate = useStorageEstimate();

    if (storageEstimate) {
        return (
            <div>
                <h2>Storage:</h2>
                <div><b>quota: </b> <Fmt>{storageEstimate.quota}</Fmt></div>
                <div><b>usage: </b> <Fmt>{storageEstimate.usage}</Fmt></div>
            </div>
        );
    } else {
        return null;
    }

}

export const ExtendedDeviceInfo = () => (
    <div>
        <DeviceInfo/>
        <StorageInfo/>
        <div>
            <b>User agent: </b>
            <div>
                {navigator.userAgent}
            </div>
        </div>
    </div>
);

