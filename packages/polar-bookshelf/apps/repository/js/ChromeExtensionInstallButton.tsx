import * as React from 'react';
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {Analytics} from "../../../web/js/analytics/Analytics";
import {useNav} from "../../../web/js/ui/util/NavHook";
import {AppRuntime} from 'polar-shared/src/util/AppRuntime';
import {Platforms} from 'polar-shared/src/util/Platforms';
import {Browsers} from "polar-browsers/src/Browsers";
import Button from '@material-ui/core/Button';
import {ChromeSVGIcon} from "../../../web/js/ui/svg_icons/ChromeSVGIcon";
import {useComponentDidMount} from "../../../web/js/hooks/ReactLifecycleHooks";
import {WebExtensionPingClient} from "polar-web-extension-api/src/WebExtensionPingClient";
import {isPresent} from "polar-shared/src/Preconditions";

export function useWebExtensionInstalled() {

    const [installed, setInstalled] = React.useState<boolean | undefined>(undefined);

    useComponentDidMount(() => {

        async function doAsync() {
            const response = await WebExtensionPingClient.exec();
            console.log("FIXME: response: ", response);
            setInstalled(isPresent(response));
        }

        doAsync()
            .catch(err => console.error(err));

    });

    return installed;

}

export const ChromeExtensionInstallButton = deepMemo(() => {

    const isChrome = ['chrome', 'chromium'].includes(Browsers.get()?.id || '');
    const hidden = AppRuntime.isElectron() || ! Platforms.isDesktop() || ! isChrome;
    const linkLoader = useNav();
    const webExtensionInstalled = useWebExtensionInstalled();

    function onClick(): void {
        Analytics.event({category: 'chrome-extension', action: 'manual-installation-triggered'});

        function computeURL() {

            if (document.location.href!.startsWith('https://beta.getpolarized.io')) {
                return 'https://chrome.google.com/webstore/detail/save-to-polar-beta/mklidoahhflhlpcpigokeckcipaibopd?hl=en';
            }

            return "https://chrome.google.com/webstore/detail/polar-pdf-web-and-documen/jkfdkjomocoaljglgddnmhcbolldcafd";

        }

        linkLoader(computeURL(), {newWindow: true, focus: true});
    }

    if (webExtensionInstalled) {
        // it's installed so we're good to go
        return null;
    }

    if (webExtensionInstalled === undefined) {
        // we dont' know if it's installed yet.
        return null;
    }

    return (

        <Button hidden={hidden}
                onClick={() => onClick()}
                variant="contained"
                startIcon={<ChromeSVGIcon/>}
                size="small"
                color="default">

            Install Chrome Extension

        </Button>

    );

});
