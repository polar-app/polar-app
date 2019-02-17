export class Nav {

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
    public static createLinkLoader(opts: LinkLoaderOpts = {focus: true}): LinkLoader {

        // https://stackoverflow.com/questions/19026162/javascript-window-open-from-callback

        const win = window.open('', '_blank');

        if (win) {

            if (opts.focus) {
                win.focus();
            }

            win.document.write("Loading...");

            return {

                load(link: string): void {
                    win.location.href = link;
                }

            };

        } else {
            throw new Error("Unable to create window");
        }

    }


}

export interface LinkLoaderOpts {
    readonly focus: boolean;
}

export interface LinkLoader {

    load(link: string): void;

}
