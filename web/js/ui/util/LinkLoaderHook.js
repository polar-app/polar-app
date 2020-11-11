"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLinkLoader = void 0;
const react_router_dom_1 = require("react-router-dom");
const Devices_1 = require("polar-shared/src/util/Devices");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
var isElectron = AppRuntime_1.AppRuntime.isElectron;
function useLinkLoader() {
    const history = react_router_dom_1.useHistory();
    switch (Devices_1.Devices.get()) {
        case "phone":
            return createMobileLinkLoader(history);
        case "tablet":
            return createMobileLinkLoader(history);
        case "desktop":
            return createDesktopLinkLoader();
    }
}
exports.useLinkLoader = useLinkLoader;
function createMobileLinkLoader(history) {
    return (location) => {
        if (typeof location === 'string') {
            const parsedURL = new URL(location);
            const newLocation = { pathname: parsedURL.pathname, hash: parsedURL.hash };
            history.push(newLocation);
        }
        else {
            history.push(location);
        }
    };
}
function createDesktopLinkLoader() {
    return (location, opts) => {
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
                    win.document.write(LOADING_HTML);
                }
            }
        }
        else {
            throw new Error("Unable to create window");
        }
        console.log("Setting window location to: ", location);
        if (!isElectron()) {
            if (typeof location === 'string') {
                win.location.href = location;
            }
            else if (location.hash) {
                win.location.hash = location.hash;
            }
            else if (location.pathname) {
                win.location.href = location.pathname;
            }
        }
    };
}
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

`;
//# sourceMappingURL=LinkLoaderHook.js.map