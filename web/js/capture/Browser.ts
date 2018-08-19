
export class Browser implements Readonly<IBrowser> {

    public readonly name: string;

    public readonly description: string;

    public readonly userAgent: string;

    public readonly deviceEmulation: Electron.Parameters;

    /**
     *
     * True when the browser should be shown while we are capturing.
     */
    public readonly show = true;

    /**
     *
     * True when we should use the offscreen support in Electron.
     */
    public readonly offscreen = false;

    // TODO: this can just become an interface but the default values are the
    // problem
    constructor(opts: any) {

        this.name = opts.name;
        this.description = opts.description;
        this.userAgent = opts.userAgent;
        this.deviceEmulation = opts.deviceEmulation;
        this.show = opts.show;
        this.offscreen = opts.offscreen;

    }

}

export interface IBrowser {

    name: string;

    description: string;

    userAgent: string;

    deviceEmulation: Electron.Parameters;

    /**
     *
     * True when the browser should be shown while we are capturing.
     */
    show: boolean;

    /**
     *
     * True when we should use the offscreen support in Electron.
     */
    offscreen: boolean;


}

export class BrowserBuilder implements IBrowser {

    description: string;
    deviceEmulation: Electron.Parameters;
    name: string;
    offscreen: boolean;
    show: boolean;
    userAgent: string;

    /**
     */
    constructor(browser: Browser) {
        this.description = browser.description;
        this.deviceEmulation = browser.deviceEmulation;
        this.name = browser.name;
        this.offscreen = browser.offscreen;
        this.show = browser.show;
        this.userAgent = browser.userAgent;
    }

    setHeight(height: number) {

        this.deviceEmulation.screenSize.height = height;
        this.deviceEmulation.viewSize.height = height;

        return this;

    }

    setShow(show: boolean) {

        this.show = show;

        return this;

    }

    /**
     * @param offscreen {boolean}
     * @return {BrowserMutator}
     */
    setOffscreen(offscreen: boolean) {

        this.offscreen = true;

        return this;

    }

    build() {
        return new Browser(this);
    }

}
