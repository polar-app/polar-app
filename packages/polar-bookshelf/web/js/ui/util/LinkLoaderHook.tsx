import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {Devices} from "polar-shared/src/util/Devices";
import {URLStr} from 'polar-shared/src/util/Strings';

export type LinkLoaderDelegate = (location: URLStr) => void;

/**
 * A link loader will load an external URL in a new window, and then focus that
 * window.  This is ONLY to be used when loading external URLs.
 */
export function useLinkLoader(): LinkLoaderDelegate {

    // We can't use window.history as react-router doesn't listen to it. Instead
    // we have to useHistory which mutates the router

    const mobileLinkLoader = useMobileLinkLoader();

    switch (Devices.get()) {

        case "phone":
            return mobileLinkLoader;
        case "tablet":
            return mobileLinkLoader;
        case "desktop":
            return createDesktopLinkLoader();

    }

}

export function useLinkLoaderRef() {
    const linkLoader = useLinkLoader();
    return React.useRef(linkLoader);
}

function useMobileLinkLoader(): LinkLoaderDelegate {

    const history = useHistory();

    return React.useCallback((location: URLStr) => {

        console.log("Loading URL with mobile link loader: ", location);

        const parsedURL = new URL(location);

        const isExternal = parsedURL.origin !== window.location.origin;

        if (isExternal) {

            // Whenever a link is opened inside the mobile app, handle it natively through the native browser
            if ((window as any).isNativeApp) {
                window.open(location);
                return;
            } else {
                console.log("Creating new window: " + location);
                window.open(location, '_blank');
                return;
            }

        }

        history.push(location);

    }, [history]);

}

function createDesktopLinkLoader(): LinkLoaderDelegate {

    return (location: URLStr) => {

        function createWindow() {

            const initialURL = location;
            console.log("Creating new window: " + initialURL);
            return window.open(initialURL, '_blank');

        }

        const win = createWindow();

        if (win) {

            win.focus();

            if (win && win.document) {
                // this is primarily for Electron as you can't access the
                // document from electron since it's basically emulating
                // this API.

                if (typeof win.document.write === 'function') {
                    win.document.write(LOADING_HTML);
                }
            }

        } else {
            throw new Error("Unable to create window");
        }

        console.log("Setting window location to: ", location);

        if (! isElectron()) {
            win.location.href = location;
        }

    }

}

/**
 * Loading HTML that should look good in all browsers.  Might also want to add
 * a Polar logo or something.
 */
const LOADING_HTML = `
<html>
<head>
<style>
    html {
        background-color: rgb(66, 66, 66);
        color: rgb(255, 255, 255);
    }
</style>
</head>
<body>
Loading... 
</body>
</html>

`
