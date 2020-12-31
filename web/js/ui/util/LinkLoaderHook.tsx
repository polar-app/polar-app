import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {Devices} from "polar-shared/src/util/Devices";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import isElectron = AppRuntime.isElectron;

interface ILocation {
    readonly hash?: string;
    readonly pathname?: string;
}

export type ILocationOrLink = ILocation | string;

interface IHistory {
    push: (location: ILocationOrLink) => void;
}

export interface LinkLoaderOpts {
    readonly focus: boolean;
    readonly newWindow: boolean;
}

export type LinkLoaderDelegate = (location: ILocationOrLink, opts: LinkLoaderOpts) => void;

/**
 * Nav function that uses history to jump to the next page not forcibly changing
 * the window which doesn't use react router.
 */
export function useLinkLoader(): LinkLoaderDelegate {

    // We can't use window.history as react-router doesn't listen to it. Instead
    // we have to useHistory which mutates the router

    const history = useHistory();

    switch (Devices.get()) {

        case "phone":
            return createMobileLinkLoader(history);
        case "tablet":
            return createMobileLinkLoader(history);
        case "desktop":
            return createDesktopLinkLoader();

    }

}

export function useLinkLoaderRef() {
    const linkLoader = useLinkLoader();
    return React.useRef(linkLoader);
}

function createMobileLinkLoader(history: IHistory): LinkLoaderDelegate {

    return (location: ILocationOrLink) => {

        if (typeof location === 'string') {
            const parsedURL = new URL(location);
            const newLocation = {pathname: parsedURL.pathname, hash: parsedURL.hash};
            history.push(newLocation);
        } else {
            history.push(location);
        }

    }

}

function createDesktopLinkLoader(): LinkLoaderDelegate {

    return (location: ILocationOrLink, opts: LinkLoaderOpts) => {

        function createWindow() {

            const initialURL = isElectron() && typeof location === 'string' ? location : '';

            console.log("Creating new window: " + initialURL);
            return window.open(initialURL, '_blank');
        }

        const win = opts.newWindow ? createWindow() : window;

        if (win) {

            if (opts.newWindow) {

                if (opts.focus) {
                    win.focus();
                }

                if (win && win.document) {
                    // this is primarily for Electron as you can't access the
                    // document from electron since it's basically emulating
                    // this API.

                    if (typeof win.document.write === 'function') {
                        win.document.write(LOADING_HTML);
                    }
                }

            }

        } else {
            throw new Error("Unable to create window");
        }

        console.log("Setting window location to: ", location);

        if (! isElectron()) {
            if (typeof location === 'string') {
                win.location.href = location;
            } else if (location.hash) {
                // TODO I think this is wrong as nothing is loaded yet.
                win.location.hash = location.hash;
            } else if (location.pathname) {
                // TODO I think this is wrong as nothing is loaded yet.
                win.location.href = location.pathname;
            }
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
