import {Platforms} from 'polar-shared/src/util/Platforms';

export class Nav {

    /// TODO: this should probably be deprecated
    public static createHashURL(hash: string) {
        const url = new URL(window.location.href);
        url.hash = hash;
        return url.toString();
    }

    public static openLinkWithNewTab(link: string) {

        const win = window.open(link, '_blank');

        if (win) {
            win.focus();
        }

    }

    /**
     * Create a loader that can function outside of a authorized event loop
     * by pre-creating a window and then changing the location later.
     *
     */
    public static createLinkLoader(opts: LinkLoaderOpts = {focus: true, newWindow: true}): LinkLoader {

        if (Platforms.type() === 'desktop') {
            return new DesktopLinkLoader(opts);
        } else {
            return new MobileLinkLoader();
        }

    }

}

class DesktopLinkLoader implements LinkLoader {

    private readonly win: Window;

    constructor(opts: LinkLoaderOpts) {

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
                    // this is primarily for Electron as you can't access the
                    // document from electron since it's basically emulating
                    // this API.
                    win.document.write(LOADING_HTML);
                }

            }

        } else {
            throw new Error("Unable to create window");
        }

    }

    public load(link: string): void {
        console.log("Setting window location to: " + link);
        this.win.location.href = link;
    }

}

class MobileLinkLoader implements LinkLoader {

    public load(link: string): void {
        document.location!.href = link;
    }

}

export interface LinkLoaderOpts {
    readonly focus: boolean;
    readonly newWindow: boolean;
}

export interface LinkLoader {

    load(link: string): void;

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
