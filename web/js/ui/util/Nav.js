"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nav = void 0;
const Platforms_1 = require("polar-shared/src/util/Platforms");
class Nav {
    static createHashURL(hash) {
        const url = new URL(window.location.href);
        url.hash = hash;
        return url.toString();
    }
    static openLinkWithNewTab(link) {
        const win = window.open(link, '_blank');
        if (win) {
            win.focus();
        }
    }
    static createLinkLoader(opts = { focus: true, newWindow: true }) {
        if (Platforms_1.Platforms.type() === 'desktop') {
            return new DesktopLinkLoader(opts);
        }
        else {
            return new MobileLinkLoader();
        }
    }
}
exports.Nav = Nav;
class DesktopLinkLoader {
    constructor(opts) {
        function createWindow() {
            console.log("Creating new window");
            return window.open('', '_blank');
        }
        const win = opts.newWindow ? createWindow() : window;
        if (win) {
            this.win = win;
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
    }
    load(link) {
        console.log("Setting window location to: " + link);
        this.win.location.href = link;
    }
}
class MobileLinkLoader {
    load(link) {
        document.location.href = link;
    }
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
//# sourceMappingURL=Nav.js.map