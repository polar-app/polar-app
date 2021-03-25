import * as React from 'react';
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {Analytics} from "../../../web/js/analytics/Analytics";
import {useLinkLoader} from "../../../web/js/ui/util/LinkLoaderHook";
import {AppRuntime} from 'polar-shared/src/util/AppRuntime';
import {Browsers} from "polar-browsers/src/Browsers";
import Button from '@material-ui/core/Button';
import {FAChromeIcon} from "../../../web/js/mui/MUIFontAwesome";
import {useSnapshotSubscriber} from "../../../web/js/ui/data_loader/UseSnapshotSubscriber";
import {WebExtensionPresenceClient} from "polar-web-extension-api/src/WebExtensionPresenceClient";
import {useComponentDidMount} from "../../../web/js/hooks/ReactLifecycleHooks";
import {isPresent} from "polar-shared/src/Preconditions";
import {ChromeStoreURLs} from "polar-web-extension-api/src/ChromeStoreURLs";
import {MUITooltip} from "../../../web/js/mui/MUITooltip";

export function useWebExtensionInstalled() {

    const [installed, setInstalled] = React.useState<boolean | undefined>(undefined);

    useComponentDidMount(() => {

        async function doAsync() {
            const response = await WebExtensionPresenceClient.exec();
            setInstalled(isPresent(response));
        }

        doAsync()
        .catch(err => console.error(err));

    });

    return installed;

}


export function useWebExtensionInstalledSnapshots() {

    const [installed, setInstalled] = React.useState<boolean | undefined>(undefined);
    const subscriber = React.useMemo(() => ({
        id: 'web-extension-presence',
        subscribe: WebExtensionPresenceClient.subscribe
    }), []);

    const {value, error} = useSnapshotSubscriber(subscriber);

    if (error) {
        setInstalled(false);
        return;
    }

    if (value) {
        setInstalled(true);
    } else {
        setInstalled(false);
    }

    return installed;

}

export const ChromeExtensionInstallButton = deepMemo(function ChromeExtensionInstallButton() {

    const isChrome = ['chrome', 'chromium'].includes(Browsers.get()?.id || '');
    const linkLoader = useLinkLoader();
    const webExtensionInstalled = useWebExtensionInstalled();

    function onClick(): void {
        Analytics.event({category: 'chrome-extension', action: 'manual-installation-triggered'});
        const chromeStoreURL = ChromeStoreURLs.create();
        linkLoader(chromeStoreURL, {newWindow: true, focus: true});
    }

    if (! isChrome) {
        return null;
    }

    if (AppRuntime.isElectron()) {
        // we're on electron so we can't install the chrome extension.
        return null;
    }

    if (webExtensionInstalled === true) {
        // it's installed so we're good to go
        return null;
    }

    if (webExtensionInstalled === undefined) {
        // we dont' know if it's installed yet.
        return null;
    }

    return (

        <MUITooltip title="Install our web extension to enable all features including web capture.">
            <Button onClick={() => onClick()}
                    variant="contained"
                    startIcon={<FAChromeIcon/>}
                    size="medium"
                    color="default">

                Install Chrome Extension

            </Button>
        </MUITooltip>

    );

});
