import {BrowserProfile, BrowserProfileID} from './BrowserProfile';
import {LinkProvider} from './link_provider/LinkProvider';

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

    public id: BrowserProfileID = BrowserProfileBuilder.sequence++;

    public profile: string = "unknown";

    public description: string;

    public deviceEmulation: Electron.Parameters;

    public name: string;

    public offscreen: boolean = false;

    public show: boolean = true;

    public userAgent: string;

    public nodeIntegration: boolean = false;

    public linkProvider: LinkProvider;

    /**
     */
    constructor(browser: Browser, linkProvider: LinkProvider) {
        this.description = browser.description;
        this.deviceEmulation = browser.deviceEmulation;
        this.name = browser.name;
        this.userAgent = browser.userAgent;
        this.linkProvider = linkProvider;
    }

    public setHeight(height: number) {

        this.deviceEmulation.screenSize.height = height;
        this.deviceEmulation.viewSize.height = height;

        return this;

    }

    public setShow(show: boolean) {
        this.show = show;
        return this;
    }

    public setOffscreen(offscreen: boolean) {
        this.offscreen = offscreen;
        return this;
    }

    public setProfile(profile: string) {
        this.profile = profile;
        return this;
    }

    public setNodeIntegration(value: boolean) {
        this.nodeIntegration = value;
        return this;
    }

    public build(): Readonly<BrowserProfile> {
        return Object.freeze(this);
    }

    private static sequence: number = 0;

}
