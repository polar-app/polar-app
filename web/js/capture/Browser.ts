import {BrowserProfile} from './BrowserProfile';

export class Browser implements Readonly<IBrowser> {

    public readonly name: string;

    public readonly description: string;

    public readonly userAgent: string;

    public readonly deviceEmulation: Electron.Parameters;


    // TODO: this can just become an interface but the default values are the
    // problem
    constructor(opts: any) {
        this.name = opts.name;
        this.description = opts.description;
        this.userAgent = opts.userAgent;
        this.deviceEmulation = opts.deviceEmulation;
    }

}

export interface IBrowser {

    name: string;

    description: string;

    userAgent: string;

    deviceEmulation: Electron.Parameters;

}

export class BrowserProfileBuilder implements BrowserProfile {

    profile: string = "unknown";
    description: string;
    deviceEmulation: Electron.Parameters;
    name: string;
    offscreen: boolean = false;
    show: boolean = true;
    userAgent: string;
    nodeIntegration: boolean = false;

    /**
     */
    constructor(browser: Browser) {
        this.description = browser.description;
        this.deviceEmulation = browser.deviceEmulation;
        this.name = browser.name;
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

    setOffscreen(offscreen: boolean) {
        this.offscreen = offscreen;
        return this;
    }

    setProfile(profile: string) {
        this.profile = profile;
        return this;
    }

    setNodeIntegration(value: boolean) {
        this.nodeIntegration = value;
        return this;
    }

    build(): Readonly<BrowserProfile> {
        return Object.freeze(this);
    }

}
